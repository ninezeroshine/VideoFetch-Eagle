'use strict';

const { exec, spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { getLocalYtdlpPath } = require('./binManager');
const eagleAdapter = require('../adapters/eagle');
const { TEMP_DIRECTORY_NAME } = require('../utils/constants');

/**
 * Build PATH with common deno install locations so yt-dlp can find it.
 */
function buildEnhancedPath() {
    const sep = process.platform === 'win32' ? ';' : ':';
    const home = os.homedir();
    const extra = [
        path.join(home, 'AppData', 'Local', 'Microsoft', 'WinGet', 'Links'),
        path.join(home, '.deno', 'bin'),
        '/usr/local/bin',
        '/opt/homebrew/bin',
    ];

    return (process.env.PATH || '') + sep + extra.join(sep);
}

function discoverPythonScriptsDirs() {
    const home = os.homedir();
    const dirs = [];
    const bases = [
        path.join(home, 'AppData', 'Local', 'Programs', 'Python'),
        path.join(home, 'AppData', 'Roaming', 'Python'),
    ];

    for (const base of bases) {
        try {
            const entries = fs.readdirSync(base);

            for (const entry of entries) {
                if (/^Python3\d+$/i.test(entry)) {
                    dirs.push(path.join(base, entry, 'Scripts', 'yt-dlp.exe'));
                }
            }
        } catch (_error) {
            // Directory does not exist — skip
        }
    }

    return dirs;
}

function getExecutableCandidates() {
    return [
        'yt-dlp',
        'yt-dlp.exe',
        ...discoverPythonScriptsDirs(),
        path.join(os.homedir(), '.local', 'bin', 'yt-dlp'),
        '/usr/local/bin/yt-dlp',
        '/usr/bin/yt-dlp',
        '/opt/homebrew/bin/yt-dlp',
    ];
}

function checkExecutable(command) {
    return new Promise((resolve) => {
        exec(`"${command}" --version`, { shell: true, timeout: 5000 }, (error) => {
            resolve(!error);
        });
    });
}

async function detectYtdlp() {
    // Check auto-installed local binary first
    const localPath = getLocalYtdlpPath();

    if (localPath && await checkExecutable(localPath)) {
        return localPath;
    }

    // Then check system PATH and common install locations
    const candidates = getExecutableCandidates();

    for (const candidate of candidates) {
        if (await checkExecutable(candidate)) {
            return candidate;
        }
    }

    return null;
}

async function getTempDirectory() {
    const eagleTempPath = await eagleAdapter.getTempPath();
    const basePath = eagleTempPath || os.tmpdir();
    return path.join(basePath, TEMP_DIRECTORY_NAME);
}

async function ensureTempDirectory() {
    const tempDirectory = await getTempDirectory();

    if (!fs.existsSync(tempDirectory)) {
        fs.mkdirSync(tempDirectory, { recursive: true });
    }

    return tempDirectory;
}

async function createDownloadSession() {
    const tempDirectory = await ensureTempDirectory();
    const sessionId = `vf_${Date.now()}`;
    const outputTemplate = path.join(tempDirectory, `${sessionId}_%(id)s.%(ext)s`);

    return {
        outputTemplate,
        sessionId,
        tempDirectory,
    };
}

function createLineProcessor(onLine) {
    let buffer = '';

    return {
        push(chunk) {
            buffer += String(chunk).replace(/\r/g, '\n');
            const parts = buffer.split('\n');
            buffer = parts.pop();

            for (const part of parts) {
                const line = part.trim();

                if (line) {
                    onLine(line);
                }
            }
        },
        flush() {
            const line = buffer.trim();

            if (line) {
                onLine(line);
            }

            buffer = '';
        },
    };
}

function runDownload(options) {
    const {
        args,
        onStderrLine,
        onStdoutLine,
        ytdlpPath,
    } = options;

    let abortFn = null;

    const promise = new Promise((resolve, reject) => {
        const stderrLines = [];
        const processHandle = spawn(ytdlpPath, args, {
            env: { ...process.env, PYTHONIOENCODING: 'utf-8', PATH: buildEnhancedPath() },
            shell: false,
        });

        abortFn = function () {
            try {
                processHandle.kill('SIGTERM');
            } catch (_error) {
                // Process may have already exited
            }
        };

        processHandle.stdout.setEncoding('utf8');
        processHandle.stderr.setEncoding('utf8');

        const stdoutProcessor = createLineProcessor((line) => {
            onStdoutLine(line);
        });

        const stderrProcessor = createLineProcessor((line) => {
            stderrLines.push(line);
            onStderrLine(line);
        });

        processHandle.stdout.on('data', (chunk) => {
            stdoutProcessor.push(chunk);
        });

        processHandle.stderr.on('data', (chunk) => {
            stderrProcessor.push(chunk);
        });

        processHandle.on('error', (error) => {
            reject(error);
        });

        processHandle.on('close', (code) => {
            stdoutProcessor.flush();
            stderrProcessor.flush();
            resolve({
                code,
                stderrLines,
            });
        });
    });

    return { abort: abortFn, promise };
}

const STALE_SESSION_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

function cleanupStaleSessions() {
    getTempDirectory().then((tempDirectory) => {
        try {
            const entries = fs.readdirSync(tempDirectory);
            const now = Date.now();

            for (const entry of entries) {
                if (!entry.startsWith('vf_')) {
                    continue;
                }

                const fullPath = path.join(tempDirectory, entry);

                try {
                    const stat = fs.statSync(fullPath);

                    if (now - stat.mtimeMs > STALE_SESSION_AGE_MS) {
                        fs.unlinkSync(fullPath);
                    }
                } catch (_error) {
                    // File already removed or inaccessible — skip
                }
            }
        } catch (_error) {
            // Temp directory does not exist yet — nothing to clean
        }
    }).catch(() => {});
}

function cleanupSessionFile(filePath) {
    if (!filePath) {
        return;
    }

    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (_error) {
        // Best-effort cleanup
    }
}

module.exports = {
    cleanupSessionFile,
    cleanupStaleSessions,
    createDownloadSession,
    detectYtdlp,
    getTempDirectory,
    runDownload,
};
