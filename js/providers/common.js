'use strict';

const path = require('path');
const { getLocalFfmpegPath } = require('../services/binManager');

/**
 * Shared yt-dlp arguments used by all providers.
 * Provider-specific args should be prepended before calling buildBaseArgs().
 */
function buildBaseArgs(outputTemplate, url) {
    const args = [
        '--no-playlist',
        '--newline',
        '--progress',
        '--progress-delta',
        '1',
        '--progress-template',
        'download:%(progress)j',
        '--no-part',
    ];

    // Point yt-dlp to locally installed ffmpeg if available
    const localFfmpeg = getLocalFfmpegPath();

    if (localFfmpeg) {
        args.push('--ffmpeg-location', path.dirname(localFfmpeg));
    }

    args.push('-o', outputTemplate, '--', url);

    return args;
}

/**
 * Shared format chip options for all providers.
 */
const FORMAT_OPTIONS = [
    { label: 'MP4', value: 'mp4' },
    { label: 'MP3', value: 'mp3' },
];

/**
 * Extra yt-dlp args for audio-only extraction.
 */
function buildAudioArgs() {
    return ['--extract-audio', '--audio-format', 'mp3'];
}

/**
 * Check if downloadOptions request audio-only mode.
 */
function isAudioOnly(downloadOptions) {
    return downloadOptions && downloadOptions.format === 'mp3';
}

/**
 * Standard download options schema for providers with single "Best" quality.
 * Used by twitter, instagram, tiktok. YouTube overrides with dynamic qualities.
 */
function buildSimpleOptions(qualityDescription) {
    return {
        defaults: { format: 'mp4' },
        schema: [
            {
                description: qualityDescription || 'Best available quality',
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

/**
 * Build download args with audio-only support.
 * Shared by providers that don't need custom format selection logic (twitter, instagram, tiktok).
 *
 * @param {string} videoFormatSelector  — yt-dlp format string for video mode
 * @param {object} options              — { downloadOptions, outputTemplate, url }
 * @param {string[]} extraArgs          — provider-specific args (e.g. ['--no-mtime'])
 */
function buildProviderArgs(videoFormatSelector, options, extraArgs) {
    const { downloadOptions, outputTemplate, url } = options;

    if (isAudioOnly(downloadOptions)) {
        return [
            '-f', 'bestaudio/best',
            ...buildAudioArgs(),
            ...extraArgs,
            ...buildBaseArgs(outputTemplate, url),
        ];
    }

    return [
        '-f', videoFormatSelector,
        '--merge-output-format', 'mp4',
        ...extraArgs,
        ...buildBaseArgs(outputTemplate, url),
    ];
}

module.exports = {
    FORMAT_OPTIONS,
    buildAudioArgs,
    buildBaseArgs,
    buildProviderArgs,
    buildSimpleOptions,
    isAudioOnly,
};
