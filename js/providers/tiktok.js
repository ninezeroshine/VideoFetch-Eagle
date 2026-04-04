'use strict';

const { buildBaseArgs } = require('./common');

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

function buildFormatSelector(downloadOptions) {
    const options = downloadOptions || {};

    if (options.quality === 'standard') {
        return 'best';
    }

    // Prefer watermark-free source, fall back to best available
    return 'bestvideo[format_note!*=watermark]+bestaudio/bestvideo+bestaudio/best';
}

function getDownloadOptions() {
    return {
        defaults: {
            quality: 'best',
        },
        schema: [
            {
                description: 'Best quality downloads without watermark when available',
                key: 'quality',
                label: 'Quality',
                options: [
                    { label: 'Best (no watermark)', value: 'best' },
                    { label: 'Standard', value: 'standard' },
                ],
                type: 'select',
            },
            {
                description: 'Output is always MP4 for best compatibility',
                key: 'container',
                label: 'Output',
                type: 'static',
                value: 'MP4',
            },
        ],
    };
}

function buildDownloadArgs(options) {
    const { downloadOptions, outputTemplate, url } = options;
    const formatSelector = buildFormatSelector(downloadOptions);

    return [
        '-f',
        formatSelector,
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
};
