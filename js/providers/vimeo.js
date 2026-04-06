'use strict';

const { buildProviderArgs, buildSimpleOptions } = require('./common');
const { parseBasicMetadata } = require('../services/metadata');

function matchesUrl(url) {
    return /^https?:\/\/(www\.|player\.)?vimeo\.com\//i.test(url);
}

function getDefaultTags() {
    return ['vimeo', 'video'];
}

function getInputLabel() {
    return 'Vimeo URL';
}

function getInputPlaceholder() {
    return 'https://vimeo.com/123456789';
}

/* ─── Metadata ─── */

const supportsMetadata = true;

function parseMetadata(raw) {
    return parseBasicMetadata(raw);
}

/* ─── Download options ─── */

function getDownloadOptions() {
    return buildSimpleOptions('Best available quality');
}

const VIDEO_FORMAT = 'bestvideo+bestaudio/best';

function buildDownloadArgs(options) {
    return buildProviderArgs(VIDEO_FORMAT, options, []);
}

module.exports = {
    buildDownloadArgs,
    getDefaultTags,
    getDownloadOptions,
    getInputLabel,
    getInputPlaceholder,
    id: 'vimeo',
    isImplemented: true,
    label: 'Vimeo',
    matchesUrl,
    parseMetadata,
    supportsMetadata,
};
