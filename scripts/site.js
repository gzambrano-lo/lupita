window.addEventListener('DOMContentLoaded', () => {
  const mainNav = document.querySelector('#nav_menu');
  if (mainNav) {
    const canonicalLabels = new Map([
      ['/index.html', 'home'],
      ['/pages/about.html', 'about'],
      ['/pages/music.html', 'music'],
      ['/pages/learn-to-code.html', 'learn to code'],
      ['/pages/bleach-shrine.html', 'shrines'],
      ['/pages/project-senpai.html', 'project senpai']
    ]);
    const currentPath = window.location.pathname === '/' ? '/index.html' : window.location.pathname;

    mainNav.querySelectorAll('a[href]').forEach((link) => {
      const linkPath = new URL(link.href, window.location.href).pathname;
      if (canonicalLabels.has(linkPath)) {
        link.textContent = canonicalLabels.get(linkPath);
      }

      const isCurrent = linkPath === currentPath;
      if (isCurrent) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
      link.closest('li')?.classList.toggle('current', isCurrent);
    });
  }

  const banner = document.querySelector('.alert.alert-welcome');
  const closeBtn = banner?.querySelector('.alert-close');
  const KEY = 'welcomeBannerDismissed';

  if (localStorage.getItem(KEY) === '1') {
    banner?.remove();
  } else if (banner && closeBtn) {
    closeBtn.addEventListener('click', () => {
      banner.remove();
      localStorage.setItem(KEY, '1');
    });
  }

  document.querySelectorAll('.af-notes--warning .af-notes-close').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.closest('.af-notes--warning')?.remove();
    });
  });

  const fallback = (el, emoji) => {
    if (el && !el.hasChildNodes()) el.textContent = emoji;
  };

  if (!window.lottie) {
    document.querySelectorAll('[data-lottie="sparkle-left"]').forEach(el => fallback(el, '✨'));
    document.querySelectorAll('[data-lottie="sparkle-right"]').forEach(el => fallback(el, '✨'));
    document.querySelectorAll('[data-lottie="new-sparkles"]').forEach(el => fallback(el, 'new'));
    return;
  }

  const opts = { renderer: 'svg', loop: true, autoplay: true };

  const paths = {
    'sparkle-left': '/animations/sparkle-left.json',
    'sparkle-right': '/animations/sparkle-right.json',
    'new-sparkles': '/animations/new_sparkles.json'
  };

  document.querySelectorAll('[data-lottie]').forEach((el) => {
    const type = el.dataset.lottie;
    const path = paths[type];

    if (path) {
      lottie.loadAnimation({
        ...opts,
        container: el,
        path
      });
    }
  });
});
