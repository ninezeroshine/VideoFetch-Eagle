'use strict';

const DEFAULT_PROVIDER_ID = 'twitter';
const PLUGIN_NAME = 'Video Fetch';
const HISTORY_STORAGE_KEY = 'vf_history';
const SELECTED_PROVIDER_STORAGE_KEY = 'vf_selected_provider';
const MAX_HISTORY_ITEMS = 20;
const TEMP_DIRECTORY_NAME = 'eagle-videofetch';
const INSTALL_GUIDE_URL = 'https://github.com/yt-dlp/yt-dlp#installation';
const VIDEO_EXTENSIONS = ['.mp4', '.mkv', '.webm', '.mov', '.m4v', '.avi', '.flv', '.ts', '.mp3', '.m4a', '.opus', '.ogg'];
const DOWNLOAD_BUTTON_LABEL = 'Download Video';
const IMPORT_ANNOTATION = 'Downloaded by Video Fetch plugin';
const URL_NOT_RECOGNIZED = 'URL not recognized. Supported: Twitter, YouTube, Instagram, TikTok.';

module.exports = {
    DEFAULT_PROVIDER_ID,
    DOWNLOAD_BUTTON_LABEL,
    IMPORT_ANNOTATION,
    PLUGIN_NAME,
    URL_NOT_RECOGNIZED,
    HISTORY_STORAGE_KEY,
    INSTALL_GUIDE_URL,
    MAX_HISTORY_ITEMS,
    SELECTED_PROVIDER_STORAGE_KEY,
    TEMP_DIRECTORY_NAME,
    VIDEO_EXTENSIONS,
};
