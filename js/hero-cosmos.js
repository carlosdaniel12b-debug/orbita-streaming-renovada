/**
 * Órbita — Fondo Cósmico Espacial Animado y Dinámico en Tiempo Real
 * - Nebulosas volumétricas animadas en canvas con gradientes radiales y oscilación suave.
 * - Estrellas titilantes multicapa con destellos de difracción en cruz y deriva orbital.
 * - Lluvia de meteoros / estrellas fugaces frecuentes con estelas de plasma gradiente.
 * - Polvo estelar bioluminiscente con física de flotación y reactividad al cursor/touch.
 * - Parallax fluido e interactivo con amortiguación (damping).
 */
(() => {
  'use strict';

  function initHeroCosmos() {
    const canvas = document.getElementById('hero-cosmos-canvas') || document.getElementById('ambient-cosmos');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    // 1. Nebulosas volumétricas sutiles y estables (sin saturación ni parpadeos bruscos)
    const nebulae = [
      { xRatio: 0.25, yRatio: 0.35, baseRadius: 320, colorStop0: 'rgba(56, 189, 248, 0.07)', colorStop1: 'rgba(14, 116, 144, 0.02)', speed: 0.12, phase: 0 },
      { xRatio: 0.72, yRatio: 0.42, baseRadius: 360, colorStop0: 'rgba(168, 85, 247, 0.06)', colorStop1: 'rgba(109, 40, 217, 0.015)', speed: 0.10, phase: 2.1 },
      { xRatio: 0.50, yRatio: 0.28, baseRadius: 280, colorStop0: 'rgba(45, 212, 191, 0.05)', colorStop1: 'rgba(15, 118, 110, 0.01)', speed: 0.14, phase: 4.3 }
    ];

    // 2. Estrellas con brillo sutil y parpadeo sereno
    let stars = [];
    const STAR_COUNT = window.innerWidth < 768 ? 60 : 120;

    const STAR_COLORS = [
      'rgba(255, 255, 255, ',
      'rgba(186, 230, 253, ', // Azul hielo suave
      'rgba(167, 234, 216, ', // Cian delicado
      'rgba(241, 245, 249, '  // Blanco platino
    ];

    function createStars() {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        const depth = Math.random();
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.02,
          vy: -0.008 - Math.random() * 0.015,
          size: (0.6 + depth * 1.1) * (window.innerWidth < 768 ? 0.8 : 1.0),
          baseAlpha: 0.2 + depth * 0.45,
          twinkleSpeed: 0.4 + Math.random() * 1.1,
          phase: Math.random() * Math.PI * 2,
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
          hasCrossGlint: depth > 0.92
        });
      }
    }

    // 3. Meteoros / Estrellas fugaces ocasionales y delicadas
    let shootingStars = [];
    let lastSpawnTime = performance.now();

    function spawnShootingStar() {
      if (shootingStars.length >= 1) return;
      const angle = (28 + Math.random() * 22) * (Math.PI / 180);
      const speed = 12 + Math.random() * 8;
      const length = 110 + Math.random() * 90;

      shootingStars.push({
        x: Math.random() * (width * 0.85),
        y: Math.random() * (height * 0.35),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: length,
        life: 0,
        maxLife: 35 + Math.random() * 20,
        width: 1.0 + Math.random() * 0.8,
        color: '#bae6fd'
      });
    }

    // 4. Polvo cósmico sereno
    let stardust = [];
    const DUST_COUNT = window.innerWidth < 768 ? 15 : 30;

    function createStardust() {
      stardust = [];
      for (let i = 0; i < DUST_COUNT; i++) {
        stardust.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          radius: 0.7 + Math.random() * 1.4,
          alpha: 0.15 + Math.random() * 0.25,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    // Dimensionado del canvas de alta resolución
    function resize() {
      const hero = document.getElementById('hero-cinematic') || document.body;
      width = hero.clientWidth || window.innerWidth;
      height = hero.clientHeight || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      createStars();
      createStardust();
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();

    // 5. Parallax interactivo con cursor y touch
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    function onPointer(e) {
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      targetX = (cx / window.innerWidth - 0.5) * 40;
      targetY = (cy / window.innerHeight - 0.5) * 30;
    }

    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('touchmove', onPointer, { passive: true });

    // 6. Optimización con IntersectionObserver
    let isVisible = true;
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
        });
      }, { threshold: 0.05 });
      const hero = document.getElementById('hero-cinematic');
      if (hero) observer.observe(hero);
    }

    // 7. Bucle de animación continuo a 60 FPS
    function loop(now) {
      requestAnimationFrame(loop);
      if (!isVisible) return;

      // Limpiar canvas
      ctx.clearRect(0, 0, width, height);

      // Inercia suave hacia el puntero
      mouseX += (targetX - mouseX) * 0.045;
      mouseY += (targetY - mouseY) * 0.045;

      const t = now * 0.001;

      // A) DIBUJAR NEBULOSAS VOLUMÉTRICAS VIVAS
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < nebulae.length; i++) {
        const neb = nebulae[i];
        const osc = Math.sin(t * neb.speed + neb.phase);
        const radius = neb.baseRadius * (1 + osc * 0.15) * (width / 1400);
        const nx = width * neb.xRatio + Math.cos(t * neb.speed * 0.6 + neb.phase) * 25 + mouseX * 0.18;
        const ny = height * neb.yRatio + Math.sin(t * neb.speed * 0.6 + neb.phase) * 20 + mouseY * 0.18;

        const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, Math.max(10, radius));
        grad.addColorStop(0, neb.colorStop0);
        grad.addColorStop(0.5, neb.colorStop1);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(nx, ny, Math.max(10, radius), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // B) DIBUJAR ESTRELLAS TITILANTES CON DERIVA Y PARALLAX
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;

        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        const alpha = s.baseAlpha + Math.sin(t * s.twinkleSpeed + s.phase) * 0.38;
        if (alpha <= 0.03) continue;

        const px = s.x + mouseX * (s.size * 0.28);
        const py = s.y + mouseY * (s.size * 0.28);

        ctx.fillStyle = s.color + Math.max(0.06, Math.min(1, alpha)) + ')';
        ctx.beginPath();
        ctx.arc(px, py, s.size, 0, Math.PI * 2);
        ctx.fill();

        // Destello en cruz en estrellas mayores
        if (s.hasCrossGlint && alpha > 0.48) {
          ctx.strokeStyle = s.color + (alpha * 0.5) + ')';
          ctx.lineWidth = 0.65;
          const glintLen = s.size * 4.2;

          ctx.beginPath();
          ctx.moveTo(px - glintLen, py);
          ctx.lineTo(px + glintLen, py);
          ctx.moveTo(px, py - glintLen);
          ctx.lineTo(px, py + glintLen);
          ctx.stroke();
        }
      }

      // C) DIBUJAR POLVO CÓSMICO BIOLUMINISCENTE
      for (let i = 0; i < stardust.length; i++) {
        const d = stardust[i];
        d.x += d.vx;
        d.y += d.vy;

        if (d.x < -20) d.x = width + 20;
        if (d.x > width + 20) d.x = -20;
        if (d.y < -20) d.y = height + 20;
        if (d.y > height + 20) d.y = -20;

        const dAlpha = d.alpha * (0.6 + Math.sin(t * 1.6 + d.phase) * 0.4);
        const px = d.x + mouseX * 0.45;
        const py = d.y + mouseY * 0.45;

        const dustGrad = ctx.createRadialGradient(px, py, 0, px, py, d.radius * 2.2);
        dustGrad.addColorStop(0, `rgba(167, 234, 216, ${dAlpha})`);
        dustGrad.addColorStop(0.45, `rgba(56, 189, 248, ${dAlpha * 0.55})`);
        dustGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = dustGrad;
        ctx.beginPath();
        ctx.arc(px, py, d.radius * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // D) GESTIONAR Y DIBUJAR METEOROS / ESTRELLAS FUGACES (ocasionales y elegantes)
      if (now - lastSpawnTime > 8000 + Math.random() * 6000) {
        spawnShootingStar();
        lastSpawnTime = now;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const m = shootingStars[i];
        m.x += m.vx;
        m.y += m.vy;
        m.life++;

        const progress = m.life / m.maxLife;
        const mAlpha = progress < 0.2 ? progress / 0.2 : (1 - progress);

        if (progress >= 1 || m.x > width + 150 || m.y > height + 150) {
          shootingStars.splice(i, 1);
          continue;
        }

        const hyp = Math.hypot(m.vx, m.vy);
        const tailX = m.x - (m.vx / hyp) * m.length;
        const tailY = m.y - (m.vy / hyp) * m.length;

        const meteorGrad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        meteorGrad.addColorStop(0, 'transparent');
        meteorGrad.addColorStop(0.65, m.color === '#a7ead8' ? `rgba(167, 234, 216, ${mAlpha * 0.65})` : `rgba(56, 189, 248, ${mAlpha * 0.65})`);
        meteorGrad.addColorStop(1, `rgba(255, 255, 255, ${mAlpha})`);

        ctx.strokeStyle = meteorGrad;
        ctx.lineWidth = m.width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();

        // Cabeza incandescente
        ctx.fillStyle = `rgba(255, 255, 255, ${mAlpha})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.width * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroCosmos);
  } else {
    initHeroCosmos();
  }
})();
