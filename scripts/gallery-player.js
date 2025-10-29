/* gallery playlist mini-dock with prev/next + shortcuts */

(() => {
  // playlist (video IDs only)
  const YT_PLAYLIST = [
    'ZP-EMaoTB-k', // 1
    'Ol0-9Ob-QNk', // 2
    'rxaKVeiBiOE', // 3
    'O1KGn5aDnck'  // 4
  ];

  // elements
  const pill       = document.getElementById('musicPill');
  const dock       = document.getElementById('musicDock');
  const dockBody   = document.getElementById('dockBody');
  const dockClose  = document.getElementById('dockClose');
  const dockPrev   = document.getElementById('dockPrev');
  const dockNext   = document.getElementById('dockNext');

  // state
  let iframe;
  let index = 0; // current track index

  function srcFor(i){
    const params = new URLSearchParams({
      autoplay: 1,
      mute: 1,                // allow autoplay
      controls: 0,
      playsinline: 1,
      rel: 0,
      modestbranding: 1,
      loop: 1,
      playlist: YT_PLAYLIST.join(',') // loop whole list
    });
    return `https://www.youtube-nocookie.com/embed/${YT_PLAYLIST[i]}?${params.toString()}`;
  }

  function buildYT(i){
    const el = document.createElement('iframe');
    el.className = 'music-iframe';
    el.allow = 'autoplay; encrypted-media; picture-in-picture';
    el.src = srcFor(i);
    return el;
  }

  function mount(i){
    if (!iframe) iframe = buildYT(i);
    else iframe.src = srcFor(i);
    dockBody.innerHTML = '';
    dockBody.appendChild(iframe);
    dock.hidden = false;
    pill.classList.add('playing');
  }

  function startDock(){
    mount(index);
  }

  function stopDock(){
    dock.hidden = true;
    pill.classList.remove('playing');
    if (iframe) iframe.src = iframe.src; // reset/stop
  }

  function nextTrack(){
    index = (index + 1) % YT_PLAYLIST.length;
    mount(index);
  }

  function prevTrack(){
    index = (index - 1 + YT_PLAYLIST.length) % YT_PLAYLIST.length;
    mount(index);
  }

  // events
  pill?.addEventListener('click', startDock);
  dockClose?.addEventListener('click', stopDock);
  dockNext?.addEventListener('click', nextTrack);
  dockPrev?.addEventListener('click', prevTrack);

  // keyboard shortcuts anywhere on page
  // K = next, J = previous (also support ArrowRight/ArrowLeft)
  window.addEventListener('keydown', (e) => {
    if (e.target && ['INPUT','TEXTAREA'].includes(e.target.tagName)) return;
    if (e.key === 'k' || e.key === 'K' || e.key === 'ArrowRight') { nextTrack(); }
    if (e.key === 'j' || e.key === 'J' || e.key === 'ArrowLeft')  { prevTrack(); }
  });

  // expose for other UI (e.g., player card)
  window.GalleryMusic = { startDock, stopDock, nextTrack, prevTrack };
})();
