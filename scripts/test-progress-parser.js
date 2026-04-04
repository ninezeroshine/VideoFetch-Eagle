'use strict';

const assert = require('assert');

const { parseProgressLine } = require('../js/services/progressParser');

function run() {
    const structuredProgress = parseProgressLine('{"status":"downloading","downloaded_bytes":5242880,"total_bytes":10485760,"speed":1048576,"eta":5}');
    assert(structuredProgress, 'Expected parser to recognize structured progress output');
    assert.strictEqual(Math.round(structuredProgress.pct), 50);
    assert.strictEqual(structuredProgress.stage, 'downloading');
    assert(structuredProgress.info.includes('5.00MiB / 10.0MiB'));
    assert(structuredProgress.info.includes('1.00MiB/s'));
    assert(structuredProgress.info.includes('ETA 00:05'));

    const prefixedStructuredProgress = parseProgressLine('download:{"status":"downloading","downloaded_bytes":1048576,"total_bytes":2097152,"speed":524288,"eta":2}');
    assert(prefixedStructuredProgress, 'Expected parser to recognize structured progress with a prefix');
    assert.strictEqual(Math.round(prefixedStructuredProgress.pct), 50);

    const downloadProgress = parseProgressLine('[download]  45.3% of 23.45MiB at 2.50MiB/s ETA 00:10');
    assert(downloadProgress, 'Expected parser to recognize download progress');
    assert.strictEqual(downloadProgress.label, 'Downloading...');
    assert.strictEqual(Math.round(downloadProgress.pct), 45);
    assert.strictEqual(downloadProgress.stage, 'downloading');
    assert(downloadProgress.info.includes('ETA 00:10'));

    const compactProgress = parseProgressLine('[download]  12.4% of ~ 125.69MiB');
    assert(compactProgress, 'Expected parser to recognize compact progress output');
    assert.strictEqual(Math.round(compactProgress.pct), 12);
    assert.strictEqual(compactProgress.stage, 'downloading');
    assert(compactProgress.info.includes('125.69MiB'));

    const mergeProgress = parseProgressLine('[Merger] Merging formats into "tmp/video.mp4"');
    assert(mergeProgress, 'Expected parser to recognize merge progress');
    assert.strictEqual(mergeProgress.label, 'Merging with ffmpeg...');
    assert.strictEqual(mergeProgress.pct, 98);
    assert.strictEqual(mergeProgress.stage, 'merging');

    const finalizingProgress = parseProgressLine('[download] 100% of 23.45MiB in 00:12');
    assert(finalizingProgress, 'Expected parser to recognize 100% finalizing output');
    assert.strictEqual(finalizingProgress.label, 'Finalizing...');
    assert.strictEqual(finalizingProgress.stage, 'merging');

    const resumeProgress = parseProgressLine('[download] Resuming download at byte 1234');
    assert(resumeProgress, 'Expected parser to recognize resume progress');
    assert.strictEqual(resumeProgress.statusMessage, 'Resuming download...');
    assert.strictEqual(resumeProgress.stage, 'downloading');

    const youtubeStatus = parseProgressLine('[youtube] abc123: Downloading webpage');
    assert(youtubeStatus, 'Expected parser to recognize YouTube preparation status');
    assert.strictEqual(youtubeStatus.label, 'Preparing YouTube media...');
    assert.strictEqual(youtubeStatus.stage, 'preparing');

    assert.strictEqual(parseProgressLine('plain text line'), null);

    console.log('Progress parser tests passed.');
}

if (require.main === module) {
    run();
}

module.exports = run;
