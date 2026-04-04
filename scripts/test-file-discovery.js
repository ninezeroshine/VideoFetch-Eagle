'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { extractFilePathFromLine, findByPrefix } = require('../js/services/fileDiscovery');

function run() {
    const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'videofetch-test-'));
    const finalPath = path.join(tempDirectory, 'vf_12345_video.mp4');
    const quotedPath = `"${path.join(tempDirectory, "vf_12345_O'Neil.mp4")}"`;
    const unrelatedPath = path.join(tempDirectory, 'vf_99999_video.mp4');

    fs.writeFileSync(finalPath, 'video');
    fs.writeFileSync(unrelatedPath, 'video');

    assert.strictEqual(extractFilePathFromLine(finalPath, tempDirectory), finalPath);
    assert.strictEqual(extractFilePathFromLine(quotedPath, tempDirectory), path.join(tempDirectory, "vf_12345_O'Neil.mp4"));
    assert.strictEqual(
        extractFilePathFromLine(`[download] Destination: ${finalPath}`, tempDirectory),
        finalPath
    );
    assert.strictEqual(
        extractFilePathFromLine(`[Merger] Merging formats into "${finalPath}"`, tempDirectory),
        finalPath
    );
    assert.strictEqual(findByPrefix(tempDirectory, 'vf_12345'), finalPath);
    assert.strictEqual(findByPrefix(tempDirectory, 'vf_missing'), null);

    fs.rmSync(tempDirectory, { force: true, recursive: true });
    console.log('File discovery tests passed.');
}

if (require.main === module) {
    run();
}

module.exports = run;
