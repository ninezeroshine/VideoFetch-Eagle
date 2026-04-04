'use strict';

const path = require('path');

let app = null;
let pluginRoot = null;

function requireFromPlugin(relativePath) {
    if (!pluginRoot) {
        throw new Error('Plugin root is not initialized yet.');
    }

    return require(path.join(pluginRoot, relativePath));
}

function loadAppModules() {
    if (!pluginRoot) {
        throw new Error('Eagle did not provide plugin.path during initialization.');
    }

    const eagleAdapter = requireFromPlugin('js/adapters/eagle.js');
    const animateModule = requireFromPlugin('js/services/animate.js');
    const historyModule = requireFromPlugin('js/app/history.js');
    const stateModule = requireFromPlugin('js/app/state.js');
    const uiModule = requireFromPlugin('js/app/ui.js');
    const providerModule = requireFromPlugin('js/providers/index.js');
    const clipboardModule = requireFromPlugin('js/services/clipboard.js');
    const fileDiscoveryModule = requireFromPlugin('js/services/fileDiscovery.js');
    const progressParserModule = requireFromPlugin('js/services/progressParser.js');
    const ytdlpModule = requireFromPlugin('js/services/ytdlp.js');
    const constantsModule = requireFromPlugin('js/utils/constants.js');

    app = {
        INSTALL_GUIDE_URL: constantsModule.INSTALL_GUIDE_URL,
        addHistoryItem: historyModule.addHistoryItem,
        animateModule,
        cleanupSessionFile: ytdlpModule.cleanupSessionFile,
        cleanupStaleSessions: ytdlpModule.cleanupStaleSessions,
        clearHistory: historyModule.clearHistory,
        createDownloadSession: ytdlpModule.createDownloadSession,
        createUi: uiModule.createUi,
        detectYtdlp: ytdlpModule.detectYtdlp,
        eagleAdapter,
        extractFilePathFromLine: fileDiscoveryModule.extractFilePathFromLine,
        findByPrefix: fileDiscoveryModule.findByPrefix,
        getProviderById: providerModule.getProviderById,
        getState: stateModule.getState,
        listProviders: providerModule.listProviders,
        loadHistory: historyModule.loadHistory,
        loadSelectedProvider: historyModule.loadSelectedProvider,
        parseProgressLine: progressParserModule.parseProgressLine,
        readClipboardText: clipboardModule.readClipboardText,
        resolveProvider: providerModule.resolveProvider,
        runDownload: ytdlpModule.runDownload,
        saveSelectedProvider: historyModule.saveSelectedProvider,
        setHistory: stateModule.setHistory,
        setIsDownloading: stateModule.setIsDownloading,
        setSelectedProviderId: stateModule.setSelectedProviderId,
        setYtdlpPath: stateModule.setYtdlpPath,
    };

    return app;
}

let ui = null;
let previousDefaultTags = '';

function updateProgressState(details) {
    ui.updateProgress(details);

    if (details && details.statusMessage) {
        ui.setStatus(details.statusMessage, details.statusType || 'loading');
    }
}

function getImplementedProviderIds() {
    return app.listProviders()
        .filter((provider) => provider.isImplemented)
        .map((provider) => provider.id);
}

function applyProvider(provider, skipAnimation) {
    const downloadOptions = typeof provider.getDownloadOptions === 'function'
        ? provider.getDownloadOptions()
        : null;

    app.setSelectedProviderId(provider.id);
    app.saveSelectedProvider(localStorage, provider.id);
    app.animateModule.setTheme(provider.id);
    ui.setSelectedProvider(provider.id, getImplementedProviderIds(), skipAnimation);

    if (skipAnimation) {
        ui.setProviderForm(provider, { previousDefaultTags, providerOptions: downloadOptions });
        previousDefaultTags = provider.getDefaultTags().join(', ');
        return;
    }

    ui.animateProviderSwitch(provider, {
        animateModule: app.animateModule,
        previousDefaultTags,
        providerOptions: downloadOptions,
    });
    previousDefaultTags = provider.getDefaultTags().join(', ');
}

function addToHistory(url, success, detail) {
    const history = app.addHistoryItem(localStorage, app.getState().downloadHistory, {
        detail,
        success,
        time: Date.now(),
        url,
    });

    app.setHistory(history);
    ui.renderHistory(history);
}

async function refreshYtdlpStatus() {
    const executablePath = await app.detectYtdlp();
    app.setYtdlpPath(executablePath);
    ui.updateYtdlpStatus(Boolean(executablePath));
}

function handleProgressLine(line) {
    const parsed = app.parseProgressLine(line);

    if (!parsed) {
        return;
    }

    updateProgressState(parsed);
}

async function runProviderDownload(options) {
    const {
        downloadOptions,
        provider,
        session,
        ytdlpPath,
    } = options;
    let capturedFilePath = null;

    function handleLine(line) {
        const possiblePath = app.extractFilePathFromLine(line, session.tempDirectory);

        if (possiblePath) {
            capturedFilePath = possiblePath;
            app.eagleAdapter.logInfo('[VideoFetch] Captured path: ' + capturedFilePath);
        }

        handleProgressLine(line);
    }

    let result = await app.runDownload({
        args: provider.buildDownloadArgs({
            downloadOptions,
            outputTemplate: session.outputTemplate,
            url: options.url,
        }),
        onStderrLine(line) {
            handleLine(line);
        },
        onStdoutLine(line) {
            handleLine(line);
        },
        ytdlpPath,
    });

    if (result.code !== 0 && typeof provider.shouldRetryWithClientFallback === 'function' && provider.shouldRetryWithClientFallback(result.stderrLines)) {
        updateProgressState({
            info: 'Switching to a token-safe YouTube client profile',
            label: 'Retrying YouTube...',
            pct: 8,
            stage: 'retrying',
            statusMessage: 'YouTube rejected the first request. Retrying with a token-safe client profile...',
            statusType: 'loading',
        });
        capturedFilePath = null;

        result = await app.runDownload({
            args: provider.buildDownloadArgs({
                downloadOptions,
                outputTemplate: session.outputTemplate,
                retryMode: 'tokenSafeClient',
                url: options.url,
            }),
            onStderrLine(line) {
                handleLine(line);
            },
            onStdoutLine(line) {
                handleLine(line);
            },
            ytdlpPath,
        });
    }

    return {
        capturedFilePath,
        result,
    };
}

async function addToEagle(sourceUrl, filePath, provider) {
    updateProgressState({
        info: path.basename(filePath),
        label: 'Importing into Eagle...',
        pct: 99,
        stage: 'importing',
        statusMessage: 'Adding to Eagle library...',
        statusType: 'loading',
    });

    const tagsValue = ui.getTags();
    const tags = tagsValue
        ? tagsValue.split(',').map((tag) => tag.trim()).filter(Boolean)
        : provider.getDefaultTags();

    const name = path.basename(filePath, path.extname(filePath));
    app.eagleAdapter.logInfo('[VideoFetch] Adding file to Eagle: ' + filePath);

    try {
        const selectedFolders = await app.eagleAdapter.getSelectedFolders();
        const folderIds = selectedFolders.map((folder) => folder.id).filter(Boolean);

        const importOptions = {
            annotation: 'Downloaded by Video Fetch plugin',
            name,
            tags,
            website: sourceUrl,
        };

        if (folderIds.length > 0) {
            importOptions.folders = folderIds;
            app.eagleAdapter.logDebug('[VideoFetch] Importing into folders: ' + folderIds.join(', '));
        }

        const itemId = await app.eagleAdapter.importFile(filePath, importOptions);

        app.cleanupSessionFile(filePath);

        if (itemId) {
            updateProgressState({
                info: path.basename(filePath),
                label: 'Saved to Eagle',
                pct: 100,
                stage: 'success',
                statusMessage: 'Video added to Eagle successfully.',
                statusType: 'success',
            });
            addToHistory(sourceUrl, true, path.basename(filePath));
            app.eagleAdapter.showNotification({
                title: 'Video Fetch',
                body: 'Video saved to Eagle: ' + name,
            });
            app.eagleAdapter.flashFrame(true);

            try {
                await app.eagleAdapter.openItem(itemId);
            } catch (error) {
                app.eagleAdapter.logInfo('[VideoFetch] Imported item could not be opened: ' + error.message);
            }

            return;
        }

        updateProgressState({
            info: path.basename(filePath),
            label: 'Saved to Eagle',
            pct: 100,
            stage: 'success',
            statusMessage: 'Saved to Eagle (no item ID returned).',
            statusType: 'success',
        });
        addToHistory(sourceUrl, true, 'OK');
        app.eagleAdapter.showNotification({
            title: 'Video Fetch',
            body: 'Video saved to Eagle.',
        });
    } catch (error) {
        app.eagleAdapter.logError('[VideoFetch] addToEagle error: ' + error.message);
        updateProgressState({
            info: error.message,
            label: 'Import failed',
            stage: 'failure',
            statusMessage: 'Eagle import failed: ' + error.message,
            statusType: 'error',
        });
        addToHistory(sourceUrl, false, error.message);
        app.eagleAdapter.showNotification({
            title: 'Video Fetch',
            body: 'Import failed: ' + error.message,
        });
        app.eagleAdapter.flashFrame(true);
    }
}

async function startDownload() {
    const state = app.getState();

    if (state.isDownloading) {
        return;
    }

    const url = ui.getUrl();

    if (!url) {
        ui.setStatus('Please enter a URL.', 'error');
        ui.focusUrlInput();
        return;
    }

    if (!state.ytdlpPath) {
        ui.setStatus('yt-dlp is not installed. See the install guide above.', 'error');
        return;
    }

    const selectedProvider = app.getProviderById(state.selectedProviderId);
    const resolvedProvider = app.resolveProvider(url);

    if (resolvedProvider && resolvedProvider.id !== selectedProvider.id) {
        applyProvider(resolvedProvider);
    }

    const provider = resolvedProvider || selectedProvider;

    if (!provider) {
        ui.setStatus('This URL is not supported yet.', 'error');
        return;
    }

    if (!provider.matchesUrl(url)) {
        ui.setStatus(`This URL does not match the selected platform: ${provider.label}.`, 'error');
        return;
    }

    app.setIsDownloading(true);
    ui.clearStatus();
    ui.resetProgress();
    ui.showProgress(true);
    updateProgressState({
        info: provider.label,
        label: 'Preparing download...',
        pct: 2,
        stage: 'preparing',
        statusMessage: 'Starting download...',
        statusType: 'loading',
    });
    ui.setDownloadButtonLoading();

    try {
        const session = await app.createDownloadSession();
        const downloadOptions = ui.getProviderOptions();
        updateProgressState({
            info: 'Resolving media streams and destination file',
            label: 'Preparing source...',
            pct: 5,
            stage: 'preparing',
            statusMessage: `Preparing ${provider.label} media...`,
            statusType: 'loading',
        });
        const { capturedFilePath, result } = await runProviderDownload({
            downloadOptions,
            provider,
            session,
            url,
            ytdlpPath: state.ytdlpPath,
        });

        if (result.code === 0) {
            const filePath = capturedFilePath || app.findByPrefix(session.tempDirectory, session.sessionId);

            if (filePath) {
                await addToEagle(url, filePath, provider);
            } else {
                app.eagleAdapter.logError('[VideoFetch] File not found after download in ' + session.tempDirectory);
                updateProgressState({
                    info: 'The final media file could not be located after download completion',
                    label: 'Download incomplete',
                    stage: 'failure',
                    statusMessage: 'Download finished but the final file could not be found.',
                    statusType: 'error',
                });
                addToHistory(url, false, 'File not found');
            }
        } else {
            const errorMessage = (result.stderrLines.join(' ') || 'Unknown error').slice(0, 200);
            app.eagleAdapter.logError('[VideoFetch] yt-dlp failed (code ' + result.code + '): ' + errorMessage);
            const isYoutubeClientFailure = provider.id === 'youtube' && /precondition check failed|unable to download api page|http error 400/i.test(errorMessage);
            const suffix = isYoutubeClientFailure ? ' Try updating yt-dlp if this keeps happening.' : '';
            updateProgressState({
                info: errorMessage,
                label: 'Download failed',
                stage: 'failure',
                statusMessage: `Download failed (code ${result.code}): ${errorMessage}${suffix}`,
                statusType: 'error',
            });
            addToHistory(url, false, 'Exit code ' + result.code);
        }
    } catch (error) {
        app.eagleAdapter.logError('[VideoFetch] Failed to start yt-dlp: ' + error.message);
        updateProgressState({
            info: error.message,
            label: 'Download failed',
            stage: 'failure',
            statusMessage: 'Failed to start yt-dlp: ' + error.message,
            statusType: 'error',
        });
        addToHistory(url, false, error.message);
    } finally {
        app.setIsDownloading(false);
        ui.resetDownloadButton(Boolean(app.getState().ytdlpPath));
    }
}

async function pasteFromClipboard() {
    try {
        const clipboardText = await app.readClipboardText(app.eagleAdapter);

        if (!clipboardText) {
            return;
        }

        ui.setUrl(clipboardText);
        const resolvedProvider = app.resolveProvider(clipboardText);

        if (resolvedProvider) {
            applyProvider(resolvedProvider);
        }
    } catch (error) {
        ui.setStatus('Cannot read clipboard: ' + error.message, 'error');
    }
}

async function autoDetectClipboard() {
    if (!app || !ui) {
        return;
    }

    try {
        const clipboardText = await app.readClipboardText(app.eagleAdapter);

        if (!clipboardText) {
            return;
        }

        const provider = app.resolveProvider(clipboardText);

        if (!provider) {
            return;
        }

        ui.setUrl(clipboardText);
        applyProvider(provider);
    } catch (error) {
        app.eagleAdapter.logInfo('[VideoFetch] Clipboard auto-detect skipped: ' + error.message);
    }
}

function handleSelectProvider(providerId) {
    const provider = app.getProviderById(providerId);

    if (!provider) {
        ui.setStatus('This platform is not available yet.', 'error');
        return;
    }

    applyProvider(provider);
}

function handleReuseUrl(index) {
    const item = app.getState().downloadHistory[index];

    if (!item) {
        return;
    }

    ui.setUrl(item.url);

    const provider = app.resolveProvider(item.url);

    if (provider) {
        applyProvider(provider);
    }
}

function handleClearHistory() {
    const history = app.clearHistory(localStorage);
    app.setHistory(history);
    ui.renderHistory(history);
}

function openInstallGuide() {
    app.eagleAdapter.openExternal(app.INSTALL_GUIDE_URL);
}

async function initialize() {
    ui = app.createUi({
        onClearHistory: handleClearHistory,
        onDownload: startDownload,
        onOpenInstallGuide: openInstallGuide,
        onPaste: pasteFromClipboard,
        onReuseUrl: handleReuseUrl,
        onSelectProvider: handleSelectProvider,
    });

    const history = app.loadHistory(localStorage);
    app.setHistory(history);
    ui.renderHistory(history);

    const selectedProviderId = app.loadSelectedProvider(localStorage);
    const constantsModule = requireFromPlugin('js/utils/constants.js');
    const selectedProvider = app.getProviderById(selectedProviderId) || app.getProviderById(constantsModule.DEFAULT_PROVIDER_ID);
    previousDefaultTags = selectedProvider.getDefaultTags().join(', ');
    applyProvider(selectedProvider, true);

    await refreshYtdlpStatus();
    app.cleanupStaleSessions();
}

eagle.onPluginCreate(async (plugin) => {
    pluginRoot = plugin && plugin.path ? plugin.path : null;
    loadAppModules();
    await initialize();
});

eagle.onPluginRun(() => {
    autoDetectClipboard();
});

eagle.onPluginShow(() => {
    autoDetectClipboard();
});

eagle.onPluginBeforeExit(() => {
    if (app) {
        app.cleanupStaleSessions();
    }
});

