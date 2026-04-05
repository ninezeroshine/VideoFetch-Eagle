'use strict';

const { FORMAT_OPTIONS, buildAudioArgs, buildBaseArgs, isAudioOnly } = require('./common');
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
            ...buildBaseArgs(outputTemplate, url),
        ];
    }

    return [
        '-f',
        'bestvideo[protocol=https][ext=mp4]+bestaudio[protocol=https][ext=mp4]/best[protocol=https][ext=mp4]/bestvideo+bestaudio/best',
        '--merge-output-format',
        'mp4',
        ...buildBaseArgs(outputTemplate, url),
    ];
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
