'use strict';

const twitterProvider = require('./twitter');
const youtubeProvider = require('./youtube');
const instagramProvider = require('./instagram');
const tiktokProvider = require('./tiktok');

const providers = [twitterProvider, youtubeProvider, instagramProvider, tiktokProvider];

function listProviders() {
    return providers.slice();
}

function getProviderById(providerId) {
    return providers.find((provider) => provider.id === providerId) || null;
}

function resolveProvider(url) {
    return providers.find((provider) => provider.matchesUrl(url)) || null;
}

module.exports = {
    getProviderById,
    listProviders,
    resolveProvider,
};
