    (function () {
      const root = document.querySelector("[data-youtube-pretty-player]");
      if (!root) return;

      const title = root.querySelector("[data-track-title]");
      const note = root.querySelector("[data-track-note]");
      const mood = root.querySelector("[data-track-mood]");
      const lyricsTrack = root.querySelector("[data-lyrics-track]");
      const lyricsPanel = root.querySelector("[data-track-lyrics]");
      const coverImg = root.querySelector("[data-track-cover]");
      const coverFrame = root.querySelector("[data-cover-frame]");
      const repeatTitle = root.querySelector("[data-repeat-title]");
      const repeatCover = root.querySelector("[data-repeat-cover]");
      const repeatPlays = root.querySelector("[data-repeat-plays]");
      const listenerUpdated = root.querySelector("[data-listener-updated]");
      const audio = root.querySelector("[data-track-audio]");
      const audioSource = root.querySelector("[data-track-audio-source]");
      const metaDate = root.querySelector("[data-meta-date]");
      const metaTags = root.querySelector("[data-meta-tags]");
      const metaNote = root.querySelector("[data-meta-note]");
      const drawerVideoShell = root.querySelector("[data-drawer-video-shell]");
      const drawerVideo = root.querySelector("[data-drawer-video]");
      const spotifyLink = root.querySelector("[data-link-spotify]");
      const appleLink = root.querySelector("[data-link-apple]");
      const youtubeLink = root.querySelector("[data-link-youtube]");
      const vinylLink = root.querySelector("[data-link-vinyl]");
      const queue = root.querySelector("[data-track-queue]");
      const queueTopBtn = root.querySelector("[data-track-queue-top]");
      const genreFilterBar = root.querySelector("[data-genre-filter-bar]");
      const backBtn = root.querySelector("[data-track-back]");
      const playBtn = root.querySelector("[data-track-play]");
      const forwardBtn = root.querySelector("[data-track-forward]");
      const infoToggle = root.querySelector("[data-player-info-toggle]");
      const drawer = root.querySelector("[data-player-drawer]");
      const defaultCover = "../assets/avatar.png";
      const extraGenres = [
        "desmadre mexicano"
      ];
      const playlist = Array.isArray(window.lupitaMusicPlaylist) ? window.lupitaMusicPlaylist : [];

      if (!playlist.length) return;

      let currentIndex = 0;
      let activeAudioSrc = "";
      let activeGenre = "all";
      let shuffleQueue = [];

      function refillShuffleQueue() {
        shuffleQueue = playlist
          .map(function (track, index) {
            return track.audioSrc ? index : -1;
          })
          .filter(function (index) {
            return index !== -1 && index !== currentIndex;
          });

        for (let index = shuffleQueue.length - 1; index > 0; index -= 1) {
          const randomIndex = Math.floor(Math.random() * (index + 1));
          const temporaryIndex = shuffleQueue[index];
          shuffleQueue[index] = shuffleQueue[randomIndex];
          shuffleQueue[randomIndex] = temporaryIndex;
        }
      }

      function playNextShuffledTrack() {
        if (!shuffleQueue.length) {
          refillShuffleQueue();
        }

        const nextIndex = shuffleQueue.shift();
        if (typeof nextIndex === "number") {
          renderTrack(nextIndex, true);
        }
      }

      function skipSequentialTrack(direction) {
        shuffleQueue = [];

        const nextIndex = (currentIndex + direction + playlist.length) % playlist.length;
        const nextTrack = playlist[nextIndex];
        const shouldKeepPlaying = Boolean(audio && !audio.paused && nextTrack && nextTrack.audioSrc);

        renderTrack(nextIndex, shouldKeepPlaying);
      }

      function toWatchUrl(embedUrl) {
        const match = embedUrl.match(/embed\/([^?]+)/);
        return match ? "https://www.youtube.com/watch?v=" + match[1] : embedUrl;
      }

      function getSongTitle(fullTitle) {
        const parts = String(fullTitle).split(/\s[-\u2013\u2014]\s/);
        return parts.length > 1 ? parts.slice(1).join(" - ") : String(fullTitle);
      }

      function getSongArtist(fullTitle) {
        const parts = String(fullTitle).split(/\s[-\u2013\u2014]\s/);
        return parts.length > 1 ? parts[0] : "lupe zambrano";
      }

      function getArtworkUrl(src) {
        return new URL(src || defaultCover, window.location.href).href;
      }

      function getArtworkType(src) {
        const pathname = String(src || "").split(/[?#]/)[0].toLowerCase();

        if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) {
          return "image/jpeg";
        }

        if (pathname.endsWith(".webp")) {
          return "image/webp";
        }

        return "image/png";
      }

      function syncMediaSession(track) {
        if (!("mediaSession" in navigator) || typeof MediaMetadata === "undefined" || !track) return;

        const artworkSrc = track.cover || defaultCover;

        navigator.mediaSession.metadata = new MediaMetadata({
          title: getSongTitle(track.title),
          artist: getSongArtist(track.title),
          album: "lupita.fm",
          artwork: [
            {
              src: getArtworkUrl(artworkSrc),
              sizes: "512x512",
              type: getArtworkType(artworkSrc)
            }
          ]
        });
      }

      function syncExternalLink(link, href) {
        if (!link) return;
        const available = Boolean(href);
        link.classList.toggle("is-unavailable", !available);
        link.setAttribute("aria-disabled", available ? "false" : "true");
        link.tabIndex = available ? 0 : -1;

        if (available) {
          link.href = href;
        } else {
          link.removeAttribute("href");
        }
      }

      function syncPlayButton() {
        if (!playBtn) return;

        const track = playlist[currentIndex];
        const hasDirectAudio = Boolean(track && track.audioSrc);
        const isPlayingDirectAudio = Boolean(hasDirectAudio && audio && !audio.paused);

        playBtn.dataset.state = isPlayingDirectAudio ? "playing" : "paused";
        playBtn.setAttribute("aria-pressed", isPlayingDirectAudio ? "true" : "false");
        playBtn.setAttribute("aria-label", isPlayingDirectAudio ? "Pause track" : "Play track");

        if ("mediaSession" in navigator) {
          navigator.mediaSession.playbackState = isPlayingDirectAudio ? "playing" : "paused";
        }
      }

      function getAudioMimeType(src) {
        const pathname = String(src).split(/[?#]/)[0].toLowerCase();

        if (pathname.endsWith(".mp4") || pathname.endsWith(".m4a")) {
          return "audio/mp4";
        }

        if (pathname.endsWith(".ogg") || pathname.endsWith(".oga")) {
          return "audio/ogg";
        }

        if (pathname.endsWith(".wav")) {
          return "audio/wav";
        }

        return "audio/mpeg";
      }

      function syncDrawer(track) {
        const tagsText = track.tags.join(", ");
        const embedUrl = track.embed || "";

        metaDate.closest(".player-meta-row").hidden = !track.date;
        metaTags.closest(".player-meta-row").hidden = !tagsText;
        metaNote.closest(".player-meta-row").hidden = !track.note;

        metaDate.textContent = track.date;
        metaTags.textContent = tagsText;
        metaNote.textContent = track.note;

        if (drawerVideoShell && drawerVideo) {
          drawerVideoShell.hidden = !embedUrl;
          drawerVideo.src = embedUrl;
          drawerVideo.title = track.title + " music video";
        }
      }

      function syncCover(img, track) {
        if (!img) return;

        const coverSrc = track.cover || defaultCover;
        img.hidden = false;
        img.dataset.hasCover = track.cover ? "true" : "false";
        img.src = coverSrc;
        img.alt = track.cover ? track.title + " cover art" : "";
      }

      function getGenres() {
        const genreSet = new Set(extraGenres);

        playlist.forEach(function (track) {
          (track.tags || []).forEach(function (tag) {
            if (tag) genreSet.add(tag);
          });
        });

        return Array.from(genreSet).sort(function (a, b) {
          return a.localeCompare(b);
        });
      }

      function renderGenreFilters() {
        if (!genreFilterBar) return;

        genreFilterBar.innerHTML = "";

        ["all"].concat(getGenres()).forEach(function (genre) {
          const button = document.createElement("button");
          const isActive = genre === activeGenre;

          button.type = "button";
          button.className = "genre-filter-button" + (isActive ? " is-active" : "");
          button.setAttribute("aria-pressed", isActive ? "true" : "false");
          button.textContent = genre;

          button.addEventListener("click", function () {
            activeGenre = genre;
            renderGenreFilters();
            renderQueue();
          });

          genreFilterBar.appendChild(button);
        });
      }

      function renderQueue() {
        queue.innerHTML = "";

        const visibleTracks = activeGenre === "all"
          ? playlist.map(function (track, index) {
            return { track: track, originalIndex: index };
          })
          : playlist
            .map(function (track, index) {
              return { track: track, originalIndex: index };
            })
            .filter(function (item) {
              return item.track.tags && item.track.tags.includes(activeGenre);
            });

        visibleTracks.forEach(function (item) {
          const track = item.track;
          const index = item.originalIndex;
          const button = document.createElement("button");
          button.type = "button";
          button.className = "queue-track" + (index === currentIndex ? " is-active" : "");
          button.setAttribute("aria-pressed", index === currentIndex ? "true" : "false");
          button.setAttribute("aria-label", "Show " + track.title);

          const number = document.createElement("span");
          number.className = "queue-track-index";
          number.textContent = String(index + 1).padStart(2, "0");

          const text = document.createElement("span");
          text.className = "queue-track-title";
          text.textContent = track.title;

          const marker = document.createElement("span");
          marker.className = "queue-track-marker";
          marker.setAttribute("aria-hidden", "true");

          const duration = document.createElement("span");
          duration.className = "queue-track-duration";
          duration.textContent = track.duration || "";
          duration.hidden = true;

          button.appendChild(number);
          button.appendChild(text);
          button.appendChild(duration);
          button.appendChild(marker);
          button.addEventListener("click", function () {
            renderTrack(index, true);
          });

          queue.appendChild(button);
        });

        syncQueueTopButton();
      }

      function syncQueueTopButton() {
        if (!queueTopBtn || !queue) return;

        const shouldShow = queue.scrollTop > 120;
        queueTopBtn.hidden = false;
        queueTopBtn.classList.toggle("is-visible", shouldShow);
        queueTopBtn.setAttribute("aria-hidden", shouldShow ? "false" : "true");
        queueTopBtn.tabIndex = shouldShow ? 0 : -1;
      }

      function getLyricsLines(track) {
        if (!track) return [];

        if (Array.isArray(track.lyrics)) {
          return track.lyrics.filter(function (line) {
            return line !== null && typeof line !== "undefined";
          });
        }

        if (typeof track.lyrics === "string" && track.lyrics.trim()) {
          return track.lyrics.split(/\n+/).map(function (line) {
            return line.trim();
          }).filter(Boolean);
        }

        return [];
      }

      function renderLyrics(track) {
        if (!lyricsPanel) return;

        const lines = getLyricsLines(track);
        lyricsPanel.innerHTML = "";

        if (lyricsTrack) {
          lyricsTrack.textContent = track ? track.title : "";
        }

        if (!lines.length) {
          const emptyMessage = document.createElement("p");
          emptyMessage.className = "lyrics-empty";
          emptyMessage.textContent = "lyrics coming soon for this track.";
          lyricsPanel.appendChild(emptyMessage);
          return;
        }

        lines.forEach(function (line) {
          const lyricLine = document.createElement("p");
          lyricLine.textContent = line;
          lyricsPanel.appendChild(lyricLine);
        });
      }

      function renderTrack(index, autoplay) {
        const track = playlist[index];
        if (!track) return;

        currentIndex = index;
        const fullTitle = title.querySelector(".track-title-full");
        const mobileTitle = title.querySelector(".track-title-mobile");

        if (fullTitle && mobileTitle) {
          fullTitle.textContent = track.title;
          mobileTitle.textContent = getSongTitle(track.title);
        } else {
          title.textContent = track.title;
        }
        const moodText = track.mood || track.note || "";
        note.hidden = !track.note;
        note.textContent = track.note;
        if (mood) {
          mood.hidden = true;
          mood.textContent = "";
        }
        if (coverFrame) {
          coverFrame.classList.toggle("has-cover", Boolean(track.cover));
          coverFrame.classList.remove("is-missing-cover");
        }
        if (coverImg) coverImg.hidden = false;
        if (repeatCover) repeatCover.hidden = false;
        syncCover(coverImg, track);
        syncCover(repeatCover, track);
        if (repeatTitle) repeatTitle.textContent = track.title;
        if (repeatPlays) repeatPlays.textContent = String(((index * 3) + 7) % 19 + 3).padStart(2, "0");
        if (listenerUpdated) listenerUpdated.textContent = track.date || "recently";
        syncExternalLink(spotifyLink, track.spotify);
        syncExternalLink(appleLink, track.apple);
        syncExternalLink(youtubeLink, track.youtube || (track.embed ? toWatchUrl(track.embed) : ""));
        syncExternalLink(vinylLink, track.vinyl);
        syncDrawer(track);
        renderLyrics(track);
        syncMediaSession(track);
        renderQueue();
        syncPlayButton();

        if (audio && audioSource) {
          const nextAudioSrc = track.audioSrc || "";
          const shouldReloadAudio = nextAudioSrc !== activeAudioSrc;

          if (shouldReloadAudio) {
            audio.pause();
            audioSource.src = nextAudioSrc;
            audioSource.type = getAudioMimeType(nextAudioSrc);
            const startTime = Math.max(0, Number(track.startTime) || 0);
            if (startTime > 0) {
              audio.addEventListener("loadedmetadata", function () {
                audio.currentTime = Math.min(startTime, audio.duration || startTime);
              }, { once: true });
            }
            audio.load();
            activeAudioSrc = nextAudioSrc;
            syncPlayButton();
          }

          if (autoplay && nextAudioSrc) {
            audio.play().catch(function (error) {
              console.error(error);
            });
            return;
          }
        }

        if (autoplay && track.embed) {
          window.open(toWatchUrl(track.embed), "_blank", "noopener,noreferrer");
        }
      }

      function setMediaSessionAction(action, handler) {
        if (!("mediaSession" in navigator)) return;

        try {
          navigator.mediaSession.setActionHandler(action, handler);
        } catch (error) {
          console.info("media session action not supported:", action, error);
        }
      }

      backBtn.addEventListener("click", function () {
        skipSequentialTrack(-1);
      });

      forwardBtn.addEventListener("click", function () {
        skipSequentialTrack(1);
      });

      if (queue && queueTopBtn) {
        queue.addEventListener("scroll", syncQueueTopButton);

        queueTopBtn.addEventListener("click", function () {
          queue.scrollTo({
            top: 0,
            behavior: "smooth"
          });
        });

        syncQueueTopButton();
      }

      playBtn.addEventListener("click", function () {
        const track = playlist[currentIndex];

        if (audio && track && track.audioSrc && activeAudioSrc === track.audioSrc && !audio.paused) {
          audio.pause();
          return;
        }

        renderTrack(currentIndex, true);
      });

      if (audio) {
        audio.addEventListener("play", syncPlayButton);
        audio.addEventListener("pause", syncPlayButton);
        audio.addEventListener("ended", function () {
          syncPlayButton();
          playNextShuffledTrack();
        });

        setMediaSessionAction("play", function () {
          renderTrack(currentIndex, true);
        });

        setMediaSessionAction("pause", function () {
          audio.pause();
        });

        setMediaSessionAction("previoustrack", function () {
          skipSequentialTrack(-1);
        });

        setMediaSessionAction("nexttrack", function () {
          skipSequentialTrack(1);
        });

      }

      if (infoToggle && drawer) {
        infoToggle.addEventListener("click", function () {
          const isOpen = infoToggle.getAttribute("aria-expanded") === "true";
          infoToggle.setAttribute("aria-expanded", isOpen ? "false" : "true");
          drawer.hidden = isOpen;
          drawer.classList.toggle("is-open", !isOpen);
        });
      }

      if (coverImg && coverFrame) {
        coverImg.addEventListener("load", function () {
          coverFrame.classList.remove("is-missing-cover");
          coverImg.hidden = false;
        });

        coverImg.addEventListener("error", function () {
          coverFrame.classList.add("is-missing-cover");
          coverImg.hidden = true;
        });
      }

      if (repeatCover) {
        repeatCover.addEventListener("error", function () {
          repeatCover.hidden = true;
        });
      }

      renderGenreFilters();
      renderTrack(0, false);
      syncPlayButton();
    }());
