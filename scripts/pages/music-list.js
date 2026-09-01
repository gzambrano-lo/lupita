(function () {
  const list = document.querySelector("[data-minimal-track-list]");
  const audio = document.querySelector("[data-minimal-audio]");
  const previousButton = document.querySelector("[data-minimal-previous]");
  const playButton = document.querySelector("[data-minimal-play]");
  const nextButton = document.querySelector("[data-minimal-next]");
  const nowPlaying = document.querySelector("[data-minimal-now-playing]");
  const playlist = Array.isArray(window.lupitaMusicPlaylist) ? window.lupitaMusicPlaylist : [];
  const defaultCover = "../assets/profile/commissioned-avatar.png";

  if (!list || !playlist.length) return;

  let currentIndex = -1;
  const trackButtons = [];

  function splitTitle(value) {
    const text = String(value || "").trim();
    const parts = text.split(/\s[-\u2013\u2014]\s/);

    if (parts.length < 2) {
      return {
        artist: "",
        song: text
      };
    }

    return {
      artist: parts.shift(),
      song: parts.join(" - ")
    };
  }

  function syncPlayButton() {
    if (!playButton || !audio) return;

    const isPlaying = !audio.paused;
    playButton.classList.toggle("is-playing", isPlaying);
    playButton.setAttribute("aria-pressed", isPlaying ? "true" : "false");
    playButton.setAttribute("aria-label", isPlaying ? "Pause song" : "Play song");
  }

  function syncNowPlaying(track) {
    if (!nowPlaying) return;

    nowPlaying.textContent = "now playing: " + (track ? splitTitle(track.title).song : "pick a song");
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

    const title = splitTitle(track.title);
    const artworkSrc = track.cover || defaultCover;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: title.song,
      artist: title.artist || "lupe zambrano",
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

  function syncMediaPlaybackState() {
    if (!("mediaSession" in navigator) || !audio) return;

    navigator.mediaSession.playbackState = audio.paused ? "paused" : "playing";
  }

  function setMediaSessionAction(action, handler) {
    if (!("mediaSession" in navigator)) return;

    try {
      navigator.mediaSession.setActionHandler(action, handler);
    } catch (error) {
      console.info("media session action not supported:", action, error);
    }
  }

  function setActive(index, shouldPlay) {
    const button = trackButtons[index];
    const track = playlist[index];

    if (!button || !track) return;

    currentIndex = index;
    syncNowPlaying(track);
    syncMediaSession(track);

    list.querySelectorAll(".minimal-track").forEach(function (item) {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", active ? "true" : "false");
    });

    if (!audio || !track.audioSrc) return;

    if (audio.src !== new URL(track.audioSrc, window.location.href).href) {
      audio.src = track.audioSrc;
    }

    if (shouldPlay) {
      audio.play().catch(function () {});
    }

    syncPlayButton();
  }

  function skipTrack(direction) {
    const startingIndex = currentIndex === -1
      ? (direction < 0 ? 0 : -1)
      : currentIndex;
    const nextIndex = (startingIndex + direction + playlist.length) % playlist.length;
    const shouldKeepPlaying = Boolean(audio && !audio.paused);

    setActive(nextIndex, shouldKeepPlaying);
  }

  function togglePlay() {
    if (!audio) return;

    if (currentIndex === -1) {
      setActive(0, true);
      return;
    }

    if (!audio.paused) {
      audio.pause();
      return;
    }

    setActive(currentIndex, true);
  }

  playlist.forEach(function (track, index) {
    const title = splitTitle(track.title);
    const button = document.createElement("button");
    const number = document.createElement("span");
    const text = document.createElement("span");
    const song = document.createElement("span");
    const artist = document.createElement("span");
    const duration = document.createElement("span");

    button.type = "button";
    button.className = "minimal-track";
    button.setAttribute("aria-pressed", "false");

    number.className = "minimal-track-number";
    number.textContent = String(index + 1).padStart(2, "0");

    text.className = "minimal-track-text";

    song.className = "minimal-track-title";
    song.textContent = title.song;

    artist.className = "minimal-track-artist";
    artist.textContent = title.artist || "unknown artist";

    duration.className = "minimal-track-duration";
    duration.textContent = track.duration || "";

    text.append(song, artist);
    button.append(number, text, duration);
    button.addEventListener("click", function () {
      setActive(index, true);
    });

    trackButtons[index] = button;
    list.appendChild(button);
  });

  if (previousButton) {
    previousButton.addEventListener("click", function () {
      skipTrack(-1);
    });
  }

  if (playButton) {
    playButton.addEventListener("click", togglePlay);
  }

  if (nextButton) {
    nextButton.addEventListener("click", function () {
      skipTrack(1);
    });
  }

  if (audio) {
    audio.addEventListener("play", function () {
      syncPlayButton();
      syncMediaPlaybackState();
    });
    audio.addEventListener("pause", function () {
      syncPlayButton();
      syncMediaPlaybackState();
    });
    audio.addEventListener("ended", function () {
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % playlist.length;
      setActive(nextIndex, true);
    });

    setMediaSessionAction("play", function () {
      if (currentIndex === -1) {
        setActive(0, true);
        return;
      }

      setActive(currentIndex, true);
    });

    setMediaSessionAction("pause", function () {
      audio.pause();
    });

    setMediaSessionAction("previoustrack", function () {
      skipTrack(-1);
    });

    setMediaSessionAction("nexttrack", function () {
      skipTrack(1);
    });
  }

  syncNowPlaying(playlist[0]);
  syncMediaSession(playlist[0]);
  syncPlayButton();
  syncMediaPlaybackState();
}());
