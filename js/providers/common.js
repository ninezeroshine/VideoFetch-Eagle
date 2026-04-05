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

module.exports = {
    FORMAT_OPTIONS,
    buildAudioArgs,
    buildBaseArgs,
    isAudioOnly,
};
