(() => {
  const carousels = document.querySelectorAll('.js-carousel');
  if (!carousels.length) return;

  carousels.forEach(setupCarousel);

  function setupCarousel(root) {
    const track = root.querySelector('[data-carousel-track]');
    const slides = track ? Array.from(track.querySelectorAll('[data-carousel-slide]')) : [];
    const prevBtn = root.querySelector('[data-carousel-prev]');
    const nextBtn = root.querySelector('[data-carousel-next]');
    const dotsContainer = root.querySelector('[data-carousel-dots]');
    const id = root.getAttribute('data-carousel') || '';

    if (!track || !slides.length) return;

    let index = 0;

    // create dots
    let dots = [];
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      dots = slides.map((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', `Show slide ${i + 1}`);
        dot.dataset.index = String(i);
        dotsContainer.appendChild(dot);
        return dot;
      });
    }

    function update() {
      const offset = -index * 100;
      track.style.transform = `translateX(${offset}%)`;

      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function goTo(newIndex) {
      if (newIndex < 0) {
        index = slides.length - 1;
      } else if (newIndex >= slides.length) {
        index = 0;
      } else {
        index = newIndex;
      }
      update();
      savePosition();
    }

    function savePosition() {
      if (!id) return;
      try {
        localStorage.setItem(`carousel:${id}`, String(index));
      } catch (_) {
        /* ignore storage errors */
      }
    }

    function restorePosition() {
      if (!id) return;
      try {
        const value = localStorage.getItem(`carousel:${id}`);
        if (value != null) {
          const storedIndex = parseInt(value, 10);
          if (!Number.isNaN(storedIndex) && storedIndex >= 0 && storedIndex < slides.length) {
            index = storedIndex;
          }
        }
      } catch (_) {
        /* ignore storage errors */
      }
    }

    // events
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goTo(index - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goTo(index + 1);
      });
    }

    if (dotsContainer) {
      dotsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.carousel-dot');
        if (!btn) return;
        const i = parseInt(btn.dataset.index || '0', 10);
        if (!Number.isNaN(i)) goTo(i);
      });
    }

    // swipe on touch devices
    let startX = null;

    track.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
    });

    track.addEventListener('touchmove', (e) => {
      if (startX === null || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - startX;
      // small threshold so it doesn't trigger accidentally
      if (Math.abs(dx) > 40) {
        if (dx > 0) {
          goTo(index - 1);
        } else {
          goTo(index + 1);
        }
        startX = null;
      }
    });

    track.addEventListener('touchend', () => {
      startX = null;
    });

    // init
    restorePosition();
    update();
  }
})();
