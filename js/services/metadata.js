'use strict';

const { exec } = require('child_process');

/**
 * Fetch video metadata via yt-dlp --dump-json.
 * Uses exec with shell (same pattern as detectYtdlp) for Eagle compatibility.
 * Returns raw parsed JSON or null on failure.
 */
function fetchRawMetadata(ytdlpPath, url) {
    return new Promise((resolve) => {
        const cmd = '"' + ytdlpPath + '" --dump-json --no-download --no-playlist -- "' + url + '"';

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
 * Pick the best available thumbnail from yt-dlp metadata.
 * Works for all providers (YouTube, Twitter, Instagram, TikTok).
 */
function pickThumbnail(raw) {
    if (Array.isArray(raw.thumbnails) && raw.thumbnails.length > 0) {
        const best = raw.thumbnails[raw.thumbnails.length - 1];
        return (best && best.url) || best || '';
    }

    return raw.thumbnail || '';
}

/**
 * Parse basic metadata common to all providers.
 * Returns { title, thumbnail, channel, duration, viewCount } or null.
 */
function parseBasicMetadata(raw) {
    if (!raw) {
        return null;
    }

    return {
        title: raw.title || raw.fulltitle || raw.description || '',
        thumbnail: pickThumbnail(raw),
        channel: raw.channel || raw.uploader || raw.uploader_id || '',
        duration: raw.duration || 0,
        viewCount: raw.view_count || raw.like_count || 0,
    };
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

/**
 * Download a thumbnail via Node https and return as base64 data URI.
 * Bypasses browser CORP/CORS restrictions (Instagram, TikTok CDNs).
 * Returns data URI string or empty string on failure.
 */
function fetchThumbnailDataUri(url) {
    if (!url) {
        return Promise.resolve('');
    }

    const https = require('https');
    const http = require('http');
    const client = url.startsWith('https') ? https : http;

    return new Promise((resolve) => {
        const req = client.get(url, { timeout: 8000 }, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                res.resume();

                if (res.headers.location) {
                    fetchThumbnailDataUri(res.headers.location).then(resolve);
                } else {
                    resolve('');
                }

                return;
            }

            if (res.statusCode !== 200) {
                res.resume();
                resolve('');
                return;
            }

            const contentType = res.headers['content-type'] || 'image/jpeg';
            const chunks = [];

            res.on('data', (chunk) => chunks.push(chunk));

            res.on('end', () => {
                const buffer = Buffer.concat(chunks);
                resolve('data:' + contentType + ';base64,' + buffer.toString('base64'));
            });

            res.on('error', () => resolve(''));
        });

        req.on('error', () => resolve(''));
        req.on('timeout', () => { req.destroy(); resolve(''); });
    });
}

module.exports = {
    extractQualities,
    fetchRawMetadata,
    fetchThumbnailDataUri,
    hasAudioFormats,
    parseBasicMetadata,
    pickThumbnail,
};
