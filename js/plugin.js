'use strict';

/**
 * Video Fetch — Eagle Plugin
 * Downloads videos from Twitter/X using yt-dlp and saves to Eagle library
 */

const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// ─── State ────────────────────────────────────────────────────────────────────
let ytdlpPath = null;
let isDownloading = false;
let downloadHistory = [];

// ─── Init ─────────────────────────────────────────────────────────────────────
eagle.onPluginCreate(async () => {
    loadHistory();
    await detectYtdlp();
});

eagle.onPluginRun(() => {
    autoDetectClipboard();
});

// ─── yt-dlp detection ─────────────────────────────────────────────────────────
async function detectYtdlp() {
    const candidates = [
        'yt-dlp',
        'yt-dlp.exe',
        path.join(os.homedir(), 'AppData', 'Local', 'Programs', 'Python', 'Python311', 'Scripts', 'yt-dlp.exe'),
        path.join(os.homedir(), 'AppData', 'Local', 'Programs', 'Python', 'Python312', 'Scripts', 'yt-dlp.exe'),
        path.join(os.homedir(), 'AppData', 'Local', 'Programs', 'Python', 'Python313', 'Scripts', 'yt-dlp.exe'),
        path.join(os.homedir(), 'AppData', 'Roaming', 'Python', 'Python311', 'Scripts', 'yt-dlp.exe'),
        path.join(os.homedir(), 'AppData', 'Roaming', 'Python', 'Python312', 'Scripts', 'yt-dlp.exe'),
        path.join(os.homedir(), '.local', 'bin', 'yt-dlp'),
        '/usr/local/bin/yt-dlp',
        '/usr/bin/yt-dlp',
        '/opt/homebrew/bin/yt-dlp',
    ];

    for (const candidate of candidates) {
        if (await checkExecutable(candidate)) {
            ytdlpPath = candidate;
            break;
        }
    }

    updateYtdlpStatus();
}

function checkExecutable(cmd) {
    return new Promise((resolve) => {
        // Use shell:true so PATH is fully resolved on Windows
        exec(`"${cmd}" --version`, { timeout: 5000, shell: true }, (err) => {
            resolve(!err);
        });
    });
}

function updateYtdlpStatus() {
    const indicator = document.getElementById('ytdlpIndicator');
    const text = document.getElementById('ytdlpText');
    const warning = document.getElementById('warningBanner');
    const btn = document.getElementById('downloadBtn');

    if (ytdlpPath) {
        indicator.className = 'ytdlp-indicator ok';
        text.textContent = 'yt-dlp ready';
        warning.classList.remove('visible');
        btn.disabled = false;
    } else {
        indicator.className = 'ytdlp-indicator missing';
        text.textContent = 'yt-dlp missing';
        warning.classList.add('visible');
        btn.disabled = true;
    }
}

// ─── UI helpers ───────────────────────────────────────────────────────────────
function setStatus(message, type = 'loading') {
    const box = document.getElementById('statusBox');
    const dot = document.getElementById('statusDot');
    const msg = document.getElementById('statusMessage');

    box.classList.add('visible');
    dot.className = `status-dot ${type}`;
    msg.className = `status-message ${type === 'error' ? 'error-msg' : type === 'success' ? 'success-msg' : ''}`;
    msg.textContent = message;
}

function clearStatus() {
    document.getElementById('statusBox').classList.remove('visible');
}

function showProgress(visible) {
    const section = document.getElementById('progressSection');
    if (visible) section.classList.add('visible');
    else section.classList.remove('visible');
}

function updateProgress(pct, label, info) {
    document.getElementById('progressFill').style.width = `${pct}%`;
    document.getElementById('progressPct').textContent = `${Math.round(pct)}%`;
    if (label !== undefined) document.getElementById('progressLabel').textContent = label;
    if (info !== undefined) document.getElementById('progressInfo').textContent = info;
}

// ─── Clipboard ────────────────────────────────────────────────────────────────
async function pasteFromClipboard() {
    let text = '';
    try { text = await navigator.clipboard.readText(); } catch { /* ignore */ }
    if (!text) {
        try { text = await eagle.clipboard.readText(); } catch (e) {
            setStatus('Cannot read clipboard: ' + e.message, 'error');
            return;
        }
    }
    if (text) document.getElementById('urlInput').value = text.trim();
}

async function autoDetectClipboard() {
    let text = '';
    try { text = await navigator.clipboard.readText(); } catch { /* ignore */ }
    if (!text) {
        try { text = await eagle.clipboard.readText(); } catch { /* ignore */ }
    }
    if (text && isTwitterUrl(text.trim())) {
        document.getElementById('urlInput').value = text.trim();
    }
}

function isTwitterUrl(url) {
    return /^https?:\/\/(www\.)?(twitter\.com|x\.com)\//i.test(url);
}

// ─── Download ─────────────────────────────────────────────────────────────────
async function startDownload() {
    if (isDownloading) return;

    const url = document.getElementById('urlInput').value.trim();
    if (!url) { setStatus('Please enter a URL', 'error'); return; }
    if (!ytdlpPath) { setStatus('yt-dlp is not installed. See install guide above.', 'error'); return; }

    isDownloading = true;
    const btn = document.getElementById('downloadBtn');
    btn.disabled = true;
    btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="animation:spin 1s linear infinite">
            <path d="M8 2A6 6 0 1 0 14 8" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Downloading...
    `;

    clearStatus();
    showProgress(true);
    updateProgress(0, 'Connecting...', '');

    // ── Output directory ──────────────────────────────────────────────────────
    const tmpDir = path.join(os.tmpdir(), 'eagle-videofetch');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    // Unique session prefix — this is how we'll reliably find the file later
    const sessionId = `vf_${Date.now()}`;
    // %(id)s.%(ext)s — yt-dlp substitutes tweet ID and extension
    const outTemplate = path.join(tmpDir, `${sessionId}_%(id)s.%(ext)s`);

    const args = [
        // Twitter/X: "http-*" formats carry video + audio in a single mp4 file (no ffmpeg needed)
        // Fallback chain: best direct https mp4 → best hls mp4 → absolute best
        '-f', 'bestvideo[protocol=https][ext=mp4]+bestaudio[protocol=https][ext=mp4]/best[protocol=https][ext=mp4]/bestvideo+bestaudio/best',
        '--merge-output-format', 'mp4',
        '--no-playlist',
        '--newline',
        '--no-part',
        // Print the final file path after download/move — most reliable detection
        '--print', 'after_move:filepath',
        '-o', outTemplate,
        url,
    ];

    setStatus('Starting download...', 'loading');

    // The file path yt-dlp actually writes to — captured from its stdout
    let capturedFilePath = null;
    const errorLines = [];

    // Capture the final file path from yt-dlp stdout
    function capturePath(line) {
        // 1. --print after_move:filepath  → bare file path on its own line
        //    This is the most reliable: yt-dlp prints it after everything is done
        if (
            line.startsWith(tmpDir) ||
            (line.length > 4 && /\.(mp4|mkv|webm|mov|m4v|avi)$/i.test(line) && !line.startsWith('['))
        ) {
            const candidate = line.trim().replace(/["']/g, '');
            if (fs.existsSync(candidate)) {
                capturedFilePath = candidate;
                eagle.log.info('[VideoFetch] --print filepath: ' + capturedFilePath);
                return;
            }
        }

        // 2. "[download] Destination: /tmp/eagle-videofetch/vf_xxx_XYZID.mp4"
        const destMatch = line.match(/^\[download\]\s+Destination:\s+(.+\.(mp4|mkv|webm|mov|m4v|avi))$/i);
        if (destMatch) {
            capturedFilePath = destMatch[1].trim();
            eagle.log.info('[VideoFetch] Destination captured: ' + capturedFilePath);
            return;
        }

        // 3. "[Merger] Merging formats into "/tmp/.../file.mp4""
        // 4. "[ffmpeg] Merging formats into "/tmp/.../file.mp4""
        const mergeMatch = line.match(/\[(?:Merger|ffmpeg)\]\s+Merging formats into\s+"?(.+\.(mp4|mkv|webm|mov|m4v))"?/i);
        if (mergeMatch) {
            capturedFilePath = mergeMatch[1].trim();
            eagle.log.info('[VideoFetch] Merge destination: ' + capturedFilePath);
        }
    }

    const proc = spawn(ytdlpPath, args, {
        shell: false,
        env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
    });

    proc.stdout.setEncoding('utf8');
    proc.stderr.setEncoding('utf8');

    // Buffer partial lines (stdout can arrive mid-line)
    let stdoutBuf = '';
    proc.stdout.on('data', (chunk) => {
        stdoutBuf += chunk;
        const lines = stdoutBuf.split('\n');
        stdoutBuf = lines.pop(); // keep unterminated tail
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed) {
                capturePath(trimmed);
                parseLine(trimmed);
            }
        }
    });

    proc.stderr.on('data', (chunk) => {
        errorLines.push(chunk);
        // stderr may also contain the file path in some yt-dlp builds
        const lines = chunk.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed) capturePath(trimmed);
        }
    });

    proc.on('close', async (code) => {
        // Flush remaining buffer
        if (stdoutBuf.trim()) {
            capturePath(stdoutBuf.trim());
            parseLine(stdoutBuf.trim());
        }

        isDownloading = false;
        resetButton();
        showProgress(false);

        if (code === 0) {
            // 1st priority: captured path from stdout
            let filePath = capturedFilePath && fs.existsSync(capturedFilePath)
                ? capturedFilePath
                : null;

            // 2nd priority: scan tmpDir for files matching our session prefix
            if (!filePath) {
                filePath = findByPrefix(tmpDir, sessionId);
            }

            if (filePath) {
                await addToEagle(url, filePath);
            } else {
                // Debug: show what's in the tmp dir
                let dirContents = '';
                try { dirContents = fs.readdirSync(tmpDir).join(', '); } catch { /* ignore */ }
                eagle.log.error('[VideoFetch] File not found. tmpDir contents: ' + dirContents);
                setStatus('Download finished but file not found.\nLogged to Eagle dev console.', 'error');
                addToHistory(url, false, 'File not found');
            }
        } else {
            const errMsg = errorLines.join('').slice(0, 400);
            eagle.log.error('[VideoFetch] yt-dlp failed (code ' + code + '): ' + errMsg);
            setStatus('Download failed (code ' + code + '): ' + (errMsg || 'Unknown error').slice(0, 120), 'error');
            addToHistory(url, false, 'Exit code ' + code);
        }
    });

    proc.on('error', (err) => {
        isDownloading = false;
        resetButton();
        showProgress(false);
        setStatus('Failed to start yt-dlp: ' + err.message, 'error');
        addToHistory(url, false, err.message);
    });
}

// ─── Find by session prefix ───────────────────────────────────────────────────
/**
 * Scan tmpDir for any file starting with sessionId prefix.
 * This is a reliable fallback when stdout didn't yield a path.
 */
function findByPrefix(dir, prefix) {
    try {
        const videoExts = new Set(['.mp4', '.mkv', '.webm', '.mov', '.m4v', '.avi']);
        const entries = fs.readdirSync(dir);

        // First: look for prefix + video extension
        const match = entries
            .filter(f => f.startsWith(prefix) && videoExts.has(path.extname(f).toLowerCase()))
            .sort() // lexicographic is fine here
            .pop();  // last one (most likely merged final)

        if (match) {
            const full = path.join(dir, match);
            eagle.log.info('[VideoFetch] Found by prefix: ' + full);
            return full;
        }

        // Second: ANY video file starting with 'vf_' created in this session (generous)
        const anyVf = entries
            .filter(f => f.startsWith('vf_') && videoExts.has(path.extname(f).toLowerCase()))
            .map(f => ({ f, full: path.join(dir, f), mtime: fs.statSync(path.join(dir, f)).mtimeMs }))
            .sort((a, b) => b.mtime - a.mtime);

        if (anyVf.length) return anyVf[0].full;

        return null;
    } catch (e) {
        eagle.log.error('[VideoFetch] findByPrefix error: ' + e.message);
        return null;
    }
}

// ─── Progress line parser ─────────────────────────────────────────────────────
function parseLine(line) {
    if (!line) return;

    // [download]  45.3% of ~23.45MiB at  2.50MiB/s ETA 00:10
    // [download]  45.3% of 23.45MiB at  2.50MiB/s ETA 00:10
    const pMatch = line.match(/\[download\]\s+([\d.]+)%\s+of\s+~?([\d.]+\s*\S+)\s+at\s+([\d.]+\s*\S+)\s+ETA\s+([\d:]+)/);
    if (pMatch) {
        const pct = parseFloat(pMatch[1]);
        const size = pMatch[2];
        const rate = pMatch[3];
        const eta = pMatch[4];
        updateProgress(pct, 'Downloading...', `${size} · ${rate} · ETA ${eta}`);
        setStatus(`Downloading: ${pct.toFixed(1)}%`, 'loading');
        return;
    }

    // [download] 100% of 23.45MiB in 00:05
    if (/\[download\]\s+100%/.test(line)) {
        updateProgress(100, 'Finalizing...', '');
        setStatus('Merging audio + video...', 'loading');
        return;
    }

    if (/\[Merger\]|\[ffmpeg\]/.test(line)) {
        updateProgress(100, 'Merging with ffmpeg...', line.replace(/\[(?:Merger|ffmpeg)\]\s*/, '').slice(0, 60));
        setStatus('Merging streams...', 'loading');
        return;
    }

    if (/\[download\]\s+Resuming/.test(line)) {
        setStatus('Resuming download...', 'loading');
    }
}

// ─── Add to Eagle ─────────────────────────────────────────────────────────────
async function addToEagle(sourceUrl, filePath) {
    setStatus('Adding to Eagle library...', 'loading');

    try {
        const tagsRaw = document.getElementById('tagsInput').value.trim();
        const tags = tagsRaw
            ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean)
            : ['twitter', 'video'];

        // Use tweet filename as name
        const name = path.basename(filePath, path.extname(filePath));

        eagle.log.info('[VideoFetch] Adding file to Eagle: ' + filePath);

        const itemId = await eagle.item.addFromPath(filePath, {
            name,
            website: sourceUrl,
            tags,
            annotation: 'Downloaded by Video Fetch plugin',
        });

        if (itemId) {
            setStatus('✓ Video added to Eagle successfully!', 'success');
            addToHistory(sourceUrl, true, path.basename(filePath));
            // Highlight in Eagle
            try { await eagle.item.open(itemId); } catch { /* non-critical */ }
        } else {
            setStatus('Saved to Eagle (no item ID returned).', 'success');
            addToHistory(sourceUrl, true, 'OK');
        }
    } catch (e) {
        eagle.log.error('[VideoFetch] addToEagle error: ' + e.message);
        setStatus('Eagle import failed: ' + e.message, 'error');
        addToHistory(sourceUrl, false, e.message);
    }
}

// ─── Button reset ─────────────────────────────────────────────────────────────
function resetButton() {
    const btn = document.getElementById('downloadBtn');
    btn.disabled = !ytdlpPath;
    btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2V10M8 10L5 7M8 10L11 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 13H14" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Download Video
    `;
}

// ─── History ──────────────────────────────────────────────────────────────────
function loadHistory() {
    try {
        const raw = localStorage.getItem('vf_history');
        downloadHistory = raw ? JSON.parse(raw) : [];
    } catch { downloadHistory = []; }
    renderHistory();
}

function saveHistory() {
    try { localStorage.setItem('vf_history', JSON.stringify(downloadHistory.slice(0, 20))); } catch { /* ignore */ }
}

function addToHistory(url, success, detail) {
    downloadHistory.unshift({ url, success, detail, time: Date.now() });
    if (downloadHistory.length > 20) downloadHistory.length = 20;
    saveHistory();
    renderHistory();
}

function renderHistory() {
    const section = document.getElementById('historySection');
    const list = document.getElementById('historyList');

    if (!downloadHistory.length) { section.style.display = 'none'; return; }

    section.style.display = 'flex';
    list.innerHTML = downloadHistory.map(item => {
        const date = new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const icon = item.success
            ? `<div class="history-status-icon ok"><svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5L4.5 8L9 3" stroke="#22c55e" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`
            : `<div class="history-status-icon fail"><svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M3 3L8 8M8 3L3 8" stroke="#ef4444" stroke-width="1.7" stroke-linecap="round"/></svg></div>`;

        return `<div class="history-item" onclick="reuseUrl('${escHtml(item.url)}')">
            ${icon}
            <div class="history-info">
                <div class="history-url">${escHtml(item.url)}</div>
                <div class="history-meta">${date} · ${escHtml(item.detail || '')}</div>
            </div>
        </div>`;
    }).join('');
}

function clearHistory() {
    downloadHistory = [];
    saveHistory();
    renderHistory();
}

function reuseUrl(url) {
    document.getElementById('urlInput').value = url;
}

function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ─── Platform tabs ────────────────────────────────────────────────────────────
function selectPlatform(platform) {
    document.querySelectorAll('.platform-tab').forEach(t => t.classList.remove('active'));
    const tab = document.getElementById(`tab-${platform}`);
    if (tab) tab.classList.add('active');
}

// ─── Install guide ────────────────────────────────────────────────────────────
function openInstallGuide() {
    eagle.shell.openExternal('https://github.com/yt-dlp/yt-dlp#installation');
}

// ─── Spinner animation ────────────────────────────────────────────────────────
const _style = document.createElement('style');
_style.textContent = `
@keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
}`;
document.head.appendChild(_style);
