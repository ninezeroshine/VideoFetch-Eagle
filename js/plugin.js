'use strict';

const path = require('path');

let app = null;
let pluginRoot = null;
let queue = null;

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
    const binManager = requireFromPlugin('js/services/binManager.js');
    const clipboardModule = requireFromPlugin('js/services/clipboard.js');
    const fileDiscoveryModule = requireFromPlugin('js/services/fileDiscovery.js');
    const historyModule = requireFromPlugin('js/app/history.js');
    const metadataModule = requireFromPlugin('js/services/metadata.js');
    const progressParserModule = requireFromPlugin('js/services/progressParser.js');
    const providerModule = requireFromPlugin('js/providers/index.js');
    const queueModule = requireFromPlugin('js/services/downloadQueue.js');
    const shortcutsModule = requireFromPlugin('js/app/shortcuts.js');
    const stateModule = requireFromPlugin('js/app/state.js');
    const titlebarModule = requireFromPlugin('js/app/titlebar.js');
    const uiModule = requireFromPlugin('js/app/ui.js');
    const ytdlpModule = requireFromPlugin('js/services/ytdlp.js');
    const constantsModule = requireFromPlugin('js/utils/constants.js');

    app = {
        IMPORT_ANNOTATION: constantsModule.IMPORT_ANNOTATION,
        INSTALL_GUIDE_URL: constantsModule.INSTALL_GUIDE_URL,
        PLUGIN_NAME: constantsModule.PLUGIN_NAME,
        URL_NOT_RECOGNIZED: constantsModule.URL_NOT_RECOGNIZED,
        addHistoryItem: historyModule.addHistoryItem,
        animateModule,
        checkSystemFfmpeg: binManager.checkSystemFfmpeg,
        cleanupSessionFile: ytdlpModule.cleanupSessionFile,
        cleanupStaleSessions: ytdlpModule.cleanupStaleSessions,
        clearHistory: historyModule.clearHistory,
        createDownloadSession: ytdlpModule.createDownloadSession,
        createQueue: queueModule.createQueue,
        createShortcuts: shortcutsModule.createShortcuts,
        createTitlebar: titlebarModule.createTitlebar,
        createUi: uiModule.createUi,
        detectYtdlp: ytdlpModule.detectYtdlp,
        downloadFfmpeg: binManager.downloadFfmpeg,
        downloadYtdlp: binManager.downloadYtdlp,
        fetchLatestYtdlpVersion: binManager.fetchLatestYtdlpVersion,
        eagleAdapter,
        extractFilePathFromLine: fileDiscoveryModule.extractFilePathFromLine,
        fetchRawMetadata: metadataModule.fetchRawMetadata,
        fetchThumbnailDataUri: metadataModule.fetchThumbnailDataUri,
        findByPrefix: fileDiscoveryModule.findByPrefix,
        getLocalFfmpegPath: binManager.getLocalFfmpegPath,
        getLocalYtdlpVersion: binManager.getLocalYtdlpVersion,
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
        setActiveTab: stateModule.setActiveTab,
        setHistory: stateModule.setHistory,
        setSelectedProviderId: stateModule.setSelectedProviderId,
        setYtdlpPath: stateModule.setYtdlpPath,
        updateYtdlp: binManager.updateYtdlp,
    };

    return app;
}

let ui = null;
let previousDefaultTags = '';

/* ─── Provider management ─── */

function getImplementedProviderIds() {
    return app.listProviders()
        .filter((provider) => provider.isImplemented)
        .map((provider) => provider.id);
}

function applyProvider(provider, skipAnimation, metadata) {
    const downloadOptions = typeof provider.getDownloadOptions === 'function'
        ? provider.getDownloadOptions(metadata || null)
        : null;

    app.setSelectedProviderId(provider.id);
    app.saveSelectedProvider(localStorage, provider.id);
    app.animateModule.setTheme(provider.id);
    ui.setSelectedProvider(provider.id, getImplementedProviderIds(), skipAnimation);

    if (metadata) {
        ui.showPreview(metadata);
    } else if (app.getState().selectedProviderId !== provider.id) {
        ui.hidePreview();
    }

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

/* ─── History ─── */

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

/* ─── Dependency management ─── */

async function refreshYtdlpStatus() {
    const executablePath = await app.detectYtdlp();
    app.setYtdlpPath(executablePath);
    ui.updateYtdlpStatus(Boolean(executablePath));
}

async function refreshDependencyStatus() {
    await refreshYtdlpStatus();
    const hasFfmpeg = app.getLocalFfmpegPath() || await app.checkSystemFfmpeg();
    ui.updateFfmpegStatus(Boolean(hasFfmpeg));
}

async function autoInstallYtdlp() {
    ui.setStatus('Downloading yt-dlp...', 'loading');

    try {
        const installedPath = await app.downloadYtdlp(function (pct, info) {
            ui.setStatus(pct >= 0 ? 'Installing yt-dlp... ' + pct + '%' : 'Installing yt-dlp... ' + info, 'loading');
        });

        app.setYtdlpPath(installedPath);
        ui.clearStatus();
        app.eagleAdapter.showNotification({ title: app.PLUGIN_NAME, body: 'yt-dlp installed successfully.' });
        await refreshDependencyStatus();
    } catch (error) {
        app.eagleAdapter.logError('[VideoFetch] Auto-install failed: ' + error.message);
        ui.setStatus('Install failed: ' + error.message, 'error');
    }
}

async function autoInstallFfmpeg() {
    ui.setStatus('Downloading ffmpeg (~130 MB)...', 'loading');

    try {
        await app.downloadFfmpeg(function (pct, info) {
            ui.setStatus(pct >= 0 ? 'Installing ffmpeg... ' + pct + '%' : 'Installing ffmpeg... ' + info, 'loading');
        });

        ui.clearStatus();
        app.eagleAdapter.showNotification({ title: app.PLUGIN_NAME, body: 'ffmpeg installed successfully.' });
        await refreshDependencyStatus();
    } catch (error) {
        app.eagleAdapter.logError('[VideoFetch] ffmpeg install failed: ' + error.message);
        ui.setStatus('ffmpeg install failed: ' + error.message, 'error');
    }
}

/* ─── Scan + apply provider ─── */

async function scanAndApplyProvider(url) {
    const provider = app.resolveProvider(url);

    if (!provider) {
        ui.setStatus(app.URL_NOT_RECOGNIZED, 'error');
        return;
    }

    ui.clearStatus();
    ui.hidePreview();

    if (provider.supportsMetadata && app.getState().ytdlpPath) {
        ui.setScanLoading(true);

        try {
            const raw = await app.fetchRawMetadata(app.getState().ytdlpPath, url);
            const metadata = typeof provider.parseMetadata === 'function'
                ? provider.parseMetadata(raw)
                : null;

            if (metadata && metadata.thumbnail) {
                const dataUri = await app.fetchThumbnailDataUri(metadata.thumbnail);

                if (dataUri) {
                    metadata.thumbnail = dataUri;
                }
            }

            applyProvider(provider, false, metadata);
        } finally {
            ui.setScanLoading(false);
        }
    } else {
        applyProvider(provider);
    }
}

/* ─── Download actions ─── */

function startSingleDownload() {
    const state = app.getState();
    const url = ui.getUrl();

    if (!url) {
        ui.setStatus('Please enter a URL.', 'error');
        ui.focusUrlInput();
        return;
    }

    if (!state.ytdlpPath) {
        ui.setStatus('yt-dlp is not installed.', 'error');
        return;
    }

    const provider = app.resolveProvider(url);

    if (!provider) {
        ui.setStatus(app.URL_NOT_RECOGNIZED, 'error');
        return;
    }

    queue.add(url, provider);
    ui.clearStatus();
}

function startBatchDownload() {
    const state = app.getState();
    const text = ui.getBatchInput();

    if (!text.trim()) {
        ui.setStatus('Paste URLs first.', 'error');
        return;
    }

    if (!state.ytdlpPath) {
        ui.setStatus('yt-dlp is not installed.', 'error');
        return;
    }

    const lines = text.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
    let added = 0;

    for (const line of lines) {
        const provider = app.resolveProvider(line);

        if (provider) {
            queue.add(line, provider);
            added++;
        }
    }

    if (added > 0) {
        ui.clearStatus();
        ui.setStatus('Added ' + added + ' downloads to queue.', 'success');
    } else {
        ui.setStatus('No supported URLs found.', 'error');
    }
}

function handleDownload() {
    if (app.getState().activeTab === 'batch') {
        startBatchDownload();
    } else {
        startSingleDownload();
    }
}

function handleStopDownload(id) {
    queue.cancel(id);
}

/* ─── Queue event handlers ─── */

function setupQueueEvents() {
    queue.on('stateChange', function (id, item) {
        ui.updateDownloadCard(id, item);

        if (item.state === 'done') {
            addToHistory(item.url, true, item.title || path.basename(item.url));
        } else if (item.state === 'error') {
            addToHistory(item.url, false, item.error || 'Error');
        }
    });

    queue.on('progress', function (id, progress) {
        ui.updateDownloadCardProgress(id, progress);
    });

    queue.on('queueUpdate', function () {
        ui.updateDownloadButton(queue.hasActive(), queue.getAll().length);
    });
}

/* ─── UI handlers ─── */

async function pasteFromClipboard() {
    try {
        const clipboardText = await app.readClipboardText(app.eagleAdapter);

        if (!clipboardText) {
            return;
        }

        ui.setUrl(clipboardText);
        await scanAndApplyProvider(clipboardText);
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

async function scanUrl() {
    const url = ui.getUrl();

    if (!url) {
        ui.setStatus('Paste a URL first, then scan.', 'error');
        ui.focusUrlInput();
        return;
    }

    await scanAndApplyProvider(url);
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

function handleModeSwitch(mode) {
    app.setActiveTab(mode);
    ui.setMode(mode, app.animateModule);
}

async function checkAndUpdateYtdlp() {
    var state = app.getState();

    if (!state.ytdlpPath) {
        ui.setStatus('yt-dlp is not installed.', 'error');
        return;
    }

    var updateBtn = document.getElementById('ytdlpUpdateBtn');
    var versionEl = document.getElementById('ytdlpVersion');

    updateBtn.classList.add('updating');
    ui.setStatus('Checking for yt-dlp updates...', 'loading');

    try {
        var results = await Promise.all([
            app.getLocalYtdlpVersion(state.ytdlpPath),
            app.fetchLatestYtdlpVersion(),
        ]);

        var currentVersion = results[0];
        var latestVersion = results[1];

        if (!latestVersion) {
            ui.setStatus('Could not check for updates.', 'error');
            updateBtn.classList.remove('updating');
            return;
        }

        if (currentVersion === latestVersion) {
            ui.setStatus('yt-dlp is up to date (' + currentVersion + ').', 'success');
            updateBtn.classList.remove('updating');
            return;
        }

        ui.setStatus('Updating yt-dlp: ' + (currentVersion || '?') + ' \u2192 ' + latestVersion + '...', 'loading');

        await app.updateYtdlp(function (pct, info) {
            ui.setStatus(pct >= 0 ? 'Updating yt-dlp... ' + pct + '%' : 'Updating yt-dlp... ' + info, 'loading');
        });

        await refreshYtdlpStatus();
        var newVersion = await app.getLocalYtdlpVersion(app.getState().ytdlpPath);
        versionEl.textContent = newVersion ? 'v' + newVersion : '';
        ui.setStatus('yt-dlp updated to ' + (newVersion || latestVersion) + '.', 'success');
        app.eagleAdapter.showNotification({ title: app.PLUGIN_NAME, body: 'yt-dlp updated successfully.' });
    } catch (error) {
        ui.setStatus('Update failed: ' + error.message, 'error');
    }

    updateBtn.classList.remove('updating');
}

function openInstallGuide() {
    app.eagleAdapter.openExternal(app.INSTALL_GUIDE_URL);
}

/* ─── Initialize ─── */

async function initialize() {
    app.createTitlebar();

    queue = app.createQueue();

    queue.init({
        cleanupSessionFile: app.cleanupSessionFile,
        createDownloadSession: app.createDownloadSession,
        extractFilePathFromLine: app.extractFilePathFromLine,
        fetchRawMetadata: app.fetchRawMetadata,
        findByPrefix: app.findByPrefix,
        getSelectedFolders: app.eagleAdapter.getSelectedFolders,
        importAnnotation: app.IMPORT_ANNOTATION,
        importFile: app.eagleAdapter.importFile,
        parseProgressLine: app.parseProgressLine,
        runDownload: app.runDownload,
        showNotification: function (body) {
            app.eagleAdapter.showNotification({ title: app.PLUGIN_NAME, body: body });
            app.eagleAdapter.flashFrame(true);
        },
        getYtdlpPath: function () { return app.getState().ytdlpPath; },
    });

    setupQueueEvents();

    ui = app.createUi({
        onAutoInstallFfmpeg: autoInstallFfmpeg,
        onAutoInstallYtdlp: autoInstallYtdlp,
        onClearHistory: handleClearHistory,
        onDownload: handleDownload,
        onModeSwitch: handleModeSwitch,
        onOpenInstallGuide: openInstallGuide,
        onPaste: pasteFromClipboard,
        onReuseUrl: handleReuseUrl,
        onScan: scanUrl,
        onStopDownload: handleStopDownload,
    });

    app.createShortcuts({
        onPaste: pasteFromClipboard,
        onDownload: handleDownload,
        onCancel: function () { if (queue) { queue.cancelAll(); } },
    });

    ui.setMode('single');

    const history = app.loadHistory(localStorage);
    app.setHistory(history);
    ui.renderHistory(history);

    await refreshDependencyStatus();

    var updateBtn = document.getElementById('ytdlpUpdateBtn');
    var versionEl = document.getElementById('ytdlpVersion');

    if (app.getState().ytdlpPath) {
        updateBtn.style.display = '';
        updateBtn.addEventListener('click', checkAndUpdateYtdlp);

        app.getLocalYtdlpVersion(app.getState().ytdlpPath).then(function (version) {
            if (version) {
                versionEl.textContent = 'v' + version;
            }
        });
    }

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
    if (queue) {
        queue.cancelAll();
    }

    if (app) {
        app.cleanupStaleSessions();
    }
});
