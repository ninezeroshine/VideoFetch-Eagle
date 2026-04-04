'use strict';

function getEagle() {
    return globalThis.eagle;
}

async function importFile(filePath, options) {
    return getEagle().item.addFromPath(filePath, options);
}

async function openItem(itemId) {
    if (!itemId) {
        return null;
    }

    return getEagle().item.open(itemId);
}

async function readClipboardText() {
    const eagle = getEagle();

    if (!eagle || !eagle.clipboard || typeof eagle.clipboard.readText !== 'function') {
        return '';
    }

    return eagle.clipboard.readText();
}

function openExternal(url) {
    return getEagle().shell.openExternal(url);
}

function showItemInFolder(filePath) {
    return getEagle().shell.showItemInFolder(filePath);
}

function logDebug(message) {
    return getEagle().log.debug(message);
}

function logInfo(message) {
    return getEagle().log.info(message);
}

function logWarn(message) {
    return getEagle().log.warn(message);
}

function logError(message) {
    return getEagle().log.error(message);
}

function onPluginCreate(handler) {
    return getEagle().onPluginCreate(handler);
}

function onPluginRun(handler) {
    return getEagle().onPluginRun(handler);
}

function onPluginShow(handler) {
    return getEagle().onPluginShow(handler);
}

function onPluginBeforeExit(handler) {
    return getEagle().onPluginBeforeExit(handler);
}

async function showNotification(options) {
    const eagle = getEagle();

    if (!eagle || !eagle.notification || typeof eagle.notification.show !== 'function') {
        return;
    }

    return eagle.notification.show(options);
}

async function flashFrame(flag) {
    const eagle = getEagle();

    if (!eagle || !eagle.window || typeof eagle.window.flashFrame !== 'function') {
        return;
    }

    return eagle.window.flashFrame(flag);
}

async function getSelectedFolders() {
    const eagle = getEagle();

    if (!eagle || !eagle.folder || typeof eagle.folder.getSelected !== 'function') {
        return [];
    }

    try {
        return await eagle.folder.getSelected();
    } catch (_error) {
        return [];
    }
}

async function getTempPath() {
    const eagle = getEagle();

    if (!eagle || !eagle.app || typeof eagle.app.getPath !== 'function') {
        return null;
    }

    try {
        return await eagle.app.getPath('temp');
    } catch (_error) {
        return null;
    }
}

function getTheme() {
    const eagle = getEagle();
    return eagle && eagle.app ? eagle.app.theme : 'DARK';
}

module.exports = {
    flashFrame,
    getSelectedFolders,
    getTempPath,
    getTheme,
    importFile,
    logDebug,
    logError,
    logInfo,
    logWarn,
    onPluginBeforeExit,
    onPluginCreate,
    onPluginRun,
    onPluginShow,
    openExternal,
    openItem,
    readClipboardText,
    showItemInFolder,
    showNotification,
};
