(() => {
  const YT_PLAYLIST = [
    'PqN8IN8TMC8',
    '5kV5cdaQh1M',
    'cU6ZGcn3ndI',
    '6w3CvOy3btM',
    'WhY_XF9t20A',
    'VgckulYQmh4',
    'y_SJEvguMF8',
    'ZP-EMaoTB-k',
    'LzTnxAFYFSE',
    'rxaKVeiBiOE',
    'O1KGn5aDnck',
    'WaVYr1APEyo'
  ];

  const pill = document.getElementById('musicPill');
  const dock = document.getElementById('musicDock');
  const dockBody = document.getElementById('dockBody');
  const dockClose = document.getElementById('dockClose');
  const dockPrev = document.getElementById('dockPrev');
  const dockNext = document.getElementById('dockNext');
  const dockMute = document.getElementById('dockMute');
  const dockLabel = document.getElementById('dockLabel');
  const dockHide = document.getElementById('dockHide');

  let iframe;
  let muted = true;
  let started = false;

  function srcFor(startIndex = 0) {
    const params = new URLSearchParams({
      autoplay: 0,
      mute: 1,
      controls: 0,
      playsinline: 1,
      rel: 0,
      modestbranding: 1,
      loop: 1,
      playlist: YT_PLAYLIST.join(','),
      enablejsapi: 1
    });

    if (location.origin && location.origin !== 'null') {
      params.set('origin', location.origin);
    }

    return `https://www.youtube-nocookie.com/embed/${YT_PLAYLIST[startIndex]}?${params.toString()}`;
  }

  function ensureIframe() {
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.className = 'music-iframe';
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.setAttribute('title', 'YouTube player');
      iframe.src = srcFor(0);
    }
  }

  function updateUI() {
    if (dock) dock.hidden = false;
    if (pill) pill.classList.add('playing');
    if (dockLabel) dockLabel.textContent = muted ? 'now playing (muted)' : 'now playing';
    if (dockMute) {
      dockMute.textContent = muted ? '🔇' : '🔊';
      dockMute.setAttribute('aria-label', muted ? 'unmute' : 'mute');
    }
  }

  function yt(cmd) {
    if (!iframe || !iframe.contentWindow) return;
    iframe.contentWindow.postMessage(JSON.stringify({
      event: 'command',
      func: cmd,
      args: []
    }), '*');
  }

  function startDock() {
    ensureIframe();
    if (dockBody && !dockBody.contains(iframe)) {
      dockBody.innerHTML = '';
      dockBody.appendChild(iframe);
    }
    updateUI();
    started = true;
    yt('playVideo');
  }

  function stopDock() {
    if (dock) dock.hidden = true;
    if (pill) pill.classList.remove('playing');
    if (dockLabel) dockLabel.textContent = 'paused';
    yt('pauseVideo');
    started = false;
  }

  function nextTrack() {
    if (!started) return startDock();
    yt('nextVideo');
  }

  function prevTrack() {
    if (!started) return startDock();
    yt('previousVideo');
  }

  function toggleMute() {
    if (!started) return startDock();
    muted = !muted;
    if (muted) yt('mute');
    else yt('unMute');
    updateUI();
  }

  function toggleHide() {
    if (!dock) return;
    dock.classList.toggle('collapsed');
  }

  pill?.addEventListener('click', startDock);
  dockClose?.addEventListener('click', stopDock);
  dockNext?.addEventListener('click', nextTrack);
  dockPrev?.addEventListener('click', prevTrack);
  dockMute?.addEventListener('click', toggleMute);
  dockHide?.addEventListener('click', toggleHide);

  window.addEventListener('keydown', (e) => {
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (e.key === 'k' || e.key === 'K' || e.key === 'ArrowRight') nextTrack();
    if (e.key === 'j' || e.key === 'J' || e.key === 'ArrowLeft') prevTrack();
    if (e.key === 'm' || e.key === 'M') toggleMute();
  });

  window.GalleryMusic = { startDock, stopDock, nextTrack, prevTrack, toggleMute };
})();
