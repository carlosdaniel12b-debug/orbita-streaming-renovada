(() => {
  'use strict';
  const intro = document.getElementById('intro');
  if (!intro) return;
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let endTimer, hideTimer, safetyTimer, previous, active = false;
  const locked = new Set();
  function finish() {
    clearTimeout(endTimer); clearTimeout(hideTimer); clearTimeout(safetyTimer);
    active = false;
    intro.hidden = true;
    intro.className = 'intro cinematic-intro dismissed';
    root.classList.remove('intro-pending');
    locked.forEach(el => { el.inert = false; }); locked.clear();
    document.body.classList.add('arrival');
    if (intro.contains(document.activeElement)) {
      const focus = previous?.isConnected && previous !== document.body ? previous : document.getElementById('hero-main-cta');
      focus?.focus({preventScroll:true});
    }
  }
  function close(immediate = false) {
    if (!active) return;
    clearTimeout(endTimer);
    if (immediate || reduce.matches) return finish();
    if (intro.classList.contains('leaving')) return;
    intro.classList.add('leaving');
    // Start the letter reveal only after the opaque portal has cleared.
    hideTimer = setTimeout(finish, 650);
  }
  function play({automatic = false} = {}) {
    if (automatic) {
      let seen = false;
      try { seen = sessionStorage.getItem('orbita-intro-seen') === '1'; } catch {}
      if (seen || window.location?.hash) {
        root.classList.add('returning-visit');
        finish();
        return;
      }
    }
    root.classList.remove('returning-visit');
    let paused = root.classList.contains('motion-paused');
    try { paused ||= localStorage.getItem('orbita-motion') === 'paused'; } catch {}
    if (reduce.matches || paused) { finish(); return; }
    if (active) finish();
    previous = document.activeElement;
    window.scrollTo?.({top:0, behavior:"instant"});
    active = true;
    try { sessionStorage.setItem('orbita-intro-seen', '1'); } catch {}
    intro.hidden = false;
    intro.className = 'intro cinematic-intro portal-active';
    document.body.classList.remove('arrival');
    root.classList.add('intro-pending');
    for (const el of document.body.children) {
      if (el !== intro && !['SCRIPT','STYLE'].includes(el.tagName) && !el.inert) { locked.add(el); el.inert = true; }
    }
    intro.querySelector('button')?.focus({preventScroll:true});
    // Independent wall-clock deadline; no animation event or rendering dependency.
    safetyTimer = setTimeout(finish, 3600);
    endTimer = setTimeout(() => close(), 1900);
  }
  window.OrbitaPortal = {play, close};
  window.closeOrbitaIntro = close;
  intro.querySelector('button')?.addEventListener('click', () => close());
  document.querySelectorAll('[data-replay]').forEach(button => button.addEventListener('click', play));
  document.addEventListener('keydown', event => {
    if (!active) return;
    if (event.key === 'Escape' || event.key === 'Enter') { event.preventDefault(); close(); }
    if (event.key === 'Tab') { event.preventDefault(); intro.querySelector('button')?.focus(); }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) close(true); });
  window.addEventListener('pagehide', finish);
  window.addEventListener('pageshow', event => { if (event.persisted) finish(); });
  reduce.addEventListener('change', () => { if (reduce.matches) close(true); });
  play({automatic:true});
})();
