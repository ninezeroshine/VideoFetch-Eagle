'use strict';

/**
 * Download Queue — manages parallel downloads with concurrency control.
 *
 * Event-based API:
 *   queue.on('stateChange', (id, item) => ...)
 *   queue.on('progress',    (id, data) => ...)
 *   queue.on('complete',    (id, item) => ...)
 *   queue.on('error',       (id, item) => ...)
 *   queue.on('queueUpdate', ()         => ...)
 */

const MAX_CONCURRENT = 3;

const STATES = {
    QUEUED: 'queued',
    SCANNING: 'scanning',
    DOWNLOADING: 'downloading',
    MERGING: 'merging',
    IMPORTING: 'importing',
    DONE: 'done',
    ERROR: 'error',
    CANCELLED: 'cancelled',
};

function createDownloadItem(id, url, provider) {
    return {
        id: id,
        url: url,
        provider: provider,
        state: STATES.QUEUED,
        progress: { pct: 0, info: '', label: '', stage: '' },
        title: '',
        error: null,
        abort: null,
    };
}

function createQueue() {
    const items = new Map();
    const listeners = {};
    let idCounter = 0;
    let deps = null;

    /* ─── Event system ─── */

    function on(event, callback) {
        if (!listeners[event]) {
            listeners[event] = [];
        }

        listeners[event].push(callback);
    }

    function emit(event) {
        const args = Array.prototype.slice.call(arguments, 1);
        const handlers = listeners[event];

        if (handlers) {
            for (let i = 0; i < handlers.length; i++) {
                handlers[i].apply(null, args);
            }
        }
    }

    /* ─── Dependencies (injected from plugin.js) ─── */

    function init(dependencies) {
        deps = dependencies;
    }

    /* ─── Queue management ─── */

    function add(url, provider) {
        idCounter += 1;
        const id = 'dl_' + Date.now() + '_' + idCounter;
        const item = createDownloadItem(id, url, provider);

        items.set(id, item);
        emit('queueUpdate');
        processQueue();

        return id;
    }

    function cancel(id) {
        const item = items.get(id);

        if (!item) {
            return;
        }

        if (item.abort) {
            item.abort();
        }

        item.state = STATES.CANCELLED;
        item.abort = null;
        emit('stateChange', id, item);
        emit('queueUpdate');
        processQueue();
    }

    function cancelAll() {
        items.forEach(function (item) {
            if (item.state === STATES.QUEUED || item.state === STATES.DOWNLOADING || item.state === STATES.SCANNING || item.state === STATES.MERGING) {
                cancel(item.id);
            }
        });
    }

    function remove(id) {
        items.delete(id);
        emit('queueUpdate');
    }

    function getAll() {
        return Array.from(items.values());
    }

    function hasActive() {
        return getAll().some(function (item) {
            return item.state === STATES.QUEUED || item.state === STATES.SCANNING || item.state === STATES.DOWNLOADING || item.state === STATES.MERGING || item.state === STATES.IMPORTING;
        });
    }

    function getActiveCount() {
        return getAll().filter(function (item) {
            return item.state === STATES.DOWNLOADING || item.state === STATES.SCANNING || item.state === STATES.MERGING || item.state === STATES.IMPORTING;
        }).length;
    }

    /* ─── Process queue — start next download if slot available ─── */

    function processQueue() {
        if (!deps) {
            return;
        }

        const activeCount = getActiveCount();

        if (activeCount >= MAX_CONCURRENT) {
            return;
        }

        const queued = getAll().filter(function (item) {
            return item.state === STATES.QUEUED;
        });

        const slotsAvailable = MAX_CONCURRENT - activeCount;

        for (let i = 0; i < Math.min(slotsAvailable, queued.length); i++) {
            executeDownload(queued[i]);
        }
    }

    /* ─── Execute a single download ─── */

    async function executeDownload(item) {
        const { provider, url } = item;

        try {
            // Scanning phase
            setState(item, STATES.SCANNING);

            let metadata = null;

            if (provider.supportsMetadata && deps.getYtdlpPath()) {
                const raw = await deps.fetchRawMetadata(deps.getYtdlpPath(), url);

                if (typeof provider.parseMetadata === 'function') {
                    metadata = provider.parseMetadata(raw);
                }

                if (metadata) {
                    item.title = metadata.title || '';
                }
            }

            // Build download options (use provider defaults)
            const downloadOptions = typeof provider.getDownloadOptions === 'function'
                ? provider.getDownloadOptions(metadata)
                : null;

            const defaults = downloadOptions && downloadOptions.defaults
                ? downloadOptions.defaults
                : {};

            // Create session
            const session = await deps.createDownloadSession();

            // Downloading phase
            setState(item, STATES.DOWNLOADING);

            let capturedFilePath = null;

            function handleLine(line) {
                const possiblePath = deps.extractFilePathFromLine(line, session.tempDirectory);

                if (possiblePath) {
                    capturedFilePath = possiblePath;
                }

                const parsed = deps.parseProgressLine(line);

                if (parsed) {
                    item.progress = {
                        pct: parsed.pct || item.progress.pct,
                        info: parsed.info || '',
                        label: parsed.label || '',
                        stage: parsed.stage || item.progress.stage,
                    };

                    if (parsed.stage === 'merging') {
                        setState(item, STATES.MERGING);
                    }

                    emit('progress', item.id, item.progress);
                }
            }

            const download = deps.runDownload({
                args: provider.buildDownloadArgs({
                    downloadOptions: defaults,
                    outputTemplate: session.outputTemplate,
                    url: url,
                }),
                onStdoutLine: handleLine,
                onStderrLine: handleLine,
                ytdlpPath: deps.getYtdlpPath(),
            });

            item.abort = download.abort;
            const result = await download.promise;
            item.abort = null;

            // Retry for YouTube
            if (result.code !== 0 && typeof provider.shouldRetryWithClientFallback === 'function' && provider.shouldRetryWithClientFallback(result.stderrLines)) {
                capturedFilePath = null;

                const retry = deps.runDownload({
                    args: provider.buildDownloadArgs({
                        downloadOptions: defaults,
                        outputTemplate: session.outputTemplate,
                        retryMode: 'tokenSafeClient',
                        url: url,
                    }),
                    onStdoutLine: handleLine,
                    onStderrLine: handleLine,
                    ytdlpPath: deps.getYtdlpPath(),
                });

                item.abort = retry.abort;
                const retryResult = await retry.promise;
                item.abort = null;

                if (retryResult.code !== 0) {
                    throw new Error((retryResult.stderrLines.join(' ') || 'Download failed').slice(0, 200));
                }
            } else if (result.code !== 0) {
                throw new Error((result.stderrLines.join(' ') || 'Download failed').slice(0, 200));
            }

            // Find file
            const filePath = capturedFilePath || deps.findByPrefix(session.tempDirectory, session.sessionId);

            if (!filePath) {
                throw new Error('File not found after download');
            }

            // Import to Eagle
            setState(item, STATES.IMPORTING);

            const tags = provider.getDefaultTags();
            const name = require('path').basename(filePath, require('path').extname(filePath));

            const importOptions = {
                annotation: deps.importAnnotation,
                name: name,
                tags: tags,
                website: url,
            };

            const selectedFolders = await deps.getSelectedFolders();
            const folderIds = selectedFolders.map(function (f) { return f.id; }).filter(Boolean);

            if (folderIds.length > 0) {
                importOptions.folders = folderIds;
            }

            await deps.importFile(filePath, importOptions);
            deps.cleanupSessionFile(filePath);

            // Done
            setState(item, STATES.DONE);
            emit('complete', item.id, item);
            deps.showNotification(item.title || 'Download complete');

        } catch (error) {
            if (item.state === STATES.CANCELLED) {
                return;
            }

            item.error = error.message || 'Unknown error';
            setState(item, STATES.ERROR);
            emit('error', item.id, item);
        }

        processQueue();
    }

    function setState(item, state) {
        item.state = state;
        emit('stateChange', item.id, item);
    }

    return {
        STATES: STATES,
        add: add,
        cancel: cancel,
        cancelAll: cancelAll,
        getAll: getAll,
        hasActive: hasActive,
        init: init,
        on: on,
        remove: remove,
    };
}

module.exports = {
    createQueue: createQueue,
};
