# Video Fetch — Eagle Plugin

Download videos from Twitter/X, YouTube, Instagram and TikTok directly into your Eagle library with full metadata, tags, and folder awareness.

## Features

- **4 platforms** — Twitter/X, YouTube, Instagram Reels/Posts/Stories, TikTok (watermark-free)
- **Auto-detect** — paste a URL and the plugin recognizes the platform automatically
- **Video preview** — thumbnail, title, channel, duration and view count displayed before download
- **Smart quality** — YouTube shows all available resolutions detected from the video
- **MP4 / MP3** — download video with audio or extract audio only, for all platforms
- **Live progress** — real-time download bar with speed, ETA, and stage indicators
- **Stop download** — cancel any active download instantly
- **Per-provider themes** — branded gradient accent colors for each platform
- **Spring animations** — elastic tab indicator, staggered options, spring-pop effects (Motion One)
- **Auto-import to Eagle** — downloaded file gets tags, source URL, annotation, and target folder
- **Auto-install** — one-click install of yt-dlp and ffmpeg directly from the plugin
- **Clipboard auto-detect** — plugin detects supported URLs on open
- **Download history** — recent downloads with one-click re-use
- **Native notifications** — system-level alerts on download success/failure
- **Temp cleanup** — automatic cleanup of stale session files (24h threshold)
- **Provider architecture** — add new platforms by creating a single module

## Requirements

### yt-dlp + ffmpeg

The plugin can **auto-install both** with one click when they are missing. No terminal needed.

Manual installation is also supported:

**yt-dlp:**
```
pip install yt-dlp          # or: winget install yt-dlp (Windows) / brew install yt-dlp (macOS)
```

**ffmpeg:**
```
winget install ffmpeg        # Windows
brew install ffmpeg          # macOS
```

**deno (recommended for YouTube):**
```
winget install DenoLand.Deno # Windows
brew install deno            # macOS
```

## Usage

1. Open Eagle and click the plugin panel
2. Click **Video Fetch**
3. Paste a video URL (or let clipboard auto-detect fill it)
4. Click **Scan** — the plugin detects the platform, fetches video info, and shows download options
5. Choose quality (YouTube) and format (MP4 or MP3)
6. Hit **Download Video**
7. Video is automatically added to your Eagle library

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
├── css/                       Modular design system (8 files, tokens-driven)
│   ├── tokens.css             Design tokens (colors, spacing, radii, shadows, gradients)
│   ├── base.css               Reset, typography, scrollbar, keyframes
│   ├── layout.css             Header, content area, footer
│   ├── components.css         Tabs, inputs, buttons, cards, chips, preview
│   ├── progress.css           Progress bar, stages, success/failure states
│   ├── status.css             Status messages, warning banners, auto-install
│   ├── history.css            Download history list
│   └── themes.css             Per-provider branded gradient themes
│
├── js/
│   ├── plugin.js              Entry point — orchestrator, lifecycle hooks
│   │
│   ├── adapters/
│   │   └── eagle.js           Eagle API abstraction layer
│   │
│   ├── app/
│   │   ├── state.js           Singleton state (frozen snapshots via getState)
│   │   ├── ui.js              DOM manipulation, preview, chips, animations
│   │   └── history.js         localStorage-backed download history
│   │
│   ├── providers/
│   │   ├── index.js           Provider registry (list, getById, resolve)
│   │   ├── common.js          Shared yt-dlp args, format options, provider helpers
│   │   ├── twitter.js         Twitter/X provider
│   │   ├── youtube.js         YouTube provider (dynamic qualities, retry, metadata)
│   │   ├── instagram.js       Instagram provider
│   │   └── tiktok.js          TikTok provider (watermark-free)
│   │
│   ├── services/
│   │   ├── ytdlp.js           yt-dlp detection, process spawning, abort, temp mgmt
│   │   ├── binManager.js      Auto-install yt-dlp + ffmpeg (download, extract, verify)
│   │   ├── metadata.js        Video metadata fetch (--dump-json), thumbnail proxy
│   │   ├── animate.js         Motion One wrapper (fadeIn, staggerIn, elasticSlide, springPop)
│   │   ├── progressParser.js  Parse yt-dlp stdout (JSON + text formats)
│   │   ├── fileDiscovery.js   Locate final file after download/merge/extract
│   │   └── clipboard.js       Browser + Eagle clipboard reading
│   │
│   └── utils/
│       ├── constants.js       Shared constants (keys, limits, labels)
│       └── html.js            XSS-safe HTML escaping, tag media type swap
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

The CSS is split into 8 modular files loaded in dependency order. All visual constants live in `css/tokens.css`:

- **Surfaces**: `--bg-primary`, `--bg-card`, `--bg-input`, `--bg-hover`
- **Accent + alphas**: `--accent`, `--accent-hover`, `--accent-dark`, `--accent-gradient`, `--accent-a02` through `--accent-a45`
- **Typography**: `--text-2xs` through `--text-2xl` (8-step scale)
- **Spacing**: `--space-2` through `--space-20`
- **Shadows**: `--shadow-accent-glow`, `--shadow-bar-glow`, `--shadow-accent-dot`
- **Transitions**: `--transition-fast` through `--transition-theme`

Per-provider themes in `css/themes.css` override the full accent token family using `body[data-provider]` selectors. Each provider has a branded gradient:

| Provider | Gradient |
|----------|----------|
| Twitter/X | Deep blue → Sky blue |
| YouTube | Dark red → Bright red |
| Instagram | Purple → Pink → Orange (brand gradient) |
| TikTok | Dark → Red → Cyan (glitch vibe) |

### Provider Interface

Each provider module exports:

```javascript
module.exports = {
    id: 'twitter',
    label: 'X / Twitter',
    isImplemented: true,
    supportsMetadata: true,
    matchesUrl(url) {},
    getDefaultTags() {},
    getInputLabel() {},
    getInputPlaceholder() {},
    getDownloadOptions(metadata) {},
    parseMetadata(raw) {},
    buildDownloadArgs(options) {},
    // Optional (YouTube only):
    shouldRetryWithClientFallback(stderrLines) {},
};
```

Shared logic lives in `providers/common.js`: format options, audio extraction args, base yt-dlp args, simple option schema builder, and the `buildProviderArgs` helper. Adding a new platform requires ~50 lines following the existing pattern.

### Auto-Install System

`services/binManager.js` handles one-click installation of yt-dlp and ffmpeg:

- Downloads standalone binaries from official GitHub releases
- Follows HTTP redirects (302) for GitHub CDN
- Writes to temp file first, then atomic rename (corruption protection)
- Extracts ffmpeg from ZIP via PowerShell (Windows) / unzip (macOS)
- Stores binaries in `~/.eagle-videofetch/bin/` (survives plugin updates)
- `detectYtdlp()` checks local binaries first, then system PATH
- `common.js` auto-passes `--ffmpeg-location` to yt-dlp when locally installed

### Security

- **No shell injection**: yt-dlp is spawned with `shell: false` and `--` separates options from URL
- **XSS protection**: All user-provided text is escaped via `escapeHtml()` before DOM insertion
- **Immutable state**: `getState()` returns `Object.freeze()` copies
- **Thumbnail proxy**: Thumbnails fetched via Node.js https (bypasses CORP) and converted to data URIs
- **No CORS issues**: Eagle plugins run without cross-origin restrictions

### Download Flow

```
1. User pastes URL → clicks Scan (or Paste auto-scans)
2. resolveProvider(url) matches provider → tab activates, theme switches
3. If provider supports metadata:
   a. yt-dlp --dump-json fetches video info
   b. Thumbnail downloaded via Node and converted to data URI
   c. Preview card + dynamic quality/format options rendered
4. User selects options → clicks Download Video
5. createDownloadSession() → temp dir + unique session ID
6. spawn yt-dlp with provider.buildDownloadArgs()
7. Parse stdout JSON progress → update progress bar in real-time
8. Parse stderr for [download], [Merger], [ExtractAudio] → capture file path
9. eagle.item.addFromPath() → import to Eagle with tags + metadata
10. cleanupSessionFile() → remove temp file
11. eagle.notification.show() → native OS notification
```

User can click **Stop** at any point during step 6-8 to kill the yt-dlp process.

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
| yt-dlp not found | Click "Auto-install yt-dlp" in the warning banner, or install manually |
| ffmpeg not found | Click "Auto-install ffmpeg" in the warning banner, or install manually |
| No audio in output | Install ffmpeg for video+audio stream merging |
| YouTube 403/bot errors | Install deno (`winget install DenoLand.Deno`) and update yt-dlp |
| Progress stuck | Update yt-dlp: `pip install -U yt-dlp` |
| Instagram thumbnail missing | Thumbnails are proxied via Node.js; check network connectivity |
| Video not in folder | Select a folder in Eagle before downloading |

## License

MIT
