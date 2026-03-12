# Video Fetch — Eagle Plugin

A premium Eagle plugin for downloading videos from Twitter / X and saving them directly to your Eagle library.

## Features

- 🎯 **Twitter / X** video download (best quality + audio, auto-merged)
- 🦅 **Auto-import** to Eagle with tags and source URL
- 📋 **Clipboard detection** — auto-fills URL when you open the plugin
- 📊 **Live progress** bar with speed and ETA
- 🕐 **Download history** with quick re-use

## Requirements

### yt-dlp (required)

This plugin uses [yt-dlp](https://github.com/yt-dlp/yt-dlp) to download videos.

**Install on Windows:**
```
winget install yt-dlp.yt-dlp
```
or
```
pip install yt-dlp
```

**Install on macOS:**
```
brew install yt-dlp
```

### ffmpeg (required for audio merge)

yt-dlp needs ffmpeg to merge best video + audio streams.

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
3. Paste a Twitter/X tweet URL
4. Hit **Download Video**
5. Video is automatically added to your Eagle library!

## How It Works

The plugin calls `yt-dlp` with:
```
-f bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best --merge-output-format mp4
```

This selects the **best quality video with the best audio track**, merged into MP4.

The downloaded file is then added to Eagle via `eagle.item.addFromPath()`.

## Troubleshooting

- **yt-dlp not found**: Make sure `yt-dlp` is in your system PATH
- **No audio**: Install ffmpeg for proper stream merging
- **Twitter rate limits**: Try again after a few minutes

## License

MIT
