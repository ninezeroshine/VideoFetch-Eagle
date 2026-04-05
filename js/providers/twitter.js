'use strict';

const { buildProviderArgs, buildSimpleOptions } = require('./common');
const { parseBasicMetadata } = require('../services/metadata');

function matchesUrl(url) {
    return /^https?:\/\/(www\.)?(twitter\.com|x\.com)\//i.test(url);
}

function getDefaultTags() {
    return ['twitter', 'video'];
}

function getInputLabel() {
    return 'Tweet / Post URL';
}

function getInputPlaceholder() {
    return 'https://x.com/user/status/...';
}

/* ─── Metadata ─── */

const supportsMetadata = true;

function parseMetadata(raw) {
    return parseBasicMetadata(raw);
}

/* ─── Download options ─── */

function getDownloadOptions() {
    return buildSimpleOptions();
}

const VIDEO_FORMAT = 'bestvideo[protocol=https][ext=mp4]+bestaudio[protocol=https][ext=mp4]/best[protocol=https][ext=mp4]/bestvideo+bestaudio/best';

function buildDownloadArgs(options) {
    return buildProviderArgs(VIDEO_FORMAT, options, []);
}

module.exports = {
    buildDownloadArgs,
    getDefaultTags,
    getDownloadOptions,
    getInputLabel,
    getInputPlaceholder,
    id: 'twitter',
    isImplemented: true,
    label: 'X / Twitter',
    matchesUrl,
    parseMetadata,
    supportsMetadata,
};
