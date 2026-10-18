/**
 * main.js: shared across all pages
 *
 * 1. Nav: marks the current page link as active
 * 2. Animations: fade-in on scroll for .fade-in elements
 * 3. Module loader: dynamically loads page-specific JS from /js/pages/
 *
 * To add interactivity to a new page:
 *   - Create js/pages/my-page.js
 *   - Add <body data-page="my-page"> to the HTML file
 *   - Write your module as an ES-style default export or self-invoking function
 */

/* ── 1. Nav active state ──────────────────────────────────── */
(function markActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav ul a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
})();

/* ── 2. Fade-in on scroll ─────────────────────────────────── */
(function initFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  // Immediately show elements already in view on load
  const show = el => el.classList.add('visible');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { show(e.target); observer.unobserve(e.target); } });
    }, { threshold: 0.08 });
    els.forEach(el => observer.observe(el));
  } else {
    // Fallback: show everything immediately
    els.forEach(show);
  }
})();

/* ── 3. Page-specific module loader ───────────────────────── */
(function loadPageModule() {
  const page = document.body.dataset.page;
  if (!page) return;

  const script = document.createElement('script');
  script.src = `js/pages/${page}.js`;
  script.type = 'module';
  script.onerror = () => console.info(`No module found for page: ${page}`);
  document.body.appendChild(script);
})();

/* ── Utility: export helpers for use in page modules ─────── */
window.JG = {
  /**
   * Lightweight chart scaffold using Canvas API.
   * Usage in a page module:
   *   const canvas = document.getElementById('my-canvas');
   *   JG.canvas(canvas, (ctx, w, h) => { ... draw ... });
   */
  canvas(el, drawFn) {
    if (!el) return;
    const ctx = el.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const rect = el.parentElement.getBoundingClientRect();
      el.width  = rect.width  * dpr;
      el.height = rect.height * dpr;
      el.style.width  = rect.width  + 'px';
      el.style.height = rect.height + 'px';
      ctx.scale(dpr, dpr);
      drawFn(ctx, rect.width, rect.height);
    };
    window.addEventListener('resize', resize);
    resize();
  },

  /**
   * Simple reactive slider binding.
   * Usage:
   *   JG.slider('my-slider', 'my-value-display', v => { recalculate(v); });
   */
  slider(sliderId, displayId, onChange) {
    const slider  = document.getElementById(sliderId);
    const display = document.getElementById(displayId);
    if (!slider) return;
    const update = () => {
      if (display) display.textContent = slider.value;
      onChange(parseFloat(slider.value));
    };
    slider.addEventListener('input', update);
    update(); // initialise
  },
};
