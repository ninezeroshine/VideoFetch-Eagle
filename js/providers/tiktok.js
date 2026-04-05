'use strict';

const { FORMAT_OPTIONS, buildAudioArgs, buildBaseArgs, isAudioOnly } = require('./common');
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
    return {
        defaults: { format: 'mp4' },
        schema: [
            {
                description: 'Best quality without watermark',
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
        'bestvideo[format_note!*=watermark]+bestaudio/bestvideo+bestaudio/best',
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
    id: 'tiktok',
    isImplemented: true,
    label: 'TikTok',
    matchesUrl,
    parseMetadata,
    supportsMetadata,
};
