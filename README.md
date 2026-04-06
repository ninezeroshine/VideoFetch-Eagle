# Video Fetch — Eagle Plugin

Download videos from Twitter/X, YouTube, Instagram, TikTok and Vimeo directly into your Eagle library with full metadata, tags, and folder awareness.

## Features

- **5 platforms** — Twitter/X, YouTube, Instagram Reels/Posts/Stories, TikTok (watermark-free), Vimeo
- **Parallel downloads** — start multiple downloads simultaneously, up to 3 concurrent
- **Batch mode** — paste multiple URLs at once, all queued and processed automatically
- **Auto-detect** — paste a URL and the plugin recognizes the platform automatically
- **Video preview** — thumbnail, title, channel, duration and view count displayed before download
- **Smart quality** — YouTube shows all available resolutions detected from the video
- **MP4 / MP3** — download video with audio or extract audio only, for all platforms
- **Download cards** — each download gets its own progress card with bar, status badge and stop button
- **Per-provider themes** — branded gradient accent colors for each platform
- **Spring animations** — elastic tab indicator, staggered options, spring-pop effects (Motion One)
- **Frameless window** — custom title bar with pin, minimize, maximize and close controls
- **Pin on top** — keep the plugin window always on top while browsing
- **Keyboard shortcuts** — Ctrl+V paste & scan, Enter download, Esc cancel
- **Auto-install** — one-click install of yt-dlp and ffmpeg directly from the plugin
- **Auto-update yt-dlp** — check for updates and update with one click from the footer
- **Clipboard auto-detect** — plugin detects supported URLs on open
- **Download history** — recent downloads with one-click re-use
- **Native notifications** — system-level alerts on download completion
- **Animated progress** — shimmer effect on active download bars
- **Download card animations** — fade-up entry, dim on completion
- **Micro-interactions** — spring hover on buttons, glow pulse on status
- **Temp cleanup** — automatic cleanup of stale session files (24h threshold)
- **Provider architecture** — add new platforms by creating a single ~50 line module

## Requirements

### yt-dlp + ffmpeg

The plugin can **auto-install both** with one click when they are missing. No terminal needed.

Manual installation is also supported:

```
pip install yt-dlp          # or: winget install yt-dlp / brew install yt-dlp
winget install ffmpeg        # or: brew install ffmpeg
```

### deno (recommended for YouTube)

yt-dlp 2026+ uses deno for YouTube JavaScript challenge solving. The plugin auto-adds deno paths to the environment.

```
winget install DenoLand.Deno # Windows
brew install deno            # macOS
```

## Usage

### Single mode

1. Open the plugin
2. Paste a video URL → click **Scan** (or Paste auto-scans)
3. Preview card shows thumbnail, title, channel and duration
4. Choose quality (YouTube) and format (MP4 / MP3)
5. Click **Download Video**
6. Start another download immediately — no need to wait

### Batch mode

1. Switch to **Batch** tab
2. Paste multiple URLs (one per line, any mix of platforms)
3. Click **Download All**
4. Downloads run 3 at a time, rest queued automatically

Each download appears as a card with its own progress bar and stop button.

### Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd+V` | Paste URL from clipboard and auto-scan |
| `Enter` | Start download |
| `Escape` | Cancel all active downloads |

## Architecture

```
VideoFetch/
├── manifest.json              Plugin config (frameless window)
├── index.html                 Entry point
├── logo.png                   Plugin icon (128x128)
│
├── css/                       Modular design system (7 files)
│   ├── tokens.css             Design tokens (colors, spacing, gradients)
│   ├── base.css               Reset, typography, scrollbar, keyframes
│   ├── layout.css             Header/titlebar, content, footer, pin/update controls
│   ├── components.css         Tabs, inputs, buttons, chips, cards, preview, shimmer
│   ├── status.css             Status messages, warning banners, glow effects
│   ├── history.css            Download history
│   └── themes.css             Per-provider branded gradient themes (5 providers)
│
├── js/
│   ├── plugin.js              Orchestrator, lifecycle hooks
│   ├── adapters/
│   │   └── eagle.js           Eagle API abstraction
│   ├── app/
│   │   ├── state.js           App state (frozen snapshots)
│   │   ├── ui.js              DOM, preview, chips, download cards, indicator drivers
│   │   ├── history.js         localStorage download history
│   │   ├── titlebar.js        Custom window controls (pin, minimize, maximize, close)
│   │   └── shortcuts.js       Global keyboard shortcuts (Ctrl+V, Enter, Esc)
│   ├── providers/
│   │   ├── index.js           Provider registry
│   │   ├── common.js          Shared args, format options, schema builder
│   │   ├── twitter.js         Twitter/X
│   │   ├── youtube.js         YouTube (dynamic qualities, retry, metadata)
│   │   ├── instagram.js       Instagram
│   │   ├── tiktok.js          TikTok (watermark-free)
│   │   └── vimeo.js           Vimeo
│   ├── services/
│   │   ├── downloadQueue.js   Parallel queue (max 3 concurrent, events)
│   │   ├── ytdlp.js           yt-dlp detection, spawn, abort, deno PATH
│   │   ├── binManager.js      Auto-install/update yt-dlp + ffmpeg, version check
│   │   ├── metadata.js        Video info fetch, thumbnail proxy
│   │   ├── animate.js         Motion One wrapper (spring, stagger, elastic)
│   │   ├── progressParser.js  yt-dlp output parser (JSON + text)
│   │   ├── fileDiscovery.js   Final file locator (download, merge, extract)
│   │   └── clipboard.js       Browser + Eagle clipboard
│   └── utils/
│       ├── constants.js       Shared constants
│       └── html.js            XSS escaping, tag media swap
│
├── node_modules/              Motion One v10
└── scripts/                   Test suite
```

### Provider Interface

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
};
```

Adding a new platform = ~50 lines using `buildProviderArgs()` and `buildSimpleOptions()` from common.js.

### Download Queue

Event-driven queue with concurrency control:

```
queue.add(url, provider)     → queued → scanning → downloading → merging → importing → done
queue.cancel(id)             → cancelled
queue.on('progress', ...)    → real-time updates per download
queue.on('stateChange', ...) → UI card updates
```

Max 3 concurrent downloads. Next in queue starts automatically when a slot opens.

### Security

- yt-dlp spawned with `shell: false` and `--` URL separator
- All user text HTML-escaped before DOM insertion
- Thumbnails proxied via Node.js https (bypasses CORP)
- State snapshots via Object.freeze()
- deno PATH injected for YouTube JS challenge solving
- Download connections have 30s timeout and stall detection

## Development

```bash
npm test                    # all tests
npm run test:providers      # provider tests only
npm run test:progress       # progress parser tests
npm run test:file-discovery # file discovery tests
```

Debug in Eagle: set `"devTools": true` in manifest.json, press F12.

## Troubleshooting

| Problem | Solution |
|---------|----------|
| yt-dlp not found | Click "Auto-install yt-dlp" or install manually |
| ffmpeg not found | Click "Auto-install ffmpeg" or install manually |
| YouTube bot error | Install deno: `winget install DenoLand.Deno` |
| Progress stuck | Click update button in footer to update yt-dlp |
| Instagram no thumbnail | Thumbnails proxied via Node.js; check network |
| macOS install hangs | Fixed in v1.5 — timeout and stall detection added |

## License

MIT
