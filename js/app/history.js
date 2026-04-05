'use strict';

const {
    DEFAULT_PROVIDER_ID,
    HISTORY_STORAGE_KEY,
    MAX_HISTORY_ITEMS,
    SELECTED_PROVIDER_STORAGE_KEY,
} = require('../utils/constants');

function loadHistory(storage) {
    try {
        const raw = storage.getItem(HISTORY_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        return [];
    }
}

function saveHistory(storage, items) {
    const history = Array.isArray(items) ? items.slice(0, MAX_HISTORY_ITEMS) : [];
    storage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    return history;
}

function addHistoryItem(storage, items, entry) {
    const history = Array.isArray(items) ? items.slice() : [];
    history.unshift(entry);

    if (history.length > MAX_HISTORY_ITEMS) {
        history.length = MAX_HISTORY_ITEMS;
    }

    saveHistory(storage, history);
    return history;
}

function clearHistory(storage) {
    storage.setItem(HISTORY_STORAGE_KEY, JSON.stringify([]));
    return [];
}

function loadSelectedProvider(storage) {
    try {
        return storage.getItem(SELECTED_PROVIDER_STORAGE_KEY) || DEFAULT_PROVIDER_ID;
    } catch (error) {
        return DEFAULT_PROVIDER_ID;
    }
}

function saveSelectedProvider(storage, providerId) {
    storage.setItem(SELECTED_PROVIDER_STORAGE_KEY, providerId);
    return providerId;
}

module.exports = {
    addHistoryItem,
    clearHistory,
    loadHistory,
    loadSelectedProvider,
    saveSelectedProvider,
};
