(function () {
    function parsePlaylist(root) {
        const dataEl = root.querySelector("[data-pretty-player-playlist]");
        if (!dataEl) return [];

        try {
            const parsed = JSON.parse(dataEl.textContent || "[]");
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error("pretty music player: invalid playlist json", error);
            return [];
        }
    }

    function formatTime(seconds) {
        if (!Number.isFinite(seconds)) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return minutes + ":" + String(secs).padStart(2, "0");
    }

    function syncPlatformLink(link, href) {
        if (!link) return;
        const isAvailable = Boolean(href) && href !== "#";
        link.hidden = false;
        link.classList.toggle("is-unavailable", !isAvailable);
        link.setAttribute("aria-hidden", "false");
        link.setAttribute("aria-disabled", isAvailable ? "false" : "true");
        link.tabIndex = isAvailable ? 0 : -1;

        if (isAvailable) {
            link.href = href;
        } else {
            link.removeAttribute("href");
        }
    }

    function syncMetaRow(labelEl, valueEl, pair) {
        if (!labelEl || !valueEl) return;

        const row = labelEl.closest(".player-meta-row");
        const label = pair && pair[0] ? pair[0] : "";
        const value = pair && pair[1] ? pair[1] : "";
        const normalizedLabel = String(label).toLowerCase();
        const isVisible = Boolean(label) && Boolean(value) && normalizedLabel !== "note" && normalizedLabel !== "song";

        if (row) {
            row.hidden = !isVisible;
            row.style.display = isVisible ? "" : "none";
        }

        if (!isVisible) {
            labelEl.textContent = "";
            valueEl.textContent = "";
            return;
        }

        labelEl.textContent = String(label).toLowerCase();
        valueEl.textContent = String(value).toLowerCase();
    }

    function initPrettyMusicPlayer(root, index) {
        const audio = root.querySelector("[data-audio-player]");
        const source = root.querySelector("[data-audio-source]");
        const toggle = root.querySelector("[data-audio-toggle]");
        const progress = root.querySelector("[data-audio-progress]");
        const current = root.querySelector("[data-time-current]");
        const total = root.querySelector("[data-time-total]");
        const backBtn = root.querySelector("[data-audio-back]");
        const forwardBtn = root.querySelector("[data-audio-forward]");
        const infoToggle = root.querySelector("[data-player-info-toggle]");
        const drawer = root.querySelector("[data-player-drawer]");
        const trackTitle = root.querySelector("[data-track-title]");
        const queue = root.querySelector("[data-track-queue]");
        const metaLabel1 = root.querySelector("[data-meta-label-1]");
        const metaLabel2 = root.querySelector("[data-meta-label-2]");
        const metaLabel3 = root.querySelector("[data-meta-label-3]");
        const metaLabel4 = root.querySelector("[data-meta-label-4]");
        const metaValue1 = root.querySelector("[data-meta-value-1]");
        const metaValue2 = root.querySelector("[data-meta-value-2]");
        const metaValue3 = root.querySelector("[data-meta-value-3]");
        const metaValue4 = root.querySelector("[data-meta-value-4]");
        const spotifyLink = root.querySelector("[data-link-spotify]");
        const appleLink = root.querySelector("[data-link-apple]");
        const youtubeLink = root.querySelector("[data-link-youtube]");
        const playlist = parsePlaylist(root);
        let currentTrackIndex = 0;

        if (!audio || !source || !toggle || !progress || !current || !total || !playlist.length) return;

        const progressId = "pretty-music-player-progress-" + index;
        const drawerId = "pretty-music-player-drawer-" + index;
        progress.id = progressId;
        if (drawer) drawer.id = drawerId;

        const progressLabel = root.querySelector('label[for]');
        if (progressLabel) progressLabel.setAttribute("for", progressId);
        if (infoToggle && drawer) infoToggle.setAttribute("aria-controls", drawerId);

        function updateProgressVisual(percent) {
            progress.style.setProperty("--progress", percent + "%");
        }

        function renderQueue() {
            if (!queue) return;
            queue.innerHTML = "";

            playlist.forEach(function (track, trackIndex) {
                const button = document.createElement("button");
                const isActive = trackIndex === currentTrackIndex;
                button.type = "button";
                button.className = "queue-track" + (isActive ? " is-active" : "");
                button.setAttribute("aria-pressed", isActive ? "true" : "false");
                button.setAttribute("aria-label", "Play " + track.title);

                const number = document.createElement("span");
                number.className = "queue-track-index";
                number.textContent = String(trackIndex + 1).padStart(2, "0");

                const text = document.createElement("span");
                text.className = "queue-track-title";
                text.textContent = String(track.title).toLowerCase();

                const marker = document.createElement("span");
                marker.className = "queue-track-marker";
                marker.setAttribute("aria-hidden", "true");

                button.appendChild(number);
                button.appendChild(text);
                button.appendChild(marker);
                button.addEventListener("click", function () {
                    renderTrack(trackIndex, true);
                });

                queue.appendChild(button);
            });
        }

        function syncUi() {
            const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
            const time = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
            const percent = duration > 0 ? (time / duration) * 100 : 0;
            const isPlaying = !audio.paused;

            progress.value = percent;
            updateProgressVisual(percent);
            current.textContent = formatTime(time);
            total.textContent = formatTime(duration);
            toggle.dataset.state = isPlaying ? "playing" : "paused";
            toggle.setAttribute("aria-pressed", isPlaying ? "true" : "false");
            toggle.setAttribute("aria-label", isPlaying ? "Pause track" : "Play track");
        }

        function renderTrack(trackIndex, shouldAutoplay) {
            const track = playlist[trackIndex];
            if (!track) return;

            currentTrackIndex = trackIndex;
            audio.pause();
            source.src = track.src;
            source.type = track.type || "audio/mpeg";
            audio.load();

            if (trackTitle) trackTitle.textContent = String(track.title).toLowerCase();
            syncMetaRow(metaLabel1, metaValue1, track.meta && track.meta[0]);
            syncMetaRow(metaLabel2, metaValue2, track.meta && track.meta[1]);
            syncMetaRow(metaLabel3, metaValue3, track.meta && track.meta[2]);
            syncMetaRow(metaLabel4, metaValue4, track.meta && track.meta[3]);
            syncPlatformLink(spotifyLink, track.links && track.links.spotify);
            syncPlatformLink(appleLink, track.links && track.links.apple);
            syncPlatformLink(youtubeLink, track.links && track.links.youtube);

            progress.value = 0;
            current.textContent = "0:00";
            total.textContent = "0:00";
            updateProgressVisual(0);
            renderQueue();
            syncUi();

            if (shouldAutoplay) {
                audio.play().catch(function (error) {
                    console.error(error);
                });
            }
        }

        toggle.addEventListener("click", function () {
            if (audio.paused) {
                audio.play().catch(function (error) {
                    console.error(error);
                });
            } else {
                audio.pause();
            }
        });

        progress.addEventListener("input", function () {
            const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
            const percent = Number(progress.value);
            updateProgressVisual(percent);
            if (duration > 0) {
                audio.currentTime = (percent / 100) * duration;
            }
        });

        if (backBtn) {
            backBtn.addEventListener("click", function () {
                renderTrack((currentTrackIndex - 1 + playlist.length) % playlist.length, true);
            });
        }

        if (forwardBtn) {
            forwardBtn.addEventListener("click", function () {
                renderTrack((currentTrackIndex + 1) % playlist.length, true);
            });
        }

        audio.addEventListener("loadedmetadata", syncUi);
        audio.addEventListener("timeupdate", syncUi);
        audio.addEventListener("play", syncUi);
        audio.addEventListener("pause", syncUi);
        audio.addEventListener("ended", function () {
            renderTrack((currentTrackIndex + 1) % playlist.length, true);
        });

        if (infoToggle && drawer) {
            function closeDrawer() {
                infoToggle.setAttribute("aria-expanded", "false");
                drawer.classList.remove("is-open");
                window.setTimeout(function () {
                    if (infoToggle.getAttribute("aria-expanded") === "false") {
                        drawer.hidden = true;
                    }
                }, 220);
            }

            function openDrawer() {
                drawer.hidden = false;
                requestAnimationFrame(function () {
                    drawer.classList.add("is-open");
                });
                infoToggle.setAttribute("aria-expanded", "true");
            }

            infoToggle.addEventListener("click", function () {
                const isOpen = infoToggle.getAttribute("aria-expanded") === "true";
                if (isOpen) {
                    closeDrawer();
                } else {
                    openDrawer();
                }
            });

            document.addEventListener("keydown", function (event) {
                if (event.key === "Escape" && infoToggle.getAttribute("aria-expanded") === "true") {
                    closeDrawer();
                    infoToggle.focus();
                }
            });
        }

        renderTrack(currentTrackIndex, false);
        syncUi();
    }

    document.querySelectorAll("[data-pretty-music-player]").forEach(function (root, index) {
        initPrettyMusicPlayer(root, index + 1);
    });
})();
