'use strict';

const { FORMAT_OPTIONS, buildAudioArgs, buildBaseArgs, isAudioOnly } = require('./common');
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
    return {
        defaults: { format: 'mp4' },
        schema: [
            {
                description: 'Best available quality',
                key: 'quality',
                label: 'Quality',
                type: 'static',
                value: 'Best',
            },
            {
                description: 'Video with audio or audio only',
                key: 'format',
                label: 'Format',
                options: FORMAT_OPTIONS,
                type: 'chips',
            },
        ],
    };
}

function buildDownloadArgs(options) {
    const { downloadOptions, outputTemplate, url } = options;

    if (isAudioOnly(downloadOptions)) {
        return [
            '-f', 'bestaudio/best',
            ...buildAudioArgs(),
            '--no-mtime',
            ...buildBaseArgs(outputTemplate, url),
        ];
    }

    return [
        '-f',
        'bestvideo+bestaudio/best',
        '--merge-output-format',
        'mp4',
        '--no-mtime',
        ...buildBaseArgs(outputTemplate, url),
    ];
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
