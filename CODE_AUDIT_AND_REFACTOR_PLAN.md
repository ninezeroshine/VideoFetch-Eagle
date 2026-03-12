# VideoFetch: code audit and refactor plan

## Purpose of this document

This document captures the current state of the `VideoFetch` plugin, the main technical findings from the code review, and a concrete refactor plan for turning the plugin into a stable multi-platform base for future support of YouTube and other social platforms.

The goal is not to rewrite the plugin from scratch. The goal is to preserve the working parts of the current implementation, reduce coupling, improve maintainability, and create clear extension points for new providers.

## Reviewed files

The current plugin is very compact and consists of the following files:

- `VideoFetch/manifest.json`
- `VideoFetch/index.html`
- `VideoFetch/js/plugin.js`
- `VideoFetch/README.md`
- `VideoFetch/logo.png`

Notably, the plugin currently has no `package.json`, no build pipeline, no test setup, and no source separation between UI logic, download logic, provider logic, and Eagle integration.

## Current architecture snapshot

### Entry and packaging

- `VideoFetch/manifest.json` registers the plugin and points `main.url` to `index.html`.
- `VideoFetch/index.html` contains the full UI markup and styles.
- `VideoFetch/js/plugin.js` contains almost the entire runtime implementation.

### Runtime responsibilities currently handled in one file

`VideoFetch/js/plugin.js` currently handles all of the following:

- Eagle lifecycle hooks via `eagle.onPluginCreate()` and `eagle.onPluginRun()`
- clipboard reading
- `yt-dlp` detection
- URL validation
- download session setup
- `yt-dlp` argument construction
- stdout/stderr parsing for progress and file path discovery
- temporary file lookup
- import into Eagle via `eagle.item.addFromPath()`
- history persistence through `localStorage`
- platform tab state
- install guide opening

This means the plugin works, but the code is highly centralized.

## What is already implemented well

The plugin is not in bad shape. It already has a solid functional core for a single source.

### Strong points

1. The end-to-end flow is real and usable.
   - URL input -> `yt-dlp` -> downloaded file -> import into Eagle works as a coherent pipeline.

2. Eagle integration is already meaningful.
   - The plugin correctly uses Eagle APIs such as `eagle.item.addFromPath()`, `eagle.item.open()`, `eagle.clipboard.readText()`, `eagle.log.info()`, and `eagle.log.error()`.

3. Dependency handling exists.
   - `detectYtdlp()` checks likely installation paths and updates the UI state when the binary is available or missing.

4. The download flow has practical resilience.
   - The plugin does not rely on only one method to find the final file. It captures file paths from output and also scans the temp directory with a session prefix fallback.

5. The UX already contains useful quality-of-life features.
   - Clipboard auto-detection, progress reporting, status updates, and recent history improve usability.

For a single-platform MVP, this is a good starting point.

## Main weaknesses found in the current code

The main issue is not that the plugin is broken. The main issue is that the implementation is tightly coupled.

### 1. Single-file architecture

The largest architectural weakness is that nearly all logic lives in `VideoFetch/js/plugin.js`.

This increases the cost of every future change because a new provider would require touching code related to:

- UI state
- platform rules
- command construction
- validation
- history
- progress parsing
- Eagle import

That is manageable for one provider, but it becomes risky once two or more providers are supported.

### 2. Provider logic is hard-coded to Twitter/X

The implementation is currently platform-specific even though the UI suggests future expansion.

Examples:

- `isTwitterUrl()` only accepts Twitter/X URLs in `VideoFetch/js/plugin.js`.
- The fallback tags default to `['twitter', 'video']` in `VideoFetch/js/plugin.js`.
- `startDownload()` builds one hard-coded `yt-dlp` argument profile optimized around current assumptions.
- The URL input label and placeholder in `VideoFetch/index.html` are Twitter-specific.

As a result, the plugin is functionally a Twitter/X downloader with future platform tabs visually teased in the UI.

### 3. Platform switching is cosmetic, not behavioral

`selectPlatform()` in `VideoFetch/js/plugin.js` only changes the active tab class.

The disabled YouTube and Instagram tabs in `VideoFetch/index.html` imply a multi-platform architecture, but no real provider selection or provider routing exists yet. This is important because it means the current code does not already have an extensibility layer waiting to be activated.

### 4. Download orchestration and provider behavior are mixed together

`startDownload()` is doing too much:

- reads user input
- performs validations
- toggles UI state
- creates temp output paths
- defines `yt-dlp` arguments
- spawns the external process
- parses process output
- handles success and failure
- dispatches import into Eagle

This is the main hotspot for future regression risk.

### 5. No test or validation scaffold

There is currently no automated way to verify:

- URL matching
- provider selection
- argument generation
- progress parsing
- fallback file discovery logic

Without at least a lightweight test harness, each new platform will increase the chance of silent breakage.

### 6. Data model is still minimal and unstructured

`localStorage` history is fine for now, but it is currently just a simple list of results. That is acceptable for the current plugin, but if provider-specific settings are added later, the plugin will need a more explicit data shape.

## Scalability assessment

### Short answer

Yes, the plugin has scaling potential, but not in its current shape.

### Realistic interpretation

The plugin already has the right high-level workflow for additional platforms:

- accept a source URL
- resolve which provider should handle it
- build the correct `yt-dlp` command
- download the media
- import the file into Eagle

That shared workflow is valuable and should be preserved.

However, the current implementation does not isolate provider-specific behavior. Because of that, each new platform would currently add more branching and more coupling inside the same main script.

### Current readiness score

- As a working single-provider MVP: strong
- As a base for two or three providers after moderate refactor: promising
- As a base for many providers without refactor: weak

### Practical verdict

The plugin should not add YouTube, Instagram, or other social sources directly into the current structure. It should first introduce clear provider boundaries.

## What blocks clean multi-platform support today

The following are the main blockers to scalable growth:

1. No provider registry or provider interface
2. Hard-coded Twitter assumptions in validation, tags, and UI copy
3. Centralized `startDownload()` function
4. Tight coupling between UI and execution state
5. No test harness for provider rules and command generation
6. No module boundaries for future maintenance

## Refactor goals

The refactor should aim to achieve the following without breaking the currently working Twitter/X flow:

1. Keep the plugin usable throughout the refactor
2. Preserve the current Eagle integration model
3. Preserve the current `yt-dlp` execution approach
4. Move provider-specific behavior out of the main flow
5. Make it cheap to add a new provider without editing unrelated code
6. Make the code easier to test and reason about

## Proposed target architecture

The plugin does not need a complex framework. It only needs clean separation.

### Suggested module layout

```text
VideoFetch/
  manifest.json
  index.html
  js/
    main.js
    app/
      state.js
      ui.js
      history.js
    eagle/
      eagle-api.js
    providers/
      index.js
      provider-types.js
      twitter.js
      youtube.js
      instagram.js
    download/
      ytdlp.js
      progress-parser.js
      file-discovery.js
      tool-detection.js
    utils/
      strings.js
      paths.js
      validation.js
```

This is only one possible shape, but the important thing is the separation of concerns, not the exact folder names.

### Core boundaries

#### UI layer

Responsible for:

- reading form values
- updating tabs
- rendering progress
- rendering status messages
- rendering history

Should not know how `yt-dlp` arguments are built.

#### Provider layer

Responsible for:

- matching URLs
- exposing display name and default tags
- defining provider-specific `yt-dlp` arguments
- optionally defining provider-specific metadata mapping

Should not handle DOM or Eagle APIs directly.

#### Download layer

Responsible for:

- locating `yt-dlp`
- spawning the process
- parsing progress lines
- determining the final output file

Should not know which tab is active in the UI.

#### Eagle integration layer

Responsible for:

- importing downloaded files into Eagle
- optional item opening/highlighting
- logging

Should not know how providers work internally.

#### Persistence layer

Responsible for:

- history storage
- future plugin settings

Should not contain provider logic.

## Provider interface recommendation

Introduce a provider contract that all future providers follow.

Example shape:

```js
{
  id: 'twitter',
  label: 'X / Twitter',
  matchesUrl(url) {},
  getDefaultTags() {},
  buildYtDlpArgs({ url, outputTemplate }) {},
  getInputPlaceholder() {},
  getInputLabel() {}
}
```

This keeps the plugin centered around one shared pipeline while moving source-specific rules into small, isolated modules.

## Concrete refactor plan

The best path is incremental refactoring, not a rewrite.

### Phase 1: Stabilize the current single-provider implementation

Goal: keep Twitter/X support working while extracting seams.

Tasks:

1. Split `VideoFetch/js/plugin.js` into smaller files by responsibility.
2. Move `yt-dlp` detection into a dedicated module.
3. Move progress parsing into a dedicated module.
4. Move history persistence into a dedicated module.
5. Move Eagle import logic into a dedicated module.
6. Keep current behavior identical from the user's perspective.

Deliverable:

- The plugin still behaves exactly the same, but the code is no longer centralized in one script.

### Phase 2: Introduce provider abstraction using Twitter as the first provider

Goal: make the current Twitter support go through a provider interface.

Tasks:

1. Create a provider registry.
2. Replace `isTwitterUrl()` with `resolveProvider(url)`.
3. Move default tags into the Twitter provider module.
4. Move the hard-coded `yt-dlp` argument builder into the Twitter provider module.
5. Update the UI to use provider-driven label and placeholder text.

Deliverable:

- Twitter/X becomes the first provider implementation instead of a special case inside the app.

### Phase 3: Separate selected platform state from detected provider state

Goal: make the UI and execution model explicit.

Tasks:

1. Add application state for selected platform.
2. Decide the source of truth for execution:
   - provider selected from tabs
   - provider auto-detected from URL
   - or hybrid with validation against both
3. Make `selectPlatform()` update real state, not only CSS.
4. Prevent misleading UI if a platform is not implemented yet.

Deliverable:

- The platform selector becomes a real part of the system rather than a visual placeholder.

### Phase 4: Add YouTube as the second provider

Goal: prove that the new architecture actually scales.

Tasks:

1. Add a `youtube` provider module.
2. Define YouTube-specific URL matching.
3. Define YouTube-specific `yt-dlp` args.
4. Review whether metadata mapping or naming should differ from Twitter.
5. Enable the YouTube tab only when the provider is implemented.

Deliverable:

- Two providers share one pipeline without major branching in the app shell.

### Phase 5: Add a minimal development scaffold

Goal: make the plugin safer to evolve.

Tasks:

1. Add a minimal `package.json` for local development tasks.
2. Add lightweight tests for:
   - provider URL matching
   - provider argument generation
   - progress line parsing
   - file discovery fallback
3. Add a small README section documenting the internal architecture.

Deliverable:

- The plugin becomes maintainable beyond one-off edits.

## Recommended implementation order

If time is limited, use this order:

1. Phase 1
2. Phase 2
3. Phase 4
4. Phase 3
5. Phase 5

Reason:

- First create boundaries
- Then formalize the provider abstraction
- Then prove the abstraction with YouTube
- Then refine platform-selection UX
- Then add validation tooling for safer iteration

## What should not be changed too early

To reduce risk, the following should remain stable during early refactor stages:

- `manifest.json` entry structure
- `index.html` as the plugin window entry point
- Eagle import flow through `eagle.item.addFromPath()`
- use of `yt-dlp` as the main download engine
- existing user-visible success path for Twitter/X

These are proven parts of the plugin and do not need immediate redesign.

## Suggested code quality improvements during refactor

These improvements should happen as part of the refactor, not as isolated cleanup.

1. Replace implicit global state with a clearer app state object.
2. Reduce direct DOM access from deep execution logic.
3. Normalize error handling so process errors, validation errors, and import errors follow a consistent shape.
4. Centralize file extension and temp-path constants.
5. Move inline HTML string generation for history into a smaller rendering helper.
6. Replace provider-specific wording in generic UI areas.

## Risks to watch during refactor

1. Breaking the current Twitter flow while extracting modules
2. Accidentally coupling provider selection to UI state in a confusing way
3. Over-engineering the provider abstraction before the second provider is added
4. Treating YouTube as just another URL pattern without reviewing output naming and metadata needs
5. Leaving the UI tabs visually enabled before their provider logic is production-ready

## Definition of success

The refactor should be considered successful when all of the following are true:

1. Twitter/X still works exactly as before from the user's perspective
2. The plugin no longer relies on one monolithic script for all logic
3. Adding a new provider only requires:
   - one provider module
   - optional provider-specific UI copy
   - minimal or no edits to the shared download pipeline
4. The platform tabs represent real behavior
5. Basic provider and parsing logic can be validated without manual end-to-end testing every time

## Final verdict

`VideoFetch` is already a credible MVP with a real working download-to-Eagle pipeline. The current problem is not lack of capability. The problem is that the architecture has not yet been separated into reusable layers.

That is good news, because it means the plugin does not need a rewrite. It needs a structured refactor.

If this refactor is done carefully, the plugin can become a solid foundation for YouTube and additional social platforms while remaining simple enough to maintain inside Eagle's plugin environment.
