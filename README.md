# Video Fetch — Eagle Plugin

Download videos from Twitter/X, YouTube, Instagram and TikTok directly into your Eagle library with full metadata, tags, and folder awareness.

## Features

- **4 platforms** — Twitter/X, YouTube, Instagram Reels/Posts/Stories, TikTok (watermark-free)
- **Auto-detect** — paste a URL and the plugin recognizes the platform automatically
- **Live progress** — real-time download bar with speed, ETA, and stage indicators
- **Stop download** — cancel any active download instantly
- **Per-provider themes** — UI accent color switches to match each platform
- **Spring animations** — elastic tab indicator, staggered options, spring-pop button (Motion One)
- **Auto-import to Eagle** — downloaded video gets tags, source URL, annotation, and target folder
- **Clipboard auto-detect** — plugin detects supported URLs on open and on show
- **Download history** — recent downloads with one-click re-use
- **Native notifications** — system-level alerts on download success/failure
- **Temp cleanup** — automatic cleanup of stale session files (24h threshold)
- **Provider architecture** — add new platforms by creating a single module

## Requirements

### yt-dlp (required)

This plugin uses [yt-dlp](https://github.com/yt-dlp/yt-dlp) to download videos.

**Windows:**
```
winget install yt-dlp.yt-dlp
```
or
```
pip install yt-dlp
```

**macOS:**
```
brew install yt-dlp
```

### ffmpeg (required for audio merge)

yt-dlp needs ffmpeg to merge best video + audio streams into MP4.

**Windows:**
```
winget install ffmpeg
```

**macOS:**
```
brew install ffmpeg
```

### deno (recommended for YouTube)

yt-dlp 2026+ uses deno for YouTube JavaScript challenge solving.

**Windows:**
```
winget install DenoLand.Deno
```

**macOS:**
```
brew install deno
```

## Usage

1. Open Eagle and click the plugin panel
2. Click **Video Fetch**
3. Paste a video URL (or let clipboard auto-detect fill it)
4. Click **Scan** — the plugin detects the platform and shows download options
5. Hit **Download Video**
6. Video is automatically added to your Eagle library

To cancel a download in progress, click the **Stop** button.

If a folder is selected in Eagle, the video will be imported into that folder.

## Technical Stack

### Platform

| Component | Version |
|-----------|---------|
| Eagle Plugin API | Window plugin type |
| Runtime | Chromium 107 + Node 16 (Eagle embedded) |
| Module system | CommonJS (`require`) |
| UI | Vanilla HTML/CSS/JS (no frameworks) |
| Animation | Motion One v10 (spring physics, stagger) |
| External tool | yt-dlp (spawned via `child_process`) |

### Architecture

```
VideoFetch/
├── manifest.json              Plugin manifest (id, version, window config)
├── index.html                 Entry point
├── logo.png                   Plugin icon (128x128)
├── package.json               Dependencies + test scripts
│
├── css/                       Modular design system
│   ├── tokens.css             Design tokens (colors, spacing, radii, shadows, accent alphas)
│   ├── base.css               Reset, typography, scrollbar, keyframes
│   ├── layout.css             Header, content area, footer
│   ├── components.css         Tabs, inputs, buttons, cards, selects
│   ├── progress.css           Progress bar, stages, success/failure states
│   ├── status.css             Status messages, warning banner
│   ├── history.css            Download history list
│   └── themes.css             Per-provider color themes (Twitter/YouTube/Instagram/TikTok)
│
├── js/
│   ├── plugin.js              Entry point — orchestrator, lifecycle hooks
│   │
│   ├── adapters/
│   │   └── eagle.js           Eagle API abstraction layer
│   │
│   ├── app/
│   │   ├── state.js           Singleton state (frozen snapshots via getState)
│   │   ├── ui.js              All DOM manipulation and UI logic
│   │   └── history.js         localStorage-backed download history
│   │
│   ├── providers/
│   │   ├── index.js           Provider registry (list, getById, resolve)
│   │   ├── common.js          Shared yt-dlp arguments for all providers
│   │   ├── twitter.js         Twitter/X provider
│   │   ├── youtube.js         YouTube provider (quality, format, retry)
│   │   ├── instagram.js       Instagram provider (Reels, Posts, Stories)
│   │   └── tiktok.js          TikTok provider (watermark-free)
│   │
│   ├── services/
│   │   ├── ytdlp.js           yt-dlp detection, process spawning, abort, temp mgmt
│   │   ├── animate.js         Motion One wrapper (fadeIn, staggerIn, elasticSlide, springPop)
│   │   ├── progressParser.js  Parse yt-dlp stdout (JSON + text formats)
│   │   ├── fileDiscovery.js   Locate final file after download/merge
│   │   └── clipboard.js       Browser + Eagle clipboard reading
│   │
│   └── utils/
│       ├── constants.js       Shared constants (keys, limits, extensions)
│       └── html.js            XSS-safe HTML escaping
│
├── node_modules/              Motion One v10 + dependencies
│
└── scripts/                   Test suite (runs outside Eagle via Node)
    ├── run-tests.js
    ├── test-providers.js
    ├── test-progress-parser.js
    └── test-file-discovery.js
```

### Design System

The CSS is split into 8 modular files loaded in dependency order. All visual constants live in `css/tokens.css` as CSS custom properties:

- **Surfaces**: `--bg-primary`, `--bg-card`, `--bg-input`, `--bg-hover`
- **Accent + alphas**: `--accent`, `--accent-hover`, `--accent-dark`, `--accent-a02` through `--accent-a45`
- **Typography**: `--text-2xs` through `--text-2xl` (8-step scale)
- **Spacing**: `--space-2` through `--space-20`
- **Shadows**: `--shadow-accent-glow`, `--shadow-bar-glow`, `--shadow-accent-dot`
- **Transitions**: `--transition-fast` through `--transition-theme`

Per-provider themes are defined in `css/themes.css` using `body[data-provider]` selectors. Each provider overrides the full accent token family. CSS transitions on accent-dependent elements handle smooth color changes automatically.

### Provider Interface

Each provider module exports:

```javascript
module.exports = {
    id: 'twitter',
    label: 'X / Twitter',
    isImplemented: true,
    matchesUrl(url) {},
    getDefaultTags() {},
    getInputLabel() {},
    getInputPlaceholder() {},
    getDownloadOptions() {},
    buildDownloadArgs(options) {},
    // Optional:
    shouldRetryWithClientFallback(stderrLines) {},
};
```

Shared yt-dlp arguments (`--no-playlist`, `--newline`, `--progress`, etc.) live in `providers/common.js`. Adding a new platform requires creating one file in `js/providers/` and registering it in `js/providers/index.js`.

### Security

- **No shell injection**: yt-dlp is spawned with `shell: false` and `--` separates options from URL
- **XSS protection**: All user-provided text is escaped via `escapeHtml()` before DOM insertion
- **Immutable state**: `getState()` returns `Object.freeze()` copies
- **No CORS issues**: Eagle plugins run without cross-origin restrictions

### Download Flow

```
1. User pastes URL → clicks Scan (or Paste auto-scans)
2. resolveProvider(url) matches provider → tab activates, theme switches
3. User clicks Download Video
4. createDownloadSession() → temp dir + unique session ID
5. spawn yt-dlp with provider.buildDownloadArgs()
6. Parse stdout JSON progress → update progress bar in real-time
7. Parse stderr for [download] Destination / [Merger] lines → capture file path
8. eagle.item.addFromPath() → import to Eagle with tags + metadata
9. cleanupSessionFile() → remove temp file
10. eagle.notification.show() → native OS notification
```

User can click **Stop** at any point during step 5-6 to kill the yt-dlp process.

YouTube downloads include automatic retry with alternative client profiles if the initial request is rejected.

## Development

Run all tests (pure Node, no Eagle required):

```bash
npm test
```

Focused tests:

```bash
npm run test:providers
npm run test:progress
npm run test:file-discovery
```

To debug inside Eagle: set `"devTools": true` in `manifest.json` and press F12.

## Troubleshooting

| Problem | Solution |
|---------|----------|
| yt-dlp not found | Ensure `yt-dlp` is in system PATH or installed via pip/winget/brew |
| No audio in output | Install ffmpeg for video+audio stream merging |
| YouTube 403/bot errors | Install deno (`winget install DenoLand.Deno`) and update yt-dlp |
| Progress stuck on Preparing | Update yt-dlp: `pip install -U yt-dlp` |
| Twitter login-wall | Some Twitter content requires authentication; yt-dlp cookies may help |
| Video not in folder | Select a folder in Eagle before downloading |

## License

MIT
