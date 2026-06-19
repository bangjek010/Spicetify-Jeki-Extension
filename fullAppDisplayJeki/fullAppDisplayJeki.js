// NAME: Full App Display
// AUTHOR: khanhas
// VERSION: 1.0
// DESCRIPTION: Fancy artwork and track status display.

/// <reference path="../globals.d.ts" />
(function FullAppDisplay() {
	if (!Spicetify.Keyboard || !Spicetify.React || !Spicetify.ReactDOM) {
		setTimeout(FullAppDisplay, 200);
		return;
	}

	const { React: react, ReactDOM: reactDOM } = Spicetify;
	const { useState, useEffect, useRef } = react;

	const CONFIG = getConfig();
	if (CONFIG.enablePodcastVideo === undefined) {
		CONFIG.enablePodcastVideo = true;
	}
	let updateVisual;

	const style = document.createElement("style");
	const styleBase = `
#fad-title.podcast-mode {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    max-width: 100%;
    transition: transform 0.2s ease;
}
#fad-title.podcast-mode:hover {
    text-overflow: clip;
    max-width: none;
    width: max-content;
    animation: titleScroll 12s linear infinite alternate;
}
@keyframes titleScroll {
    0%, 10% { transform: translateX(0); }
    90%, 100% { transform: translateX(calc(-100% + 300px)); }
}




#full-app-display {
    display: none;
    position: fixed;
    width: 100%;
    height: 100%;
    cursor: default;
    left: 0;
    top: 0;
}
#full-app-display.hide-cursor {
	cursor: none;
}
#fad-header {
    position: fixed;
    width: 100%;
    height: 80px;
    -webkit-app-region: drag;
}
#fad-body {
    height: 100vh;
}
#fad-body.has-lyrics {
    display: grid;
    grid-template-columns: 1fr 1fr;
}
#fad-body.has-lyrics #fad-foreground {
    padding: 0 50px 0 100px;
    width: 50vw;
}
#fad-foreground {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: scale(var(--fad-scale));
}
#fad-art-image {
    position: relative;
    width: 100%;
    height: 100%;
    padding-bottom: 100%;
    border-radius: 15px;
    background-size: cover;
}
#fad-art-inner {
    position: absolute;
    left: 3%;
    bottom: 0;
    width: 94%;
    height: 94%;
    z-index: -1;
    backface-visibility: hidden;
    transform: translateZ(0);
    filter: blur(6px);
    backdrop-filter: blur(6px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
}
#fad-art-overlay {
    display: none;
}
#fad-art:hover #fad-art-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    border-radius: 15px;
    backdrop-filter: brightness(0.75);
}
#fad-heart {
    background-color: transparent;
    border: 0;
    color: #fff;
    padding: 0 5px;
    cursor: pointer;
}
#fad-progress-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 15px;
}
#fad-progress {
    width: 100%;
    height: 24px;
    border-radius: 4px;
    background-color: transparent;
    flex-grow: 1;
    min-width: 150px;
    position: relative;
}
#fad-progress:hover #fad-thumb {
    visibility: visible;
}
#fad-progress-inner {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
}
#fad-thumb {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #ffffff;
    cursor: pointer;
    visibility: hidden;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}
#fad-background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
}
body.fad-activated #full-app-display {
    display: block
}
.fad-background-fade {
    transition: background-image 1s linear;
}
body.video-full-screen.video-full-screen--hide-ui {
    cursor: auto;
}
#fad-controls button {
    background-color: transparent;
    border: 0;
    color: currentColor;
    padding: 0 5px;
    cursor: pointer;
}
#fad-controls button svg {
    vertical-align: middle;
}
#fad-elapsed, #fad-duration {
    font-variant-numeric: tabular-nums;
}
#fad-artist svg, #fad-album svg, #fad-release-date svg {
    display: inline-block;
}
::-webkit-scrollbar {
    width: 8px;
}

/* Control wrappers & layout */
#fad-controls-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 15px;
    margin: 10px 0;
}
#fad-peeks {
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 30px;
}
.fad-track-peek {
    display: flex;
    flex-direction: column;
    width: 180px;
    opacity: 0.6;
    transition: opacity 0.2s ease, transform 0.2s ease;
    overflow: hidden; /* BARIS INI DITAMBAHKAN */
}
.fad-track-peek:hover {
    opacity: 1;
    transform: scale(1.03);
}
.fad-track-peek.prev {
    text-align: left;
    align-items: flex-start;
}
.fad-track-peek.next {
    text-align: right;
    align-items: flex-end;
}
.fad-peek-label {
    font-size: 10px;
    font-weight: 800;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 1px;
    margin-bottom: 4px;
}
.fad-peek-title {
    font-size: 14px;
    font-weight: 700;
    color: #ffffff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
}
.fad-track-peek:hover .fad-peek-title {
    overflow: visible; /* Memunculkan teks yang terpotong */
    text-overflow: clip; /* Menghilangkan titik tiga (...) */
    animation: peekScroll 5s linear infinite alternate;
}

@keyframes peekScroll {
    0%, 15% { transform: translateX(0); } /* Jeda sebentar sebelum mulai jalan */
    85%, 100% { transform: translateX(-100px); } /* Menggeser teks ke kiri. Tambah angkanya (misal -150px) jika judulnya sangat panjang */
}
.fad-peek-artist {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    margin-top: 2px;
}

/* Volume Control */
#fad-volume-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 250px;
    gap: 12px;
    margin: 5px 0 15px 0; /* Memberi jarak halus ke atas (tombol) dan ke bawah (info lagu) */
    color: rgba(255, 255, 255, 0.7);
}
	
#fad-volume {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background-color: rgba(255, 255, 255, 0.25);
    position: relative;
    cursor: pointer;
}
#fad-volume-inner {
    height: 100%;
    background-color: #ffffff;
    border-radius: 3px;
    pointer-events: none;
}
#fad-volume-thumb {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #ffffff;
    cursor: pointer;
    visibility: hidden;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}
#fad-volume:hover #fad-volume-thumb {
    visibility: visible;
}
#fad-volume-container svg {
    cursor: pointer;
}

/* Lyrics Display */
#fad-lyrics-plus-container {
    position: relative;
    width: 50vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transform: translate(-40px, -40px); /* BARIS INI YANG DITAMBAHKAN */
    mask-image: linear-gradient(to bottom, transparent 0%, white 20%, white 80%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, white 20%, white 80%, transparent 100%);
}
	
#fad-lyrics-scroll-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
}
.fad-lyric-line {
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #ffffff;
    word-break: break-word;
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.05);
    text-align: center;
    width: 80%;
}
.fad-lyric-line.active {
    text-shadow: 0 0 25px rgba(255, 255, 255, 0.6);
}
.fad-lyrics-status {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: rgba(255, 255, 255, 0.6);
    font-family: sans-serif;
    gap: 15px;
}
.fad-lyrics-loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: rotate 0.8s linear infinite;
}
@keyframes rotate {
    to { transform: rotate(360deg); }
}
`;

	const styleChoices = [
		`
#fad-foreground {
    flex-direction: row;
    text-align: left;
}
#fad-art {
    width: calc(100vw - 840px);
    min-width: 200px;
    max-width: 340px;
}
#fad-details {
    padding-left: 50px;
    line-height: initial;
    max-width: 70%;
    color: #FFFFFF;
    overflow: hidden;
}
#fad-title {
    font-size: 87px;
    font-weight: 900 !important; /* Gunakan 900 atau 'bold' */
}
#fad-artist, #fad-album, #fad-release-date {
    font-size: 54px;
    font-weight: var(--glue-font-weight-medium);
}
#fad-artist svg, #fad-album svg, #fad-release-date svg {
    margin-right: 5px;
}
#fad-status {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    width: 100%;
}
#fad-status.active {
    margin-top: 20px;
}
#fad-controls {
    display: flex;
    margin: 0 auto;
}`,
		`
#fad-art {
    width: calc(100vh - 400px);
    max-width: 340px;
}
#fad-foreground {
    flex-direction: column;
    text-align: center;
}
#fad-details {
    padding-top: 50px;
    line-height: initial;
    max-width: 70%;
    color: #FFFFFF;
    overflow: hidden;
}
#fad-title {
    font-size: 54px;
    font-weight: var(--glue-font-weight-black);
}
#fad-artist, #fad-album, #fad-release-date {
    font-size: 33px;
    font-weight: var(--glue-font-weight-medium);
}
#fad-artist svg, #fad-album svg, #fad-release-date svg {
    width: 25px;
    height: 25px;
    margin-right: 5px;
}
#fad-status {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    min-width: 400px;
    max-width: 400px;
}
#fad-status.active {
    margin: 20px auto 0;
}
#fad-progress-container {
    width: 100%;
}`,
	];

	updateStyle();

	const DisplayIcon = ({ icon, size }) => {
		return react.createElement("svg", {
			width: size,
			height: size,
			viewBox: "0 0 16 16",
			fill: "currentColor",
			dangerouslySetInnerHTML: {
				__html: icon,
			},
		});
	};

	const SubInfo = ({ text, id, icon }) => {
		return react.createElement(
			"div",
			{
				id,
			},
			CONFIG.icons && react.createElement(DisplayIcon, { icon, size: 35 }),
			react.createElement("span", null, text)
		);
	};

	const ButtonIcon = ({ icon, onClick, active = false }) => {
		return react.createElement(
			"button",
			{
				onClick,
				style: { 
					color: active ? "#1db954" : "currentColor", /* Warna Hijau Spotify jika aktif */
					transition: "color 0.2s" 
				}
			},
			react.createElement(DisplayIcon, { icon, size: 20 })
		);
	};
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
		if (!trackUri) return generateMockWaveform();
		const trackId = trackUri.split(':').pop();
		
		if (trackUri.includes(':local:')) {
			return generateMockWaveform();
		}

		let response;
		try {
			response = await Spicetify.CosmosAsync.get(`https://spclient.wg.spotify.com/audio-attributes/v1/audio-analysis/${trackId}`);
			return processAudioAnalysis(response);
		} catch (e) {
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
				return generateMockWaveform();
			}
		}
	}

	function processAudioAnalysis(analysisData) {
		if (!analysisData || !analysisData.segments || !analysisData.track) {
			return generateMockWaveform();
		}
		const segments = analysisData.segments;
		const duration = analysisData.track.duration;
		const dataPoints = 80;
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

	const ProgressBar = () => {
		const [progress, setProgress] = useState(Spicetify.Player.getProgress());
		const duration = Spicetify.Platform.PlayerAPI._state.duration;

		const progressDivRef = useRef(null);
		const canvasRef = useRef(null);
		const [isDragging, setIsDragging] = useState(false);
		const [waveformData, setWaveformData] = useState(null);
		const [loadingWave, setLoadingWave] = useState(false);
		
		const trackUri = Spicetify.Player.data?.item?.uri;

		useEffect(() => {
			if (!trackUri) return;
			let isMounted = true;
			setLoadingWave(true);
			setWaveformData(null);

			const loadWave = async () => {
				const data = await fetchAudioAnalysis(trackUri);
				if (isMounted) {
					setWaveformData(data);
					setLoadingWave(false);
				}
			};

			loadWave();
			return () => { isMounted = false; };
		}, [trackUri]);

		useEffect(() => {
			if (!loadingWave || !canvasRef.current) return;
			const canvas = canvasRef.current;
			let animationFrameId;

			const drawLoading = () => {
				if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
					canvas.width = canvas.offsetWidth;
					canvas.height = canvas.offsetHeight;
				}
				const ctx = canvas.getContext('2d');
				const width = canvas.width;
				const height = canvas.height;
				ctx.clearRect(0, 0, width, height);

				const barCount = 40;
				const barWidth = width / (barCount * 2);
				const maxBarHeight = height * 0.8;
				const time = Date.now() * 0.002;

				ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
				const fillWidth = Math.max(1.5, barWidth * 0.7);

				for (let i = 0; i < barCount; i++) {
					const x = (i * 2 + 0.5) * barWidth;
					const combinedWave = (Math.sin(time + i * 0.15) + Math.sin(time * 1.5 + i * 0.075)) / 2 + 0.5;
					const barHeight = Math.max(2, combinedWave * maxBarHeight);
					const y = (height - barHeight) / 2;
					ctx.fillRect(x, y, fillWidth, barHeight);
				}

				animationFrameId = requestAnimationFrame(drawLoading);
			};

			drawLoading();
			return () => cancelAnimationFrame(animationFrameId);
		}, [loadingWave]);

		useEffect(() => {
			if (loadingWave || !waveformData || !canvasRef.current) return;
			const canvas = canvasRef.current;
			
			const ratio = duration > 0 ? (progress / duration) : 0;

			if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
				canvas.width = canvas.offsetWidth;
				canvas.height = canvas.offsetHeight;
			}

			const ctx = canvas.getContext('2d');
			const width = canvas.width;
			const height = canvas.height;
			ctx.clearRect(0, 0, width, height);

			const progressColor = '#ffffff'; 
			const disabledColor = 'rgba(255, 255, 255, 0.25)';

			const barWidth = width / waveformData.length;
			const fillWidth = Math.max(1.5, barWidth * 0.7);

			waveformData.forEach((loudness, index) => {
				const x = index * barWidth;
				const barHeight = Math.max(2, loudness * height * 0.85);
				const y = (height - barHeight) / 2;
				
				if (x <= ratio * width) {
					ctx.fillStyle = progressColor;
				} else {
					ctx.fillStyle = disabledColor;
				}
				
				ctx.fillRect(x, y, fillWidth, barHeight);
			});
		}, [progress, waveformData, loadingWave]);

		useEffect(() => {
			if (isDragging) {
				return;
			}

			const update = ({ data }) => setProgress(data);
			Spicetify.Player.addEventListener("onprogress", update);
			return () => Spicetify.Player.removeEventListener("onprogress", update);
		}, [isDragging]);

		const handleClick = (e) => {
			const container = progressDivRef.current;
			if (isDragging || !container) {
				return;
			}

			const containerRect = container.getBoundingClientRect();
			const clickX = e.clientX - containerRect.left;
			const newProgress = (clickX / containerRect.width) * duration;
			Spicetify.Player.seek(newProgress);
			setProgress(newProgress);
		};

		const handleMouseDown = () => setIsDragging(true);
		const handleMouseMove = (e) => {
			const container = progressDivRef.current;
			if (!isDragging || !container) {
				return;
			}

			const containerRect = container.getBoundingClientRect();
			const offsetX = e.clientX - containerRect.left;
			const newProgress = Math.max(0, Math.min(duration, (offsetX / containerRect.width) * duration));
			setProgress(newProgress);
		};
		const handleMouseUp = () => {
			if (!isDragging) {
				return;
			}

			Spicetify.Player.seek(progress);
			setIsDragging(false);
		};

		useEffect(() => {
			if (isDragging) {
				window.addEventListener("mousemove", handleMouseMove);
				window.addEventListener("mouseup", handleMouseUp);
			} else {
				window.removeEventListener("mousemove", handleMouseMove);
				window.removeEventListener("mouseup", handleMouseUp);
			}

			return () => {
				window.removeEventListener("mousemove", handleMouseMove);
				window.removeEventListener("mouseup", handleMouseUp);
			};
		}, [isDragging, progress]);

		const thumbPosition = (progress / duration) * 100;

		return react.createElement(
			"div",
			{ id: "fad-progress-container" },
			react.createElement("span", { id: "fad-elapsed" }, Spicetify.Player.formatTime(progress)),
			react.createElement(
				"div",
				{
					id: "fad-progress",
					ref: progressDivRef,
					onClick: handleClick,
					style: {
						"--progress-width": `${thumbPosition}%`,
					},
				},
				react.createElement("canvas", {
					ref: canvasRef,
					style: {
						width: "100%",
						height: "100%",
						display: "block",
						pointerEvents: "none",
					}
				}),
				react.createElement(
					"div",
					{ 
						id: "fad-progress-inner",
						style: {
							position: "absolute",
							top: 0,
							left: 0,
							height: "100%",
							width: "100%",
							background: "transparent",
							pointerEvents: "none"
						}
					},
					react.createElement("div", {
						id: "fad-thumb",
						onMouseDown: handleMouseDown,
						style: {
							top: "50%",
							transform: "translateY(-50%)",
							position: "absolute",
							left: `calc(${thumbPosition}% - 6px)`,
							pointerEvents: "auto"
						}
					})
				)
			),
			react.createElement("span", { id: "fad-duration" }, Spicetify.Player.formatTime(duration))
		);
	};

	const PlayerControls = () => {
		const [value, setValue] = useState(Spicetify.Player.isPlaying());
		const [prevTrack, setPrevTrack] = useState(null);
		const [nextTrack, setNextTrack] = useState(null);
		const [isShuffle, setIsShuffle] = useState(Spicetify.Player.getShuffle());
		const [repeatMode, setRepeatMode] = useState(Spicetify.Player.getRepeat());
		
		const updateQueueInfo = () => {
			const queueObj = Spicetify.Queue || Spicetify.Platform?.PlayerAPI?._queue || Spicetify.Player?.origin?._queue;
			if (!queueObj) return;

			const prevTracks = queueObj.prevTracks || [];
			const nextTracks = queueObj.nextTracks || [];

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

			const prevItem = getAdjacentTrack(prevTracks, true);
			const nextItem = getAdjacentTrack(nextTracks, false);

			const formatTrack = (item) => {
				if (!item) return null;
				const track = item.contextTrack || item;
				const metadata = track.metadata || {};
				return {
					title: track.name || metadata.title || track.title || metadata.name || 'Unknown',
					artist: metadata.artist_name || (Array.isArray(track.artists) ? track.artists.map(a => a.name).join(', ') : '') || track.artist || metadata.artist || 'Unknown'
				};
			};

			setPrevTrack(formatTrack(prevItem));
			setNextTrack(formatTrack(nextItem));
		};

		useEffect(() => {
			const updatePlay = ({ data }) => setValue(!data.isPaused);
			Spicetify.Player.addEventListener("onplaypause", updatePlay);

			Spicetify.Player.addEventListener("songchange", updateQueueInfo);
			Spicetify.Platform.PlayerAPI?._events?.addListener("queue_update", updateQueueInfo);

			updateQueueInfo();

			// Sinkronisasi otomatis agar tombol merespons jika kamu mengubahnya dari HP/aplikasi lain
			const syncState = setInterval(() => {
				setIsShuffle(Spicetify.Player.getShuffle());
				setRepeatMode(Spicetify.Player.getRepeat());
			}, 1000);

			return () => {
				Spicetify.Player.removeEventListener("onplaypause", updatePlay);
				Spicetify.Player.removeEventListener("songchange", updateQueueInfo);
				Spicetify.Platform.PlayerAPI?._events?.removeListener("queue_update", updateQueueInfo);
				clearInterval(syncState);
			};
		}, []);

		return react.createElement(
			"div",
			{ id: "fad-controls-wrapper" },
			react.createElement(
				"div",
				{ id: "fad-controls", style: { display: "flex", gap: "20px", alignItems: "center" } },
				// Tombol SHUFFLE
				react.createElement(ButtonIcon, {
					icon: Spicetify.SVGIcons["shuffle"],
					active: isShuffle,
					onClick: () => {
						Spicetify.Player.toggleShuffle();
						setTimeout(() => setIsShuffle(Spicetify.Player.getShuffle()), 100);
					},
				}),
				// Tombol PREV
				react.createElement(ButtonIcon, {
					icon: Spicetify.SVGIcons["skip-back"],
					onClick: Spicetify.Player.back,
				}),
				// Tombol PLAY/PAUSE
				react.createElement(ButtonIcon, {
					icon: Spicetify.SVGIcons[value ? "pause" : "play"],
					onClick: Spicetify.Player.togglePlay,
				}),
				// Tombol NEXT
				react.createElement(ButtonIcon, {
					icon: Spicetify.SVGIcons["skip-forward"],
					onClick: Spicetify.Player.next,
				}),
				// Tombol REPEAT (Otomatis berubah ikon jika mode Repeat One)
				react.createElement(ButtonIcon, {
					icon: Spicetify.SVGIcons[repeatMode === 2 ? "repeat-once" : "repeat"] || Spicetify.SVGIcons["repeat"],
					active: repeatMode > 0,
					onClick: () => {
						Spicetify.Player.toggleRepeat();
						setTimeout(() => setRepeatMode(Spicetify.Player.getRepeat()), 100);
					},
				})
			),
			
			react.createElement(VolumeControls),
			react.createElement(
				"div",
				{ id: "fad-peeks" },
				react.createElement(
					"div",
					{ 
						className: "fad-track-peek prev",
						onClick: Spicetify.Player.back,
						style: { cursor: prevTrack ? "pointer" : "default", visibility: prevTrack ? "visible" : "hidden" }
					},
					prevTrack && [
						react.createElement("span", { className: "fad-peek-label", key: "lbl" }, "PREVIOUS"),
						react.createElement("span", { className: "fad-peek-title", key: "ttl" }, prevTrack.title),
						react.createElement("span", { className: "fad-peek-artist", key: "art" }, prevTrack.artist)
					]
				),
				react.createElement(
					"div",
					{ 
						className: "fad-track-peek next",
						onClick: Spicetify.Player.next,
						style: { cursor: nextTrack ? "pointer" : "default", visibility: nextTrack ? "visible" : "hidden" }
					},
					nextTrack && [
						react.createElement("span", { className: "fad-peek-label", key: "lbl" }, "NEXT"),
						react.createElement("span", { className: "fad-peek-title", key: "ttl" }, nextTrack.title),
						react.createElement("span", { className: "fad-peek-artist", key: "art" }, nextTrack.artist)
					]
				)
			),
		);
	};

	async function fetchLyrics(trackUri) {
		try {
			const trackId = trackUri.split(':').pop();
			const isEpisode = trackUri.includes(':episode:');
			const typePath = isEpisode ? 'episode' : 'track';
			
			try {
				const response = await Spicetify.CosmosAsync.get(
					`https://spclient.wg.spotify.com/color-lyrics/v2/${typePath}/${trackId}?format=json&market=from_token`
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

			try {
				const altResponse = await Spicetify.CosmosAsync.get(
					`wg://lyrics/v1/${typePath}/${trackId}?format=json&market=from_token`
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
			console.error('[FAD Lyrics] Error fetching lyrics:', error);
			return null;
		}
	}

	const FADLyrics = () => {
		const [lyrics, setLyrics] = useState(null);
		const [activeIdx, setActiveIdx] = useState(-1);

		useEffect(() => {
			let isMounted = true;
			const track = Spicetify.Player.data?.item;
			if (!track?.uri) return;

			const load = async () => {
				setLyrics(null);
				setActiveIdx(-1);
				const data = await fetchLyrics(track.uri);
				if (isMounted) {
					setLyrics(data);
				}
			};

			load();

			const onSongChange = () => {
				load();
			};

			Spicetify.Player.addEventListener("songchange", onSongChange);
			return () => {
				isMounted = false;
				Spicetify.Player.removeEventListener("songchange", onSongChange);
			};
		}, [Spicetify.Player.data?.item?.uri]);

		useEffect(() => {
			if (!lyrics?.synced || !lyrics?.lines?.length) return;

			const updateLyrics = () => {
				const currentTime = Spicetify.Player.getProgress();
				let currentIdx = -1;
				const filteredLines = lyrics.lines;
				
				for (let i = filteredLines.length - 1; i >= 0; i--) {
					if (currentTime >= filteredLines[i].startTime) {
						currentIdx = i;
						break;
					}
				}

				if (currentIdx !== activeIdx) {
					setActiveIdx(currentIdx);
				}
			};

			const interval = setInterval(updateLyrics, 100);
			return () => clearInterval(interval);
		}, [lyrics, activeIdx]);

		if (!lyrics || !lyrics.lines?.length) {
			return react.createElement(
				"div",
				{ className: "fad-lyrics-status" },
				react.createElement("div", { className: "fad-lyrics-loading-spinner" }),
				react.createElement("div", null, "Instrumental / Loading lyrics...")
			);
		}

		const baseIdx = activeIdx === -1 ? 0 : activeIdx;
		const lineOffsets = [-2, -1, 0, 1, 2];

		return react.createElement(
			"div",
			{ 
				id: "fad-lyrics-scroll-container",
			},
			lineOffsets.map((offset) => {
				const lineIdx = baseIdx + offset;
				const line = (lineIdx >= 0 && lineIdx < lyrics.lines.length) ? lyrics.lines[lineIdx] : null;
				
				const isActive = activeIdx !== -1 && offset === 0;
				const isPast = offset < 0;

				return react.createElement(
					"div",
					{
						key: `lyric-${lineIdx}-${offset}`,
						className: `fad-lyric-line${isActive ? " active" : ""}${isPast ? " past" : ""}`,
						style: {
							fontSize: isActive ? "32px" : "24px",
							opacity: line ? (isActive ? 1 : isPast ? 0.4 : 0.25) : 0,
							fontWeight: isActive ? "800" : "500",
							transform: isActive ? "scale(1.03)" : "scale(1)",
							transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
							padding: "15px 20px",
							cursor: line ? "pointer" : "default",
							lineHeight: "1.4",
							minHeight: "40px",
						},
						onClick: () => {
							if (line) Spicetify.Player.seek(line.startTime);
						}
					},
					line ? line.text : ""
				);
			})
		);
	};


	const PodcastVideo = () => {
		const containerRef = useRef(null);
		const originalParentRef = useRef(null);
		const originalSiblingRef = useRef(null);
		const videoRef = useRef(null);

		const transcriptRef = useRef(null);
		const originalTranscriptParentRef = useRef(null);
		const originalTranscriptSiblingRef = useRef(null);
		const transcriptHeaderRef = useRef(null);

		const openNowPlayingView = () => {
			const npvButton = document.querySelector('[data-testid="now-playing-view-button"]') || 
			                  document.querySelector('button[aria-label="Now playing view"]');
			if (npvButton && npvButton.getAttribute("aria-checked") !== "true") {
				npvButton.click();
			}
		};

		const trackUri = Spicetify.Player.data?.item?.uri;

		useEffect(() => {
			// Reset refs on new trackUri mount
			videoRef.current = null;
			transcriptRef.current = null;
			transcriptHeaderRef.current = null;

			// Ensure NPV is open so video and transcript render
			openNowPlayingView();

			let intervalId;
			const checkAndMoveVideo = () => {
				if (!videoRef.current) {
					const video = document.querySelector("main video") || document.querySelector("video");
					if (video && containerRef.current && !containerRef.current.contains(video)) {
						videoRef.current = video;
						originalParentRef.current = video.parentElement;
						originalSiblingRef.current = video.nextSibling;
						containerRef.current.appendChild(video);

						video.style.width = "100%";
						video.style.height = "100%";
						video.style.objectFit = "contain";
						video.style.display = "block";
						video.style.backgroundColor = "transparent";
					}
				}

				if (!transcriptRef.current) {
					const allElements = document.querySelectorAll("div, section, h1, h2, h3, h4, span");
					let header = null;
					for (const el of allElements) {
						if (el.textContent && el.textContent.trim() === "Read along (BETA)") {
							header = el;
							break;
						}
					}

					if (header) {
						// Grandparent of header is typically the scroll card wrapper
						const card = header.parentElement?.parentElement;
						const subContainer = document.getElementById("fad-podcast-subtitles");
						if (card && subContainer && !subContainer.contains(card)) {
							transcriptRef.current = card;
							originalTranscriptParentRef.current = card.parentElement;
							originalTranscriptSiblingRef.current = card.nextSibling;
							transcriptHeaderRef.current = header;

							subContainer.appendChild(card);
							
							header.style.display = "none"; // Hide "Read along (BETA)" title

							card.style.width = "100%";
							card.style.height = "150px";
							card.style.overflow = "hidden";
							card.style.backgroundColor = "transparent";
							card.style.boxShadow = "none";
						}
					}
				}
			};

			checkAndMoveVideo();
			intervalId = setInterval(checkAndMoveVideo, 500);

			return () => {
				clearInterval(intervalId);
				if (videoRef.current && originalParentRef.current) {
					try {
						originalParentRef.current.insertBefore(videoRef.current, originalSiblingRef.current);
						videoRef.current.style.width = "";
						videoRef.current.style.height = "";
						videoRef.current.style.objectFit = "";
						videoRef.current.style.display = "";
						videoRef.current.style.backgroundColor = "";
					} catch (e) {
						console.error("[FAD Podcast] Error restoring video:", e);
					}
					videoRef.current = null;
				}
				if (transcriptRef.current && originalTranscriptParentRef.current) {
					try {
						originalTranscriptParentRef.current.insertBefore(transcriptRef.current, originalTranscriptSiblingRef.current);
						if (transcriptHeaderRef.current) {
							transcriptHeaderRef.current.style.display = "";
						}
						transcriptRef.current.style.width = "";
						transcriptRef.current.style.height = "";
						transcriptRef.current.style.overflow = "";
						transcriptRef.current.style.backgroundColor = "";
						transcriptRef.current.style.boxShadow = "";
					} catch (e) {
						console.error("[FAD Podcast] Error restoring transcript:", e);
					}
					transcriptRef.current = null;
					transcriptHeaderRef.current = null;
				}
			};
		}, [trackUri]);

		return react.createElement(
			"div",
			{
				style: {
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center"
				}
			},
			react.createElement("div", {
				ref: containerRef,
				style: {
					width: "100%",
					height: "65%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					overflow: "hidden",
					borderRadius: "15px",
					backgroundColor: "transparent"
				}
			}),
			react.createElement("div", {
				id: "fad-podcast-subtitles",
				style: {
					width: "90%",
					minHeight: "150px",
					maxHeight: "150px",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					overflow: "hidden",
					marginTop: "20px"
				}
			})
		);
	};


	const VolumeControls = () => {
		const [volume, setVolume] = useState(Spicetify.Player.getVolume());
		const volRef = useRef(null);
		const [isDragging, setIsDragging] = useState(false);

		const setSpicetifyVolume = (vol) => {
			Spicetify.Player.setVolume(vol);
			setVolume(vol);
		};

		const handleClick = (e) => {
			if (isDragging || !volRef.current) return;
			const rect = volRef.current.getBoundingClientRect();
			const newVol = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
			setSpicetifyVolume(newVol);
		};

		const handleMouseDown = () => setIsDragging(true);
		const handleMouseMove = (e) => {
			if (!isDragging || !volRef.current) return;
			const rect = volRef.current.getBoundingClientRect();
			const newVol = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
			setSpicetifyVolume(newVol);
		};
		const handleMouseUp = () => setIsDragging(false);

		useEffect(() => {
			if (isDragging) {
				window.addEventListener("mousemove", handleMouseMove);
				window.addEventListener("mouseup", handleMouseUp);
			} else {
				window.removeEventListener("mousemove", handleMouseMove);
				window.removeEventListener("mouseup", handleMouseUp);
			}
			return () => {
				window.removeEventListener("mousemove", handleMouseMove);
				window.removeEventListener("mouseup", handleMouseUp);
			};
		}, [isDragging]);

		const toggleMute = () => {
			if (volume === 0) {
				setSpicetifyVolume(1); // Kembalikan ke 100% jika di-unmute
			} else {
				setSpicetifyVolume(0); // Mute
			}
		};

		return react.createElement(
			"div",
			{ id: "fad-volume-container" },
			react.createElement(
				"div", 
				{ onClick: toggleMute },
				react.createElement(DisplayIcon, { 
					icon: Spicetify.SVGIcons[volume === 0 ? "volume-off" : "volume"], 
					size: 18 
				})
			),
			react.createElement(
				"div",
				{
					id: "fad-volume",
					ref: volRef,
					onClick: handleClick,
				},
				react.createElement(
					"div",
					{
						id: "fad-volume-inner",
						style: { width: `${volume * 100}%` }
					}
				),
				react.createElement("div", {
					id: "fad-volume-thumb",
					onMouseDown: handleMouseDown,
					style: { left: `calc(${volume * 100}% - 6px)` }
				})
			)
		);
	};

	const DigitalClock = () => {
		const [time, setTime] = useState(new Date());

		useEffect(() => {
			const timer = setInterval(() => setTime(new Date()), 1000);
			return () => clearInterval(timer);
		}, []);

		return react.createElement(
			"div",
			{
				id: "fad-elegant-clock",
				style: {
					position: "absolute",
					top: "2vh", /* Ubah 6vh menjadi 2vh. Semakin kecil angkanya, semakin ke atas posisinya */
					left: "50%",
					transform: "translateX(-50%)",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					zIndex: 10,
					textShadow: "0 8px 30px rgba(0, 0, 0, 0.6)", /* Bayangan elegan */
					color: "#ffffff",
					fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif", /* Font yang sama dengan lirik */
					pointerEvents: "none" /* Agar tidak mengganggu klik elemen di bawahnya */
				}
			},
			// Bagian Waktu (Jam & Menit)
			react.createElement("div", {
				style: {
					fontSize: "90px", /* Ukuran jam yang besar */
					fontWeight: "800",
					letterSpacing: "4px",
					lineHeight: "1",
					margin: "0"
				}
			}, time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })),
			// Bagian Hari & Tanggal
			react.createElement("div", {
				style: {
					fontSize: "18px",
					fontWeight: "600",
					letterSpacing: "3px",
					marginTop: "12px",
					color: "rgba(255, 255, 255, 0.75)", 
					textTransform: "uppercase"
				}
			}, time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }))
		);
	};


	class FAD extends react.Component {
		constructor(props) {
			super(props);

			this.state = {
				title: "",
				artist: "",
				album: "",
				releaseDate: "",
				cover: "",
				heart: Spicetify.Player.getHeart(),
			};
			this.currTrackImg = new Image();
			this.nextTrackImg = new Image();
			this.mousetrap = new Spicetify.Mousetrap();
		}

		async getAlbumDate(uri) {
			const { getAlbum } = Spicetify.GraphQL.Definitions;
			const { errors, data } = await Spicetify.GraphQL.Request(getAlbum, {
				uri,
				locale: Spicetify.Locale.getLocale(),
				offset: 0,
				limit: 10,
			});

			if (errors) return null;

			const albumDate = data.albumUnion.date;

			if (albumDate.precision === "YEAR") {
				return albumDate.isoString.split("-")[0];
			}

			const date = new Date(albumDate.isoString);

			return date.toLocaleDateString("default", {
				year: "numeric",
				month: "short",
				day: "numeric",
			});
		}

		async fetchInfo() {
			const meta = Spicetify.Player.data.item.metadata;

			let rawTitle = meta.title;
			if (CONFIG.trimTitle) {
				rawTitle = rawTitle
					.replace(/\(.+?\)/g, "")
					.replace(/\[.+?\]/g, "")
					.replace(/\s-\s.+?$/, "")
					.replace(/,.+?$/, "")
					.trim();
			}

			let artistName;
			if (CONFIG.showAllArtists) {
				artistName = Object.keys(meta)
					.filter((key) => key.startsWith("artist_name"))
					.sort()
					.map((key) => meta[key])
					.join(", ");
			} else {
				artistName = meta.artist_name;
			}

			let releaseDate;
			if (CONFIG.showReleaseDate) {
				const albumURI = meta.album_uri;
				if (albumURI?.startsWith("spotify:album:")) {
					releaseDate = await this.getAlbumDate(albumURI);
				}
			}

			const albumText = meta.album_title || "";

			if (meta.image_xlarge_url === this.currTrackImg.src) {
				this.setState({
					title: rawTitle || "",
					artist: artistName || "",
					album: albumText || "",
					releaseDate: releaseDate || "",
					heart: Spicetify.Player.getHeart(),
				});
				return;
			}

			const previousImg = this.currTrackImg.cloneNode();
			this.currTrackImg.src = meta.image_xlarge_url;
			this.currTrackImg.onload = () => {
				const bgImage = `url("${this.currTrackImg.src}")`;

				this.animateCanvas(previousImg, this.currTrackImg);
				this.setState({
					title: rawTitle || "",
					artist: artistName || "",
					album: albumText || "",
					releaseDate: releaseDate || "",
					cover: bgImage,
					heart: Spicetify.Player.getHeart(),
				});
			};
			this.currTrackImg.onerror = () => {
				this.currTrackImg.src =
					"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCI+CiAgPHJlY3Qgc3R5bGU9ImZpbGw6I2ZmZmZmZiIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiB4PSIwIiB5PSIwIiAvPgogIDxwYXRoIGZpbGw9IiNCM0IzQjMiIGQ9Ik0yNi4yNSAxNi4xNjJMMjEuMDA1IDEzLjEzNEwyMS4wMTIgMjIuNTA2QzIwLjU5NCAyMi4xOTIgMjAuMDgxIDIxLjk5OSAxOS41MTkgMjEuOTk5QzE4LjE0MSAyMS45OTkgMTcuMDE5IDIzLjEyMSAxNy4wMTkgMjQuNDk5QzE3LjAxOSAyNS44NzggMTguMTQxIDI2Ljk5OSAxOS41MTkgMjYuOTk5QzIwLjg5NyAyNi45OTkgMjIuMDE5IDI1Ljg3OCAyMi4wMTkgMjQuNDk5QzIyLjAxOSAyNC40MjIgMjIuMDA2IDE0Ljg2NyAyMi4wMDYgMTQuODY3TDI1Ljc1IDE3LjAyOUwyNi4yNSAxNi4xNjJaTTE5LjUxOSAyNS45OThDMTguNjkyIDI1Ljk5OCAxOC4wMTkgMjUuMzI1IDE4LjAxOSAyNC40OThDMTguMDE5IDIzLjY3MSAxOC42OTIgMjIuOTk4IDE5LjUxOSAyMi45OThDMjAuMzQ2IDIyLjk5OCAyMS4wMTkgMjMuNjcxIDIxLjAxOSAyNC40OThDMjEuMDE5IDI1LjMyNSAyMC4zNDYgMjUuOTk4IDE5LjUxOSAyNS45OThaIi8+Cjwvc3ZnPgo=";
			};
		}

		animateCanvas(prevImg, nextImg) {
			const { innerWidth: width, innerHeight: height } = window;
			this.back.width = width;
			this.back.height = height;

			const ctx = this.back.getContext("2d");
			ctx.imageSmoothingEnabled = false;
			ctx.filter = "blur(30px) brightness(0.6)";
			const blur = 30;

			const x = -blur * 2;

			let y;
			let dim;

			if (width > height) {
				dim = width;
				y = x - (width - height) / 2;
			} else {
				dim = height;
				y = x;
			}

			const size = dim + 4 * blur;

			if (!CONFIG.enableFade) {
				ctx.globalAlpha = 1;
				ctx.drawImage(nextImg, x, y, size, size);
				return;
			}

			let factor = 0.0;
			const animate = () => {
				ctx.globalAlpha = 1;
				ctx.drawImage(prevImg, x, y, size, size);
				ctx.globalAlpha = Math.sin((Math.PI / 2) * factor);
				ctx.drawImage(nextImg, x, y, size, size);

				if (factor < 1.0) {
					factor += 0.016;
					requestAnimationFrame(animate);
				}
			};

			requestAnimationFrame(animate);
		}

		componentDidMount() {
			this.updateInfo = this.fetchInfo.bind(this);
			Spicetify.Player.addEventListener("songchange", this.updateInfo);
			this.updateInfo();

			updateVisual = () => {
				updateStyle();
				this.fetchInfo();
			};

			this.onQueueChange = async (queueData) => {
				const queue = queueData.data;
				let nextTrack;
				if (queue.queued.length) {
					nextTrack = queue.queued[0];
				} else {
					nextTrack = queue.nextUp[0];
				}
				this.nextTrackImg.src = nextTrack.metadata.image_xlarge_url;
			};

			const scaleLimit = { min: 0.1, max: 4, step: 0.05 };
			this.onScaleChange = (event) => {
				if (!event.ctrlKey) return;
				const dir = event.deltaY < 0 ? 1 : -1;
				let temp = (CONFIG.scale || 1) + dir * scaleLimit.step;
				if (temp < scaleLimit.min) {
					temp = scaleLimit.min;
				} else if (temp > scaleLimit.max) {
					temp = scaleLimit.max;
				}
				CONFIG.scale = temp;
				saveConfig();
				updateVisual();
			};

			Spicetify.Platform.PlayerAPI._events.addListener("queue_update", this.onQueueChange);
			this.mousetrap.bind("esc", deactivate);
			window.dispatchEvent(new Event("fad-request"));
		}

		componentWillUnmount() {
			Spicetify.Player.removeEventListener("songchange", this.updateInfo);
			Spicetify.Platform.PlayerAPI._events.removeListener("queue_update", this.onQueueChange);
			this.mousetrap.unbind("esc");
		}

		render() {
			const showRightPanel = CONFIG.enableLyrics;

			return react.createElement(
				"div",
				{
					id: "full-app-display",
					className: "Video VideoPlayer--fullscreen VideoPlayer--landscape",
					onDoubleClick: deactivate,
					onContextMenu: openConfig,
				},
				react.createElement("canvas", {
					id: "fad-background",
					ref: (el) => {
						this.back = el;
					},
				}),
				react.createElement("div", { id: "fad-header" }),
				react.createElement(DigitalClock),
				
				react.createElement(
					"div",
					{ 
						id: "fad-body",
						className: showRightPanel ? "has-lyrics" : ""
					},
					react.createElement(
						"div",
						{
							id: "fad-foreground",
							style: {
								"--fad-scale": CONFIG.scale || 1,
							},
							ref: (el) => {
								if (!el) return;
								el.onmousewheel = this.onScaleChange;
							},
						},
						react.createElement(
							"div",
							{ id: "fad-art" },
							react.createElement(
								"div",
								{
									id: "fad-art-image",
									className: CONFIG.enableFade && "fad-background-fade",
									style: {
										backgroundImage: this.state.cover,
									},
								},
								react.createElement(
									"div",
									{
										id: "fad-art-overlay",
									},
									react.createElement(
										"button",
										{
											id: "fad-heart",
											onClick: () => {
												Spicetify.Player.toggleHeart();
												this.setState({ heart: !this.state.heart });
											},
										},
										react.createElement(DisplayIcon, {
											icon: Spicetify.SVGIcons[this.state.heart ? "heart-active" : "heart"],
											size: 50,
										})
									)
								),
								react.createElement("div", {
									id: "fad-art-inner",
								})
							)
						),
						react.createElement(
							"div",
							{ id: "fad-details" },
							react.createElement(
								"div",
								{
									id: "fad-title",
									className: Spicetify.Player.data?.item?.type === "episode" ? "podcast-mode" : ""
								},
								this.state.title
							),
							Spicetify.Player.data?.item?.type === "episode" && react.createElement(
								"div",
								{
									style: {
										fontSize: "24px",
										fontWeight: "600",
										color: "rgba(255, 255, 255, 0.7)",
										marginTop: "10px",
										marginBottom: "15px",
										fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif"
									}
								},
								this.state.album || this.state.artist || ""
							),
							react.createElement(SubInfo, {
								id: "fad-artist",
								text: this.state.artist,
								icon: Spicetify.SVGIcons.artist,
							}),
							CONFIG.showAlbum &&
								react.createElement(SubInfo, {
									id: "fad-album",
									text: this.state.album,
									icon: Spicetify.SVGIcons.album,
								}),
							CONFIG.showReleaseDate &&
								react.createElement(SubInfo, {
									id: "fad-release-date",
									text: this.state.releaseDate,
									icon: Spicetify.SVGIcons.clock,
								}),
							react.createElement(
								"div",
								{
									id: "fad-status",
									className: (CONFIG.enableControl || CONFIG.enableProgress) && "active",
								},
								CONFIG.enableProgress && react.createElement(ProgressBar),
								CONFIG.enableControl && react.createElement(PlayerControls)
							)
						)
					),
					showRightPanel &&
						react.createElement(
							"div",
							{
								id: "fad-lyrics-plus-container",
							},
							Spicetify.Player.data?.item?.type === "episode"
								? react.createElement(PodcastVideo)
								: react.createElement(FADLyrics)
						)
				)
			);
		}
	}

	const classes = ["video", "video-full-screen", "video-full-window", "video-full-screen--hide-ui", "fad-activated"];

	const container = document.createElement("div");
	container.id = "fad-main";
	let cursorTimeout;
	let fad;

	async function toggleFullscreen() {
		if (CONFIG.enableFullscreen) {
			await document.documentElement.requestFullscreen();
			toggleCursor(false);
		} else if (document.webkitIsFullScreen) {
			await document.exitFullscreen();
			toggleCursor(true);
		}
	}

	function eventListener() {
		showCursor();
		cursorTimeout = setTimeout(hideCursor, 2000);
	}

	function showCursor() {
		fad.classList.remove("hide-cursor");
		clearTimeout(cursorTimeout);
	}

	function hideCursor() {
		fad.classList.add("hide-cursor");
	}

	function toggleCursor(show = true) {
		fad = document.getElementById("full-app-display");

		if (!fad) {
			setTimeout(toggleCursor, 300, show);
			return;
		}

		if (show) {
			document.removeEventListener("mousemove", eventListener);
			showCursor();
		} else {
			cursorTimeout = setTimeout(hideCursor, 2000);
			document.addEventListener("mousemove", eventListener);
		}
	}

	async function activate() {
		if (!Spicetify.Player.data) return;

		await toggleFullscreen();

		document.body.classList.add(...classes);
		document.body.append(style, container);
		reactDOM.render(react.createElement(FAD), container);
	}

	function deactivate() {
		if (CONFIG.enableFullscreen || document.webkitIsFullScreen) {
			document.exitFullscreen();
		}
		toggleCursor(true);
		document.body.classList.remove(...classes);
		reactDOM.unmountComponentAtNode(container);
		style.remove();
		container.remove();
		window.dispatchEvent(new Event("fad-request"));
	}

	function toggleFad() {
		if (document.body.classList.contains("fad-activated")) {
			deactivate();
		} else {
			activate();
		}
	}

	function updateStyle() {
		style.innerHTML = styleBase + styleChoices[CONFIG.vertical ? 1 : 0];
	}

	function getConfig() {
		const defaults = {
			enableLyrics: true,
			enableProgress: true,
			enableControl: true,
			trimTitle: true,
			vertical: true,
			enableFullscreen: true,
			enableFade: true
		};
		try {
			const parsed = JSON.parse(Spicetify.LocalStorage.get("full-app-display-config") || "{}");
			if (parsed && typeof parsed === "object") {
				for (const key in defaults) {
					if (parsed[key] === undefined) {
						parsed[key] = defaults[key];
					}
				}
				return parsed;
			}
			throw "";
		} catch {
			Spicetify.LocalStorage.set("full-app-display-config", JSON.stringify(defaults));
			return defaults;
		}
	}

	function saveConfig() {
		Spicetify.LocalStorage.set("full-app-display-config", JSON.stringify(CONFIG));
	}

	const ConfigItem = ({ name, field, func, disabled = false }) => {
		const [value, setValue] = useState(CONFIG[field]);
		return react.createElement(
			"div",
			{ className: "setting-row" },
			react.createElement("label", { className: "col description" }, name),
			react.createElement(
				"div",
				{ className: "col action" },
				react.createElement(
					"button",
					{
						className: `switch${value ? "" : " disabled"}`,
						disabled,
						onClick: () => {
							const state = !value;
							CONFIG[field] = state;
							setValue(state);
							saveConfig();
							func();
						},
					},
					react.createElement(DisplayIcon, {
						icon: Spicetify.SVGIcons.check,
						size: 16,
					})
				)
			)
		);
	};

	function openConfig(event) {
		event.preventDefault();
		const style = react.createElement("style", {
			dangerouslySetInnerHTML: {
				__html: `
.setting-row::after {
    content: "";
    display: table;
    clear: both;
}
.setting-row .col {
    display: flex;
    padding: 10px 0;
    align-items: center;
}
.setting-row .col.description {
    float: left;
    padding-right: 15px;
}
.setting-row .col.action {
    float: right;
    text-align: right;
}
button.switch {
    align-items: center;
    border: 0px;
    border-radius: 50%;
    background-color: rgba(var(--spice-rgb-shadow), .7);
    color: var(--spice-text);
    cursor: pointer;
    display: flex;
    margin-inline-start: 12px;
    padding: 8px;
}
button.switch.disabled,
button.switch[disabled] {
    color: rgba(var(--spice-rgb-text), .3);
}
`,
			},
		});
		const configContainer = react.createElement(
			"div",
			null,
			style,
			react.createElement(ConfigItem, {
				name: "Enable Lyrics & Podcast",
				field: "enableLyrics",
				func: () => {
					updateVisual();
				},
			}),
			react.createElement(ConfigItem, {
				name: "Enable progress bar",
				field: "enableProgress",
				func: updateVisual,
			}),
			react.createElement(ConfigItem, {
				name: "Enable controls",
				field: "enableControl",
				func: updateVisual,
			}),
			react.createElement(ConfigItem, {
				name: "Trim title",
				field: "trimTitle",
				func: updateVisual,
			}),
			react.createElement(ConfigItem, {
				name: "Show album",
				field: "showAlbum",
				func: updateVisual,
			}),
			react.createElement(ConfigItem, {
				name: "Show all artists",
				field: "showAllArtists",
				func: updateVisual,
			}),
			react.createElement(ConfigItem, {
				name: "Show release date",
				field: "showReleaseDate",
				func: updateVisual,
			}),
			react.createElement(ConfigItem, {
				name: "Show icons",
				field: "icons",
				func: updateVisual,
			}),
			react.createElement(ConfigItem, {
				name: "Vertical mode",
				field: "vertical",
				func: updateStyle,
			}),
			react.createElement(ConfigItem, {
				name: "Enable fullscreen",
				field: "enableFullscreen",
				func: toggleFullscreen,
			}),
			react.createElement(ConfigItem, {
				name: "Enable song change animation",
				field: "enableFade",
				func: updateVisual,
			})
		);
		Spicetify.PopupModal.display({
			title: "Full App Display",
			content: configContainer,
		});
	}

	new Spicetify.Topbar.Button(
		"Full App Display",
		`<svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="currentColor">${Spicetify.SVGIcons.projector}</svg>`,
		activate
	);

	Spicetify.Mousetrap.bind("f11", toggleFad);
})();