'use strict';

const { exec } = require('child_process');

/**
 * Fetch video metadata via yt-dlp --dump-json.
 * Uses exec with shell (same pattern as detectYtdlp) for Eagle compatibility.
 * Returns raw parsed JSON or null on failure.
 */
function fetchRawMetadata(ytdlpPath, url) {
    return new Promise((resolve) => {
        const cmd ='"' + ytdlpPath + '" --dump-json --no-download --no-playlist -- "' + url + '"';

        exec(cmd, { shell: true, timeout: 20000, maxBuffer: 5 * 1024 * 1024 }, (error, stdout) => {
            if (error || !stdout) {
                resolve(null);
                return;
            }

            try {
                resolve(JSON.parse(stdout.trim()));
            } catch (_parseError) {
                resolve(null);
            }
        });
    });
}

/**
 * Extract unique available video heights from yt-dlp format list.
 * Returns sorted descending array like [2160, 1080, 720, 480, 360].
 */
function extractQualities(formats) {
    if (!Array.isArray(formats)) {
        return [];
    }

    const heights = new Set();

    for (const fmt of formats) {
        if (fmt.height && fmt.vcodec && fmt.vcodec !== 'none') {
            heights.add(fmt.height);
        }
    }

    return Array.from(heights).sort((a, b) => b - a);
}

/**
 * Check if audio-only formats are available.
 */
function hasAudioFormats(formats) {
    if (!Array.isArray(formats)) {
        return false;
    }

    return formats.some((fmt) => fmt.acodec && fmt.acodec !== 'none');
}

module.exports = {
    extractQualities,
    fetchRawMetadata,
    hasAudioFormats,
};
