window.addEventListener('DOMContentLoaded', () => {
  const isCoarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (!isCoarsePointer) return;

  const terms = Array.from(document.querySelectorAll('.term'));
  if (terms.length === 0) return;

  const tooltip = document.createElement('div');
  tooltip.className = 'term-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.setAttribute('aria-hidden', 'true');

  const tooltipText = document.createElement('p');
  tooltip.appendChild(tooltipText);
  document.body.appendChild(tooltip);

  const closeAll = () => {
    terms.forEach((term) => {
      term.classList.remove('is-active');
      term.setAttribute('aria-expanded', 'false');
    });
    tooltip.classList.remove('is-visible');
    tooltip.setAttribute('aria-hidden', 'true');
    tooltip.style.left = '';
    tooltip.style.top = '';
    tooltip.style.right = '';
    tooltip.style.bottom = '';
  };

  const positionTooltip = (term) => {
    const rect = term.getBoundingClientRect();
    const vv = window.visualViewport || { width: window.innerWidth, height: window.innerHeight, offsetLeft: 0, offsetTop: 0 };
    const padding = 12;
    const gap = 10;

    tooltip.style.left = '0px';
    tooltip.style.top = '0px';
    tooltip.style.right = 'auto';
    tooltip.style.bottom = 'auto';

    const tipRect = tooltip.getBoundingClientRect();
    const fitsBelow = rect.bottom + gap + tipRect.height + padding <= vv.height;

    const center = rect.left + rect.width / 2;
    let left = center - tipRect.width / 2;
    left = Math.max(padding, Math.min(left, vv.width - padding - tipRect.width));

    let top = fitsBelow ? rect.bottom + gap : rect.top - gap - tipRect.height;
    top = Math.max(padding, Math.min(top, vv.height - padding - tipRect.height));

    tooltip.style.left = `${left + (vv.offsetLeft || 0)}px`;
    tooltip.style.top = `${top + (vv.offsetTop || 0)}px`;
  };

  const toggleTerm = (term) => {
    const definition = term.getAttribute('data-def');
    if (!definition) {
      closeAll();
      return;
    }
    const isOpen = term.classList.contains('is-active');
    closeAll();
    if (!isOpen) {
      term.classList.add('is-active');
      term.setAttribute('aria-expanded', 'true');
      tooltipText.textContent = definition;
      tooltip.classList.add('is-visible');
      tooltip.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(() => positionTooltip(term));
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
