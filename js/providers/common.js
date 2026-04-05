'use strict';

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
        const path = require('path');
        args.push('--ffmpeg-location', path.dirname(localFfmpeg));
    }

    args.push('-o', outputTemplate, '--', url);

    return args;
}

module.exports = {
    buildBaseArgs,
};
