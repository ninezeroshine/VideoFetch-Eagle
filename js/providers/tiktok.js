'use strict';

const { buildProviderArgs, buildSimpleOptions } = require('./common');
const { parseBasicMetadata } = require('../services/metadata');

function matchesUrl(url) {
    return /^https?:\/\/(www\.|vm\.|vt\.)?tiktok\.com\//i.test(url);
}

function getDefaultTags() {
    return ['tiktok', 'video'];
}

function getInputLabel() {
    return 'TikTok URL';
}

function getInputPlaceholder() {
    return 'https://www.tiktok.com/@user/video/...';
}

/* ─── Metadata ─── */

const supportsMetadata = true;

function parseMetadata(raw) {
    return parseBasicMetadata(raw);
}

/* ─── Download options ─── */

function getDownloadOptions() {
    return buildSimpleOptions('Best quality without watermark');
}

const VIDEO_FORMAT = 'bestvideo[format_note!*=watermark]+bestaudio/bestvideo+bestaudio/best';

function buildDownloadArgs(options) {
    return buildProviderArgs(VIDEO_FORMAT, options, ['--no-mtime']);
}

module.exports = {
    buildDownloadArgs,
    getDefaultTags,
    getDownloadOptions,
    getInputLabel,
    getInputPlaceholder,
    id: 'tiktok',
    isImplemented: true,
    label: 'TikTok',
    matchesUrl,
    parseMetadata,
    supportsMetadata,
};
