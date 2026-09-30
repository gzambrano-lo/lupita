window.addEventListener('DOMContentLoaded', () => {
  const marqueeQuery = '.marquee-text, [data-mobile-marquee]';
  const mobileMarqueeMedia = window.matchMedia('(max-width: 620px)');
  const marqueeObservers = new WeakMap();
  const measuredMarquees = new Set();

  const getMarqueeText = (el) => {
    const copy = el.querySelector('.marquee-copy:not([aria-hidden="true"])');
    return (copy ? copy.textContent : el.textContent || '').trim();
  };

  const ensureMarqueeMarkup = (el) => {
    el.classList.add('mobile-marquee');

    let track = el.querySelector(':scope > .marquee-track');
    if (!track) {
      const text = (el.textContent || '').trim();
      el.textContent = '';
      track = document.createElement('span');
      track.className = 'marquee-track';

      const copy = document.createElement('span');
      copy.className = 'marquee-copy';
      copy.textContent = text;

      const duplicate = document.createElement('span');
      duplicate.className = 'marquee-copy';
      duplicate.setAttribute('aria-hidden', 'true');
      duplicate.textContent = text;

      track.append(copy, duplicate);
      el.append(track);
    }

    const copies = track.querySelectorAll('.marquee-copy');
    if (copies.length === 1) {
      const duplicate = copies[0].cloneNode(true);
      duplicate.setAttribute('aria-hidden', 'true');
      track.append(duplicate);
    }

    return track;
  };

  const measureMarquee = (el) => {
    if (!document.documentElement.contains(el)) return;

    const track = ensureMarqueeMarkup(el);
    const primaryCopy = track.querySelector('.marquee-copy:not([aria-hidden="true"])') || track.firstElementChild;
    const fullText = getMarqueeText(el);

    el.classList.remove('is-overflowing');
    el.removeAttribute('tabindex');

    if (!mobileMarqueeMedia.matches || !primaryCopy || !fullText) {
      el.removeAttribute('title');
      return;
    }

    const overflowBuffer = 2;
    const isOverflowing = primaryCopy.scrollWidth > el.clientWidth + overflowBuffer;

    el.classList.toggle('is-overflowing', isOverflowing);
    if (isOverflowing) {
      el.title = fullText;
      el.setAttribute('tabindex', '0');
      el.style.setProperty('--marquee-duration', Math.max(8, Math.min(18, fullText.length / 3.5)) + 's');
    } else {
      el.removeAttribute('title');
      el.style.removeProperty('--marquee-duration');
    }
  };

  const queueMarqueeMeasure = (el) => {
    requestAnimationFrame(() => measureMarquee(el));
  };

  const initMarquee = (el) => {
    if (!el || measuredMarquees.has(el)) return;

    measuredMarquees.add(el);
    ensureMarqueeMarkup(el);

    if ('ResizeObserver' in window) {
      const resizeObserver = new ResizeObserver(() => queueMarqueeMeasure(el));
      resizeObserver.observe(el);
      marqueeObservers.set(el, resizeObserver);
    }

    const mutationObserver = new MutationObserver(() => queueMarqueeMeasure(el));
    mutationObserver.observe(el, {
      characterData: true,
      childList: true,
      subtree: true
    });

    queueMarqueeMeasure(el);
  };

  const initMarquees = (root = document) => {
    root.querySelectorAll?.(marqueeQuery).forEach(initMarquee);
  };

  initMarquees();
  mobileMarqueeMedia.addEventListener?.('change', () => {
    measuredMarquees.forEach(queueMarqueeMeasure);
  });

  const marqueeDomObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        if (node.matches?.(marqueeQuery)) initMarquee(node);
        initMarquees(node);
      });
    });
  });

  marqueeDomObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

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
