# Adblock

Blocks audio, billboard, and UI ads on Spotify with auto-mute fallback, statistics, and a custom Settings Modal.

## Features

- **Active Blocking**: Bypasses and blocks billboard, leaderboard, sponsored playlist, and audio ads.
- **Auto-Mute & Auto-Skip Fallback**: Automatically mutes the player and skips to the next track if an audio ad starts playing.
- **UI Cleaner**: Removes "Upgrade to Premium" buttons and banners dynamically.
- **Statistics Tracker**: Monitors how many audio, billboard, and UI elements have been blocked.
- **Settings Modal**: Interactive popup window to toggle the adblocker on/off and reset stats.

## Installation

Copy the `adblock.js` file to your Spicetify extensions directory:
`%appdata%\spicetify\Extensions`

After copying, register and apply the extension:

```bash
spicetify config extensions adblock.js
spicetify apply
```
