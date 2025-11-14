(() => {
  const YT_PLAYLIST = ['VgckulYQmh4','ZP-EMaoTB-k','rxaKVeiBiOE','O1KGn5aDnck','WaVYr1APEyo'];

  const pill = document.getElementById('musicPill');
  const dock = document.getElementById('musicDock');
  const dockBody = document.getElementById('dockBody');
  const dockClose = document.getElementById('dockClose');
  const dockPrev = document.getElementById('dockPrev');
  const dockNext = document.getElementById('dockNext');
  const dockMute = document.getElementById('dockMute');
  const dockLabel = document.getElementById('dockLabel');

  let player = null;
  let playerReady = false;
  let muted = true;
  let started = false;

  function updateUI() {
    if (dock) dock.hidden = false;
    if (pill) pill.classList.add('playing');
    if (dockLabel) dockLabel.textContent = muted ? 'now playing (muted)' : 'now playing';
    if (dockMute) {
      dockMute.textContent = muted ? '🔇' : '🔊';
      dockMute.setAttribute('aria-label', muted ? 'unmute' : 'mute');
      dockMute.setAttribute('title', muted ? 'unmute (m)' : 'mute (m)');
    }
  }

  function startDock() {
    if (!dock || !pill) return;
    dock.hidden = false;
    pill.classList.add('playing');
    started = true;
    if (playerReady && player) {
      if (muted) player.mute();
      else player.unMute();
      player.playVideo();
    }
    updateUI();
  }

  function stopDock() {
    if (dock) dock.hidden = true;
    if (pill) pill.classList.remove('playing');
    if (dockLabel) dockLabel.textContent = 'paused';
    if (playerReady && player) player.pauseVideo();
  }

  function nextTrack() {
    if (!started) {
      startDock();
      return;
    }
    if (playerReady && player) player.nextVideo();
  }

  function prevTrack() {
    if (!started) {
      startDock();
      return;
    }
    if (playerReady && player) player.previousVideo();
  }

  function toggleMute() {
    if (!started) {
      startDock();
      return;
    }
    muted = !muted;
    if (playerReady && player) {
      if (muted) player.mute();
      else player.unMute();
    }
    updateUI();
  }

  pill && pill.addEventListener('click', startDock);
  dockClose && dockClose.addEventListener('click', stopDock);
  dockNext && dockNext.addEventListener('click', nextTrack);
  dockPrev && dockPrev.addEventListener('click', prevTrack);
  dockMute && dockMute.addEventListener('click', toggleMute);

  window.addEventListener('keydown', (e) => {
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (e.key === 'k' || e.key === 'K' || e.key === 'ArrowRight') nextTrack();
    if (e.key === 'j' || e.key === 'J' || e.key === 'ArrowLeft') prevTrack();
    if (e.key === 'm' || e.key === 'M') toggleMute();
  });

  window.onYouTubeIframeAPIReady = function () {
    if (!dockBody) return;
    player = new YT.Player(dockBody, {
      width: '100%',
      height: '100%',
      videoId: YT_PLAYLIST[0],
      playerVars: {
        autoplay: 0,
        controls: 0,
        rel: 0,
        playsinline: 1,
        loop: 1,
        modestbranding: 1,
        playlist: YT_PLAYLIST.join(',')
      },
      events: {
        onReady: function () {
          playerReady = true;
          if (muted && player) player.mute();
          const iframe = dockBody.querySelector('iframe');
          if (iframe) iframe.classList.add('music-iframe');
        }
      }
    });
  };

  window.GalleryMusic = { startDock, stopDock, nextTrack, prevTrack, toggleMute };
})();
