(() => {
  'use strict';
  const intro = document.getElementById('intro');
  if (!intro) return;
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let endTimer, hideTimer, safetyTimer, previous, active = false;
  const locked = new Set();
  let warpAnimationId = null;

  function initWarpCanvas() {
    const canvas = document.getElementById('warp');
    if (!canvas || reduce.matches) return;
    const ctx = canvas.getContext?.('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth || 800;
    let height = canvas.height = window.innerHeight || 600;
    const count = 160;
    const stars = [];
    const colors = ['#c4ff62', '#a7ead8', '#38bdf8', '#ffffff'];

    for (let i = 0; i < count; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 1.5 + 0.8
      });
    }

    let speed = 4.5;
    function resize() {
      if (!canvas.isConnected) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener?.('resize', resize, { passive: true });

    function renderFrame() {
      if (!active) {
        if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(warpAnimationId);
        return;
      }
      ctx.fillStyle = 'rgba(3, 7, 18, 0.24)';
      ctx.fillRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.z -= speed;
        if (s.z <= 0) {
          s.z = width;
          s.x = (Math.random() - 0.5) * width * 2;
          s.y = (Math.random() - 0.5) * height * 2;
        }

        const k = 250 / s.z;
        const px = s.x * k + cx;
        const py = s.y * k + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const alpha = Math.min(1, (1 - s.z / width) * 1.4);
          const sz = Math.max(0.6, (1 - s.z / width) * s.size * 2.5);
          ctx.beginPath();
          ctx.arc(px, py, sz, 0, Math.PI * 2);
          ctx.fillStyle = s.color;
          ctx.globalAlpha = alpha;
          ctx.fill();
          ctx.globalAlpha = 1;

          if (speed > 7) {
            const oldK = 250 / (s.z + speed * 1.8);
            const oldPx = s.x * oldK + cx;
            const oldPy = s.y * oldK + cy;
            ctx.beginPath();
            ctx.moveTo(oldPx, oldPy);
            ctx.lineTo(px, py);
            ctx.strokeStyle = s.color;
            ctx.globalAlpha = alpha * 0.5;
            ctx.lineWidth = sz * 0.8;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      if (speed < 18) speed += 0.12;
      if (typeof requestAnimationFrame === 'function') {
        warpAnimationId = requestAnimationFrame(renderFrame);
      }
    }
    if (typeof requestAnimationFrame === 'function') {
      warpAnimationId = requestAnimationFrame(renderFrame);
    }
  }

  function finish() {
    clearTimeout(endTimer); clearTimeout(hideTimer); clearTimeout(safetyTimer);
    if (warpAnimationId && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(warpAnimationId);
      warpAnimationId = null;
    }
    active = false;
    intro.hidden = true;
    intro.className = 'intro cinematic-intro dismissed';
    root.classList.remove('intro-pending');
    root.classList.remove('intro-revealing');
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
    root.classList.add('intro-revealing');
    // Start main arrival smoothly without blocking frames
    hideTimer = setTimeout(finish, 420);
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
    initWarpCanvas();
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
