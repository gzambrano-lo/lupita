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
    'WaVYr1APEyo',
    'YeX8xemV9rw'
  ];

  const pill = document.getElementById('musicPill');
  const dock = document.getElementById('musicDock');
  const dockBody = document.getElementById('dockBody');
  const dockClose = document.getElementById('dockClose');
  const dockPrev = document.getElementById('dockPrev');
  const dockNext = document.getElementById('dockNext');
  const dockMute = document.getElementById('dockMute');
  const dockHide = document.getElementById('dockHide');
  const dockLabel = document.getElementById('dockLabel');

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

  function updateLabel() {
    if (!dockLabel) return;
    if (!started) {
      dockLabel.textContent = 'paused';
    } else if (muted) {
      dockLabel.textContent = 'now playing (muted)';
    } else {
      dockLabel.textContent = 'now playing';
    }
  }

  function updateMuteButton() {
    if (!dockMute) return;
    dockMute.textContent = muted ? '🔇' : '🔊';
    dockMute.setAttribute('aria-label', muted ? 'unmute' : 'mute');
    dockMute.setAttribute('title', muted ? 'unmute (m)' : 'mute (m)');
  }

  function updateDockVisibility() {
    if (dock) dock.hidden = !started;
    if (pill) {
      if (started) pill.classList.add('playing');
      else pill.classList.remove('playing');
    }
    updateLabel();
    updateMuteButton();
  }

  function yt(cmd) {
    if (!iframe || !iframe.contentWindow) return;
    iframe.contentWindow.postMessage(
      JSON.stringify({
        event: 'command',
        func: cmd,
        args: []
      }),
      '*'
    );
  }

  function startDock() {
    ensureIframe();

    if (dockBody && !dockBody.contains(iframe)) {
      dockBody.innerHTML = '';
      dockBody.appendChild(iframe);
    }

    started = true;
    muted = true;          // start muted (safer autoplay)
    if (dock) dock.classList.remove('collapsed'); // start expanded

    updateDockVisibility();
    yt('mute');
    yt('playVideo');
  }

  function stopDock() {
    yt('pauseVideo');
    started = false;
    if (dock) dock.classList.remove('collapsed');
    updateDockVisibility();
  }

  function nextTrack() {
    if (!started) {
      startDock();
      return;
    }
    yt('nextVideo');
  }

  function prevTrack() {
    if (!started) {
      startDock();
      return;
    }
    yt('previousVideo');
  }

  function toggleMute() {
    if (!started) {
      startDock();
      return;
    }

    muted = !muted;

    if (muted) {
      yt('mute');
    } else {
      yt('unMute');
    }

    updateDockVisibility();
  }

  function toggleCollapse() {
    if (!started || !dock) return;
    const isCollapsed = dock.classList.toggle('collapsed');

    if (dockHide) {
      dockHide.textContent = isCollapsed ? '▴' : '▾';
      dockHide.setAttribute(
        'aria-label',
        isCollapsed ? 'expand player' : 'collapse player'
      );
      dockHide.setAttribute(
        'title',
        isCollapsed ? 'expand player' : 'collapse player'
      );
    }

    // label stays short when collapsed
    if (dockLabel && started) {
      if (isCollapsed) {
        dockLabel.textContent = '♪ playing';
      } else {
        updateLabel();
      }
    }
  }

  pill?.addEventListener('click', startDock);
  dockClose?.addEventListener('click', stopDock);
  dockNext?.addEventListener('click', nextTrack);
  dockPrev?.addEventListener('click', prevTrack);
  dockMute?.addEventListener('click', toggleMute);
  dockHide?.addEventListener('click', toggleCollapse);

  window.addEventListener('keydown', (e) => {
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;

    if (e.key === 'k' || e.key === 'K' || e.key === 'ArrowRight') nextTrack();
    if (e.key === 'j' || e.key === 'J' || e.key === 'ArrowLeft') prevTrack();
    if (e.key === 'm' || e.key === 'M') toggleMute();
  });

  window.GalleryMusic = { startDock, stopDock, nextTrack, prevTrack, toggleMute, toggleCollapse };
})();
