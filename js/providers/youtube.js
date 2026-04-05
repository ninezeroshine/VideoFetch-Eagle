'use strict';

const { FORMAT_OPTIONS, buildAudioArgs, buildBaseArgs, isAudioOnly } = require('./common');
const { extractQualities, hasAudioFormats, parseBasicMetadata } = require('../services/metadata');

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

/* ─── Metadata support ─── */

const supportsMetadata = true;

function parseMetadata(raw) {
    const base = parseBasicMetadata(raw);

    if (!base) {
        return null;
    }

    // YouTube-specific: use ytimg.com URL for reliable thumbnail
    if (raw.id) {
        base.thumbnail = 'https://i.ytimg.com/vi/' + raw.id + '/hqdefault.jpg';
    }

    // YouTube-specific: extract available quality options
    const heights = extractQualities(raw.formats);
    const qualityOptions = [{ label: 'Best', value: 'best' }];

    for (const h of heights) {
        qualityOptions.push({ label: h + 'p', value: h + 'p' });
    }

    base.qualities = qualityOptions;
    base.hasAudio = hasAudioFormats(raw.formats);

    return base;
}

/* ─── Download options ─── */

function getDownloadOptions(metadata) {
    let qualities = [
        { label: 'Best', value: 'best' },
        { label: '1080p', value: '1080p' },
        { label: '720p', value: '720p' },
        { label: '480p', value: '480p' },
    ];

    if (metadata && metadata.qualities) {
        qualities = metadata.qualities;
    }

    const formatOptions = FORMAT_OPTIONS.slice();

    return {
        defaults: {
            format: 'mp4',
            quality: 'best',
        },
        schema: [
            {
                description: 'Select video resolution',
                key: 'quality',
                label: 'Quality',
                options: qualities,
                type: 'chips',
            },
            {
                description: 'Video with audio or audio only',
                key: 'format',
                label: 'Format',
                options: formatOptions,
                type: 'chips',
            },
        ],
    };
}

/* ─── Format selector logic ─── */

function getHeightLimit(quality) {
    const match = String(quality || '').match(/^(\d+)p?$/);
    return match ? match[1] : null;
}

function buildFormatSelector(downloadOptions) {
    const opts = downloadOptions || {};

    if (opts.format === 'mp3') {
        return 'bestaudio/best';
    }

    const heightLimit = getHeightLimit(opts.quality);

    if (heightLimit) {
        return 'bestvideo[ext=mp4][height<=' + heightLimit + ']+bestaudio[ext=m4a]'
            + '/best[ext=mp4][height<=' + heightLimit + ']'
            + '/bestvideo[height<=' + heightLimit + ']+bestaudio'
            + '/best[height<=' + heightLimit + ']';
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
    const opts = downloadOptions || {};
    const formatSelector = buildFormatSelector(opts);

    const providerArgs = [
        '-f',
        formatSelector,
        ...getExtractorArgs(retryMode),
    ];

    if (isAudioOnly(opts)) {
        providerArgs.push(...buildAudioArgs());
    } else {
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
    parseMetadata,
    shouldRetryWithClientFallback,
    supportsMetadata,
};
