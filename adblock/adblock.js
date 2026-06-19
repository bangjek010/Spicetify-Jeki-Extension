//@ts-check

// NAME: adblock
// AUTHOR: CharlieS1103 (Refactored & Enhanced)
// DESCRIPTION: Block all audio and UI ads on Spotify with auto-mute fallback, statistics, and Popup Modal settings

/// <reference path="../../spicetify-cli/globals.d.ts" />

(function adblock() {
    if (!Spicetify.Platform) {
        setTimeout(adblock, 300);
        return;
    }

    const { Platform } = Spicetify;

    // --- State and Stats Setup ---
    let isAdblockEnabled = localStorage.getItem("adblock-enabled") !== "false";
    let blockedStats = {
        audio: parseInt(localStorage.getItem("adblock-stats-audio") || "0", 10),
        billboard: parseInt(localStorage.getItem("adblock-stats-billboard") || "0", 10),
        ui: parseInt(localStorage.getItem("adblock-stats-ui") || "0", 10)
    };
    let wasMutedByAdblock = false;

    function saveStats() {
        localStorage.setItem("adblock-stats-audio", blockedStats.audio.toString());
        localStorage.setItem("adblock-stats-billboard", blockedStats.billboard.toString());
        localStorage.setItem("adblock-stats-ui", blockedStats.ui.toString());
    }

    function incrementBlocked(type) {
        blockedStats[type] += 1;
        saveStats();
        updateTopbarButton();
    }

    function showNotification(message) {
        if (typeof Spicetify.Toast?.show === 'function') {
            Spicetify.Toast.show(message);
        } else if (typeof Spicetify.showNotification === 'function') {
            Spicetify.showNotification(message);
        } else {
            console.log("[Adblock Toast]", message);
        }
    }

    // --- Dynamic CSS Injection ---
    const styleSheet = document.createElement("style");
    styleSheet.id = "adblock-styles";
    styleSheet.innerHTML = `
    .MnW5SczTcbdFHxLZ_Z8j, .WiPggcPDzbwGxoxwLWFf, .ReyA3uE3K7oEz7PTTnAn, .main-leaderboardComponent-container, .sponsor-container, a.link-subtle.main-navBar-navBarLink.GKnnhbExo0U9l7Jz2rdc, button[title="Upgrade to Premium"], button[aria-label="Upgrade to Premium"], .main-topBar-UpgradeButton, .main-contextMenu-menuItem a[href^="https://www.spotify.com/premium/"] {
        display: none !important;
    }
    `;
    document.body.appendChild(styleSheet);

    function updateStylesState() {
        styleSheet.disabled = !isAdblockEnabled;
    }
    updateStylesState();

    // --- Smart Dynamic UI Cleaner ---
    function cleanUI() {
        if (!isAdblockEnabled) return;

        let cleanedCount = 0;

        const upgradeSelectors = [
            'button[title*="Upgrade"]',
            'button[aria-label*="Upgrade"]',
            'a[href*="spotify.com/premium"]',
            '.main-topBar-UpgradeButton'
        ];

        upgradeSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((el) => {
                if (el.style.display !== 'none') {
                    el.style.display = 'none';
                    cleanedCount++;
                }
            });
        });

        const menuItems = document.querySelectorAll('li');
        menuItems.forEach((item) => {
            if (item.textContent && (item.textContent.includes("Upgrade to Premium") || item.textContent.includes("Premium"))) {
                const link = item.querySelector('a[href*="spotify.com/premium"]');
                if (link && item.style.display !== 'none') {
                    item.style.display = 'none';
                    cleanedCount++;
                }
            }
        });

        if (cleanedCount > 0) {
            blockedStats.ui += cleanedCount;
            saveStats();
        }
    }

    const uiObserver = new MutationObserver(() => {
        cleanUI();
    });
    uiObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // --- Hook Billboard Ads ---
    const adManagers = Platform.AdManagers;
    if (adManagers?.billboard?.displayBillboard) {
        const billboard = adManagers.billboard.displayBillboard;

        adManagers.billboard.displayBillboard = function (...args) {
            if (!isAdblockEnabled) {
                return billboard.apply(this, args);
            }

            try {
                adManagers.billboard.finish();
                incrementBlocked("billboard");
            } catch (e) {
                console.warn("[Adblock] Failed to finish billboard early:", e);
            }

            const ret = billboard.apply(this, args);

            try {
                adManagers.billboard.finish();
            } catch (e) {
                console.warn("[Adblock] Failed to finish billboard late:", e);
            }

            const observer = new MutationObserver((_, obs) => {
                const billboardAd = document.getElementById('view-billboard-ad');
                if (billboardAd) {
                    try {
                        adManagers.billboard.finish();
                    } catch (e) {
                        console.warn("[Adblock] Failed to finish billboard on mutation:", e);
                    }
                    obs.disconnect();
                }
            });

            observer.observe(document, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
            }, 10000);

            return ret;
        };
    }

    // --- Fallback Audio Ad Auto-Mute & Auto-Skip ---
    function handleTrackChange() {
        if (!isAdblockEnabled) return;

        const currentTrack = Spicetify.Player?.data?.track;
        if (!currentTrack) return;

        const isAd = currentTrack.metadata?.is_advertisement === "true" ||
            currentTrack.metadata?.ad_id ||
            currentTrack.uri?.includes("spotify:ad:");

        if (isAd) {
            if (!wasMutedByAdblock) {
                try {
                    Spicetify.Player.setMute(true);
                    wasMutedByAdblock = true;
                } catch (e) {
                    console.error("[Adblock] Failed to mute player:", e);
                }
            }
            try {
                Spicetify.Player.next();
                incrementBlocked("audio");
                showNotification("Adblock: Muted & Skipped Audio Ad!");
            } catch (e) {
                console.error("[Adblock] Failed to skip ad:", e);
            }
        } else {
            if (wasMutedByAdblock) {
                try {
                    Spicetify.Player.setMute(false);
                    wasMutedByAdblock = false;
                } catch (e) {
                    console.error("[Adblock] Failed to unmute player:", e);
                }
            }
        }
    }

    if (Spicetify.Player) {
        Spicetify.Player.addEventListener("songchange", handleTrackChange);
    }

    // --- Active Adblock Core ---
    async function delayAds() {
        if (!isAdblockEnabled) return;
        if (!Platform.UserAPI) {
            setTimeout(delayAds, 300);
            return;
        }

        try {
            const productState = Platform.UserAPI._product_state || Platform.UserAPI._product_state_service;
            if (productState && typeof productState.putOverridesValues === 'function') {
                await productState.putOverridesValues({
                    pairs: {
                        ads: "0",
                        catalogue: "premium",
                        product: "premium",
                        type: "premium"
                    }
                });
            }

            const am = Platform.AdManagers;
            if (am) {
                if (am.audio?.audioApi?.cosmosConnector) {
                    try {
                        am.audio.audioApi.cosmosConnector.increaseStreamTime(-100000000000);
                    } catch (e) {
                        console.warn("[Adblock] increaseStreamTime audio failed:", e);
                    }
                }
                if (am.billboard?.billboardApi?.cosmosConnector) {
                    try {
                        am.billboard.billboardApi.cosmosConnector.increaseStreamTime(-100000000000);
                    } catch (e) {
                        console.warn("[Adblock] increaseStreamTime billboard failed:", e);
                    }
                }

                if (am.audio && typeof am.audio.disable === 'function') {
                    await am.audio.disable().catch(e => console.warn("[Adblock] disable audio failed:", e));
                }
                if (am.billboard && typeof am.billboard.disable === 'function') {
                    await am.billboard.disable().catch(e => console.warn("[Adblock] disable billboard failed:", e));
                }
                if (am.leaderboard && typeof am.leaderboard.disableLeaderboard === 'function') {
                    await am.leaderboard.disableLeaderboard().catch(e => console.warn("[Adblock] disable leaderboard failed:", e));
                }
                if (am.sponsoredPlaylist && typeof am.sponsoredPlaylist.disable === 'function') {
                    await am.sponsoredPlaylist.disable().catch(e => console.warn("[Adblock] disable sponsoredPlaylist failed:", e));
                }
            }
        } catch (error) {
            console.error("[Adblock] Error during disabling ads:", error);
        }
    }

    delayAds();
    setInterval(delayAds, 30 * 1000);

    (async function subscribeToProductState() {
        if (!Platform.UserAPI) {
            setTimeout(subscribeToProductState, 300);
            return;
        }
        try {
            const productState = Platform.UserAPI._product_state || Platform.UserAPI._product_state_service;
            if (productState && typeof productState.subValues === 'function') {
                productState.subValues({ keys: ["ads"] }, () => {
                    delayAds();
                });
            }
        } catch (e) {
            console.log("[Adblock] Product State subscribe failed:", e);
        }
    })();

    // --- Modal Popup Settings UI ---
    function showAdblockModal() {
        if (typeof Spicetify.PopupModal?.display !== 'function') {
            showNotification(`Adblock: Enabled = ${isAdblockEnabled}. Stats: 🎧 ${blockedStats.audio} | 🖼️ ${blockedStats.billboard} | 🧹 ${blockedStats.ui}`);
            return;
        }

        const modalContent = document.createElement("div");
        modalContent.id = "adblock-modal-container";
        modalContent.innerHTML = `
            <style>
                .adblock-modal {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    color: #ffffff;
                    font-family: var(--font-family, sans-serif);
                    padding: 10px;
                }
                .adblock-toggle-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 16px;
                    border-radius: 12px;
                }
                .adblock-toggle-label {
                    font-size: 16px;
                    font-weight: 700;
                }
                /* Switch Toggle Styling */
                .adblock-switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 26px;
                }
                .adblock-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .adblock-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-color: #727272;
                    transition: .4s;
                    border-radius: 34px;
                }
                .adblock-slider:before {
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }
                input:checked + .adblock-slider {
                    background-color: #1db954;
                }
                input:checked + .adblock-slider:before {
                    transform: translateX(24px);
                }
                .adblock-stats-section {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .adblock-stats-title {
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: #b3b3b3;
                    font-weight: 700;
                }
                .adblock-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 12px;
                }
                .adblock-stat-card {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 14px;
                    border-radius: 12px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }
                .adblock-stat-num {
                    font-size: 22px;
                    font-weight: 800;
                    color: #1db954;
                }
                .adblock-stat-name {
                    font-size: 12px;
                    color: #b3b3b3;
                }
                .adblock-btn-reset {
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    color: white;
                    padding: 10px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: background 0.2s;
                }
                .adblock-btn-reset:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            </style>
            <div class="adblock-modal">
                <div class="adblock-toggle-row">
                  <span class="adblock-toggle-label">Enable Adblocker</span>
                  <label class="adblock-switch">
                    <input type="checkbox" id="adblock-toggle-chk" ${isAdblockEnabled ? 'checked' : ''}>
                    <span class="adblock-slider"></span>
                  </label>
                </div>
                
                <div class="adblock-stats-section">
                  <div class="adblock-stats-title">Blocking Statistics</div>
                  <div class="adblock-stats-grid">
                    <div class="adblock-stat-card">
                      <span class="adblock-stat-num" id="stat-audio">${blockedStats.audio}</span>
                      <span class="adblock-stat-name">🎧 Audio Ads</span>
                    </div>
                    <div class="adblock-stat-card">
                      <span class="adblock-stat-num" id="stat-billboard">${blockedStats.billboard}</span>
                      <span class="adblock-stat-name">🖼️ Billboards</span>
                    </div>
                    <div class="adblock-stat-card">
                      <span class="adblock-stat-num" id="stat-ui">${blockedStats.ui}</span>
                      <span class="adblock-stat-name">🧹 UI Elements</span>
                    </div>
                  </div>
                </div>
                <button class="adblock-btn-reset" id="adblock-reset-btn">Reset Statistics</button>
            </div>
        `;

        const chk = modalContent.querySelector("#adblock-toggle-chk");
        if (chk) {
            chk.addEventListener("change", (e) => {
                // @ts-ignore
                isAdblockEnabled = e.target.checked;
                localStorage.setItem("adblock-enabled", isAdblockEnabled ? "true" : "false");
                updateStylesState();
                updateTopbarButton();
                if (isAdblockEnabled) {
                    delayAds();
                }
            });
        }

        const resetBtn = modalContent.querySelector("#adblock-reset-btn");
        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                blockedStats = { audio: 0, billboard: 0, ui: 0 };
                saveStats();
                updateTopbarButton();

                const a = modalContent.querySelector("#stat-audio");
                const b = modalContent.querySelector("#stat-billboard");
                const u = modalContent.querySelector("#stat-ui");
                if (a) a.textContent = "0";
                if (b) b.textContent = "0";
                if (u) u.textContent = "0";
                
                showNotification("Adblock: Stats reset successfully!");
            });
        }

        Spicetify.PopupModal.display({
            title: "Adblocker Settings & Stats",
            content: modalContent
        });
    }

    // --- Topbar Button Registration ---
    let topbarButton;

    function updateTopbarButton() {
        if (!topbarButton) return;
        const btnElement = topbarButton.element;
        if (btnElement) {
            btnElement.style.color = isAdblockEnabled ? "#1db954" : "currentColor";
            btnElement.title = `Adblock Settings & Stats`;
        }
    }

    function initTopbarButton() {
        if (typeof Spicetify.Topbar?.Button !== 'function') {
            setTimeout(initTopbarButton, 500);
            return;
        }

        try {
            // Menggunakan tombol Topbar yang ketika ditekan membuka Popup Modal Settings
            topbarButton = new Spicetify.Topbar.Button(
                "Adblocker Settings",
                `<svg role="img" height="16" width="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>`,
                showAdblockModal
            );

            updateTopbarButton();
        } catch (e) {
            console.error("[Adblock] Topbar Button registration failed:", e);
        }
    }

    initTopbarButton();
})();
