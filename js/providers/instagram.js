'use strict';

const { buildProviderArgs, buildSimpleOptions } = require('./common');
const { parseBasicMetadata } = require('../services/metadata');

function matchesUrl(url) {
    return /^https?:\/\/(www\.)?instagram\.com\/(reel|p|reels|stories|tv)\//i.test(url);
}

function getDefaultTags() {
    return ['instagram', 'video'];
}

function getInputLabel() {
    return 'Instagram URL';
}

function getInputPlaceholder() {
    return 'https://www.instagram.com/reel/...';
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

const VIDEO_FORMAT = 'bestvideo+bestaudio/best';

function buildDownloadArgs(options) {
    return buildProviderArgs(VIDEO_FORMAT, options, ['--no-mtime']);
}

module.exports = {
    buildDownloadArgs,
    getDefaultTags,
    getDownloadOptions,
    getInputLabel,
    getInputPlaceholder,
    id: 'instagram',
    isImplemented: true,
    label: 'Instagram',
    matchesUrl,
    parseMetadata,
    supportsMetadata,
};
