window.addEventListener('DOMContentLoaded', () => {

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

  const fallback = (el, emoji) => {
    if (el && !el.hasChildNodes()) el.textContent = emoji;
  };

  if (!window.lottie) {
    document.querySelectorAll('[data-lottie="sparkle-left"]').forEach(el => fallback(el, '✨'));
    document.querySelectorAll('[data-lottie="sparkle-right"]').forEach(el => fallback(el, '✨'));
    return;
  }

  const opts = { renderer: 'svg', loop: true, autoplay: true };

  const paths = {
    'sparkle-left': '/animations/sparkle-left.json',
    'sparkle-right': '/animations/sparkle-right.json'
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
