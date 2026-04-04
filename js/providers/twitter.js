'use strict';

const { buildBaseArgs } = require('./common');

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

function getDownloadOptions() {
    return {
        schema: [
            {
                description: 'Best available media from the selected post',
                key: 'quality',
                label: 'Quality',
                type: 'static',
                value: 'Automatic',
            },
            {
                description: 'Audio is included whenever the source provides it',
                key: 'container',
                label: 'Output',
                type: 'static',
                value: 'Best available',
            },
        ],
    };
}

function buildDownloadArgs(options) {
    const { outputTemplate, url } = options;

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
};
