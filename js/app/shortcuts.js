'use strict';

/**
 * Global keyboard shortcuts.
 *
 * Ctrl+V / Cmd+V  — paste URL from clipboard and auto-scan
 * Enter           — start download (when not focused on textarea)
 * Escape          — cancel all active downloads
 *
 * @param {object} callbacks
 * @param {Function} callbacks.onPaste    — paste + scan
 * @param {Function} callbacks.onDownload — start download
 * @param {Function} callbacks.onCancel   — cancel active downloads
 */
function createShortcuts(callbacks) {
    var onPaste    = callbacks.onPaste;
    var onDownload = callbacks.onDownload;
    var onCancel   = callbacks.onCancel;

    function isTyping(e) {
        var tag = e.target.tagName;
        return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    }

    function handleKeydown(e) {
        var ctrlOrMeta = e.ctrlKey || e.metaKey;

        /* Ctrl/Cmd + V — paste & scan (only when URL input is not focused) */
        if (ctrlOrMeta && e.key === 'v' && !isTyping(e)) {
            e.preventDefault();
            onPaste();
            return;
        }

        /* Enter — start download (skip if typing in a textarea) */
        if (e.key === 'Enter' && !e.shiftKey && !ctrlOrMeta) {
            if (e.target.tagName === 'TEXTAREA') {
                return;
            }

            e.preventDefault();
            onDownload();
            return;
        }

        /* Escape — cancel active downloads */
        if (e.key === 'Escape') {
            onCancel();
            return;
        }
    }

    document.addEventListener('keydown', handleKeydown);

    return {
        destroy: function () {
            document.removeEventListener('keydown', handleKeydown);
        },
    };
}

module.exports = { createShortcuts: createShortcuts };
