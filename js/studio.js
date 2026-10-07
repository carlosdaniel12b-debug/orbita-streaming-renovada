/* Pointer depth is opt-in, bounded and independent of document scrolling. */
(() => {
  'use strict';
  const gallery = document.querySelector('.poster-gallery');
  if (!gallery) return;
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0, rect = null, x = 0, y = 0;
  const blocked = () => !fine.matches || reduce.matches || document.documentElement.classList.contains('motion-paused');
  function reset() {
    cancelAnimationFrame(frame); frame = 0; rect = null;
    gallery.style.removeProperty('transform');
  }
  gallery.addEventListener('pointerenter', e => {
    if (e.pointerType === 'mouse' && !blocked()) rect = gallery.getBoundingClientRect();
  });
  gallery.addEventListener('pointermove', e => {
    if (!rect || blocked() || e.pointerType !== 'mouse') return;
    x = Math.max(-.5, Math.min(.5, (e.clientX - rect.left) / rect.width - .5));
    y = Math.max(-.5, Math.min(.5, (e.clientY - rect.top) / rect.height - .5));
    if (!frame) frame = requestAnimationFrame(() => {
      gallery.style.transform = `perspective(1100px) rotateY(${x * 7}deg) rotateX(${-y * 4}deg)`;
      frame = 0;
    });
  }, {passive: true});
  gallery.addEventListener('pointerleave', reset);
  gallery.addEventListener('pointercancel', reset);
  fine.addEventListener('change', reset); reduce.addEventListener('change', reset);
  addEventListener('resize', reset);
  addEventListener('scroll', reset, {passive: true});
  addEventListener('pagehide', reset);
  document.addEventListener('visibilitychange', () => { if (document.hidden) reset(); });
  new MutationObserver(reset).observe(document.documentElement, {attributes: true, attributeFilter: ['class']});
})();
