# VideoFetch Refactor Plan

## Goal

Refactor the current monolithic Eagle plugin into a modular multi-provider architecture while preserving current Twitter/X behavior, then add YouTube support, make platform selection state real, and add a minimal local development scaffold.

## Constraints

- Keep `manifest.json` entry structure unchanged.
- Keep `index.html` as the plugin window entrypoint.
- Keep Eagle import through `eagle.item.addFromPath()`.
- Keep `yt-dlp` as the download engine.
- Remain compatible with Eagle's Chromium 107 + Node 16 environment.
- Do not introduce a bundler, framework, or TypeScript.
- Keep the runtime in CommonJS-compatible vanilla JS loaded from `index.html` via `js/plugin.js`.

## Current Baseline

- `manifest.json` points the plugin entry to `index.html`.
- `index.html` contains the full UI and inline event handlers.
- `js/plugin.js` currently owns state, clipboard detection, yt-dlp detection, provider validation, download orchestration, progress parsing, file discovery, Eagle import, history, and platform tab selection.
- Current user-visible behavior works for Twitter/X and should remain stable during extraction.

## Target Module Layout

```text
js/
  plugin.js
  app/
    state.js
    ui.js
    history.js
  adapters/
    eagle.js
  providers/
    index.js
    twitter.js
    youtube.js
  services/
    ytdlp.js
    progressParser.js
    fileDiscovery.js
    clipboard.js
  utils/
    html.js
    constants.js
```

## Core Contracts

### Provider contract

Each provider module exposes:

```js
{
  id,
  label,
  matchesUrl(url),
  getDefaultTags(),
  getInputLabel(),
  getInputPlaceholder(),
  buildDownloadArgs({ url, outputTemplate })
}
```

### Registry contract

- `listProviders()` returns supported providers.
- `getProviderById(id)` returns a provider or `null`.
- `resolveProvider(url)` returns the first matching provider or `null`.

### State contract

App state tracks:

- `selectedProviderId`
- `isDownloading`
- `ytdlpPath`
- `downloadHistory`

## Phases

### Phase 1 - Modularize without behavior change

Move the existing logic out of `js/plugin.js` into modules while keeping the current Twitter/X user flow unchanged.

Tasks:

1. Extract state management into `js/app/state.js`.
2. Extract status/progress/history DOM updates into `js/app/ui.js`.
3. Extract `localStorage` history handling into `js/app/history.js`.
4. Extract Eagle integration into `js/adapters/eagle.js`.
5. Extract yt-dlp detection and execution into `js/services/ytdlp.js`.
6. Extract progress parsing into `js/services/progressParser.js`.
7. Extract file resolution fallback into `js/services/fileDiscovery.js`.
8. Keep `js/plugin.js` as the thin composition layer.

Acceptance criteria:

- Twitter/X download flow behaves the same as before.
- Missing `yt-dlp` still disables downloads and shows the warning banner.
- History still persists in `localStorage`.
- Eagle import still uses `eagle.item.addFromPath()` and opens the item when possible.
- `eagle.onPluginCreate()` still loads history and checks `yt-dlp` availability.
- `eagle.onPluginRun()` still attempts clipboard auto-fill.
- Clipboard paste still falls back from `navigator.clipboard` to `eagle.clipboard.readText()`.
- Progress and status text still update during download, merge, success, and failure states.
- History items can still be reused and cleared from the UI.
- The install guide action still opens the `yt-dlp` installation page.

Manual QA:

- In Eagle, open the plugin and confirm the existing X-focused screen renders without missing controls.
- With `yt-dlp` unavailable, confirm the warning banner is visible and the download button is disabled.
- With `yt-dlp` available, confirm the footer indicator switches to ready and the button becomes enabled.
- Trigger plugin run with a Twitter/X URL in the clipboard and confirm the URL input is auto-filled.
- Use the Paste button with clipboard access blocked in the browser context and confirm the Eagle clipboard fallback still fills the input.
- Run one successful Twitter/X download and confirm visible transitions: connecting -> downloading progress -> finalizing/merging -> Eagle import success.
- Click a saved history item and confirm the URL is restored into the input.
- Click Clear in history and confirm the history section becomes empty/hidden.
- Click the install guide button and confirm it opens the `yt-dlp` installation page externally.

### Phase 2 - Introduce provider abstraction with Twitter

Replace the Twitter special cases with a real provider registry and a Twitter provider module.

Tasks:

1. Add `js/providers/index.js` registry helpers.
2. Add `js/providers/twitter.js` using existing Twitter/X rules.
3. Replace `isTwitterUrl()` checks with `resolveProvider(url)`.
4. Move default tags, labels, placeholders, and yt-dlp args into the Twitter provider.
5. Update the composition layer so downloads run through the resolved provider contract.

Acceptance criteria:

- Twitter/X still works through provider resolution instead of hard-coded checks.
- UI label/placeholder/tags come from the Twitter provider.
- `plugin.js` no longer contains provider-specific download arguments.

Manual QA:

- In Eagle, paste a Twitter/X URL and confirm provider-driven label, placeholder, and default tags come from the Twitter provider.
- Confirm a supported Twitter/X URL resolves through the registry before download arguments are built.
- Confirm an unsupported URL produces generic provider validation instead of Twitter-only messaging.

### Phase 3 - Add YouTube provider

Prove the new architecture supports a second provider without branching the shared shell excessively.

Tasks:

1. Add `js/providers/youtube.js`.
2. Implement YouTube URL matching.
3. Add YouTube-specific `yt-dlp` argument generation with `--no-playlist` and merged output handling.
4. Ensure final file detection still prefers `--print after_move:filepath`.
5. Register the YouTube provider in the registry.

Acceptance criteria:

- YouTube URLs resolve to the YouTube provider.
- YouTube downloads use provider-specific args.
- Twitter/X flow remains unchanged.
- Phase 3 verification does not depend on YouTube UI tabs being enabled yet.

Manual QA:

- Run a temporary Node verification command during Phase 3 itself, for example `node -e "const { resolveProvider } = require('./js/providers'); const twitter = resolveProvider('https://x.com/user/status/123'); const youtube = resolveProvider('https://www.youtube.com/watch?v=abc123'); console.log(twitter && twitter.id, youtube && youtube.id);"` and confirm the output is `twitter youtube`.
- Run a temporary Node verification command during Phase 3 itself, for example `node -e "const { getProviderById } = require('./js/providers'); const provider = getProviderById('youtube'); const args = provider.buildDownloadArgs({ url: 'https://www.youtube.com/watch?v=abc123', outputTemplate: 'tmp/%(id)s.%(ext)s' }); console.log(args.join(' '));"` and confirm the output contains YouTube-specific download arguments including `--no-playlist`, `--print after_move:filepath`, and output template wiring.
- Execute one X/Twitter shared-pipeline smoke test in Eagle to confirm the second provider did not regress the existing provider.

### Phase 4 - Make platform selection state real

Turn the platform tabs into actual state instead of cosmetic class toggles.

Tasks:

1. Persist `selectedProviderId` in app state.
2. Make tab clicks update actual selected provider state.
3. Enable only implemented provider tabs.
4. Sync UI labels/placeholders/default tags with the selected provider.
5. Support clipboard and typed URL auto-detection without misleading the user.

Acceptance criteria:

- X and YouTube tabs map to real provider behavior.
- Unimplemented platforms remain visibly unavailable.
- Reopening the plugin restores the last selected provider.
- Enabling the YouTube tab is part of this phase, not earlier.

Manual QA:

- In Eagle, switch between X and YouTube tabs and confirm provider-specific form copy updates immediately.
- Confirm the selected tab changes actual provider behavior, not only CSS classes.
- Reopen the plugin and confirm the last selected provider is restored.
- Confirm Instagram remains visibly unavailable.

### Phase 5 - Add minimal development scaffold

Add the minimum local tooling needed to validate pure logic outside Eagle.

Tasks:

1. Add `package.json` with Node 16-compatible local scripts.
2. Add lightweight tests for provider resolution, argument generation, progress parsing, and file discovery.
3. Add fixtures if needed for parser validation.
4. Update `README.md` with architecture and development notes.

Acceptance criteria:

- Local scripts can validate pure modules without Eagle.
- README documents the module layout and verification flow.
- `package.json` defines explicit commands for provider checks, parser checks, file discovery checks, and aggregated test execution.

Manual QA:

- Run the exact commands added in `package.json` and confirm zero exit codes plus expected pass output for provider resolution, argument generation, progress parsing, and file discovery.

## Verification Checklist

- All modified JavaScript files load in the CommonJS-based plugin runtime without introducing browser module imports.
- Local validation commands from `package.json` pass with exit code 0 once Phase 5 is complete.
- Manual QA covers preserved Twitter/X behavior plus the final YouTube-enabled flow.
- The plugin still enters through `index.html` and imports through Eagle.
