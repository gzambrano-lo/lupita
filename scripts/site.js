window.addEventListener('DOMContentLoaded', () => {
  const mainNav = document.querySelector('#nav_menu');
  if (mainNav) {
    const canonicalLabels = new Map([
      ['/index.html', 'home'],
      ['/pages/about.html', 'about'],
      ['/pages/music.html', 'music'],
      ['/pages/blog.html', 'blog'],
      ['/pages/links.html', 'links'],
      ['/pages/learn-to-code.html', 'learn to code'],
      ['/pages/project-senpai.html', 'project senpai']
    ]);
    const currentPath = window.location.pathname === '/' ? '/index.html' : window.location.pathname;
    const isBlogPostPage = document.body.classList.contains('post-page');
    const navList = mainNav.querySelector('.tab-nav-list');

    if (isBlogPostPage && navList && !mainNav.querySelector('a[href="/pages/blog.html"]')) {
      const blogItem = document.createElement('li');
      blogItem.className = 'tab-nav-item';
      blogItem.innerHTML = '<a class="tab-nav-link" href="/pages/blog.html">blog</a>';
      const linksItem = mainNav.querySelector('a[href="/pages/links.html"]')?.closest('li');
      navList.insertBefore(blogItem, linksItem || null);
    }

    if (isBlogPostPage && !document.querySelector('.minimal-post-back')) {
      const postHeader = document.querySelector('.post > header, .post-shell-header');
      if (postHeader) {
        const backLink = document.createElement('a');
        backLink.className = 'minimal-post-back';
        backLink.href = '/pages/blog.html';
        backLink.textContent = '\u2190 back';
        postHeader.insertBefore(backLink, postHeader.firstChild);
      }
    }

    mainNav.querySelectorAll('a[href]').forEach((link) => {
      const linkPath = new URL(link.href, window.location.href).pathname;
      if (canonicalLabels.has(linkPath)) {
        link.textContent = canonicalLabels.get(linkPath);
      }

      const isCurrent = linkPath === currentPath || (isBlogPostPage && linkPath === '/pages/blog.html');
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
    'sparkle-left': '/assets/animations/sparkle-left.json',
    'sparkle-right': '/assets/animations/sparkle-right.json',
    'new-sparkles': '/assets/animations/new_sparkles.json'
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
