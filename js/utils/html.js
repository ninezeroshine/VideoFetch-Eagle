'use strict';

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function swapTagMediaType(tags, format) {
    if (format === 'mp3') {
        return tags.replace(/\bvideo\b/g, 'audio');
    }

    return tags.replace(/\baudio\b/g, 'video');
}

module.exports = {
    escapeHtml,
    swapTagMediaType,
};
