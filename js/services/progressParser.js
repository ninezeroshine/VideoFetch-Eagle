'use strict';

function formatBytes(bytes) {
    if (typeof bytes !== 'number' || !Number.isFinite(bytes) || bytes <= 0) {
        return null;
    }

    const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
    let value = bytes;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex += 1;
    }

    const decimals = value >= 100 ? 0 : value >= 10 ? 1 : 2;
    return `${value.toFixed(decimals)}${units[unitIndex]}`;
}

function formatEta(seconds) {
    if (typeof seconds !== 'number' || !Number.isFinite(seconds) || seconds < 0) {
        return null;
    }

    const roundedSeconds = Math.round(seconds);
    const hours = Math.floor(roundedSeconds / 3600);
    const minutes = Math.floor((roundedSeconds % 3600) / 60);
    const secs = roundedSeconds % 60;

    if (hours > 0) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function parseStructuredProgressLine(line) {
    const normalizedLine = String(line).trim();
    const jsonStartIndex = normalizedLine.indexOf('{');

    if (jsonStartIndex === -1) {
        return null;
    }

    try {
        const progress = JSON.parse(normalizedLine.slice(jsonStartIndex));

        if (!progress || typeof progress !== 'object' || typeof progress.status !== 'string') {
            return null;
        }

        const totalBytes = progress.total_bytes || progress.total_bytes_estimate || null;
        const downloadedBytes = progress.downloaded_bytes || 0;
        const pct = totalBytes && totalBytes > 0
            ? (downloadedBytes / totalBytes) * 100
            : null;
        const downloadedText = formatBytes(downloadedBytes);
        const totalText = formatBytes(totalBytes);
        const speedText = formatBytes(progress.speed);
        const etaText = formatEta(progress.eta);
        const infoParts = [];

        if (downloadedText && totalText) {
            infoParts.push(`${downloadedText} / ${totalText}`);
        } else if (totalText) {
            infoParts.push(totalText);
        }

        if (speedText) {
            infoParts.push(`${speedText}/s`);
        }

        if (etaText) {
            infoParts.push(`ETA ${etaText}`);
        }

        if (progress.status === 'downloading') {
            return {
                info: infoParts.join(' · '),
                label: 'Downloading...',
                pct: typeof pct === 'number' ? pct : 0,
                stage: 'downloading',
                statusMessage: `Downloading: ${(typeof pct === 'number' ? pct : 0).toFixed(1)}%`,
                statusType: 'loading',
            };
        }

        if (progress.status === 'finished') {
            return {
                info: infoParts.join(' · '),
                label: 'Finalizing...',
                pct: 96,
                stage: 'merging',
                statusMessage: 'Merging audio + video...',
                statusType: 'loading',
            };
        }
    } catch (error) {
        return null;
    }

    return null;
}

function parseProgressLine(line) {
    if (!line) {
        return null;
    }

    const structuredProgress = parseStructuredProgressLine(line);

    if (structuredProgress) {
        return structuredProgress;
    }

    const normalizedLine = String(line).trim();

    if (/\[download\]\s+100%/.test(normalizedLine)) {
        return {
            info: '',
            label: 'Finalizing...',
            pct: 96,
            stage: 'merging',
            statusMessage: 'Merging audio + video...',
            statusType: 'loading',
        };
    }

    const fullProgressMatch = normalizedLine.match(/\[download\]\s+([\d.]+)%\s+of\s+~?\s*(.+?)\s+at\s+(.+?)(?:\s+ETA\s+([\d:]+)|\s+in\s+([\d:]+))?(?:\s|$)/);

    if (fullProgressMatch) {
        const pct = parseFloat(fullProgressMatch[1]);
        const size = fullProgressMatch[2].trim();
        const rate = fullProgressMatch[3].trim();
        const eta = fullProgressMatch[4] || fullProgressMatch[5] || null;
        const info = eta ? `${size} · ${rate} · ETA ${eta}` : `${size} · ${rate}`;

        return {
            info,
            label: 'Downloading...',
            pct,
            stage: 'downloading',
            statusMessage: `Downloading: ${pct.toFixed(1)}%`,
            statusType: 'loading',
        };
    }

    const compactProgressMatch = normalizedLine.match(/\[download\]\s+([\d.]+)%\s+of\s+~?\s*(.+?)(?:\s|$)/);

    if (compactProgressMatch) {
        const pct = parseFloat(compactProgressMatch[1]);
        const size = compactProgressMatch[2].trim();

        return {
            info: size,
            label: 'Downloading...',
            pct,
            stage: 'downloading',
            statusMessage: `Downloading: ${pct.toFixed(1)}%`,
            statusType: 'loading',
        };
    }

    if (/\[(?:Merger|ffmpeg)\]/.test(normalizedLine)) {
        return {
            info: normalizedLine.replace(/\[(?:Merger|ffmpeg)\]\s*/, '').slice(0, 80),
            label: 'Merging with ffmpeg...',
            pct: 98,
            stage: 'merging',
            statusMessage: 'Merging streams...',
            statusType: 'loading',
        };
    }

    if (/\[download\]\s+Resuming/.test(normalizedLine)) {
        return {
            pct: 12,
            stage: 'downloading',
            statusMessage: 'Resuming download...',
            statusType: 'loading',
        };
    }

    const youtubeStatusMatch = normalizedLine.match(/^\[youtube\].*?:\s+(Downloading .+)$/i);

    if (youtubeStatusMatch) {
        return {
            info: youtubeStatusMatch[1],
            label: 'Preparing YouTube media...',
            pct: 4,
            stage: 'preparing',
            statusMessage: youtubeStatusMatch[1],
            statusType: 'loading',
        };
    }

    return null;
}

module.exports = {
    parseProgressLine,
};
