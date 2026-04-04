'use strict';

/**
 * Shared yt-dlp arguments used by all providers.
 * Provider-specific args should be prepended before calling buildBaseArgs().
 */
function buildBaseArgs(outputTemplate, url) {
    return [
        '--no-playlist',
        '--newline',
        '--progress',
        '--progress-delta',
        '1',
        '--progress-template',
        'download:%(progress)j',
        '--no-part',
        '-o',
        outputTemplate,
        '--',
        url,
    ];
}

module.exports = {
    buildBaseArgs,
};
