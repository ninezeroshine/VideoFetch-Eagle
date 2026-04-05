'use strict';

const fs = require('fs');
const path = require('path');

const { VIDEO_EXTENSIONS } = require('../utils/constants');

const VIDEO_EXTENSION_SET = new Set(VIDEO_EXTENSIONS);

function sanitizePath(candidate) {
    return String(candidate || '').trim().replace(/^['"]|['"]$/g, '');
}

function isVideoPath(candidate) {
    return VIDEO_EXTENSION_SET.has(path.extname(candidate).toLowerCase());
}

function extractFilePathFromLine(line, tmpDir) {
    if (!line) {
        return null;
    }

    const sanitizedLine = sanitizePath(line);

    if (sanitizedLine.startsWith(tmpDir) || (sanitizedLine.length > 4 && isVideoPath(sanitizedLine) && !sanitizedLine.startsWith('['))) {
        return sanitizedLine;
    }

    const destinationMatch = line.match(/^\[download\]\s+Destination:\s+(.+)$/i);

    if (destinationMatch) {
        return sanitizePath(destinationMatch[1]);
    }

    const mergeMatch = line.match(/\[(?:Merger|ffmpeg)\]\s+Merging formats into\s+"?(.+)"?/i);

    if (mergeMatch) {
        return sanitizePath(mergeMatch[1]);
    }

    const extractAudioMatch = line.match(/\[ExtractAudio\]\s+Destination:\s+(.+)$/i);

    if (extractAudioMatch) {
        return sanitizePath(extractAudioMatch[1]);
    }

    return null;
}

function findByPrefix(dir, prefix) {
    try {
        const entries = fs.readdirSync(dir);
        const prefixedMatch = entries
            .filter((entry) => entry.startsWith(prefix) && isVideoPath(entry))
            .sort()
            .pop();

        return prefixedMatch ? path.join(dir, prefixedMatch) : null;
    } catch (error) {
        return null;
    }
}

module.exports = {
    extractFilePathFromLine,
    findByPrefix,
};
