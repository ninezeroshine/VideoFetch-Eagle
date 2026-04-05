'use strict';

const { DEFAULT_PROVIDER_ID } = require('../utils/constants');

const state = {
    activeTab: 'single',
    downloadHistory: [],
    selectedProviderId: DEFAULT_PROVIDER_ID,
    ytdlpPath: null,
};

function getState() {
    return Object.freeze(Object.assign({}, state));
}

function setActiveTab(tab) {
    state.activeTab = tab === 'batch' ? 'batch' : 'single';
    return state.activeTab;
}

function setHistory(history) {
    state.downloadHistory = Array.isArray(history) ? history.slice() : [];
    return state.downloadHistory;
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
    setActiveTab,
    setHistory,
    setSelectedProviderId,
    setYtdlpPath,
};
