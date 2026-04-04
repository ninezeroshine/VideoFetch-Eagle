'use strict';

const assert = require('assert');

const { getProviderById, resolveProvider } = require('../js/providers');

function run() {
    const twitterProvider = resolveProvider('https://x.com/user/status/123');
    const youtubeProvider = resolveProvider('https://www.youtube.com/watch?v=abc123');
    const mobileYoutubeProvider = resolveProvider('https://m.youtube.com/watch?v=abc123');
    const unknownProvider = resolveProvider('https://example.com/video/1');

    assert(twitterProvider, 'Twitter provider should resolve');
    assert.strictEqual(twitterProvider.id, 'twitter');

    assert(youtubeProvider, 'YouTube provider should resolve');
    assert.strictEqual(youtubeProvider.id, 'youtube');

    assert(mobileYoutubeProvider, 'Mobile YouTube provider should resolve');
    assert.strictEqual(mobileYoutubeProvider.id, 'youtube');

    assert.strictEqual(unknownProvider, null);

    const youtubeArgs = getProviderById('youtube').buildDownloadArgs({
        downloadOptions: { container: 'mp4', quality: '1080p' },
        outputTemplate: 'tmp/%(id)s.%(ext)s',
        url: 'https://www.youtube.com/watch?v=abc123',
    });

    assert(youtubeArgs.includes('--no-playlist'));
    assert(youtubeArgs.includes('--progress-delta'));
    assert(youtubeArgs.includes('1'));
    assert(youtubeArgs.includes('--progress-template'));
    assert(youtubeArgs.includes('download:%(progress)j'));
    assert(youtubeArgs.includes('--print'));
    assert(youtubeArgs.includes('after_move:filepath'));
    assert(youtubeArgs.includes('--merge-output-format'));
    assert(youtubeArgs.includes('mp4'));
    assert(youtubeArgs.includes('tmp/%(id)s.%(ext)s'));
    assert(youtubeArgs.includes('bestvideo[ext=mp4][height<=1080]+bestaudio[ext=m4a]/best[ext=mp4][height<=1080]/bestvideo[height<=1080]+bestaudio/best[height<=1080]'));

    const youtubeNativeArgs = getProviderById('youtube').buildDownloadArgs({
        downloadOptions: { container: 'native', quality: '720p' },
        outputTemplate: 'tmp/%(id)s.%(ext)s',
        url: 'https://www.youtube.com/watch?v=abc123',
    });

    assert(!youtubeNativeArgs.includes('--merge-output-format'));
    assert(youtubeNativeArgs.includes('bestvideo[height<=720]+bestaudio/best[height<=720]'));

    const youtubeRetryArgs = getProviderById('youtube').buildDownloadArgs({
        downloadOptions: { container: 'mp4', quality: 'best' },
        outputTemplate: 'tmp/%(id)s.%(ext)s',
        retryMode: 'tokenSafeClient',
        url: 'https://www.youtube.com/watch?v=abc123',
    });

    assert(youtubeRetryArgs.includes('--extractor-args'));
    assert(youtubeRetryArgs.includes('youtube:player_client=tv,web_embedded,android_vr;player_skip=initial_data;skip=hls,dash'));
    assert.strictEqual(getProviderById('youtube').shouldRetryWithClientFallback(['WARNING: [youtube] YouTube said: ERROR - Precondition check failed.']), true);
    assert.strictEqual(getProviderById('youtube').shouldRetryWithClientFallback(['WARNING: [youtube] No PO Token provided for web client']), true);

    const twitterArgs = getProviderById('twitter').buildDownloadArgs({
        outputTemplate: 'tmp/%(id)s.%(ext)s',
        url: 'https://x.com/user/status/123',
    });

    assert(twitterArgs.includes('--no-playlist'));
    assert(twitterArgs.includes('--progress-delta'));
    assert(twitterArgs.includes('1'));
    assert(twitterArgs.includes('--progress-template'));
    assert(twitterArgs.includes('download:%(progress)j'));
    assert(twitterArgs.includes('after_move:filepath'));

    // --- Instagram ---
    const instagramReelProvider = resolveProvider('https://www.instagram.com/reel/ABC123/');
    assert(instagramReelProvider, 'Instagram reel URL should resolve');
    assert.strictEqual(instagramReelProvider.id, 'instagram');

    const instagramPostProvider = resolveProvider('https://www.instagram.com/p/XYZ789/');
    assert(instagramPostProvider, 'Instagram post URL should resolve');
    assert.strictEqual(instagramPostProvider.id, 'instagram');

    assert.strictEqual(resolveProvider('https://instagram.com/username'), null, 'Instagram profile URL should not match');

    const instagramArgs = getProviderById('instagram').buildDownloadArgs({
        downloadOptions: { quality: '1080p' },
        outputTemplate: 'tmp/%(id)s.%(ext)s',
        url: 'https://www.instagram.com/reel/ABC123/',
    });

    assert(instagramArgs.includes('--no-playlist'));
    assert(instagramArgs.includes('--merge-output-format'));
    assert(instagramArgs.includes('mp4'));
    assert(instagramArgs.includes('--no-mtime'));
    assert(instagramArgs.includes('bestvideo[height<=1080]+bestaudio/best[height<=1080]'));
    assert(instagramArgs.includes('tmp/%(id)s.%(ext)s'));

    const instagramBestArgs = getProviderById('instagram').buildDownloadArgs({
        downloadOptions: { quality: 'best' },
        outputTemplate: 'tmp/%(id)s.%(ext)s',
        url: 'https://www.instagram.com/reel/ABC123/',
    });

    assert(instagramBestArgs.includes('bestvideo+bestaudio/best'));

    // --- TikTok ---
    const tiktokProvider = resolveProvider('https://www.tiktok.com/@user/video/123456');
    assert(tiktokProvider, 'TikTok URL should resolve');
    assert.strictEqual(tiktokProvider.id, 'tiktok');

    const tiktokShortProvider = resolveProvider('https://vm.tiktok.com/ZM1234/');
    assert(tiktokShortProvider, 'TikTok short URL should resolve');
    assert.strictEqual(tiktokShortProvider.id, 'tiktok');

    assert.strictEqual(resolveProvider('https://tiktok.example.com/video'), null, 'Non-TikTok domain should not match');

    const tiktokArgs = getProviderById('tiktok').buildDownloadArgs({
        downloadOptions: { quality: 'best' },
        outputTemplate: 'tmp/%(id)s.%(ext)s',
        url: 'https://www.tiktok.com/@user/video/123456',
    });

    assert(tiktokArgs.includes('--no-playlist'));
    assert(tiktokArgs.includes('--merge-output-format'));
    assert(tiktokArgs.includes('mp4'));
    assert(tiktokArgs.includes('--no-mtime'));
    assert(tiktokArgs.includes('tmp/%(id)s.%(ext)s'));
    assert(tiktokArgs.some((arg) => arg.includes('watermark')), 'Best quality should use watermark-free format selector');

    const tiktokStdArgs = getProviderById('tiktok').buildDownloadArgs({
        downloadOptions: { quality: 'standard' },
        outputTemplate: 'tmp/%(id)s.%(ext)s',
        url: 'https://www.tiktok.com/@user/video/123456',
    });

    assert(tiktokStdArgs.includes('best'), 'Standard quality should use simple best selector');

    // --- common.js buildBaseArgs ---
    const { buildBaseArgs } = require('../js/providers/common');
    const baseArgs = buildBaseArgs('out/%(id)s.%(ext)s', 'https://example.com/video');

    assert(baseArgs.includes('--no-playlist'));
    assert(baseArgs.includes('--newline'));
    assert(baseArgs.includes('--progress-delta'));
    assert(baseArgs.includes('--no-part'));
    assert(baseArgs.includes('--print'));
    assert(baseArgs.includes('after_move:filepath'));
    assert.strictEqual(baseArgs[baseArgs.length - 1], 'https://example.com/video');
    assert.strictEqual(baseArgs[baseArgs.length - 2], '--');

    console.log('Provider tests passed.');
}

if (require.main === module) {
    run();
}

module.exports = run;
