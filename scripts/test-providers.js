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
        downloadOptions: { format: 'mp4', quality: '1080p' },
        outputTemplate: 'tmp/%(id)s.%(ext)s',
        url: 'https://www.youtube.com/watch?v=abc123',
    });

    assert(youtubeArgs.includes('--no-playlist'));
    assert(youtubeArgs.includes('--progress-delta'));
    assert(youtubeArgs.includes('--merge-output-format'));
    assert(youtubeArgs.includes('mp4'));
    assert(!youtubeArgs.includes('--print'), 'Should not include --print (suppresses progress)');
    assert(youtubeArgs.includes('bestvideo[ext=mp4][height<=1080]+bestaudio[ext=m4a]/best[ext=mp4][height<=1080]/bestvideo[height<=1080]+bestaudio/best[height<=1080]'));

    // Audio-only MP3 mode
    const youtubeMp3Args = getProviderById('youtube').buildDownloadArgs({
        downloadOptions: { format: 'mp3', quality: 'best' },
        outputTemplate: 'tmp/%(id)s.%(ext)s',
        url: 'https://www.youtube.com/watch?v=abc123',
    });

    assert(youtubeMp3Args.includes('--extract-audio'));
    assert(youtubeMp3Args.includes('--audio-format'));
    assert(youtubeMp3Args.includes('mp3'));
    assert(youtubeMp3Args.includes('bestaudio/best'));
    assert(!youtubeMp3Args.includes('--merge-output-format'), 'MP3 should not merge');

    const youtubeRetryArgs = getProviderById('youtube').buildDownloadArgs({
        downloadOptions: { format: 'mp4', quality: 'best' },
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
    assert(twitterArgs.includes('--merge-output-format'));
    assert(twitterArgs.includes('mp4'));

    // Twitter MP3
    const twitterMp3Args = getProviderById('twitter').buildDownloadArgs({
        downloadOptions: { format: 'mp3' },
        outputTemplate: 'tmp/%(id)s.%(ext)s',
        url: 'https://x.com/user/status/123',
    });

    assert(twitterMp3Args.includes('--extract-audio'));
    assert(twitterMp3Args.includes('mp3'));
    assert(!twitterMp3Args.includes('--merge-output-format'), 'MP3 should not merge');

    // Twitter metadata support
    assert.strictEqual(getProviderById('twitter').supportsMetadata, true);

    // --- Instagram ---
    const instagramReelProvider = resolveProvider('https://www.instagram.com/reel/ABC123/');
    assert(instagramReelProvider, 'Instagram reel URL should resolve');
    assert.strictEqual(instagramReelProvider.id, 'instagram');

    const instagramPostProvider = resolveProvider('https://www.instagram.com/p/XYZ789/');
    assert(instagramPostProvider, 'Instagram post URL should resolve');
    assert.strictEqual(instagramPostProvider.id, 'instagram');

    assert.strictEqual(resolveProvider('https://instagram.com/username'), null, 'Instagram profile URL should not match');

    // Instagram MP4
    const instagramArgs = getProviderById('instagram').buildDownloadArgs({
        downloadOptions: { format: 'mp4' },
        outputTemplate: 'tmp/%(id)s.%(ext)s',
        url: 'https://www.instagram.com/reel/ABC123/',
    });

    assert(instagramArgs.includes('--no-playlist'));
    assert(instagramArgs.includes('--merge-output-format'));
    assert(instagramArgs.includes('mp4'));
    assert(instagramArgs.includes('--no-mtime'));
    assert(instagramArgs.includes('bestvideo+bestaudio/best'));

    // Instagram MP3
    const instagramMp3Args = getProviderById('instagram').buildDownloadArgs({
        downloadOptions: { format: 'mp3' },
        outputTemplate: 'tmp/%(id)s.%(ext)s',
        url: 'https://www.instagram.com/reel/ABC123/',
    });

    assert(instagramMp3Args.includes('--extract-audio'));
    assert(instagramMp3Args.includes('--audio-format'));
    assert(instagramMp3Args.includes('mp3'));
    assert(!instagramMp3Args.includes('--merge-output-format'), 'MP3 should not merge');

    // Instagram metadata support
    assert.strictEqual(getProviderById('instagram').supportsMetadata, true);

    // --- TikTok ---
    const tiktokProvider = resolveProvider('https://www.tiktok.com/@user/video/123456');
    assert(tiktokProvider, 'TikTok URL should resolve');
    assert.strictEqual(tiktokProvider.id, 'tiktok');

    const tiktokShortProvider = resolveProvider('https://vm.tiktok.com/ZM1234/');
    assert(tiktokShortProvider, 'TikTok short URL should resolve');
    assert.strictEqual(tiktokShortProvider.id, 'tiktok');

    assert.strictEqual(resolveProvider('https://tiktok.example.com/video'), null, 'Non-TikTok domain should not match');

    // TikTok MP4 (watermark-free)
    const tiktokArgs = getProviderById('tiktok').buildDownloadArgs({
        downloadOptions: { format: 'mp4' },
        outputTemplate: 'tmp/%(id)s.%(ext)s',
        url: 'https://www.tiktok.com/@user/video/123456',
    });

    assert(tiktokArgs.includes('--no-playlist'));
    assert(tiktokArgs.includes('--merge-output-format'));
    assert(tiktokArgs.includes('mp4'));
    assert(tiktokArgs.includes('--no-mtime'));
    assert(tiktokArgs.some((arg) => arg.includes('watermark')), 'Should use watermark-free format selector');

    // TikTok MP3
    const tiktokMp3Args = getProviderById('tiktok').buildDownloadArgs({
        downloadOptions: { format: 'mp3' },
        outputTemplate: 'tmp/%(id)s.%(ext)s',
        url: 'https://www.tiktok.com/@user/video/123456',
    });

    assert(tiktokMp3Args.includes('--extract-audio'));
    assert(tiktokMp3Args.includes('mp3'));

    // TikTok metadata support
    assert.strictEqual(getProviderById('tiktok').supportsMetadata, true);

    // --- common.js buildBaseArgs ---
    const { buildBaseArgs } = require('../js/providers/common');
    const baseArgs = buildBaseArgs('out/%(id)s.%(ext)s', 'https://example.com/video');

    assert(baseArgs.includes('--no-playlist'));
    assert(baseArgs.includes('--newline'));
    assert(baseArgs.includes('--progress'));
    assert(baseArgs.includes('--progress-delta'));
    assert(baseArgs.includes('--no-part'));
    assert(!baseArgs.includes('--print'), 'buildBaseArgs should not include --print');
    assert.strictEqual(baseArgs[baseArgs.length - 1], 'https://example.com/video');
    assert.strictEqual(baseArgs[baseArgs.length - 2], '--');

    console.log('Provider tests passed.');
}

if (require.main === module) {
    run();
}

module.exports = run;
