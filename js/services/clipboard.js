'use strict';

async function readBrowserClipboardText() {
    if (!globalThis.navigator || !navigator.clipboard || typeof navigator.clipboard.readText !== 'function') {
        return '';
    }

    try {
        return await navigator.clipboard.readText();
    } catch (error) {
        return '';
    }
}

async function readClipboardText(eagleAdapter) {
    const browserText = (await readBrowserClipboardText() || '').trim();

    if (browserText) {
        return browserText;
    }

    return ((await eagleAdapter.readClipboardText()) || '').trim();
}

module.exports = {
    readClipboardText,
};
