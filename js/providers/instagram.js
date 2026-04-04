'use strict';

const { buildBaseArgs } = require('./common');

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

function getHeightLimit(quality) {
    const normalized = String(quality || 'best');

    if (normalized === '1080p') {
        return '1080';
    }

    if (normalized === '720p') {
        return '720';
    }

    return null;
}

function buildFormatSelector(downloadOptions) {
    const options = downloadOptions || {};
    const heightLimit = getHeightLimit(options.quality);

    if (heightLimit) {
        return `bestvideo[height<=${heightLimit}]+bestaudio/best[height<=${heightLimit}]`;
    }

    return 'bestvideo+bestaudio/best';
}

function getDownloadOptions() {
    return {
        defaults: {
            quality: 'best',
        },
        schema: [
            {
                description: 'Target quality for the downloaded video',
                key: 'quality',
                label: 'Quality',
                options: [
                    { label: 'Best available', value: 'best' },
                    { label: '1080p', value: '1080p' },
                    { label: '720p', value: '720p' },
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
    id: 'instagram',
    isImplemented: true,
    label: 'Instagram',
    matchesUrl,
};
