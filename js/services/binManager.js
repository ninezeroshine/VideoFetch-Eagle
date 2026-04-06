'use strict';

const { exec } = require('child_process');
const https = require('https');
const fs = require('fs');
const os = require('os');
const path = require('path');

/* ─── Config ─── */

const BIN_DIR_NAME = '.eagle-videofetch';
const UNSUPPORTED_PLATFORM = 'Unsupported platform: ' + process.platform;

const YTDLP_URLS = {
    win32: 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe',
    darwin: 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos',
    linux: 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp',
};

const YTDLP_FILENAMES = {
    win32: 'yt-dlp.exe',
    darwin: 'yt-dlp_macos',
    linux: 'yt-dlp',
};

const FFMPEG_URLS = {
    win32: 'https://github.com/yt-dlp/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip',
    darwin: 'https://evermeet.cx/ffmpeg/getrelease/zip',
};

/* ─── Shared helpers ─── */

function getBinDirectory() {
    return path.join(os.homedir(), BIN_DIR_NAME, 'bin');
}

function ensureBinDirectory() {
    const dir = getBinDirectory();

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    return dir;
}

var REQUEST_TIMEOUT_MS = 30000;
var STALL_TIMEOUT_MS = 30000;
var REDIRECT_CODES = [301, 302, 303, 307, 308];

function httpsGetFollowRedirects(url, maxRedirects) {
    const remaining = maxRedirects != null ? maxRedirects : 5;

    return new Promise((resolve, reject) => {
        const req = https.get(url, { timeout: REQUEST_TIMEOUT_MS }, (res) => {
            var isRedirect = REDIRECT_CODES.indexOf(res.statusCode) !== -1;

            if (isRedirect && res.headers.location && remaining > 0) {
                res.resume();
                httpsGetFollowRedirects(res.headers.location, remaining - 1).then(resolve, reject);
                return;
            }

            if (res.statusCode !== 200) {
                res.resume();
                reject(new Error('Download failed: HTTP ' + res.statusCode));
                return;
            }

            resolve(res);
        });

        req.on('timeout', function () {
            req.destroy(new Error('Connection timed out'));
        });

        req.on('error', reject);
    });
}

function downloadToFile(url, targetPath, onProgress) {
    const tempPath = targetPath + '.tmp';

    return httpsGetFollowRedirects(url).then((res) => {
        return new Promise((resolve, reject) => {
            const totalBytes = parseInt(res.headers['content-length'], 10) || 0;
            let downloadedBytes = 0;
            let stallTimer = null;

            const file = fs.createWriteStream(tempPath);

            function resetStallTimer() {
                if (stallTimer) { clearTimeout(stallTimer); }
                stallTimer = setTimeout(function () {
                    res.destroy(new Error('Download stalled — no data received for 30s'));
                }, STALL_TIMEOUT_MS);
            }

            resetStallTimer();

            res.on('data', (chunk) => {
                downloadedBytes += chunk.length;
                resetStallTimer();

                if (onProgress) {
                    if (totalBytes > 0) {
                        onProgress(Math.round((downloadedBytes / totalBytes) * 100));
                    } else {
                        var mb = (downloadedBytes / 1048576).toFixed(1);
                        onProgress(-1, mb + ' MB downloaded');
                    }
                }
            });

            res.pipe(file);

            file.on('finish', () => {
                if (stallTimer) { clearTimeout(stallTimer); }
                file.close(() => {
                    try {
                        if (fs.existsSync(targetPath)) {
                            fs.unlinkSync(targetPath);
                        }

                        fs.renameSync(tempPath, targetPath);
                        resolve(targetPath);
                    } catch (err) {
                        reject(err);
                    }
                });
            });

            file.on('error', (err) => {
                if (stallTimer) { clearTimeout(stallTimer); }
                file.close();
                try { fs.unlinkSync(tempPath); } catch (_e) { /* cleanup */ }
                reject(err);
            });

            res.on('error', (err) => {
                if (stallTimer) { clearTimeout(stallTimer); }
                file.close();
                try { fs.unlinkSync(tempPath); } catch (_e) { /* cleanup */ }
                reject(err);
            });
        });
    });
}

function execPromise(cmd, options) {
    return new Promise((resolve, reject) => {
        exec(cmd, options, (error, stdout) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
}

/* ─── yt-dlp ─── */

function getLocalYtdlpPath() {
    const filename = YTDLP_FILENAMES[process.platform];

    if (!filename) {
        return null;
    }

    const fullPath = path.join(getBinDirectory(), filename);

    return fs.existsSync(fullPath) ? fullPath : null;
}

function downloadYtdlp(onProgress) {
    const url = YTDLP_URLS[process.platform];
    const filename = YTDLP_FILENAMES[process.platform];

    if (!url || !filename) {
        return Promise.reject(new Error(UNSUPPORTED_PLATFORM));
    }

    const binDir = ensureBinDirectory();
    const targetPath = path.join(binDir, filename);

    return downloadToFile(url, targetPath, onProgress).then((filePath) => {
        if (process.platform !== 'win32') {
            fs.chmodSync(filePath, 0o755);
        }

        return filePath;
    });
}

/* ─── ffmpeg ─── */

function getLocalFfmpegPath() {
    const filename = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
    const fullPath = path.join(getBinDirectory(), filename);

    return fs.existsSync(fullPath) ? fullPath : null;
}

function checkSystemFfmpeg() {
    return new Promise((resolve) => {
        exec('ffmpeg -version', { shell: true, timeout: 5000 }, (error) => {
            resolve(!error);
        });
    });
}

function downloadFfmpeg(onProgress) {
    const url = FFMPEG_URLS[process.platform];

    if (!url) {
        return Promise.reject(new Error(UNSUPPORTED_PLATFORM));
    }

    const binDir = ensureBinDirectory();
    const zipPath = path.join(binDir, 'ffmpeg-download.zip');
    const extractDir = path.join(binDir, 'ffmpeg-extract');

    return downloadToFile(url, zipPath, onProgress).then(() => {
        // Clean extract dir
        if (fs.existsSync(extractDir)) {
            fs.rmSync(extractDir, { recursive: true, force: true });
        }

        fs.mkdirSync(extractDir, { recursive: true });

        // Extract using OS tools
        const extractCmd = process.platform === 'win32'
            ? 'powershell -NoProfile -Command "Expand-Archive -Path \'' + zipPath + '\' -DestinationPath \'' + extractDir + '\' -Force"'
            : 'unzip -o "' + zipPath + '" -d "' + extractDir + '"';

        return execPromise(extractCmd, { timeout: 120000 });
    }).then(() => {
        // Find ffmpeg binary in extracted files
        const ffmpegName = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
        const ffmpegBin = findFileRecursive(extractDir, ffmpegName);

        if (!ffmpegBin) {
            throw new Error('ffmpeg binary not found in archive');
        }

        const targetPath = path.join(binDir, ffmpegName);
        fs.copyFileSync(ffmpegBin, targetPath);

        if (process.platform !== 'win32') {
            fs.chmodSync(targetPath, 0o755);
        }

        // Also copy ffprobe if present
        const ffprobeName = process.platform === 'win32' ? 'ffprobe.exe' : 'ffprobe';
        const ffprobeBin = findFileRecursive(extractDir, ffprobeName);

        if (ffprobeBin) {
            const ffprobeTarget = path.join(binDir, ffprobeName);
            fs.copyFileSync(ffprobeBin, ffprobeTarget);

            if (process.platform !== 'win32') {
                fs.chmodSync(ffprobeTarget, 0o755);
            }
        }

        // Cleanup
        try {
            fs.unlinkSync(zipPath);
            fs.rmSync(extractDir, { recursive: true, force: true });
        } catch (_e) { /* best effort */ }

        return targetPath;
    });
}

function findFileRecursive(dir, filename) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isFile() && entry.name === filename) {
            return fullPath;
        }

        if (entry.isDirectory()) {
            const found = findFileRecursive(fullPath, filename);

            if (found) {
                return found;
            }
        }
    }

    return null;
}

/* ─── yt-dlp version + update ─── */

function getLocalYtdlpVersion(ytdlpPath) {
    return new Promise((resolve) => {
        if (!ytdlpPath) {
            resolve(null);
            return;
        }

        exec('"' + ytdlpPath + '" --version', { timeout: 5000 }, (error, stdout) => {
            if (error) {
                resolve(null);
                return;
            }

            resolve(stdout.trim() || null);
        });
    });
}

function fetchLatestYtdlpVersion() {
    var apiUrl = 'https://api.github.com/repos/yt-dlp/yt-dlp/releases/latest';

    return new Promise((resolve) => {
        var req = https.get(apiUrl, {
            timeout: REQUEST_TIMEOUT_MS,
            headers: { 'User-Agent': 'VideoFetch' },
        }, (res) => {
            if (res.statusCode !== 200) {
                res.resume();
                resolve(null);
                return;
            }

            var body = '';

            res.on('data', (chunk) => { body += chunk; });

            res.on('end', () => {
                try {
                    var data = JSON.parse(body);
                    resolve(data.tag_name || null);
                } catch (_e) {
                    resolve(null);
                }
            });
        });

        req.on('timeout', function () { req.destroy(); resolve(null); });
        req.on('error', function () { resolve(null); });
    });
}

function updateYtdlp(onProgress) {
    return downloadYtdlp(onProgress);
}

module.exports = {
    checkSystemFfmpeg,
    downloadFfmpeg,
    downloadYtdlp,
    fetchLatestYtdlpVersion,
    getBinDirectory,
    getLocalFfmpegPath,
    getLocalYtdlpPath,
    getLocalYtdlpVersion,
    updateYtdlp,
};
