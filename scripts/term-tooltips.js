window.addEventListener('DOMContentLoaded', () => {
  const terms = Array.from(document.querySelectorAll('.term'));
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
    }, { passive: false });

    term.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleTerm(term);
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
