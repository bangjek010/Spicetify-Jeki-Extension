// Lyric Miniplayer - Spicetify Extension
// Creates a floating Picture-in-Picture lyrics window that stays on top of all apps

(async function LyricsOverlay() {
    // Wait for Spicetify to be fully loaded
    while (!Spicetify?.Player?.data || !Spicetify?.Platform || !Spicetify?.CosmosAsync) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // ==================== CONFIG ====================
    const CONFIG = {
        pipWidth: 280,
        pipHeight: 360,
        updateInterval: 100,
        defaultFontSize: 14,
        maxFontSize: 28,
        minFontSize: 10,
    };

    // ==================== THEMES ====================
    const THEMES = {
        spotify: {
            name: 'Spotify',
            emoji: '💚',
            bg: 'linear-gradient(160deg, #0a0a0a 0%, #1a1a2e 40%, #0f0f23 100%)',
            accent: '#1ed760',
            accentHover: '#1fdf64',
            headerBg: 'rgba(0, 0, 0, 0.5)',
            controlsBg: 'rgba(0, 0, 0, 0.35)',
            footerBg: 'rgba(0, 0, 0, 0.45)',
            textGlow: 'rgba(30, 215, 96, 0.3)',
        },
        pink: {
            name: 'Pink Pop',
            emoji: '💖',
            bg: 'linear-gradient(160deg, #1a0a14 0%, #2d1f2b 40%, #1f0f1a 100%)',
            accent: '#ff69b4',
            accentHover: '#ff85c2',
            headerBg: 'rgba(40, 10, 30, 0.6)',
            controlsBg: 'rgba(40, 10, 30, 0.4)',
            footerBg: 'rgba(40, 10, 30, 0.5)',
            textGlow: 'rgba(255, 105, 180, 0.4)',
        },
        kawaii: {
            name: 'Kawaii',
            emoji: '🌸',
            bg: 'linear-gradient(160deg, #2d1f2f 0%, #1f1a2e 40%, #2a1f35 100%)',
            accent: '#ffb7dd',
            accentHover: '#ffc9e5',
            headerBg: 'rgba(50, 30, 50, 0.6)',
            controlsBg: 'rgba(50, 30, 50, 0.4)',
            footerBg: 'rgba(50, 30, 50, 0.5)',
            textGlow: 'rgba(255, 183, 221, 0.4)',
        },
        ocean: {
            name: 'Ocean Blue',
            emoji: '🌊',
            bg: 'linear-gradient(160deg, #0a1628 0%, #0d253f 40%, #0a1a30 100%)',
            accent: '#00bfff',
            accentHover: '#33ccff',
            headerBg: 'rgba(10, 30, 50, 0.6)',
            controlsBg: 'rgba(10, 30, 50, 0.4)',
            footerBg: 'rgba(10, 30, 50, 0.5)',
            textGlow: 'rgba(0, 191, 255, 0.4)',
        },
        racing: {
            name: 'Racing Red',
            emoji: '🏎️',
            bg: 'linear-gradient(160deg, #0a0a0a 0%, #1a0a0a 40%, #150505 100%)',
            accent: '#ff3333',
            accentHover: '#ff5555',
            headerBg: 'rgba(30, 5, 5, 0.7)',
            controlsBg: 'rgba(30, 5, 5, 0.5)',
            footerBg: 'rgba(30, 5, 5, 0.6)',
            textGlow: 'rgba(255, 51, 51, 0.4)',
        },
        sunset: {
            name: 'Sunset',
            emoji: '🌅',
            bg: 'linear-gradient(160deg, #1a0f0a 0%, #2d1a0f 40%, #1f1408 100%)',
            accent: '#ff6b35',
            accentHover: '#ff8555',
            headerBg: 'rgba(40, 20, 10, 0.6)',
            controlsBg: 'rgba(40, 20, 10, 0.4)',
            footerBg: 'rgba(40, 20, 10, 0.5)',
            textGlow: 'rgba(255, 107, 53, 0.4)',
        },
        purple: {
            name: 'Galaxy',
            emoji: '🔮',
            bg: 'linear-gradient(160deg, #0f0a1a 0%, #1a1030 40%, #150d25 100%)',
            accent: '#a855f7',
            accentHover: '#b975f9',
            headerBg: 'rgba(25, 15, 40, 0.6)',
            controlsBg: 'rgba(25, 15, 40, 0.4)',
            footerBg: 'rgba(25, 15, 40, 0.5)',
            textGlow: 'rgba(168, 85, 247, 0.4)',
        },
        mint: {
            name: 'Mint Fresh',
            emoji: '🍃',
            bg: 'linear-gradient(160deg, #0a1a14 0%, #0f2a20 40%, #081810 100%)',
            accent: '#2dd4bf',
            accentHover: '#4ee0cd',
            headerBg: 'rgba(10, 35, 28, 0.6)',
            controlsBg: 'rgba(10, 35, 28, 0.4)',
            footerBg: 'rgba(10, 35, 28, 0.5)',
            textGlow: 'rgba(45, 212, 191, 0.4)',
        },
        gold: {
            name: 'Luxury Gold',
            emoji: '👑',
            bg: 'linear-gradient(160deg, #0f0d08 0%, #1a1508 40%, #12100a 100%)',
            accent: '#fbbf24',
            accentHover: '#fcd34d',
            headerBg: 'rgba(30, 25, 15, 0.6)',
            controlsBg: 'rgba(30, 25, 15, 0.4)',
            footerBg: 'rgba(30, 25, 15, 0.5)',
            textGlow: 'rgba(251, 191, 36, 0.4)',
        },
        cyberpunk: {
            name: 'Cyberpunk',
            emoji: '🤖',
            bg: 'linear-gradient(160deg, #0a0a12 0%, #12081f 40%, #0f0a18 100%)',
            accent: '#f0f',
            accentHover: '#ff44ff',
            headerBg: 'rgba(20, 10, 35, 0.7)',
            controlsBg: 'rgba(20, 10, 35, 0.5)',
            footerBg: 'rgba(20, 10, 35, 0.6)',
            textGlow: 'rgba(255, 0, 255, 0.5)',
        },
        snow: {
            name: 'Frost',
            emoji: '❄️',
            bg: 'linear-gradient(160deg, #0d1520 0%, #1a2535 40%, #0f1825 100%)',
            accent: '#7dd3fc',
            accentHover: '#a5e1fd',
            headerBg: 'rgba(15, 25, 40, 0.6)',
            controlsBg: 'rgba(15, 25, 40, 0.4)',
            footerBg: 'rgba(15, 25, 40, 0.5)',
            textGlow: 'rgba(125, 211, 252, 0.4)',
        },
        rose: {
            name: 'Rose Gold',
            emoji: '🌹',
            bg: 'linear-gradient(160deg, #1a1015 0%, #251820 40%, #1d1318 100%)',
            accent: '#f43f5e',
            accentHover: '#fb7185',
            headerBg: 'rgba(35, 20, 25, 0.6)',
            controlsBg: 'rgba(35, 20, 25, 0.4)',
            footerBg: 'rgba(35, 20, 25, 0.5)',
            textGlow: 'rgba(244, 63, 94, 0.4)',
        },
    };

    // ==================== STATE ====================
    let pipWindow = null;
    let currentLyrics = null;
    let currentTrackUri = null;
    let updateIntervalId = null;
    let fontSize = CONFIG.defaultFontSize;
    let showFontSlider = true;
    let showVolumeSlider = true;
    let showLyrics = true;
    let showShuffleBtn = true;
    let showLikeBtn = true;
    let showCloseBtn = true;
    let centerLyrics = true;
    let currentTheme = 'spotify';
    let bgOpacity = 100;
    let currentWaveformData = null;
    let waveformDrawn = false;
    let loadingAnimationFrame = null;
    let isTransitioning = false;
    let lastPlayState = null;
    let lastLikeState = null;
    let lastActiveIdx = -1;
    let cachedLyricElements = null;
    let lastProgressRatio = -1;

    // Load saved settings
    try {
        const savedSize = localStorage.getItem('lyrics-overlay-fontsize');
        if (savedSize) fontSize = parseInt(savedSize);
        const savedShowFont = localStorage.getItem('lyrics-overlay-showfont');
        if (savedShowFont !== null) showFontSlider = savedShowFont === 'true';
        const savedShowVol = localStorage.getItem('lyrics-overlay-showvol');
        if (savedShowVol !== null) showVolumeSlider = savedShowVol === 'true';
        const savedShowLyrics = localStorage.getItem('lyrics-overlay-showlyrics');
        if (savedShowLyrics !== null) showLyrics = savedShowLyrics === 'true';
        const savedShowShuffle = localStorage.getItem('lyrics-overlay-showshuffle');
        if (savedShowShuffle !== null) showShuffleBtn = savedShowShuffle === 'true';
        const savedShowLike = localStorage.getItem('lyrics-overlay-showlike');
        if (savedShowLike !== null) showLikeBtn = savedShowLike === 'true';
        const savedShowClose = localStorage.getItem('lyrics-overlay-showclose');
        if (savedShowClose !== null) showCloseBtn = savedShowClose === 'true';
        const savedCenterLyrics = localStorage.getItem('lyrics-overlay-centerlyrics');
        if (savedCenterLyrics !== null) centerLyrics = savedCenterLyrics === 'true';
        const savedTheme = localStorage.getItem('lyrics-overlay-theme');
        if (savedTheme && THEMES[savedTheme]) currentTheme = savedTheme;
        const savedOpacity = localStorage.getItem('lyrics-overlay-bg-opacity');
        if (savedOpacity) bgOpacity = parseInt(savedOpacity);
    } catch (e) {}

    // ==================== GENERATE CSS WITH THEME ====================
    function generateStyles(theme) {
        const t = THEMES[theme] || THEMES.spotify;
        return `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        
        :root {
            --accent: ${t.accent};
            --accent-hover: ${t.accentHover};
            --text-glow: ${t.textGlow};
        }
        
        *, *::before, *::after {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html, body {
            height: 100%;
            overflow: hidden;
        }

        body {
            font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: transparent;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            position: relative;
            box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5), 0 0 30px var(--text-glow);
            transition: box-shadow 0.3s ease;
        }

        body::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: ${t.bg};
            opacity: var(--bg-opacity, 1);
            z-index: -1;
            pointer-events: none;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12); /* Top lighting highlight like iOS */
        }

        .bg-album-art {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: blur(30px) brightness(0.5) saturate(1.3);
            transform: scale(1.15);
            z-index: -2;
            pointer-events: none;
        }

        /* Fade transitions on song change */
        .fade-transition {
            transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), filter 0.25s ease;
        }
        .fade-out {
            opacity: 0 !important;
            transform: scale(0.98);
            filter: blur(4px);
        }

        /* Seek head tooltip */
        .seek-tooltip {
            position: absolute;
            bottom: 32px;
            left: 0;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(4px);
            color: #ffffff;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 10px;
            font-weight: 600;
            font-family: 'DM Sans', sans-serif;
            pointer-events: none;
            opacity: 0;
            transform: translate(-50%, 5px);
            transition: opacity 0.15s ease, transform 0.15s ease;
            z-index: 10;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .seek-tooltip.visible {
            opacity: 1;
            transform: translate(-50%, 0);
        }


        /* Resize Handle at Top - Overlay */
        .resize-handle {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            cursor: ns-resize;
            z-index: 9999;
            background: transparent;
        }

        /* Header - Draggable */
        .header {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 12px;
            background: ${t.headerBg};
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            flex-shrink: 0;
            cursor: grab;
            user-select: none;
            -webkit-app-region: drag;
            app-region: drag;
        }

        .header:active {
            cursor: grabbing;
        }

        .album-art {
            width: 40px;
            height: 40px;
            border-radius: 6px;
            object-fit: cover;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.5);
            flex-shrink: 0;
            -webkit-app-region: no-drag;
            app-region: no-drag;
        }

        .track-info {
            flex: 1;
            min-width: 0;
        }

        .track-title {
            font-size: 12px;
            font-weight: 600;
            color: #fff;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 1px;
        }

        .track-artist {
            font-size: 10px;
            font-weight: 400;
            color: rgba(255, 255, 255, 0.55);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* Header Buttons */
        .header-btns {
            display: flex;
            align-items: center;
            gap: 2px;
            -webkit-app-region: no-drag;
            app-region: no-drag;
        }

        .header-icon-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            background: none;
            border: none;
            color: #fff;
            opacity: 0.4;
            cursor: pointer;
            transition: opacity 0.15s;
            padding: 4px;
        }

        .header-icon-btn:hover {
            opacity: 0.8;
        }

        .header-icon-btn svg {
            width: 14px;
            height: 14px;
            fill: currentColor;
        }

        .menu-btn {
            display: flex;
            flex-direction: column;
            gap: 2px;
            padding: 6px 4px;
            cursor: pointer;
            opacity: 0.4;
            transition: opacity 0.15s;
            background: none;
            border: none;
        }

        .menu-btn:hover {
            opacity: 0.8;
        }

        .menu-row {
            display: flex;
            gap: 2px;
        }

        .menu-dot {
            width: 2px;
            height: 2px;
            background: #fff;
            border-radius: 50%;
        }

        /* Compact Mode Override */
        body.compact-mode .lyrics-wrap {
            display: none !important;
        }

        body.compact-mode .footer {
            display: none !important;
        }

        .close-btn {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.4);
            font-size: 18px;
            cursor: pointer;
            padding: 4px 6px;
            transition: all 0.15s;
            line-height: 1;
        }

        .close-btn:hover {
            color: #ff5f5f;
        }

        .close-btn.hidden {
            display: none;
        }

        /* Settings Panel - Full Overlay */
        .settings-panel {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(10, 10, 15, 0.98);
            z-index: 1000;
            display: none;
            flex-direction: column;
            -webkit-app-region: no-drag;
            app-region: no-drag;
            overflow-y: auto;
        }

        .settings-panel.open {
            display: flex;
            animation: panelSlide 0.2s ease;
        }

        @keyframes panelSlide {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .settings-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            flex-shrink: 0;
        }

        .settings-title {
            font-size: 16px;
            font-weight: 600;
            color: #fff;
        }

        .settings-close {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: #fff;
            width: 32px;
            height: 32px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.15s;
        }

        .settings-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .settings-content {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
        }

        .menu-section-title {
            font-size: 11px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.4);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 12px;
            margin-top: 8px;
        }

        .menu-section-title:first-child {
            margin-top: 0;
        }

        .menu-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 14px;
            cursor: pointer;
            transition: background 0.1s;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 10px;
            margin-bottom: 8px;
        }

        .menu-item:hover {
            background: rgba(255, 255, 255, 0.08);
        }

        .menu-item-label {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.85);
        }

        .menu-item-slider {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 14px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 10px;
            margin-bottom: 8px;
        }

        .menu-item-slider .slider {
            flex: 1;
        }


        .menu-toggle {
            width: 44px;
            height: 24px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 12px;
            position: relative;
            transition: background 0.2s;
        }

        .menu-toggle.on {
            background: var(--accent);
        }

        .menu-toggle::after {
            content: '';
            position: absolute;
            top: 3px;
            left: 3px;
            width: 18px;
            height: 18px;
            background: #fff;
            border-radius: 50%;
            transition: transform 0.2s;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .menu-toggle.on::after {
            transform: translateX(20px);
        }

        .menu-divider {
            height: 1px;
            background: rgba(255, 255, 255, 0.08);
            margin: 16px 0;
        }

        /* Theme Button */
        .theme-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
            padding: 12px 14px;
            background: rgba(255, 255, 255, 0.03);
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: background 0.15s;
        }

        .theme-btn:hover {
            background: rgba(255, 255, 255, 0.08);
        }

        .theme-btn-preview {
            font-size: 20px;
        }

        .theme-btn-info {
            flex: 1;
            text-align: left;
        }

        .theme-btn-label {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.4);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .theme-btn-name {
            font-size: 13px;
            font-weight: 500;
            color: #fff;
        }

        .theme-btn-arrow {
            color: rgba(255, 255, 255, 0.4);
            font-size: 18px;
        }

        /* Theme Picker Panel */
        .theme-picker {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(8, 8, 12, 0.98);
            z-index: 1001;
            display: none;
            flex-direction: column;
        }

        .theme-picker.open {
            display: flex;
            animation: panelSlide 0.2s ease;
        }

        .theme-picker-header {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 14px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            flex-shrink: 0;
        }

        .theme-picker-back {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: #fff;
            width: 28px;
            height: 28px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.15s;
        }

        .theme-picker-back:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .theme-picker-title {
            font-size: 14px;
            font-weight: 600;
            color: #fff;
        }

        .theme-grid {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            align-content: start;
        }

        .theme-grid::-webkit-scrollbar { width: 4px; }
        .theme-grid::-webkit-scrollbar-thumb { 
            background: rgba(255, 255, 255, 0.15); 
            border-radius: 2px; 
        }

        .theme-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            padding: 10px 4px;
            cursor: pointer;
            transition: all 0.15s;
            font-size: 10px;
            color: rgba(255, 255, 255, 0.6);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.03);
            border: 2px solid transparent;
        }

        .theme-item:hover {
            background: rgba(255, 255, 255, 0.08);
            color: #fff;
        }

        .theme-item.active {
            background: rgba(255, 255, 255, 0.1);
            border-color: var(--accent);
            color: #fff;
        }

        .theme-emoji { font-size: 20px; }
        .theme-name { 
            font-weight: 500; 
            text-align: center;
            line-height: 1.2;
        }



        /* Controls */
        .controls {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
            background: ${t.controlsBg};
            flex-shrink: 0;
            -webkit-app-region: no-drag;
            app-region: no-drag;
        }

        .ctrl-left, .ctrl-right {
            display: flex;
            align-items: center;
            width: 32px;
            flex-shrink: 0;
        }

        .ctrl-right {
            justify-content: flex-end;
        }

        .ctrl-center {
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1;
            min-width: 0;
            gap: 12px;
        }

        .ctrl-btn {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.6);
            width: 32px;
            height: 32px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.15s ease;
            flex-shrink: 0;
        }

        .ctrl-btn:hover {
            color: #fff;
            transform: scale(1.1);
            filter: drop-shadow(0 0 6px var(--text-glow));
        }

        .ctrl-btn:active {
            transform: scale(0.95);
        }

        .ctrl-btn svg {
            width: 16px;
            height: 16px;
            fill: currentColor;
        }

        .ctrl-btn.play-btn {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: #121212;
            position: relative;
            padding: 0;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.2s ease;
        }

        .ctrl-btn.play-btn:hover {
            transform: scale(1.08);
            box-shadow: 0 0 20px var(--text-glow);
            border-color: var(--accent);
        }

        .vinyl-record {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: radial-gradient(circle, #2c2c2c 0%, #121212 40%, #0a0a0a 60%, #1c1c1c 80%, #000000 100%);
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: spin 5s linear infinite;
            animation-play-state: paused;
        }

        .vinyl-record::before {
            content: '';
            position: absolute;
            width: 90%;
            height: 90%;
            border-radius: 50%;
            border: 1px dashed rgba(255, 255, 255, 0.08);
            pointer-events: none;
        }

        .vinyl-img {
            width: 42%;
            height: 42%;
            border-radius: 50%;
            object-fit: cover;
            z-index: 1;
        }

        .vinyl-center {
            position: absolute;
            width: 10%;
            height: 10%;
            border-radius: 50%;
            background: #1e1e1e;
            border: 1px solid #000;
            z-index: 2;
        }

        .play-icon-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.4);
            opacity: 0;
            transition: opacity 0.2s ease;
            border-radius: 50%;
            z-index: 3;
        }

        .ctrl-btn.play-btn:hover .play-icon-overlay,
        .ctrl-btn.play-btn.paused .play-icon-overlay {
            opacity: 1;
        }

        .play-icon-overlay svg {
            width: 14px;
            height: 14px;
            fill: #ffffff;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .ctrl-btn.shuffle-on {
            color: var(--accent);
        }

        .ctrl-btn.liked {
            color: var(--accent);
        }

        .ctrl-btn.liked svg {
            fill: var(--accent);
        }

        .ctrl-btn.hidden {
            display: none;
        }

        /* Previous and Next Navigation Track Metadata */
        .track-nav-info {
            display: flex;
            align-items: center;
            gap: 6px;
            flex: 1;
            min-width: 0;
            user-select: none;
            margin: 0 4px;
        }

        .track-nav-text {
            display: flex;
            flex-direction: column;
            min-width: 0;
            flex: 1;
        }

        #prevTrackContainer {
            flex-direction: row;
            justify-content: flex-end;
            text-align: right;
        }

        #nextTrackContainer {
            flex-direction: row-reverse;
            justify-content: flex-end;
            text-align: left;
        }

        #prevTrackContainer .track-nav-text {
            align-items: flex-end;
        }

        #nextTrackContainer .track-nav-text {
            align-items: flex-start;
        }

        .nav-album-art {
            width: 24px;
            height: 24px;
            border-radius: 4px;
            object-fit: cover;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            flex-shrink: 0;
            display: none;
        }

        
        .track-nav-label {
            font-size: 8px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.4);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 2px;
        }
        
        .track-nav-scroll {
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
        }
        
        .track-nav-title {
            display: inline-block;
            font-size: 10px;
            font-weight: 500;
            color: #ffffff;
            white-space: nowrap;
        }
        
        .track-nav-artist {
            font-size: 8.5px;
            color: rgba(255, 255, 255, 0.5);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-top: 1px;
        }

        /* Lyrics Container */
        .lyrics-wrap {
            flex: 1 1 auto;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 12px;
            scroll-behavior: smooth;
            -webkit-app-region: no-drag;
            app-region: no-drag;
            min-height: 0;
        }

        .lyrics-wrap.centered {
            text-align: center;
        }

        .lyrics-wrap.centered .lyric {
            transform-origin: center center;
        }

        .lyrics-wrap.collapsed {
            display: none;
        }

        .lyrics-wrap::-webkit-scrollbar {
            display: none;
        }

        .lyrics-wrap {
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE/Edge */
        }

        .lyric {
            padding: 5px 0;
            opacity: 0.3;
            transition: all 0.2s ease;
            cursor: pointer;
            line-height: 1.35;
            transform-origin: left center;
        }

        .lyric:hover {
            opacity: 0.5;
        }

        .lyric.active {
            opacity: 1;
            color: var(--accent);
            font-weight: 500;
            transform: scale(1.02);
            text-shadow: 0 0 20px var(--text-glow);
        }

        .lyric.past {
            opacity: 0.4;
        }

        /* No Lyrics / Loading */
        .status-msg {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            text-align: center;
            padding: 20px;
            opacity: 0.6;
        }

        .status-msg .icon {
            font-size: 40px;
            margin-bottom: 12px;
        }

        .status-msg .text {
            font-size: 15px;
            font-weight: 500;
        }

        .status-msg .subtext {
            font-size: 12px;
            opacity: 0.6;
            margin-top: 4px;
        }

        .spinner {
            width: 32px;
            height: 32px;
            border: 3px solid rgba(255, 255, 255, 0.1);
            border-top-color: var(--accent);
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Footer */
        .footer {
            background: ${t.footerBg};
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            flex-shrink: 0;
            padding: 6px 10px;
            -webkit-app-region: no-drag;
            app-region: no-drag;
        }

        /* Hide footer when all rows are collapsed */
        .footer:not(:has(.footer-row:not(.collapsed))) {
            display: none;
        }

        .footer-row {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .footer-row.collapsed {
            display: none;
        }

        .footer-row.collapsed + .footer-row:not(.collapsed) {
            /* No extra spacing when previous row is collapsed */
        }

        .footer-row:not(.collapsed) + .footer-row:not(.collapsed) {
            margin-top: 6px;
            padding-top: 6px;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .control-label, #volumeIconWrap {
            font-size: 9px;
            color: rgba(255, 255, 255, 0.4);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            min-width: 32px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }

        .slider {
            -webkit-appearance: none;
            flex: 1;
            height: 3px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 2px;
            outline: none;
        }

        .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 10px;
            height: 10px;
            background: var(--accent);
            border-radius: 50%;
            cursor: pointer;
            transition: transform 0.1s;
            box-shadow: 0 0 6px var(--text-glow);
        }

        .slider::-webkit-slider-thumb:hover {
            transform: scale(1.2);
        }

        .volume-icon {
            width: 14px;
            height: 14px;
            fill: rgba(255, 255, 255, 0.5);
            flex-shrink: 0;
            cursor: pointer;
            transition: fill 0.15s;
        }

        .volume-icon:hover {
            fill: #fff;
        }

        .value-display {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.5);
            min-width: 28px;
            text-align: right;
        }

        /* Progress Slider Container */
        .progress-container {
            padding: 4px 12px;
            width: 100%;
            height: 28px;
            display: flex;
            align-items: center;
            position: relative;
            background: ${t.controlsBg};
            flex-shrink: 0;
            -webkit-app-region: no-drag;
            app-region: no-drag;
        }

        .waveform-canvas {
            width: calc(100% - 24px);
            height: calc(100% - 8px);
            position: absolute;
            left: 12px;
            top: 4px;
            pointer-events: none;
            z-index: 1;
        }

        .progress-slider {
            -webkit-appearance: none;
            width: 100%;
            height: 100%;
            background: transparent;
            outline: none;
            cursor: pointer;
            position: relative;
            z-index: 2;
        }

        .progress-slider::-webkit-slider-runnable-track {
            background: transparent;
            border: none;
        }

        .progress-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 4px;
            height: 18px;
            background: #ffffff;
            border-radius: 2px;
            cursor: pointer;
            box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
            transition: transform 0.1s;
        }

        .progress-slider::-webkit-slider-thumb:hover {
            transform: scale(1.3);
        }

        /* ==================== RESPONSIVE LAYOUT (iOS Style Widgets) ==================== */
        @media (max-width: 290px) {
            .track-nav-text {
                display: none !important; /* Hide track title/artist text to prevent overlap */
            }
            .nav-album-art {
                display: block !important;
                width: 22px;
                height: 22px;
                border-radius: 50% !important; /* Circular bubble album art */
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
                transition: transform 0.2s;
            }
            #prevTrackContainer, #nextTrackContainer {
                padding: 4px;
                background: rgba(255, 255, 255, 0.08);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 30px;
                height: 30px;
                flex-shrink: 0;
            }
            #prevTrackContainer:hover, #nextTrackContainer:hover {
                background: rgba(255, 255, 255, 0.15);
                transform: scale(1.08);
            }
            .ctrl-center {
                gap: 8px;
            }
        }

        @media (max-width: 210px) {
            #prevTrackContainer, #nextTrackContainer {
                display: none !important; /* Hide preview album arts completely if extremely narrow */
            }
            .ctrl-center {
                gap: 6px;
                justify-content: center;
            }
        }

        @media (max-width: 250px) {
            .footer-row {
                gap: 4px;
            }
            .control-label, #volumeIconWrap {
                min-width: 24px;
                font-size: 8px;
            }
            .value-display {
                min-width: 22px;
                font-size: 9px;
            }
        }
    `;
    }

    // ==================== AUDIO ANALYSIS & WAVEFORM ====================
    function generateMockWaveform() {
        const dataPoints = 80;
        let processedData = new Array(dataPoints).fill(0);
        for (let i = 0; i < dataPoints; i++) {
            const progress = i / dataPoints;
            const shape = Math.sin(progress * Math.PI); 
            const noise = 0.18 * Math.sin(progress * Math.PI * 12) * Math.cos(progress * Math.PI * 4);
            const subNoise = 0.08 * Math.sin(progress * Math.PI * 32);
            const loudness = Math.max(0.08, shape * 0.65 + noise + subNoise);
            processedData[i] = Math.min(1, loudness);
        }
        return processedData;
    }

    async function fetchAudioAnalysis(trackUri) {
        if (!trackUri) throw new Error("Invalid track URI");
        const trackId = trackUri.split(':').pop();
        
        // Skip API request for local files
        if (trackUri.includes(':local:')) {
            console.log('[Lyric Miniplayer] Local track detected, using mock waveform');
            return generateMockWaveform();
        }

        let response;
        try {
            response = await Spicetify.CosmosAsync.get(`https://api.spotify.com/v1/audio-analysis/${trackId}`);
            return processAudioAnalysis(response);
        } catch (e) {
            console.warn('[Lyric Miniplayer] CosmosAsync audio-analysis failed, trying fetch with Session token:', e);
            try {
                const token = Spicetify.Platform?.Session?.accessToken;
                const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
                const res = await fetch(`https://api.spotify.com/v1/audio-analysis/${trackId}`, { headers });
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                response = await res.json();
                return processAudioAnalysis(response);
            } catch (err2) {
                console.warn('[Lyric Miniplayer] All audio-analysis APIs failed, using beautiful generated mock waveform:', err2);
                return generateMockWaveform();
            }
        }
    }

    function processAudioAnalysis(analysisData) {
        if (!analysisData || !analysisData.segments || !analysisData.track) {
            throw new Error("Invalid audio analysis data");
        }
        const segments = analysisData.segments;
        const duration = analysisData.track.duration;
        const dataPoints = 80; // SoundCloud-like clean waveform look
        const segmentDuration = duration / dataPoints;
        const contrastFactor = 4.0;
        let processedData = new Array(dataPoints).fill(0);
        
        segments.forEach(segment => {
            const startIndex = Math.floor(segment.start / segmentDuration);
            const endIndex = Math.min(Math.floor((segment.start + segment.duration) / segmentDuration), dataPoints - 1);
            const normalizedLoudness = 1 - (Math.min(Math.max(segment.loudness_max, -40), 0) / -40);
            const adjustedLoudness = Math.pow(normalizedLoudness, contrastFactor);
            for (let i = startIndex; i <= endIndex; i++) {
                processedData[i] = Math.max(processedData[i], adjustedLoudness);
            }
        });
        return processedData;
    }

    function drawWaveformLoading(canvas) {
        if (!canvas || pipWindow?.closed) return;
        
        // Dynamically set resolution matching layout size
        if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        if (width === 0 || height === 0) {
            // Layout is not rendered/computed yet, retry on next frame
            loadingAnimationFrame = requestAnimationFrame(() => drawWaveformLoading(canvas));
            return;
        }

        ctx.clearRect(0, 0, width, height);

        const barCount = 40; // Fewer bars for cleaner loading look
        const barWidth = width / (barCount * 2);
        const maxBarHeight = height * 2;
        const animationSpeed = 0.002;
        const time = Date.now() * animationSpeed;

        let disabledColor = 'rgba(255, 255, 255, 0.35)';
        try {
            disabledColor = getComputedStyle(pipWindow.document.documentElement)
                .getPropertyValue('--spice-button-disabled').trim() || 'rgba(255, 255, 255, 0.35)';
        } catch(e) {}
        ctx.fillStyle = disabledColor;

        const fillWidth = Math.max(1.5, barWidth * 0.7);

        for (let i = 0; i < barCount; i++) {
            const x = (i * 2 + 0.5) * barWidth;
            const waveFrequency = 0.15;
            const waveAmplitude = 0.5;
            const baseHeight = 0.1;
            const wave1 = Math.sin(time + i * waveFrequency) * waveAmplitude;
            const wave2 = Math.sin(time * 1.5 + i * waveFrequency * 0.5) * (waveAmplitude * 0.5);
            const wave3 = Math.sin(time * 0.5 + i * waveFrequency * 0.25) * (waveAmplitude * 0.25);
            const combinedWave = (wave1 + wave2 + wave3) / 3 + baseHeight;
            const barHeight = combinedWave * maxBarHeight;
            const y = (height - barHeight) / 2;
            ctx.fillRect(x, y, fillWidth, barHeight);
        }

        loadingAnimationFrame = requestAnimationFrame(() => drawWaveformLoading(canvas));
    }

    function drawWaveform(canvas, progress = 0) {
        if (!canvas || !currentWaveformData || pipWindow?.closed) return;

        // Dynamically set resolution matching layout size
        if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        if (width === 0 || height === 0) return; // Layout not ready yet

        ctx.clearRect(0, 0, width, height);

        const activeTheme = THEMES[currentTheme];
        const progressColor = activeTheme ? activeTheme.accent : '#1db954';
        
        let disabledColor = 'rgba(255, 255, 255, 0.35)';
        try {
            disabledColor = getComputedStyle(pipWindow.document.documentElement)
                .getPropertyValue('--spice-button-disabled').trim() || 'rgba(255, 255, 255, 0.35)';
        } catch(e) {}

        const barWidth = width / currentWaveformData.length;
        const fillWidth = Math.max(1.5, barWidth * 0.7); // 70% bar width, 30% gap (at least 1.5px bar width)

        currentWaveformData.forEach((loudness, index) => {
            const x = index * barWidth;
            const barHeight = loudness * height * 0.8;
            const y = (height - barHeight) / 2;
            
            if (x <= progress * width) {
                ctx.fillStyle = progressColor;
            } else {
                ctx.fillStyle = disabledColor;
            }
            
            ctx.fillRect(x, y, fillWidth, barHeight);
        });
        waveformDrawn = true;
    }

    async function loadWaveform(trackUri) {
        if (!pipWindow || pipWindow.closed) return;
        const canvas = pipWindow.document.getElementById('waveformCanvas');
        if (!canvas) return;

        if (loadingAnimationFrame) {
            cancelAnimationFrame(loadingAnimationFrame);
            loadingAnimationFrame = null;
        }

        currentWaveformData = null;
        waveformDrawn = false;

        drawWaveformLoading(canvas);

        try {
            currentWaveformData = await fetchAudioAnalysis(trackUri);
            if (loadingAnimationFrame) {
                cancelAnimationFrame(loadingAnimationFrame);
                loadingAnimationFrame = null;
            }
            const progress = Spicetify.Player.getProgress() || 0;
            const duration = Spicetify.Player.getDuration() || 0;
            const ratio = duration > 0 ? (progress / duration) : 0;
            drawWaveform(canvas, ratio);
        } catch (err) {
            console.error('[Lyric Miniplayer] Failed to load audio analysis:', err);
            if (loadingAnimationFrame) {
                cancelAnimationFrame(loadingAnimationFrame);
                loadingAnimationFrame = null;
            }
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    // ==================== LYRICS FETCHING ====================
    async function fetchLyrics(trackUri) {
        try {
            const trackId = trackUri.split(':').pop();
            
            // Method 1: Color Lyrics API
            try {
                const response = await Spicetify.CosmosAsync.get(
                    `https://spclient.wg.spotify.com/color-lyrics/v2/track/${trackId}?format=json&market=from_token`
                );
                if (response?.lyrics?.lines) {
                    return {
                        synced: response.lyrics.syncType === 'LINE_SYNCED',
                        lines: response.lyrics.lines.map(line => ({
                            startTime: parseInt(line.startTimeMs),
                            text: line.words || ''
                        }))
                    };
                }
            } catch (e) {}

            // Method 2: Platform Lyrics API
            if (Spicetify.Platform?.Lyrics) {
                try {
                    const lyrics = await Spicetify.Platform.Lyrics.getLyrics(trackUri);
                    if (lyrics?.lines) {
                        return {
                            synced: true,
                            lines: lyrics.lines.map(line => ({
                                startTime: line.startTimeMs || 0,
                                text: line.words || line.text || ''
                            }))
                        };
                    }
                } catch (e) {}
            }

            // Method 3: Legacy endpoint
            try {
                const altResponse = await Spicetify.CosmosAsync.get(
                    `wg://lyrics/v1/track/${trackId}?format=json&market=from_token`
                );
                if (altResponse?.lines) {
                    return {
                        synced: true,
                        lines: altResponse.lines.map(line => ({
                            startTime: parseInt(line.startTimeMs || line.time || 0),
                            text: line.words || line.text || ''
                        }))
                    };
                }
            } catch (e) {}

            return null;
        } catch (error) {
            console.error('[Lyric Miniplayer] Error fetching lyrics:', error);
            return null;
        }
    }

    // ==================== PIP WINDOW CREATION ====================
    async function openPictureInPicture() {
        // Close existing PiP window if open
        if (pipWindow && !pipWindow.closed) {
            pipWindow.close();
            pipWindow = null;
            return;
        }

        // Reset track URI to force fresh lyrics load
        currentTrackUri = null;

        // Load compact state and width
        let isCompactMode = false;
        let savedWidth = CONFIG.pipWidth;
        try {
            isCompactMode = localStorage.getItem('lyrics-overlay-compact') === 'true';
            const w = localStorage.getItem('lyrics-overlay-width');
            if (w) savedWidth = parseInt(w);
        } catch(e) {}
        const initialHeight = isCompactMode ? 160 : CONFIG.pipHeight;

        // Check for Document Picture-in-Picture API (Chrome 116+)
        if ('documentPictureInPicture' in window) {
            try {
                pipWindow = await window.documentPictureInPicture.requestWindow({
                    width: savedWidth,
                    height: initialHeight,
                });

                setupPipWindow(pipWindow);
                return;
            } catch (err) {
                console.log('[Lyric Miniplayer] Document PiP failed, trying fallback:', err);
            }
        }

        // Fallback: Regular popup window
        try {
            const left = window.screen.width - savedWidth - 30;
            const top = 30;

            pipWindow = window.open(
                'about:blank',
                'LyricsOverlayPiP',
                `width=${savedWidth},height=${initialHeight},left=${left},top=${top},resizable=yes,scrollbars=no,toolbar=no,menubar=no,location=no,status=no`
            );

            if (pipWindow) {
                setupPipWindow(pipWindow);
            } else {
                Spicetify.showNotification('Could not open lyrics window.', true);
            }
        } catch (err) {
            console.error('[Lyric Miniplayer] Fallback popup failed:', err);
            Spicetify.showNotification('Could not open lyrics window', true);
        }
    }

    function getVolumeIconSvg(volume) {
        if (volume === 0) {
            return `<svg viewBox="0 0 16 16" class="volume-icon" id="volumeIcon">
                <path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z"/>
                <path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.642 3.642 0 0 0-1.33 4.967 3.639 3.639 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.73 4.73 0 0 1-1.5-.694v1.3L2.817 9.852a2.141 2.141 0 0 1-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694V1.5z"/>
            </svg>`;
        } else if (volume < 50) {
            return `<svg viewBox="0 0 16 16" class="volume-icon" id="volumeIcon">
                <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"/>
            </svg>`;
        } else {
            return `<svg viewBox="0 0 16 16" class="volume-icon" id="volumeIcon">
                <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 6.087a4.502 4.502 0 0 0 0-8.474v1.65a2.999 2.999 0 0 1 0 5.175v1.649z"/>
            </svg>`;
        }
    }

    function generateThemeMenuItems() {
        return Object.entries(THEMES).map(([key, theme]) => 
            `<div class="theme-item ${key === currentTheme ? 'active' : ''}" data-theme="${key}">
                <span class="theme-emoji">${theme.emoji}</span>
                <span class="theme-name">${theme.name}</span>
            </div>`
        ).join('');
    }

    function setupPipWindow(win) {
        const doc = win.document;
        const currentVolume = Math.round((Spicetify.Player.getVolume() || 0) * 100);

        // Build the HTML
        doc.write(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>♫ Lyrics</title>
    <style id="themeStyles">${generateStyles(currentTheme)}</style>
</head>
<body>
    <img class="bg-album-art fade-transition" id="bgAlbumArt" src="" alt="">
    <div class="resize-handle" id="resizeHandle" title="Drag to resize"></div>
    <div class="header" id="dragHeader" title="Drag to move window">
        <img class="album-art fade-transition" id="albumArt" src="" alt="">
        <div class="track-info">
            <div class="track-title fade-transition" id="trackTitle">Loading...</div>
            <div class="track-artist fade-transition" id="trackArtist">-</div>
        </div>
        <div class="header-btns">
            <button class="header-icon-btn" id="compactBtn" title="Toggle Compact Mode">
                <svg viewBox="0 0 16 16" id="compactIcon"></svg>
            </button>
            <button class="menu-btn" id="menuBtn" title="Settings">
                <div class="menu-row">
                    <div class="menu-dot"></div>
                    <div class="menu-dot"></div>
                </div>
                <div class="menu-row">
                    <div class="menu-dot"></div>
                    <div class="menu-dot"></div>
                </div>
                <div class="menu-row">
                    <div class="menu-dot"></div>
                    <div class="menu-dot"></div>
                </div>
            </button>
            <button class="close-btn ${showCloseBtn ? '' : 'hidden'}" id="closeBtn" title="Close">×</button>
        </div>
    </div>

    <!-- Settings Panel - Full Screen -->
    <div class="settings-panel" id="settingsPanel">
        <div class="settings-header">
            <span class="settings-title">⚙️ Settings</span>
            <button class="settings-close" id="settingsClose">✕</button>
        </div>
        <div class="settings-content">
            <button class="theme-btn" id="openThemePicker">
                <span class="theme-btn-preview" id="currentThemeEmoji">${THEMES[currentTheme].emoji}</span>
                <div class="theme-btn-info">
                    <div class="theme-btn-label">Theme</div>
                    <div class="theme-btn-name" id="currentThemeName">${THEMES[currentTheme].name}</div>
                </div>
                <span class="theme-btn-arrow">›</span>
            </button>
            
            <div class="menu-divider"></div>
            
            <div class="menu-section-title">📺 Display</div>
            <div class="menu-item" id="toggleLyricsItem">
                <span class="menu-item-label">Show Lyrics</span>
                <div class="menu-toggle ${showLyrics ? 'on' : ''}" id="toggleLyrics"></div>
            </div>
            <div class="menu-item" id="toggleCenterItem">
                <span class="menu-item-label">Center Lyrics</span>
                <div class="menu-toggle ${centerLyrics ? 'on' : ''}" id="toggleCenter"></div>
            </div>
            <div class="menu-item" id="toggleShuffleItem">
                <span class="menu-item-label">Shuffle Button</span>
                <div class="menu-toggle ${showShuffleBtn ? 'on' : ''}" id="toggleShuffle"></div>
            </div>
            <div class="menu-item" id="toggleLikeItem">
                <span class="menu-item-label">Like Button</span>
                <div class="menu-toggle ${showLikeBtn ? 'on' : ''}" id="toggleLike"></div>
            </div>
            <div class="menu-item" id="toggleCloseItem">
                <span class="menu-item-label">Close Button</span>
                <div class="menu-toggle ${showCloseBtn ? 'on' : ''}" id="toggleClose"></div>
            </div>
            <div class="menu-item" id="toggleFontItem">
                <span class="menu-item-label">Font Size Slider</span>
                <div class="menu-toggle ${showFontSlider ? 'on' : ''}" id="toggleFont"></div>
            </div>
            <div class="menu-item" id="toggleVolItem">
                <span class="menu-item-label">Volume Slider</span>
                <div class="menu-toggle ${showVolumeSlider ? 'on' : ''}" id="toggleVol"></div>
            </div>
            
            <div class="menu-divider"></div>
            
            <div class="menu-section-title">✨ Transparency</div>
            <div class="menu-item-slider">
                <span class="menu-item-label" style="min-width: 60px;">Opacity</span>
                <input type="range" class="slider" id="bgOpacitySlider" min="10" max="100" value="${bgOpacity}">
                <span class="value-display" id="bgOpacityValue">${bgOpacity}%</span>
            </div>
        </div>

    </div>

    <!-- Theme Picker Panel -->
    <div class="theme-picker" id="themePicker">
        <div class="theme-picker-header">
            <button class="theme-picker-back" id="themePickerBack">‹</button>
            <span class="theme-picker-title">Choose Theme</span>
        </div>
        <div class="theme-grid" id="themeGrid">
            ${generateThemeMenuItems()}
        </div>
    </div>

    <div class="lyrics-wrap fade-transition ${showLyrics ? '' : 'collapsed'} ${centerLyrics ? 'centered' : ''}" id="lyricsContainer">
        <div class="status-msg">
            <div class="spinner"></div>
        </div>
    </div>

    <!-- Seeker Progress Bar -->
    <div class="progress-container" id="progressContainer">
        <div id="seekTooltip" class="seek-tooltip">0:00</div>
        <canvas id="waveformCanvas" class="waveform-canvas"></canvas>
        <input type="range" class="progress-slider" id="progressSlider" min="0" max="100" value="0">
    </div>

    <div class="controls">
        <div class="ctrl-left">
            <button class="ctrl-btn ${showShuffleBtn ? '' : 'hidden'}" id="shuffleBtn" title="Shuffle">
                <svg viewBox="0 0 16 16" id="shuffleIcon"><path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06l2.306-2.306a.75.75 0 0 0 0-1.06L13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z"/><path d="m7.5 10.723.98-1.167 1.796 2.14a2.25 2.25 0 0 0 1.724.804h1.947l-1.017-1.018a.75.75 0 1 1 1.06-1.06l2.306 2.306a.75.75 0 0 1 0 1.06l-2.306 2.306a.75.75 0 1 1-1.06-1.06L14.109 14H12.16a3.75 3.75 0 0 1-2.873-1.34l-1.787-2.14z"/></svg>
            </button>
        </div>

        <div class="ctrl-center">
            <div class="track-nav-info" id="prevTrackContainer" title="Previous Track">
                <div class="track-nav-text">
                    <span class="track-nav-label">PREVIOUS</span>
                    <div class="track-nav-scroll">
                        <span class="track-nav-title" id="prevTrackTitle">None</span>
                    </div>
                    <span class="track-nav-artist" id="prevTrackArtist"></span>
                </div>
                <img class="nav-album-art" id="prevTrackArt" src="" alt="">
            </div>

            <button class="ctrl-btn" id="prevBtn" title="Previous">
                <svg viewBox="0 0 16 16"><path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"/></svg>
            </button>
            
            <button class="ctrl-btn play-btn paused" id="playBtn" title="Play/Pause">
                <div class="vinyl-record" id="vinylRecord">
                    <img class="vinyl-img fade-transition" id="vinylImg" src="" alt="">
                    <div class="vinyl-center"></div>
                </div>
                <div class="play-icon-overlay" id="playIconOverlay">
                    <svg viewBox="0 0 16 16" id="playIcon"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/></svg>
                </div>
            </button>

            <button class="ctrl-btn" id="nextBtn" title="Next">
                <svg viewBox="0 0 16 16"><path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"/></svg>
            </button>

            <div class="track-nav-info" id="nextTrackContainer" title="Next Track">
                <div class="track-nav-text">
                    <span class="track-nav-label">NEXT</span>
                    <div class="track-nav-scroll">
                        <span class="track-nav-title" id="nextTrackTitle">None</span>
                    </div>
                    <span class="track-nav-artist" id="nextTrackArtist"></span>
                </div>
                <img class="nav-album-art" id="nextTrackArt" src="" alt="">
            </div>
        </div>

        <div class="ctrl-right">
            <button class="ctrl-btn ${showLikeBtn ? '' : 'hidden'}" id="likeBtn" title="Save to Liked Songs">
                <svg viewBox="0 0 16 16" id="likeIcon"><path d="M1.69 2A4.582 4.582 0 0 1 8 2.023 4.583 4.583 0 0 1 11.88.817h.002a4.618 4.618 0 0 1 3.782 3.65v.003a4.543 4.543 0 0 1-1.011 3.84L9.35 14.629a1.765 1.765 0 0 1-2.093.464 1.762 1.762 0 0 1-.605-.463L1.348 8.309A4.582 4.582 0 0 1 1.689 2zm3.158.252A3.082 3.082 0 0 0 2.49 7.337l.005.005L7.8 13.664a.264.264 0 0 0 .311.069.262.262 0 0 0 .09-.069l5.312-6.33a3.043 3.043 0 0 0 .68-2.573 3.118 3.118 0 0 0-2.551-2.463 3.079 3.079 0 0 0-2.612.816l-.007.007a1.501 1.501 0 0 1-2.045 0l-.009-.008a3.082 3.082 0 0 0-2.121-.861z"/></svg>
            </button>
        </div>
    </div>
    
    <div class="footer" id="footer">
        <div class="footer-row ${showFontSlider ? '' : 'collapsed'}" id="fontRow">
            <span class="control-label">Size</span>
            <input type="range" class="slider" id="fontSlider" min="${CONFIG.minFontSize}" max="${CONFIG.maxFontSize}" value="${fontSize}">
            <span class="value-display" id="fontValue">${fontSize}px</span>
        </div>
        <div class="footer-row ${showVolumeSlider ? '' : 'collapsed'}" id="volumeRow">
            <div id="volumeIconWrap">
                ${getVolumeIconSvg(currentVolume)}
            </div>
            <input type="range" class="slider" id="volumeSlider" min="0" max="100" value="${currentVolume}">
            <span class="value-display" id="volumePercent">${currentVolume}%</span>
        </div>
    </div>
</body>
</html>`);
        doc.close();

        // Get elements
        const menuBtn = doc.getElementById('menuBtn');
        const settingsPanel = doc.getElementById('settingsPanel');
        const settingsClose = doc.getElementById('settingsClose');
        const prevBtn = doc.getElementById('prevBtn');
        const playBtn = doc.getElementById('playBtn');
        const nextBtn = doc.getElementById('nextBtn');
        const shuffleBtn = doc.getElementById('shuffleBtn');
        const likeBtn = doc.getElementById('likeBtn');
        const fontSlider = doc.getElementById('fontSlider');
        const fontValue = doc.getElementById('fontValue');
        const fontRow = doc.getElementById('fontRow');
        const volumeRow = doc.getElementById('volumeRow');
        const volumeSlider = doc.getElementById('volumeSlider');
        const volumePercent = doc.getElementById('volumePercent');
        const volumeIconWrap = doc.getElementById('volumeIconWrap');
        const lyricsContainer = doc.getElementById('lyricsContainer');
        const toggleLyricsItem = doc.getElementById('toggleLyricsItem');
        const toggleLyrics = doc.getElementById('toggleLyrics');
        const toggleCenterItem = doc.getElementById('toggleCenterItem');
        const toggleCenter = doc.getElementById('toggleCenter');
        const toggleShuffleItem = doc.getElementById('toggleShuffleItem');
        const toggleShuffle = doc.getElementById('toggleShuffle');
        const toggleLikeItem = doc.getElementById('toggleLikeItem');
        const toggleLike = doc.getElementById('toggleLike');
        const toggleCloseItem = doc.getElementById('toggleCloseItem');
        const toggleClose = doc.getElementById('toggleClose');
        const toggleFontItem = doc.getElementById('toggleFontItem');
        const toggleFont = doc.getElementById('toggleFont');
        const toggleVolItem = doc.getElementById('toggleVolItem');
        const toggleVol = doc.getElementById('toggleVol');
        const themeStyles = doc.getElementById('themeStyles');
        const openThemePickerBtn = doc.getElementById('openThemePicker');
        const currentThemeEmoji = doc.getElementById('currentThemeEmoji');
        const currentThemeName = doc.getElementById('currentThemeName');
        const themePicker = doc.getElementById('themePicker');
        
        const bgOpacitySlider = doc.getElementById('bgOpacitySlider');
        const bgOpacityValue = doc.getElementById('bgOpacityValue');
        
        // Set initial transparency value on body
        doc.body.style.setProperty('--bg-opacity', bgOpacity / 100);

        const themePickerBack = doc.getElementById('themePickerBack');
        const themeGrid = doc.getElementById('themeGrid');
        const closeBtn = doc.getElementById('closeBtn');
        const progressSlider = doc.getElementById('progressSlider');
        const progressContainer = doc.getElementById('progressContainer');
        const seekTooltip = doc.getElementById('seekTooltip');
        const prevTrackContainer = doc.getElementById('prevTrackContainer');
        const prevTrackTitle = doc.getElementById('prevTrackTitle');
        const prevTrackArtist = doc.getElementById('prevTrackArtist');
        const prevTrackArt = doc.getElementById('prevTrackArt');
        const nextTrackContainer = doc.getElementById('nextTrackContainer');
        const nextTrackTitle = doc.getElementById('nextTrackTitle');
        const nextTrackArtist = doc.getElementById('nextTrackArtist');
        const nextTrackArt = doc.getElementById('nextTrackArt');

        // Hover scrolling setup
        function setupScrollOnHover(container, textElement) {
            container.addEventListener('mouseenter', () => {
                const containerWidth = container.clientWidth;
                const textWidth = textElement.scrollWidth;
                if (textWidth > containerWidth) {
                    const scrollDistance = textWidth - containerWidth;
                    const duration = Math.max(3, scrollDistance / 20); // 20px per sec
                    textElement.style.transition = `transform ${duration}s linear`;
                    textElement.style.transform = `translateX(-${scrollDistance}px)`;
                }
            });
            container.addEventListener('mouseleave', () => {
                textElement.style.transition = 'transform 0.4s ease-out';
                textElement.style.transform = 'translateX(0)';
            });
        }
        if (prevTrackContainer && prevTrackTitle) setupScrollOnHover(prevTrackContainer, prevTrackTitle);
        if (nextTrackContainer && nextTrackTitle) setupScrollOnHover(nextTrackContainer, nextTrackTitle);

        // Progress bar seeking
        if (progressSlider) {
            progressSlider.addEventListener('mousedown', () => { progressSlider.dataset.dragging = 'true'; });
            progressSlider.addEventListener('touchstart', () => { progressSlider.dataset.dragging = 'true'; });
            progressSlider.addEventListener('mouseup', () => { progressSlider.dataset.dragging = ''; });
            progressSlider.addEventListener('touchend', () => { progressSlider.dataset.dragging = ''; });

            progressSlider.oninput = (e) => {
                const ratio = parseFloat(e.target.value) / 100;
                const canvas = doc.getElementById('waveformCanvas');
                if (canvas && currentWaveformData) {
                    drawWaveform(canvas, ratio);
                }
            };

            progressSlider.onchange = (e) => {
                progressSlider.dataset.dragging = '';
                const duration = Spicetify.Player.getDuration();
                if (duration) {
                    const targetMs = (parseFloat(e.target.value) / 100) * duration;
                    Spicetify.Player.seek(targetMs);
                }
            };
        }

        // Seekhead Tooltip Hover Logic
        if (progressContainer && seekTooltip) {
            progressContainer.addEventListener('mousemove', (e) => {
                const rect = progressContainer.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percent = Math.max(0, Math.min(1, x / rect.width));
                
                seekTooltip.style.left = `${percent * 100}%`;
                
                const duration = Spicetify.Player.getDuration();
                if (duration) {
                    const timeMs = percent * duration;
                    const totalSecs = Math.floor(timeMs / 1000);
                    const mins = Math.floor(totalSecs / 60);
                    const secs = String(totalSecs % 60).padStart(2, '0');
                    seekTooltip.textContent = `${mins}:${secs}`;
                }
                
                seekTooltip.classList.add('visible');
            });
            
            progressContainer.addEventListener('mouseleave', () => {
                seekTooltip.classList.remove('visible');
            });
        }

        // Compact mode handler
        let isCompactMode = false;
        try {
            isCompactMode = localStorage.getItem('lyrics-overlay-compact') === 'true';
            if (isCompactMode) {
                doc.body.classList.add('compact-mode');
            }
        } catch(e) {}

        const compactBtn = doc.getElementById('compactBtn');
        const compactIcon = doc.getElementById('compactIcon');

        // Listen for user resize to save width
        let resizeTimeout;
        win.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                try {
                    const currentWidth = win.outerWidth || win.innerWidth;
                    if (currentWidth && currentWidth > 100) {
                        localStorage.setItem('lyrics-overlay-width', currentWidth);
                    }
                    const canvas = doc.getElementById('waveformCanvas');
                    if (canvas && currentWaveformData) {
                        canvas.width = canvas.offsetWidth;
                        canvas.height = canvas.offsetHeight;
                        const progress = Spicetify.Player.getProgress() || 0;
                        const duration = Spicetify.Player.getDuration() || 0;
                        const ratio = duration > 0 ? (progress / duration) : 0;
                        drawWaveform(canvas, ratio);
                    }
                } catch(e) {}
            }, 300);
        });

        function updateCompactIcon() {
            if (compactIcon) {
                if (isCompactMode) {
                    compactIcon.innerHTML = `<path d="M1.5 5a.5.5 0 0 1 .5-.5h3v-3a.5.5 0 0 1 1 0v4h-4a.5.5 0 0 1-.5-.5zm13 0a.5.5 0 0 0-.5-.5h-3v-3a.5.5 0 0 0-1 0v4h4a.5.5 0 0 0 .5-.5zm-13 6a.5.5 0 0 0 .5.5h3v3a.5.5 0 0 0 1 0v-4h-4a.5.5 0 0 0-.5.5zm13 0a.5.5 0 0 1-.5.5h-3v3a.5.5 0 0 1-1 0v-4h4a.5.5 0 0 1 .5.5z"/>`;
                } else {
                    compactIcon.innerHTML = `<path d="M4 1.5a.5.5 0 0 0-1 0v3h3a.5.5 0 0 0 0-1h-2l3.25-3.25a.5.5 0 0 0-.7-.7L4.5 2.8v-1.3zm8 0a.5.5 0 0 1 1 0v3h-3a.5.5 0 0 1 0-1h2l-3.25-3.25a.5.5 0 0 1 .7-.7L11.5 2.8v-1.3zm-8 13a.5.5 0 0 1-1 0v-3h3a.5.5 0 0 1 0 1h-2l3.25 3.25a.5.5 0 0 1-.7.7L4.5 12.2v1.3zm8 0a.5.5 0 0 0 1 0v-3h-3a.5.5 0 0 0 0 1h2l-3.25 3.25a.5.5 0 0 0 .7.7L11.5 12.2v1.3z"/>`;
                }
            }
        }
        updateCompactIcon();

        if (compactBtn) {
            compactBtn.onclick = () => {
                isCompactMode = !isCompactMode;
                doc.body.classList.toggle('compact-mode', isCompactMode);
                try {
                    localStorage.setItem('lyrics-overlay-compact', isCompactMode);
                    const currentWidth = win.outerWidth || win.innerWidth || CONFIG.pipWidth;
                    if (isCompactMode) {
                        win.resizeTo(currentWidth, 160);
                    } else {
                        win.resizeTo(currentWidth, CONFIG.pipHeight);
                    }
                } catch(e) {}
                updateCompactIcon();
            };
        }

        // Close miniplayer
        closeBtn.onclick = () => {
            win.close();
        };

        // Settings panel toggle
        menuBtn.onclick = (e) => {
            e.stopPropagation();
            settingsPanel.classList.add('open');
        };

        // Close settings panel
        settingsClose.onclick = () => {
            settingsPanel.classList.remove('open');
        };

        // Open theme picker panel
        openThemePickerBtn.onclick = () => {
            themePicker.classList.add('open');
        };

        // Close theme picker (back to settings)
        themePickerBack.onclick = () => {
            themePicker.classList.remove('open');
        };

        // Theme selection
        themeGrid.onclick = (e) => {
            const themeItem = e.target.closest('.theme-item');
            if (themeItem) {
                const newTheme = themeItem.dataset.theme;
                if (newTheme && THEMES[newTheme]) {
                    currentTheme = newTheme;
                    localStorage.setItem('lyrics-overlay-theme', currentTheme);
                    
                    // Update styles
                    themeStyles.textContent = generateStyles(currentTheme);
                    
                    // Redraw waveform with new theme colors
                    const canvas = doc.getElementById('waveformCanvas');
                    if (canvas && currentWaveformData) {
                        const progress = Spicetify.Player.getProgress() || 0;
                        const duration = Spicetify.Player.getDuration() || 0;
                        const ratio = duration > 0 ? (progress / duration) : 0;
                        drawWaveform(canvas, ratio);
                    }

                    // Update theme button
                    currentThemeEmoji.textContent = THEMES[currentTheme].emoji;
                    currentThemeName.textContent = THEMES[currentTheme].name;
                    
                    // Update active state
                    doc.querySelectorAll('.theme-item').forEach(item => {
                        item.classList.toggle('active', item.dataset.theme === currentTheme);
                    });
                    
                    // Close picker after selection
                    themePicker.classList.remove('open');
                }
            }
        };


        // Toggle handlers
        toggleLyricsItem.onclick = () => {
            showLyrics = !showLyrics;
            toggleLyrics.classList.toggle('on', showLyrics);
            lyricsContainer.classList.toggle('collapsed', !showLyrics);
            localStorage.setItem('lyrics-overlay-showlyrics', showLyrics);
        };

        toggleCenterItem.onclick = () => {
            centerLyrics = !centerLyrics;
            toggleCenter.classList.toggle('on', centerLyrics);
            lyricsContainer.classList.toggle('centered', centerLyrics);
            localStorage.setItem('lyrics-overlay-centerlyrics', centerLyrics);
        };

        toggleShuffleItem.onclick = () => {
            showShuffleBtn = !showShuffleBtn;
            toggleShuffle.classList.toggle('on', showShuffleBtn);
            shuffleBtn.classList.toggle('hidden', !showShuffleBtn);
            localStorage.setItem('lyrics-overlay-showshuffle', showShuffleBtn);
        };

        toggleLikeItem.onclick = () => {
            showLikeBtn = !showLikeBtn;
            toggleLike.classList.toggle('on', showLikeBtn);
            likeBtn.classList.toggle('hidden', !showLikeBtn);
            localStorage.setItem('lyrics-overlay-showlike', showLikeBtn);
        };

        toggleCloseItem.onclick = () => {
            showCloseBtn = !showCloseBtn;
            toggleClose.classList.toggle('on', showCloseBtn);
            closeBtn.classList.toggle('hidden', !showCloseBtn);
            localStorage.setItem('lyrics-overlay-showclose', showCloseBtn);
        };

        toggleFontItem.onclick = () => {
            showFontSlider = !showFontSlider;
            toggleFont.classList.toggle('on', showFontSlider);
            fontRow.classList.toggle('collapsed', !showFontSlider);
            localStorage.setItem('lyrics-overlay-showfont', showFontSlider);
        };

        toggleVolItem.onclick = () => {
            showVolumeSlider = !showVolumeSlider;
            toggleVol.classList.toggle('on', showVolumeSlider);
            volumeRow.classList.toggle('collapsed', !showVolumeSlider);
            localStorage.setItem('lyrics-overlay-showvol', showVolumeSlider);
        };

        // Control handlers
        prevBtn.onclick = () => Spicetify.Player.back();
        playBtn.onclick = () => Spicetify.Player.togglePlay();
        nextBtn.onclick = () => Spicetify.Player.next();

        if (prevTrackContainer) {
            prevTrackContainer.style.cursor = 'pointer';
            prevTrackContainer.onclick = () => Spicetify.Player.back();
        }
        if (nextTrackContainer) {
            nextTrackContainer.style.cursor = 'pointer';
            nextTrackContainer.onclick = () => Spicetify.Player.next();
        }
        shuffleBtn.onclick = () => {
            Spicetify.Player.toggleShuffle();
            updateShuffleState();
        };

        likeBtn.onclick = () => {
            Spicetify.Player.toggleHeart();
        };

        // Update shuffle button state
        function updateShuffleState() {
            const isShuffled = Spicetify.Player.getShuffle();
            shuffleBtn.classList.toggle('shuffle-on', isShuffled);
        }
        updateShuffleState();

        // Update like icon (filled vs outline)
        function updateLikeIcon(isLiked) {
            const likeIcon = doc.getElementById('likeIcon');
            if (!likeIcon) return;
            
            likeBtn.classList.toggle('liked', isLiked);
            
            if (isLiked) {
                // Filled heart
                likeIcon.innerHTML = '<path d="M15.724 4.22A4.313 4.313 0 0 0 12.192.814a4.269 4.269 0 0 0-3.622 1.13.837.837 0 0 1-1.14 0 4.272 4.272 0 0 0-6.21 5.855l5.916 7.05a1.128 1.128 0 0 0 1.727 0l5.916-7.05a4.228 4.228 0 0 0 .945-3.577z"/>';
            } else {
                // Outline heart
                likeIcon.innerHTML = '<path d="M1.69 2A4.582 4.582 0 0 1 8 2.023 4.583 4.583 0 0 1 11.88.817h.002a4.618 4.618 0 0 1 3.782 3.65v.003a4.543 4.543 0 0 1-1.011 3.84L9.35 14.629a1.765 1.765 0 0 1-2.093.464 1.762 1.762 0 0 1-.605-.463L1.348 8.309A4.582 4.582 0 0 1 1.689 2zm3.158.252A3.082 3.082 0 0 0 2.49 7.337l.005.005L7.8 13.664a.264.264 0 0 0 .311.069.262.262 0 0 0 .09-.069l5.312-6.33a3.043 3.043 0 0 0 .68-2.573 3.118 3.118 0 0 0-2.551-2.463 3.079 3.079 0 0 0-2.612.816l-.007.007a1.501 1.501 0 0 1-2.045 0l-.009-.008a3.082 3.082 0 0 0-2.121-.861z"/>';
            }
        }

        // Check and update like state
        function updateLikeState() {
            const isLiked = Spicetify.Player.getHeart();
            updateLikeIcon(isLiked);
        }
        
        // Initial update
        updateLikeState();

        // Font size handler
        fontSlider.oninput = (e) => {
            fontSize = parseInt(e.target.value);
            fontValue.textContent = `${fontSize}px`;
            localStorage.setItem('lyrics-overlay-fontsize', fontSize);
            updatePipFontSize();
        };

        // Volume handlers
        volumeSlider.oninput = (e) => {
            const vol = parseInt(e.target.value);
            Spicetify.Player.setVolume(vol / 100);
            volumePercent.textContent = `${vol}%`;
            volumeIconWrap.innerHTML = getVolumeIconSvg(vol);
        };

        // Background Opacity handler
        if (bgOpacitySlider && bgOpacityValue) {
            bgOpacitySlider.oninput = (e) => {
                bgOpacity = parseInt(e.target.value);
                bgOpacityValue.textContent = `${bgOpacity}%`;
                localStorage.setItem('lyrics-overlay-bg-opacity', bgOpacity);
                doc.body.style.setProperty('--bg-opacity', bgOpacity / 100);
            };
        }


        // Click volume icon to mute/unmute
        volumeIconWrap.onclick = () => {
            const currentVol = Math.round((Spicetify.Player.getVolume() || 0) * 100);
            if (currentVol > 0) {
                volumeSlider.dataset.prevVolume = currentVol;
                Spicetify.Player.setVolume(0);
                volumeSlider.value = 0;
                volumePercent.textContent = '0%';
                volumeIconWrap.innerHTML = getVolumeIconSvg(0);
            } else {
                const prevVol = parseInt(volumeSlider.dataset.prevVolume) || 50;
                Spicetify.Player.setVolume(prevVol / 100);
                volumeSlider.value = prevVol;
                volumePercent.textContent = `${prevVol}%`;
                volumeIconWrap.innerHTML = getVolumeIconSvg(prevVol);
            }
        };

        // Lyrics click to seek
        lyricsContainer.onclick = (e) => {
            if (e.target.classList.contains('lyric')) {
                const time = e.target.dataset.time;
                if (time) Spicetify.Player.seek(parseInt(time));
            }
        };

        // Handle window close
        win.addEventListener('pagehide', () => {
            pipWindow = null;
        });

        // Initial update - force load lyrics for current track
        async function initialLoad() {
            const track = Spicetify.Player.data?.item;
            if (track?.uri) {
                currentTrackUri = track.uri;
                await loadLyrics(track.uri);
                loadWaveform(track.uri);
                updatePipLikeState();
            } else {
                // Retry after a short delay if track data not ready
                setTimeout(initialLoad, 200);
            }
        }
        
        updatePipContent();
        initialLoad();
        startUpdateLoop();
    }

    function updatePipContent() {
        if (!pipWindow || pipWindow.closed) return;

        const doc = pipWindow.document;
        const data = Spicetify.Player.data;
        
        if (!data?.item) return;

        const track = data.item;

        const titleEl = doc.getElementById('trackTitle');
        const artistEl = doc.getElementById('trackArtist');
        const albumArtEl = doc.getElementById('albumArt');
        const bgAlbumArtEl = doc.getElementById('bgAlbumArt');
        const vinylImg = doc.getElementById('vinylImg');

        // Check if track changed and we're not already transitioning
        if (track.uri !== currentTrackUri && !isTransitioning) {
            isTransitioning = true;

            const elementsToFade = [
                bgAlbumArtEl,
                albumArtEl,
                vinylImg,
                titleEl,
                artistEl,
                doc.getElementById('lyricsContainer')
            ].filter(Boolean);

            // 1. Add fade-out class to trigger CSS transition
            elementsToFade.forEach(el => el.classList.add('fade-out'));

            // 2. Perform updates after fade out completes (250ms)
            setTimeout(async () => {
                currentTrackUri = track.uri;
                
                // Update elements content
                if (titleEl) titleEl.textContent = track.name || 'Unknown';
                if (artistEl) artistEl.textContent = track.artists?.map(a => a.name).join(', ') || 'Unknown';
                if (albumArtEl) {
                    const imgUrl = track.album?.images?.[0]?.url || track.metadata?.image_url || '';
                    albumArtEl.src = imgUrl;
                    if (bgAlbumArtEl) bgAlbumArtEl.src = imgUrl;
                    if (vinylImg) vinylImg.src = imgUrl;
                }

                await loadLyrics(track.uri);
                loadWaveform(track.uri);
                updatePipLikeState();

                // Update prev/next track info
                updatePrevNextTracks();

                // 3. Remove fade-out class to fade back in
                elementsToFade.forEach(el => el.classList.remove('fade-out'));
                
                isTransitioning = false;
            }, 250);
        } else if (!isTransitioning) {
            // Regular updates (non-track change)
            if (titleEl && titleEl.textContent !== track.name) titleEl.textContent = track.name || 'Unknown';
            if (artistEl) {
                const artistsStr = track.artists?.map(a => a.name).join(', ') || 'Unknown';
                if (artistEl.textContent !== artistsStr) artistEl.textContent = artistsStr;
            }
            if (albumArtEl) {
                const imgUrl = track.album?.images?.[0]?.url || track.metadata?.image_url || '';
                if (albumArtEl.getAttribute('src') !== imgUrl) {
                    albumArtEl.src = imgUrl;
                    if (bgAlbumArtEl) bgAlbumArtEl.src = imgUrl;
                    if (vinylImg) vinylImg.src = imgUrl;
                }
            }
            // Update prev/next track info
            updatePrevNextTracks();
        }

        // Update play button
        updatePipPlayButton();

        // Update volume
        updatePipVolume();

        // Update progress
        updatePipProgress();
    }

    function updatePipProgress() {
        if (!pipWindow || pipWindow.closed) return;
        const doc = pipWindow.document;
        const progressSlider = doc.getElementById('progressSlider');
        const canvas = doc.getElementById('waveformCanvas');
        if (!progressSlider) return;

        const progress = Spicetify.Player.getProgress() || 0;
        const duration = Spicetify.Player.getDuration() || 0;
        const ratio = duration > 0 ? (progress / duration) : 0;

        // Dirty check for progress ratio (round to 3 decimal places to prevent microscopic rendering loops)
        const roundedRatio = Math.round(ratio * 1000) / 1000;
        if (roundedRatio === lastProgressRatio) return;
        lastProgressRatio = roundedRatio;

        if (doc.activeElement !== progressSlider && progressSlider.dataset.dragging !== 'true') {
            progressSlider.value = ratio * 100;
        }

        if (canvas && currentWaveformData && !loadingAnimationFrame) {
            drawWaveform(canvas, ratio);
        }
    }

    const metadataCache = {};

    async function fetchTrackMetadata(uri) {
        if (!uri) return null;
        if (metadataCache[uri]) return metadataCache[uri];

        try {
            const trackId = uri.split(':').pop();

            // Try internal WebGate metadata endpoint
            try {
                const res = await Spicetify.CosmosAsync.get(`wg://metadata/v1/track/${trackId}`);
                if (res && (res.name || res.title)) {
                    const artistArr = res.artists || res.artist || [];
                    let imgUrl = '';
                    if (res.album?.cover?.uri) {
                        const hash = res.album.cover.uri.split(':').pop();
                        imgUrl = `https://i.scdn.co/image/${hash}`;
                    } else if (res.album?.cover_group?.image?.[0]?.file_id) {
                        imgUrl = `https://i.scdn.co/image/${res.album.cover_group.image[0].file_id}`;
                    }
                    const data = {
                        title: res.name || res.title,
                        artist: Array.isArray(artistArr) ? artistArr.map(a => a.name).join(', ') : (artistArr.name || artistArr || ''),
                        image: imgUrl
                    };
                    metadataCache[uri] = data;
                    return data;
                }
            } catch (e) {}

            // Try manual fetch / CosmosAsync Web API call with Session token
            try {
                const token = Spicetify.Platform?.Session?.accessToken;
                const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
                const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, { headers }).then(r => r.json());

                if (res && res.name) {
                    const data = {
                        title: res.name,
                        artist: res.artists?.map(a => a.name).join(', ') || '',
                        image: res.album?.images?.[2]?.url || res.album?.images?.[0]?.url || ''
                    };
                    metadataCache[uri] = data;
                    return data;
                }
            } catch (e) {}
        } catch (e) {
            console.error('[Lyric Miniplayer] Error fetching track metadata:', e);
        }
        return null;
    }


    function getQueue() {
        if (Spicetify.Queue) return Spicetify.Queue;
        if (Spicetify.Platform?.PlayerAPI?._queue) return Spicetify.Platform.PlayerAPI._queue;
        if (Spicetify.Player?.origin?._queue) return Spicetify.Player.origin._queue;
        return null;
    }

    let lastPrevUri = null;
    let lastNextUri = null;

    async function updatePrevNextTracks() {
        if (!pipWindow || pipWindow.closed) return;
        const doc = pipWindow.document;
        const prevTitleEl = doc.getElementById('prevTrackTitle');
        const prevArtistEl = doc.getElementById('prevTrackArtist');
        const prevArtEl = doc.getElementById('prevTrackArt');
        const nextTitleEl = doc.getElementById('nextTrackTitle');
        const nextArtistEl = doc.getElementById('nextTrackArtist');
        const nextArtEl = doc.getElementById('nextTrackArt');

        const queue = getQueue();
        
        const prevTracks = queue?.prevTracks || [];
        const nextTracks = queue?.nextTracks || [];

        const getAdjacentTrack = (tracks, reverse = false) => {
            const list = reverse ? [...tracks].reverse() : tracks;
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                const contextTrack = item?.contextTrack || item;
                const metadata = contextTrack?.metadata;
                const provider = item?.provider;
                if (provider === 'ad' || metadata?.hidden === 'true' || metadata?.hidden === true) continue;
                return item;
            }
            return null;
        };

        const prevTrackItem = getAdjacentTrack(prevTracks, true);
        const nextTrackItem = getAdjacentTrack(nextTracks, false);

        const prevTrack = prevTrackItem?.contextTrack || prevTrackItem;
        const nextTrack = nextTrackItem?.contextTrack || nextTrackItem;

        const prevUri = prevTrack?.uri || null;
        const nextUri = nextTrack?.uri || null;

        // If URIs haven't changed, do nothing
        if (prevUri === lastPrevUri && nextUri === lastNextUri) {
            return;
        }

        lastPrevUri = prevUri;
        lastNextUri = nextUri;

        if (prevTitleEl && prevArtistEl) {
            if (prevUri) {
                // If it is already hydrated with metadata
                const metadata = prevTrack.metadata || {};
                const title = prevTrack.name || metadata.title || prevTrack.title || metadata.name;
                const artist = metadata.artist_name || (Array.isArray(prevTrack.artists) ? prevTrack.artists.map(a => a.name).join(', ') : '') || prevTrack.artist || metadata.artist || '';
                const image = metadata.image_url || prevTrack.album?.images?.[2]?.url || prevTrack.album?.images?.[0]?.url || '';
                
                if (title && artist) {
                    prevTitleEl.textContent = title;
                    prevArtistEl.textContent = artist;
                    if (prevArtEl) {
                        if (image) {
                            prevArtEl.src = image;
                            prevArtEl.style.display = 'block';
                        } else {
                            prevArtEl.style.display = 'none';
                        }
                    }
                } else {
                    prevTitleEl.textContent = 'Loading...';
                    prevArtistEl.textContent = '';
                    if (prevArtEl) prevArtEl.style.display = 'none';
                    fetchTrackMetadata(prevUri).then(data => {
                        if (data && prevUri === lastPrevUri) {
                            prevTitleEl.textContent = data.title;
                            prevArtistEl.textContent = data.artist;
                            if (prevArtEl && data.image) {
                                prevArtEl.src = data.image;
                                prevArtEl.style.display = 'block';
                            }
                        }
                    });
                }
            } else {
                prevTitleEl.textContent = 'None';
                prevArtistEl.textContent = '';
                if (prevArtEl) prevArtEl.style.display = 'none';
            }
        }

        if (nextTitleEl && nextArtistEl) {
            if (nextUri) {
                // If it is already hydrated with metadata
                const metadata = nextTrack.metadata || {};
                const title = nextTrack.name || metadata.title || nextTrack.title || metadata.name;
                const artist = metadata.artist_name || (Array.isArray(nextTrack.artists) ? nextTrack.artists.map(a => a.name).join(', ') : '') || nextTrack.artist || metadata.artist || '';
                const image = metadata.image_url || nextTrack.album?.images?.[2]?.url || nextTrack.album?.images?.[0]?.url || '';
                
                if (title && artist) {
                    nextTitleEl.textContent = title;
                    nextArtistEl.textContent = artist;
                    if (nextArtEl) {
                        if (image) {
                            nextArtEl.src = image;
                            nextArtEl.style.display = 'block';
                        } else {
                            nextArtEl.style.display = 'none';
                        }
                    }
                } else {
                    nextTitleEl.textContent = 'Loading...';
                    nextArtistEl.textContent = '';
                    if (nextArtEl) nextArtEl.style.display = 'none';
                    fetchTrackMetadata(nextUri).then(data => {
                        if (data && nextUri === lastNextUri) {
                            nextTitleEl.textContent = data.title;
                            nextArtistEl.textContent = data.artist;
                            if (nextArtEl && data.image) {
                                nextArtEl.src = data.image;
                                nextArtEl.style.display = 'block';
                            }
                        }
                    });
                }
            } else {
                nextTitleEl.textContent = 'None';
                nextArtistEl.textContent = '';
                if (nextArtEl) nextArtEl.style.display = 'none';
            }
        }
    }

    function updatePipLikeState() {
        if (!pipWindow || pipWindow.closed) return;
        
        const doc = pipWindow.document;
        const likeBtn = doc.getElementById('likeBtn');
        const likeIcon = doc.getElementById('likeIcon');
        if (!likeBtn || !likeIcon) return;
        
        const isLiked = Spicetify.Player.getHeart();
        if (isLiked === lastLikeState) return;
        lastLikeState = isLiked;
        
        likeBtn.classList.toggle('liked', isLiked);
        if (isLiked) {
            likeIcon.innerHTML = '<path d="M15.724 4.22A4.313 4.313 0 0 0 12.192.814a4.269 4.269 0 0 0-3.622 1.13.837.837 0 0 1-1.14 0 4.272 4.272 0 0 0-6.21 5.855l5.916 7.05a1.128 1.128 0 0 0 1.727 0l5.916-7.05a4.228 4.228 0 0 0 .945-3.577z"/>';
        } else {
            likeIcon.innerHTML = '<path d="M1.69 2A4.582 4.582 0 0 1 8 2.023 4.583 4.583 0 0 1 11.88.817h.002a4.618 4.618 0 0 1 3.782 3.65v.003a4.543 4.543 0 0 1-1.011 3.84L9.35 14.629a1.765 1.765 0 0 1-2.093.464 1.762 1.762 0 0 1-.605-.463L1.348 8.309A4.582 4.582 0 0 1 1.689 2zm3.158.252A3.082 3.082 0 0 0 2.49 7.337l.005.005L7.8 13.664a.264.264 0 0 0 .311.069.262.262 0 0 0 .09-.069l5.312-6.33a3.043 3.043 0 0 0 .68-2.573 3.118 3.118 0 0 0-2.551-2.463 3.079 3.079 0 0 0-2.612.816l-.007.007a1.501 1.501 0 0 1-2.045 0l-.009-.008a3.082 3.082 0 0 0-2.121-.861z"/>';
        }
    }

    function updatePipPlayButton() {
        if (!pipWindow || pipWindow.closed) return;

        const playBtn = pipWindow.document.getElementById('playBtn');
        const playIcon = pipWindow.document.getElementById('playIcon');
        const vinylRecord = pipWindow.document.getElementById('vinylRecord');
        const vinylImg = pipWindow.document.getElementById('vinylImg');
        
        if (!playBtn || !playIcon) return;

        const isPlaying = Spicetify.Player.isPlaying();
        
        if (isPlaying === lastPlayState) {
            // Check if vinyl image source needs updating (e.g. initially empty)
            if (vinylImg && !vinylImg.src) {
                const track = Spicetify.Player.data?.item;
                if (track) {
                    vinylImg.src = track.album?.images?.[0]?.url || track.metadata?.image_url || '';
                }
            }
            return;
        }
        lastPlayState = isPlaying;

        if (isPlaying) {
            playBtn.classList.remove('paused');
            if (vinylRecord) vinylRecord.style.animationPlayState = 'running';
        } else {
            playBtn.classList.add('paused');
            if (vinylRecord) vinylRecord.style.animationPlayState = 'paused';
        }

        playIcon.outerHTML = isPlaying
            ? '<svg viewBox="0 0 16 16" id="playIcon"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"/></svg>'
            : '<svg viewBox="0 0 16 16" id="playIcon"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/></svg>';

        if (vinylImg && !vinylImg.src) {
            const track = Spicetify.Player.data?.item;
            if (track) {
                vinylImg.src = track.album?.images?.[0]?.url || track.metadata?.image_url || '';
            }
        }
    }

    function updatePipVolume() {
        if (!pipWindow || pipWindow.closed) return;

        const doc = pipWindow.document;
        const volumeSlider = doc.getElementById('volumeSlider');
        const volumePercent = doc.getElementById('volumePercent');
        const volumeIconWrap = doc.getElementById('volumeIconWrap');
        
        if (!volumeSlider || !volumePercent || !volumeIconWrap) return;

        // Only update if slider is not being dragged
        if (doc.activeElement !== volumeSlider) {
            const vol = Math.round((Spicetify.Player.getVolume() || 0) * 100);
            volumeSlider.value = vol;
            volumePercent.textContent = `${vol}%`;
            volumeIconWrap.innerHTML = getVolumeIconSvg(vol);
        }
    }

    async function loadLyrics(uri) {
        if (!pipWindow || pipWindow.closed) return;

        const container = pipWindow.document.getElementById('lyricsContainer');
        if (!container) return;

        // Clear cache and reset state for new lyrics
        cachedLyricElements = null;
        lastActiveIdx = -1;

        // Show loading
        container.innerHTML = '<div class="status-msg"><div class="spinner"></div></div>';

        // Fetch lyrics
        currentLyrics = await fetchLyrics(uri);

        if (!currentLyrics || !currentLyrics.lines?.length) {
            container.innerHTML = `
                <div class="status-msg">
                    <div class="icon">🎵</div>
                    <div class="text">No lyrics available</div>
                    <div class="subtext">Lyrics not found for this track</div>
                </div>
            `;
            return;
        }

        // Render lyrics
        const lyricsHtml = currentLyrics.lines
            .filter(line => line.text && line.text.trim())
            .map((line, idx) => 
                `<div class="lyric" data-time="${line.startTime}" data-idx="${idx}" style="font-size:${fontSize}px">${escapeHtml(line.text)}</div>`
            ).join('');

        container.innerHTML = lyricsHtml || `
            <div class="status-msg">
                <div class="icon">🎶</div>
                <div class="text">Instrumental</div>
            </div>
        `;
    }

    function updateCurrentLyric() {
        if (!pipWindow || pipWindow.closed || !currentLyrics?.synced) return;

        const doc = pipWindow.document;
        const currentTime = Spicetify.Player.getProgress();
        
        // Find active line
        let activeIdx = -1;
        const filteredLines = currentLyrics.lines.filter(l => l.text && l.text.trim());
        
        for (let i = filteredLines.length - 1; i >= 0; i--) {
            if (currentTime >= filteredLines[i].startTime) {
                activeIdx = i;
                break;
            }
        }

        // Cache elements if not cached yet
        if (!cachedLyricElements) {
            cachedLyricElements = doc.querySelectorAll('.lyric');
        }

        if (cachedLyricElements.length === 0) return;

        // Only update classes if active lyric index changed
        if (activeIdx === lastActiveIdx) return;
        lastActiveIdx = activeIdx;

        const isPlaying = Spicetify.Player.isPlaying();
        
        cachedLyricElements.forEach((el, idx) => {
            el.classList.remove('active', 'past');
            
            if (idx === activeIdx) {
                el.classList.add('active');
                // Only auto-scroll when playing
                if (isPlaying) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else if (idx < activeIdx) {
                el.classList.add('past');
            }
        });
    }

    function updatePipFontSize() {
        if (!pipWindow || pipWindow.closed) return;

        const lyrics = pipWindow.document.querySelectorAll('.lyric');
        lyrics.forEach(el => {
            el.style.fontSize = `${fontSize}px`;
        });
    }

    function startUpdateLoop() {
        if (updateIntervalId) clearInterval(updateIntervalId);
        
        let tickCount = 0;
        updateIntervalId = setInterval(() => {
            if (!pipWindow || pipWindow.closed) {
                clearInterval(updateIntervalId);
                updateIntervalId = null;
                return;
            }
            
            const isPlaying = Spicetify.Player.isPlaying();
            
            updatePipPlayButton();
            updatePipLikeState();
            
            // Only update lyrics and progress if playing, or on the initial ticks
            if (isPlaying || tickCount === 0) {
                updateCurrentLyric();
                updatePipProgress();
            }
            
            tickCount++;
            if (tickCount % 10 === 0) {
                updatePrevNextTracks();
            }
        }, CONFIG.updateInterval);
    }

    // ==================== UTILITIES ====================
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ==================== TOPBAR BUTTON ====================
    function injectTopbarStyles() {
        const styleId = 'lyric-miniplayer-topbar-style';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Style Spicetify Topbar Button for Lyric Miniplayer to be large & circular */
            .main-topBar-container button[aria-label="Lyric Miniplayer"],
            .main-topBar-container button[title="Lyric Miniplayer"],
            button.main-topBar-button[aria-label="Lyric Miniplayer"],
            button.main-topBar-button[title="Lyric Miniplayer"] {
                background-color: rgba(255, 255, 255, 0.08) !important;
                border-radius: 50% !important;
                width: 40px !important;
                height: 40px !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                border: none !important;
                color: #ffffff !important;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
                margin: 0 4px !important;
                padding: 0 !important;
            }
            .main-topBar-container button[aria-label="Lyric Miniplayer"]:hover,
            .main-topBar-container button[title="Lyric Miniplayer"]:hover,
            button.main-topBar-button[aria-label="Lyric Miniplayer"]:hover,
            button.main-topBar-button[title="Lyric Miniplayer"]:hover {
                background-color: rgba(255, 255, 255, 0.16) !important;
                transform: scale(1.06) !important;
                color: var(--spice-button, #1ed760) !important; /* Glow/accent color on hover */
            }
            .main-topBar-container button[aria-label="Lyric Miniplayer"] svg,
            .main-topBar-container button[title="Lyric Miniplayer"] svg,
            button.main-topBar-button[aria-label="Lyric Miniplayer"] svg,
            button.main-topBar-button[title="Lyric Miniplayer"] svg {
                width: 20px !important;
                height: 20px !important;
            }
        `;
        document.head.appendChild(style);
    }

    function injectPlaybarButton() {
        const targetId = 'lyric-miniplayer-playbar-btn';
        if (document.getElementById(targetId)) return;

        // Find the right controls bar container in Spotify
        const container = document.querySelector('.main-nowPlayingBar-right') || 
                          document.querySelector('.main-nowPlayingBar-extraControls') ||
                          document.querySelector('.ExtraControls');
        if (!container) return;

        const btn = document.createElement('button');
        btn.id = targetId;
        btn.title = 'Lyric Miniplayer';
        btn.ariaLabel = 'Lyric Miniplayer';
        // Inherit styling from standard control buttons
        btn.className = 'control-button main-nowPlayingBar-button';
        btn.style.display = 'inline-flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.border = 'none';
        btn.style.background = 'none';
        btn.style.cursor = 'pointer';
        btn.style.width = '38px';
        btn.style.height = '38px';
        btn.style.color = 'var(--spice-subtext, #b3b3b3)';
        btn.style.transition = 'color 0.2s ease, transform 0.2s ease';
        btn.style.padding = '0';
        btn.style.margin = '0 2px';

        btn.onmouseenter = () => {
            btn.style.color = 'var(--spice-button, #1ed760)';
            btn.style.transform = 'scale(1.1)';
        };
        btn.onmouseleave = () => {
            btn.style.color = 'var(--spice-subtext, #b3b3b3)';
            btn.style.transform = 'scale(1)';
        };
        
        // Music note icon inside button (larger)
        btn.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6zm0 2h3v2h-3V5z"/>
        </svg>`;

        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            openPictureInPicture();
        };

        // Try to insert directly next to the native Lyrics button (microphone icon)
        const lyricsBtn = container.querySelector('button[aria-label="Lyrics"]') || 
                          container.querySelector('button[title="Lyrics"]') ||
                          container.querySelector('button[aria-label="Lirik"]') ||
                          container.querySelector('button[title="Lirik"]') ||
                          container.querySelector('.lyrics-button') ||
                          container.querySelector('button:has(svgpath[d*="M12 2a3"])'); // matches mic icon path roughly

        if (lyricsBtn && lyricsBtn.parentNode === container) {
            container.insertBefore(btn, lyricsBtn.nextSibling);
        } else if (container.firstChild) {
            container.insertBefore(btn, container.firstChild);
        } else {
            container.appendChild(btn);
        }
    }

    function createButton() {
        if (Spicetify.Topbar?.Button) {
            new Spicetify.Topbar.Button(
                'Lyric Miniplayer',
                `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6zm0 2h3v2h-3V5z"/>
                </svg>`,
                openPictureInPicture,
                false
            );
        }
    }

    // ==================== EVENT LISTENERS ====================
    Spicetify.Player.addEventListener('songchange', () => {
        updatePipContent();
    });

    Spicetify.Player.addEventListener('onplaypause', () => {
        updatePipPlayButton();
    });

    // ==================== INIT ====================
    injectTopbarStyles();
    createButton();
    injectPlaybarButton();
    setInterval(injectPlaybarButton, 2000);
    
    console.log('[Lyric Miniplayer] Ready!');

})();
