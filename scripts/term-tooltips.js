window.addEventListener('DOMContentLoaded', () => {
  const terms = Array.from(document.querySelectorAll('.term'));
  const debugBadge = document.createElement('div');
  debugBadge.textContent = 'terms ready';
  debugBadge.setAttribute('data-term-debug', 'true');
  Object.assign(debugBadge.style, {
    position: 'fixed',
    bottom: '6px',
    right: '8px',
    zIndex: '9999',
    fontSize: '12px',
    padding: '4px 6px',
    borderRadius: '6px',
    background: '#111',
    color: '#fff',
    opacity: '0.8'
  });
  document.body.appendChild(debugBadge);
  if (terms.length === 0) return;

  const closeAll = () => {
    terms.forEach((term) => {
      term.classList.remove('is-active');
      term.setAttribute('aria-expanded', 'false');
    });
  };

  const toggleTerm = (term) => {
    const isOpen = term.classList.contains('is-active');
    closeAll();
    if (!isOpen) {
      term.classList.add('is-active');
      term.setAttribute('aria-expanded', 'true');
    }
  };

  terms.forEach((term) => {
    term.setAttribute('role', 'button');
    term.setAttribute('aria-expanded', 'false');
    if (!term.hasAttribute('tabindex')) term.setAttribute('tabindex', '0');

    term.addEventListener('touchend', (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleTerm(term);
      debugBadge.textContent = 'touchend';
    }, { passive: false });

    term.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleTerm(term);
      debugBadge.textContent = 'click';
    });

    term.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleTerm(term);
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (event.target.closest('.term')) return;
    closeAll();
  });

  document.addEventListener('pointerdown', (event) => {
    if (event.target.closest('.term')) return;
    closeAll();
  });
});
