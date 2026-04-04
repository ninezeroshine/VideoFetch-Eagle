'use strict';

const { DEFAULT_PROVIDER_ID } = require('../utils/constants');

const state = {
    downloadHistory: [],
    isDownloading: false,
    selectedProviderId: DEFAULT_PROVIDER_ID,
    ytdlpPath: null,
};

function getState() {
    return Object.freeze(Object.assign({}, state));
}

function setHistory(history) {
    state.downloadHistory = Array.isArray(history) ? history.slice() : [];
    return state.downloadHistory;
}

function setIsDownloading(value) {
    state.isDownloading = Boolean(value);
    return state.isDownloading;
}

function setSelectedProviderId(providerId) {
    state.selectedProviderId = providerId || DEFAULT_PROVIDER_ID;
    return state.selectedProviderId;
}

function setYtdlpPath(executablePath) {
    state.ytdlpPath = executablePath || null;
    return state.ytdlpPath;
}

module.exports = {
    getState,
    setHistory,
    setIsDownloading,
    setSelectedProviderId,
    setYtdlpPath,
};
