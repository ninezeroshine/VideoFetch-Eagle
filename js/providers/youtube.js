'use strict';

const { buildBaseArgs } = require('./common');

function matchesUrl(url) {
    return /^https?:\/\/((www|m)\.)?(youtube\.com|youtu\.be)\//i.test(url);
}

function getDefaultTags() {
    return ['youtube', 'video'];
}

function getInputLabel() {
    return 'Video URL';
}

function getInputPlaceholder() {
    return 'https://www.youtube.com/watch?v=...';
}

function getDownloadOptions() {
    return {
        defaults: {
            container: 'mp4',
            quality: 'best',
        },
        schema: [
            {
                description: 'Target quality for the final download',
                key: 'quality',
                label: 'Quality',
                options: [
                    { label: 'Best available', value: 'best' },
                    { label: '1080p', value: '1080p' },
                    { label: '720p', value: '720p' },
                    { label: '480p', value: '480p' },
                ],
                type: 'select',
            },
            {
                description: 'Prefer a broadly compatible MP4 file or the best native container',
                key: 'container',
                label: 'Format',
                options: [
                    { label: 'MP4 compatible', value: 'mp4' },
                    { label: 'Best native', value: 'native' },
                ],
                type: 'select',
            },
        ],
    };
}

function getHeightLimit(quality) {
    const normalizedQuality = String(quality || 'best');

    if (normalizedQuality === '1080p') {
        return '1080';
    }

    if (normalizedQuality === '720p') {
        return '720';
    }

    if (normalizedQuality === '480p') {
        return '480';
    }

    return null;
}

function buildFormatSelector(downloadOptions) {
    const normalizedOptions = downloadOptions || {};
    const heightLimit = getHeightLimit(normalizedOptions.quality);
    const container = normalizedOptions.container === 'native' ? 'native' : 'mp4';

    if (container === 'native') {
        if (heightLimit) {
            return `bestvideo[height<=${heightLimit}]+bestaudio/best[height<=${heightLimit}]`;
        }

        return 'bestvideo+bestaudio/best';
    }

    if (heightLimit) {
        return `bestvideo[ext=mp4][height<=${heightLimit}]+bestaudio[ext=m4a]/best[ext=mp4][height<=${heightLimit}]/bestvideo[height<=${heightLimit}]+bestaudio/best[height<=${heightLimit}]`;
    }

    return 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/bestvideo+bestaudio/best';
}

function getExtractorArgs(retryMode) {
    if (retryMode === 'tokenSafeClient') {
        return ['--extractor-args', 'youtube:player_client=tv,web_embedded,android_vr;player_skip=initial_data;skip=hls,dash'];
    }

    return [];
}

function buildDownloadArgs(options) {
    const { downloadOptions, outputTemplate, retryMode, url } = options;
    const formatSelector = buildFormatSelector(downloadOptions);
    const container = downloadOptions && downloadOptions.container === 'native' ? 'native' : 'mp4';
    const providerArgs = [
        '-f',
        formatSelector,
        ...getExtractorArgs(retryMode),
    ];

    if (container === 'mp4') {
        providerArgs.push('--merge-output-format', 'mp4');
    }

    return [
        ...providerArgs,
        ...buildBaseArgs(outputTemplate, url),
    ];
}

function shouldRetryWithClientFallback(stderrLines) {
    const errorText = Array.isArray(stderrLines) ? stderrLines.join(' ') : String(stderrLines || '');
    return /precondition check failed|unable to download api page|http error 400|no po token provided for web client/i.test(errorText);
}

module.exports = {
    buildDownloadArgs,
    getDefaultTags,
    getDownloadOptions,
    getInputLabel,
    getInputPlaceholder,
    id: 'youtube',
    isImplemented: true,
    label: 'YouTube',
    matchesUrl,
    shouldRetryWithClientFallback,
};
