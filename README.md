# Video Fetch — Eagle Plugin

Download videos from Twitter/X and YouTube directly into your Eagle library with full metadata, tags, and folder awareness.

## Features

- **Twitter/X & YouTube** video download with provider-specific quality options
- **Auto-import to Eagle** with tags, source URL, annotation, and selected folder support
- **Clipboard auto-detect** — plugin detects supported URLs on open and on show
- **Live progress** — real-time download bar with speed, ETA, and stage indicators
- **Download history** — recent downloads with one-click re-use
- **Native notifications** — system-level alerts on download success/failure
- **Temp cleanup** — automatic cleanup of stale session files (24h threshold)
- **Provider architecture** — add new platforms by creating a single module

## Requirements

### yt-dlp (required)

This plugin uses [yt-dlp](https://github.com/yt-dlp/yt-dlp) to download videos. The plugin auto-detects yt-dlp from PATH and common Python install locations.

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

## Usage

1. Open Eagle and click the plugin panel
2. Click **Video Fetch**
3. Paste a Twitter/X or YouTube URL (or let clipboard auto-detect fill it)
4. Choose quality and format options
5. Hit **Download Video**
6. Video is automatically added to your Eagle library

If a folder is selected in Eagle, the video will be imported into that folder.

## Technical Stack

### Platform

| Component | Version |
|-----------|---------|
| Eagle Plugin API | Window plugin type |
| Runtime | Chromium 107 + Node 16 (Eagle embedded) |
| Module system | CommonJS (`require`) |
| UI | Vanilla HTML/CSS/JS (no frameworks) |
| External tool | yt-dlp (spawned via `child_process`) |

### Eagle API Usage

| API | Purpose |
|-----|---------|
| `eagle.onPluginCreate` | Initialize plugin, load modules |
| `eagle.onPluginRun` | Auto-detect clipboard URL |
| `eagle.onPluginShow` | Re-detect clipboard when window shown |
| `eagle.onPluginBeforeExit` | Cleanup stale temp files |
| `eagle.item.addFromPath` | Import downloaded video with metadata |
| `eagle.item.open` | Navigate to imported item |
| `eagle.folder.getSelected` | Import into currently selected folder |
| `eagle.clipboard.readText` | Read URL from clipboard |
| `eagle.notification.show` | Native OS notifications on completion |
| `eagle.window.flashFrame` | Flash taskbar on background completion |
| `eagle.shell.openExternal` | Open yt-dlp install guide |
| `eagle.app.getPath('temp')` | Resolve temp directory for downloads |
| `eagle.log.*` | Debug/info/warn/error logging |

### Architecture

```
VideoFetch/
├── manifest.json              Plugin manifest (id, version, window config)
├── index.html                 Entry point — clean HTML, no inline CSS
├── logo.png                   Plugin icon (128x128)
├── package.json               Dev-only: test scripts
│
├── css/                       Modular design system
│   ├── tokens.css             Design tokens (colors, spacing, radii, shadows)
│   ├── base.css               Reset, typography, scrollbar, keyframes
│   ├── layout.css             Header, content area, footer
│   ├── components.css         Tabs, inputs, buttons, cards, selects
│   ├── progress.css           Progress bar, stages, success/failure states
│   ├── status.css             Status messages, warning banner
│   └── history.css            Download history list
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
│   │   ├── twitter.js         Twitter/X: URL matching, yt-dlp args, options
│   │   └── youtube.js         YouTube: quality/format selection, retry logic
│   │
│   ├── services/
│   │   ├── ytdlp.js           yt-dlp detection, process spawning, temp mgmt
│   │   ├── progressParser.js  Parse yt-dlp stdout (JSON + text formats)
│   │   ├── fileDiscovery.js   Locate final file after download/merge
│   │   └── clipboard.js       Browser + Eagle clipboard reading
│   │
│   └── utils/
│       ├── constants.js       Shared constants (keys, limits, extensions)
│       └── html.js            XSS-safe HTML escaping
│
└── scripts/                   Test suite (runs outside Eagle via Node)
    ├── run-tests.js
    ├── test-providers.js
    ├── test-progress-parser.js
    └── test-file-discovery.js
```

### Design System

The CSS is split into 7 modular files loaded in dependency order. All visual constants live in `css/tokens.css` as CSS custom properties:

- **Surfaces**: `--bg-primary`, `--bg-card`, `--bg-input`, `--bg-hover`
- **Text**: `--text-primary`, `--text-secondary`, `--text-muted`
- **Accent**: `--accent`, `--accent-hover`, `--accent-dark`
- **Semantic**: `--success`, `--error`, `--warning` (with dark variants)
- **Spacing**: `--space-2` through `--space-20` (2px increments)
- **Radii**: `--radius-xs` through `--radius-pill`
- **Transitions**: `--transition-fast`, `--transition-normal`, `--transition-slow`
- **Shadows**: `--shadow-accent-glow`, `--shadow-success-glow`, `--shadow-error-glow`

To re-theme the plugin, swap or override `tokens.css`. All other CSS files reference tokens only.

### Provider Interface

Each provider module exports:

```javascript
module.exports = {
    id: 'twitter',                   // Unique identifier
    label: 'X / Twitter',            // Display name
    isImplemented: true,             // Show in UI or mark "coming soon"
    matchesUrl(url) {},              // URL pattern test
    getDefaultTags() {},             // Default Eagle tags
    getInputLabel() {},              // URL input label text
    getInputPlaceholder() {},        // URL input placeholder
    getDownloadOptions() {},         // Options schema for UI rendering
    buildDownloadArgs(options) {},   // Build yt-dlp CLI arguments
    // Optional:
    shouldRetryWithClientFallback(stderrLines) {},  // YouTube-specific retry
};
```

Adding a new platform requires creating one file in `js/providers/` and registering it in `js/providers/index.js`.

### Security

- **No shell injection**: yt-dlp is spawned with `shell: false` and `--` separates options from URL arguments
- **XSS protection**: All user-provided text is escaped via `escapeHtml()` before DOM insertion
- **Immutable state**: `getState()` returns `Object.freeze()` copies preventing accidental mutation
- **No CORS issues**: Eagle plugins run without cross-origin restrictions

### Download Flow

```
1. User pastes URL → resolveProvider(url) matches provider
2. createDownloadSession() → temp dir + unique session ID
3. spawn yt-dlp with provider.buildDownloadArgs()
4. Parse stdout/stderr → update progress bar in real-time
5. extractFilePathFromLine() captures final file path
6. eagle.folder.getSelected() → get target folder (if any)
7. eagle.item.addFromPath() → import to Eagle with tags + metadata
8. cleanupSessionFile() → remove temp file
9. eagle.notification.show() → native OS notification
10. eagle.item.open() → navigate to imported item
```

YouTube downloads include automatic retry with alternative client profiles if the initial request is rejected (PO token / precondition failures).

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
| YouTube 403/400 errors | Update yt-dlp: `pip install -U yt-dlp` or `winget upgrade yt-dlp` |
| Twitter login-wall | Some Twitter content requires authentication; yt-dlp cookies may help |
| Video not in folder | Select a folder in Eagle before downloading |

## License

MIT
