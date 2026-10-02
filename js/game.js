(()=>{
  'use strict';
  const $ = s => document.querySelector(s);
  const dialog = $('#game-dialog');
  const canvas = $('#game-canvas');
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;

  // 5 Naves espaciales seleccionables con identidades y skins visuales únicas
  const SHIPS = [
    {
      id: 'celestia',
      name: 'Apex Celestia',
      desc: 'Caza Cuántico Estelar',
      color: '#38bdf8',
      accent: '#c084fc',
      engineGlow: '#00f2fe',
      flameColor: '#38bdf8',
      glyph: '◈',
      draw(c, ship, secColor) {
        c.save();
        // Fuselaje aerodinámico delta con bisel reflectivo
        c.fillStyle = '#0b1324';
        c.strokeStyle = '#38bdf8';
        c.lineWidth = 2.2;
        c.beginPath();
        c.moveTo(28, 0);       // Proa
        c.lineTo(10, -8);
        c.lineTo(-14, -18);    // Ala superior
        c.lineTo(-10, -5);
        c.lineTo(-20, -7);     // Tobera superior
        c.lineTo(-16, 0);      // Centro posterior
        c.lineTo(-20, 7);      // Tobera inferior
        c.lineTo(-10, 5);
        c.lineTo(-14, 18);     // Ala inferior
        c.lineTo(10, 8);
        c.closePath();
        c.fill();
        c.stroke();

        // Placas de titanio cósmico
        c.fillStyle = '#1e293b';
        c.beginPath();
        c.moveTo(18, 0);
        c.lineTo(-4, -7);
        c.lineTo(-12, 0);
        c.lineTo(-4, 7);
        c.closePath();
        c.fill();

        // Filamentos de energía cuántica violeta
        c.strokeStyle = '#c084fc';
        c.lineWidth = 1.3;
        c.beginPath();
        c.moveTo(14, 0);
        c.lineTo(-10, -12);
        c.moveTo(14, 0);
        c.lineTo(-10, 12);
        c.stroke();

        // Cabina Liquid Glass con reflejo especular
        const canopyGrad = c.createLinearGradient(0, -4, 12, 4);
        canopyGrad.addColorStop(0, '#e0f2fe');
        canopyGrad.addColorStop(0.5, '#38bdf8');
        canopyGrad.addColorStop(1, '#0284c7');
        c.fillStyle = canopyGrad;
        c.beginPath();
        c.ellipse(6, 0, 8, 3.2, 0, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = '#ffffff';
        c.lineWidth = 0.8;
        c.stroke();

        // Balizas de navegación en puntas de ala
        c.fillStyle = '#f43f5e';
        c.beginPath();
        c.arc(-13, -17, 1.8, 0, Math.PI * 2);
        c.arc(-13, 17, 1.8, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    },
    {
      id: 'astra',
      name: 'Astra Falcon',
      desc: 'Interceptor Ágil',
      color: '#5de0ff',
      accent: '#38bdf8',
      engineGlow: '#0ea5e9',
      flameColor: '#38bdf8',
      glyph: '▲',
      draw(c, ship, secColor) {
        c.fillStyle = '#1c2d42';
        c.strokeStyle = this.color;
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(25, 0);
        c.lineTo(-17, -13);
        c.lineTo(-9, 0);
        c.lineTo(-17, 13);
        c.closePath();
        c.fill();
        c.stroke();

        c.fillStyle = this.color;
        c.beginPath();
        c.moveTo(13, 0);
        c.lineTo(-10, -5);
        c.lineTo(-5, 0);
        c.lineTo(-10, 5);
        c.closePath();
        c.fill();

        c.fillStyle = '#ffffff';
        c.beginPath();
        c.ellipse(4, 0, 7, 2.5, 0, 0, Math.PI * 2);
        c.fill();
      }
    },
    {
      id: 'phoenix',
      name: 'Phoenix Cruiser',
      desc: 'Blindaje Solar',
      color: '#ff9e58',
      accent: '#ffd066',
      engineGlow: '#f97316',
      flameColor: '#ea580c',
      glyph: '◆',
      draw(c, ship, secColor) {
        c.fillStyle = '#3d1c10';
        c.strokeStyle = this.color;
        c.lineWidth = 2.2;
        c.beginPath();
        c.moveTo(27, 0);
        c.lineTo(15, -11);
        c.lineTo(-18, -14);
        c.lineTo(-12, 0);
        c.lineTo(-18, 14);
        c.lineTo(15, 11);
        c.closePath();
        c.fill();
        c.stroke();

        c.fillStyle = this.color;
        c.fillRect(-6, -6, 12, 12);

        c.fillStyle = '#ffe082';
        c.beginPath();
        c.arc(6, 0, 4, 0, Math.PI * 2);
        c.fill();
      }
    },
    {
      id: 'void',
      name: 'Void Phantom',
      desc: 'Sigilo Cuántico',
      color: '#c084fc',
      accent: '#e879f9',
      engineGlow: '#a855f7',
      flameColor: '#7c3aed',
      glyph: '✦',
      draw(c, ship, secColor) {
        c.fillStyle = '#2a1138';
        c.strokeStyle = this.color;
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(28, 0);
        c.lineTo(2, -15);
        c.lineTo(-20, -5);
        c.lineTo(-11, 0);
        c.lineTo(-20, 5);
        c.lineTo(2, 15);
        c.closePath();
        c.fill();
        c.stroke();

        c.strokeStyle = '#f3e8ff';
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(18, 0);
        c.lineTo(-4, -6);
        c.lineTo(-4, 6);
        c.closePath();
        c.stroke();

        c.fillStyle = '#f0abfc';
        c.beginPath();
        c.arc(2, 0, 3, 0, Math.PI * 2);
        c.fill();
      }
    },
    {
      id: 'viper',
      name: 'Solar Viper',
      desc: 'Doble Impulso',
      color: '#34d399',
      accent: '#6ee7b7',
      engineGlow: '#10b981',
      flameColor: '#059669',
      glyph: '►',
      draw(c, ship, secColor) {
        c.fillStyle = '#062d22';
        c.strokeStyle = this.color;
        c.lineWidth = 1.8;
        c.beginPath();
        c.rect(-16, -13, 34, 7);
        c.rect(-16, 6, 34, 7);
        c.fill();
        c.stroke();

        c.fillStyle = '#10b981';
        c.fillRect(-6, -6, 18, 12);
        c.fillStyle = '#ffffff';
        c.fillRect(4, -3, 8, 6);
      }
    }
  ];

  let currentShipIndex = 0;
  try {
    const savedShip = localStorage.getItem('orbita-arcade-ship');
    const idx = SHIPS.findIndex(s => s.id === savedShip);
    if (idx !== -1) currentShipIndex = idx;
  } catch {}

  // 8 Sectores espaciales con paletas estelares hiper-vibrantes y nebulosas profundas
  const levels = [
    { name: 'Órbita Terrestre', score: 0, target: 8, color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.55)', bgNebula: '#0c233c', starsColor: '#c8f5ed' },
    { name: 'Mar Lunar', score: 8, target: 18, color: '#a78bfa', glow: 'rgba(167, 139, 250, 0.55)', bgNebula: '#1e113a', starsColor: '#f3e8ff' },
    { name: 'Cañón de Marte', score: 18, target: 30, color: '#fb923c', glow: 'rgba(251, 146, 60, 0.55)', bgNebula: '#3d160e', starsColor: '#fed7aa' },
    { name: 'Cinturón de Asteroides', score: 30, target: 44, color: '#facc15', glow: 'rgba(250, 204, 21, 0.55)', bgNebula: '#3b2f0a', starsColor: '#fef08a' },
    { name: 'Anillos de Saturno', score: 44, target: 60, color: '#f472b6', glow: 'rgba(244, 114, 182, 0.55)', bgNebula: '#370f2d', starsColor: '#fce7f3' },
    { name: 'Nebulosa de Orión', score: 60, target: 76, color: '#2dd4bf', glow: 'rgba(45, 212, 191, 0.55)', bgNebula: '#092d2b', starsColor: '#ccfbf1' },
    { name: 'Horizonte de Sucesos', score: 76, target: 94, color: '#c084fc', glow: 'rgba(192, 132, 252, 0.65)', bgNebula: '#2b0a3d', starsColor: '#fae8ff' },
    { name: 'Singularidad Cuántica', score: 94, target: 115, color: '#ffffff', glow: 'rgba(255, 255, 255, 0.8)', bgNebula: '#1a1836', starsColor: '#ffffff' }
  ];

  let record = 0;
  try {
    record = Number(localStorage.getItem('orbita-arcade-record') || localStorage.getItem('flappy_space_highscore')) || 0;
  } catch {}

  let running = false;
  let paused = false;
  let score = 0;
  let level = 0;
  let hasShield = false;
  let ship = { x: 160, y: 220, vy: 0, angle: 0, shieldTime: 0, invulnerable: 0 };
  let pipes = [];
  let asteroids = [];
  let particles = [];
  let popups = [];
  let collectibles = [];
  let frame = 0;
  let last = 0;
  let spawn = 0;
  let asteroidSpawn = 3;
  let screenShake = 0;
  let levelBanner = '';
  let levelBannerTimer = 0;

  // Variables de Destrucción, Agujero Negro y Galaxia Espiral
  let isDestroyed = false;
  let destroyTimer = 0;
  let debrisList = [];
  let shockwaves = [];
  let blackHole = { active: false, x: 880, y: 220, r: 52, pulse: 0, phase: 'idle' };
  let galaxyAngle = 0;
  let starTwinkleTime = 0;
  let shootingStars = [
    { x: 100, y: 40, vx: 220, vy: 110, len: 65, life: 1, maxLife: 1.8, active: true },
    { x: 500, y: 80, vx: 250, vy: 120, len: 75, life: 0.2, maxLife: 2.2, active: false }
  ];

  // Estrellas en capas de profundidad con colores y parpadeo realista
  const starsLayer1 = Array.from({ length: 80 }, () => ({
    x: Math.random() * 800,
    y: Math.random() * 440,
    r: Math.random() * 1.5 + 0.4,
    speed: Math.random() * 14 + 8,
    alpha: Math.random() * 0.5 + 0.35,
    seed: Math.random() * 20
  }));
  const starsLayer2 = Array.from({ length: 55 }, () => ({
    x: Math.random() * 800,
    y: Math.random() * 440,
    r: Math.random() * 2.2 + 1.2,
    speed: Math.random() * 32 + 22,
    alpha: Math.random() * 0.65 + 0.4,
    seed: Math.random() * 20
  }));

  $('#game-record').textContent = record;

  function updateShipSelectionUI() {
    const cards = document.querySelectorAll('.ship-card');
    cards.forEach((card, idx) => {
      const isActive = idx === currentShipIndex;
      card.classList.toggle('active', isActive);
      card.setAttribute('aria-checked', String(isActive));
    });
  }

  document.querySelectorAll('.ship-card').forEach((card, idx) => {
    card.onclick = () => {
      currentShipIndex = idx;
      updateShipSelectionUI();
      try {
        localStorage.setItem('orbita-arcade-ship', SHIPS[idx].id);
      } catch {}
      window.OrbitaAudio?.play('flap');
      render(0);
    };
  });

  updateShipSelectionUI();

  function open() {
    if (!dialog.open) dialog.showModal();
    updateShipSelectionUI();
    render(0);
  }

  document.querySelectorAll('[data-game]').forEach(b => b.onclick = open);

  function saveRecord() {
    if (score > record) {
      record = score;
      try {
        localStorage.setItem('orbita-arcade-record', record);
      } catch {}
      $('#game-record').textContent = record;
    }
  }

  function stop() {
    window.OrbitaAudio?.stop();
    running = false;
    cancelAnimationFrame(frame);
    saveRecord();
    $('#game-pause').disabled = true;
  }

  dialog.addEventListener('close', stop);
  dialog.addEventListener('cancel', stop);

  function updateHUDShield() {
    const shieldEl = $('#game-shield');
    if (shieldEl) {
      if (hasShield) {
        shieldEl.textContent = 'ACTIVO (100%)';
        shieldEl.style.color = '#38bdf8';
      } else {
        shieldEl.textContent = 'Listo';
        shieldEl.style.color = '#a7ead8';
      }
    }
  }

  function start() {
    window.OrbitaAudio?.unlock();
    window.OrbitaAudio?.play('start');
    cancelAnimationFrame(frame);

    running = true;
    paused = false;
    isDestroyed = false;
    destroyTimer = 0;
    debrisList = [];
    shockwaves = [];
    blackHole = { active: false, x: 880, y: 220, r: 52, pulse: 0, phase: 'idle' };
    score = 0;
    level = 0;
    hasShield = false;
    ship = { x: 160, y: 220, vy: -50, angle: 0, shieldTime: 0, invulnerable: 0 };
    pipes = [];
    asteroids = [];
    particles = [];
    popups = [];
    collectibles = [];
    spawn = 0.5;
    asteroidSpawn = 2.5;
    last = 0;
    screenShake = 0;
    levelBanner = `SECTOR 1: ${levels[0].name.toUpperCase()}`;
    levelBannerTimer = 2.5;

    $('#game-score').textContent = 0;
    $('#game-level').textContent = levels[0].name;
    updateHUDShield();
    const over = $('#game-overlay');
    if (over) {
      over.hidden = true;
      over.style.display = 'none';
    }
    $('#game-pause').disabled = false;
    $('#game-pause').textContent = 'Pausar';
    $('#game-status').textContent = 'Vuelo iniciado en Sector ' + levels[0].name;

    canvas.focus();
    frame = requestAnimationFrame(tick);
  }

  function flap() {
    if (!running || paused || isDestroyed || blackHole.active) return;

    ship.vy = -305;
    window.OrbitaAudio?.play('flap');

    const curShip = SHIPS[currentShipIndex];
    for (let i = 0; i < 10; i++) {
      particles.push({
        x: ship.x - 22,
        y: ship.y + (Math.random() - 0.5) * 8,
        vx: -Math.random() * 150 - 90,
        vy: (Math.random() - 0.5) * 70,
        life: 1,
        maxLife: Math.random() * 0.35 + 0.25,
        color: i % 2 === 0 ? curShip.flameColor : curShip.color,
        size: Math.random() * 4 + 3
      });
    }
  }

  $('#game-flap').onclick = flap;
  const stage = $('.game-stage');
  if (stage) {
    stage.addEventListener('pointerdown', e => {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
      e.preventDefault();
      flap();
    });
  } else {
    canvas.addEventListener('pointerdown', e => {
      e.preventDefault();
      flap();
    });
  }

  dialog.addEventListener('keydown', e => {
    if ((e.code === 'Space' || e.code === 'ArrowUp') && (e.target === canvas || dialog.contains(e.target))) {
      e.preventDefault();
      if (!e.repeat) flap();
    }
    if (e.code === 'KeyP' && running) {
      e.preventDefault();
      togglePause();
    }
  });

  function togglePause() {
    if (!running || isDestroyed) return;
    paused = !paused;
    if (paused) {
      window.OrbitaAudio?.stop();
    } else {
      window.OrbitaAudio?.unlock();
      window.OrbitaAudio?.play('resume');
    }
    $('#game-pause').textContent = paused ? 'Continuar' : 'Pausar';
    $('#game-status').textContent = paused ? 'Juego pausado' : 'Vuelo reanudado';

    if (!paused) {
      last = 0;
      frame = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(frame);
      render(0);
    }
  }

  $('#game-pause').onclick = togglePause;

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && running && !paused) togglePause();
  });

  function triggerShieldAbsorb() {
    hasShield = false;
    ship.invulnerable = 1.6;
    ship.shieldTime = 1.6;
    screenShake = 9;
    window.OrbitaAudio?.play('score');
    updateHUDShield();
    popups.push({ x: ship.x, y: ship.y - 25, text: '¡ESCUDO ABSORBIÓ IMPACTO!', alpha: 1, color: '#38bdf8' });

    for (let i = 0; i < 25; i++) {
      particles.push({
        x: ship.x,
        y: ship.y,
        vx: (Math.random() - 0.5) * 260,
        vy: (Math.random() - 0.5) * 260,
        life: 1,
        maxLife: 0.5,
        color: '#38bdf8',
        size: 4
      });
    }
  }

  function crash() {
    if (isDestroyed) return true;
    if (hasShield) {
      triggerShieldAbsorb();
      return false; // Escudo absorbió el daño, la nave continúa volando
    }

    isDestroyed = true;
    destroyTimer = 1.45;
    window.OrbitaAudio?.play('crash');
    screenShake = 22;

    const curShip = SHIPS[currentShipIndex];
    // Fragmentos físicos de fuselaje de la nave destruida
    debrisList = [
      { x: ship.x, y: ship.y, vx: -150 + Math.random() * 40, vy: -160 + Math.random() * 60, rot: 0, vRot: 8, w: 16, h: 9, color: curShip.color },
      { x: ship.x, y: ship.y, vx: 130 + Math.random() * 50, vy: -130 + Math.random() * 50, rot: 0.5, vRot: -8.5, w: 18, h: 7, color: '#1e293b' },
      { x: ship.x, y: ship.y, vx: -100 + Math.random() * 40, vy: 150 + Math.random() * 50, rot: -0.4, vRot: 6.5, w: 14, h: 10, color: curShip.accent || '#38bdf8' },
      { x: ship.x, y: ship.y, vx: 110 + Math.random() * 40, vy: 170 + Math.random() * 50, rot: 1.2, vRot: -9.5, w: 16, h: 8, color: '#38bdf8' },
      { x: ship.x, y: ship.y, vx: -190 + Math.random() * 40, vy: -50 + Math.random() * 60, rot: -1.1, vRot: 11, w: 10, h: 5, color: '#ffffff' },
      { x: ship.x, y: ship.y, vx: 170 + Math.random() * 40, vy: 25 + Math.random() * 50, rot: 0.3, vRot: -7, w: 12, h: 6, color: '#0f172a' }
    ];

    // Ondas expansivas de plasma
    shockwaves = [
      { x: ship.x, y: ship.y, r: 6, maxR: 120, color: '#ffffff', alpha: 1 },
      { x: ship.x, y: ship.y, r: 2, maxR: 160, color: curShip.color, alpha: 0.9 }
    ];

    // Destellos y chispas de plasma de la explosión
    for (let i = 0; i < 65; i++) {
      particles.push({
        x: ship.x,
        y: ship.y,
        vx: (Math.random() - 0.5) * 480,
        vy: (Math.random() - 0.5) * 480,
        life: 1,
        maxLife: Math.random() * 0.75 + 0.45,
        color: ['#ffffff', '#38bdf8', curShip.flameColor, '#f43f5e', '#ffd066'][i % 5],
        size: Math.random() * 6.5 + 2.5
      });
    }

    // Iniciar loop de explosión inmediatamente para que nunca se congele
    cancelAnimationFrame(frame);
    last = 0;
    frame = requestAnimationFrame(tick);
    return true;
  }

  function showGameOverOverlay() {
    const over = $('#game-overlay');
    over.hidden = false;
    over.style.display = 'flex';
    over.innerHTML = `
      <div class="game-over-card">
        <span class="pill" style="margin-bottom:12px; border-color:#f43f5e; color:#fecdd3; background:rgba(244,63,94,0.2);">💥 Impacto Crítico Detectado</span>
        <h3 style="font-size:32px; margin: 0 0 8px; color:#ffffff;">Nave Destruida</h3>
        <p style="font-size:14px; margin: 0 0 16px; color:var(--muted);">
          Tu nave colisionó en <strong style="color:#e0f2fe">${levels[level].name}</strong>.
        </p>
        <div class="game-over-stats">
          <div class="stat-box"><small>Puntos</small><strong style="color:var(--coral);">${score}</strong></div>
          <div class="stat-box"><small>Récord</small><strong>${record}</strong></div>
          <div class="stat-box"><small>Sector</small><strong style="font-size:14px; color:#38bdf8;">${level + 1}/8</strong></div>
        </div>
        <button class="button hero-btn-liquid-primary" id="game-retry" style="margin-top:16px;">
          <span>Volver a Despegar</span>
          <span class="btn-arrow" aria-hidden="true">↻</span>
        </button>
      </div>
    `;
    const retryBtn = $('#game-retry');
    if (retryBtn) {
      retryBtn.onclick = (e) => {
        if (e) e.stopPropagation();
        start();
      };
      retryBtn.focus();
    }
    $('#game-status').textContent = `Fin del vuelo. ${score} puntos alcanzados en ${levels[level].name}.`;
  }

  function showVictoryOverlay() {
    const over = $('#game-overlay');
    over.hidden = false;
    over.style.display = 'flex';
    const isLastLevel = level >= levels.length - 1;
    over.innerHTML = `
      <div class="game-over-card victory-card">
        <span class="pill" style="margin-bottom:12px; border-color:#c084fc; color:#fae8ff; background:rgba(192,132,252,0.25);">🌌 Singularidad Conquistada</span>
        <h3 style="font-size:30px; margin: 0 0 8px; color:#ffffff;">¡Sector Completado!</h3>
        <p style="font-size:14px; margin: 0 0 16px; color:var(--muted);">
          Has cruzado el <strong>Agujero Negro</strong> y dominado la gravedad cuántica de <strong style="color:#e0f2fe">${levels[level].name}</strong>.
        </p>
        <div class="game-over-stats">
          <div class="stat-box"><small>Puntos</small><strong style="color:#a7ead8;">${score}</strong></div>
          <div class="stat-box"><small>Récord</small><strong>${record}</strong></div>
          <div class="stat-box"><small>Siguiente</small><strong style="font-size:14px; color:#c084fc;">${isLastLevel ? 'Misión Cumplida' : levels[level + 1].name}</strong></div>
        </div>
        <button class="button hero-btn-liquid-primary" id="game-next-sector" style="margin-top:16px;">
          <span>${isLastLevel ? 'Reiniciar Odisea' : 'Entrar al Siguiente Sector'}</span>
          <span class="btn-arrow" aria-hidden="true">➔</span>
        </button>
      </div>
    `;
    const nextBtn = $('#game-next-sector');
    if (nextBtn) {
      nextBtn.onclick = (e) => {
        if (e) e.stopPropagation();
        if (isLastLevel) {
          start();
        } else {
          advanceToNextSector();
        }
      };
      nextBtn.focus();
    }
    $('#game-status').textContent = `¡Nivel completado con éxito! Salto cuántico preparado.`;
  }

  function advanceToNextSector() {
    level++;
    blackHole.active = false;
    blackHole.phase = 'idle';
    ship.x = 160;
    ship.y = 220;
    ship.vy = -40;
    ship.invulnerable = 2.0;
    ship.shieldTime = 2.0;
    pipes = [];
    asteroids = [];
    collectibles = [];
    spawn = 1.0;
    asteroidSpawn = 2.8;
    levelBanner = `¡SECTOR ${level + 1}: ${levels[level].name.toUpperCase()}!`;
    levelBannerTimer = 2.8;
    screenShake = 6;
    $('#game-level').textContent = levels[level].name;
    const over = $('#game-overlay');
    over.hidden = true;
    over.style.display = 'none';
    running = true;
    last = 0;
    frame = requestAnimationFrame(tick);
  }

  function tick(t) {
    if (!running || paused || !dialog.open) return;
    const dt = Math.min(0.035, last ? (t - last) / 1000 : 0.016);
    last = t;

    galaxyAngle += dt * 0.04;

    // FASE DE DESTRUCCIÓN: Si la nave fue impactada, animar la desintegración física antes del Game Over
    if (isDestroyed) {
      destroyTimer -= dt;

      // Actualizar fragmentos de fuselaje de la nave destruida
      for (const d of debrisList) {
        d.x += d.vx * dt;
        d.vy += 380 * dt; // Aceleración gravitacional
        d.y += d.vy * dt;
        d.rot += d.vRot * dt;

        if (Math.random() < 0.35) {
          particles.push({
            x: d.x,
            y: d.y,
            vx: (Math.random() - 0.5) * 60,
            vy: (Math.random() - 0.5) * 60,
            life: 1,
            maxLife: 0.35,
            color: d.color,
            size: 2.2
          });
        }
      }

      // Actualizar ondas de choque térmicas
      for (const sw of shockwaves) {
        sw.r += 210 * dt;
        sw.alpha = Math.max(0, 1 - (sw.r / sw.maxR));
      }
      shockwaves = shockwaves.filter(sw => sw.alpha > 0.02);

      // Actualizar partículas y chispas
      for (const p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt / p.maxLife;
      }
      particles = particles.filter(p => p.life > 0);

      if (screenShake > 0) screenShake -= dt * 14;

      render(dt);

      if (destroyTimer <= 0) {
        running = false;
        cancelAnimationFrame(frame);
        saveRecord();
        showGameOverOverlay();
        return;
      }
      frame = requestAnimationFrame(tick);
      return;
    }

    // FASE DE AGUJERO NEGRO: Singularidad de fin de nivel
    if (blackHole.active) {
      blackHole.pulse += dt * 3.5;
      blackHole.x = Math.max(540, blackHole.x - 110 * dt);

      // Desactivar spawn de nuevos obstáculos durante la singularidad
      spawn = 999;
      asteroidSpawn = 999;

      const dx = blackHole.x - ship.x;
      const dy = blackHole.y - ship.y;
      const dist = Math.hypot(dx, dy);

      // Succión gravitacional exponencial hacia el horizonte de sucesos
      const pullForce = Math.min(750, 52000 / Math.max(35, dist));
      const nx = dx / dist;
      const ny = dy / dist;

      ship.x += (nx * pullForce * 0.55 + 50) * dt;
      ship.y += (ny * pullForce) * dt;
      ship.vy *= 0.85;

      const targetAngle = Math.atan2(dy, dx);
      ship.angle += (targetAngle - ship.angle) * 0.16;

      // Partículas y radiación cósmica aspiradas al centro
      if (Math.random() < 0.75) {
        const pAng = Math.random() * Math.PI * 2;
        const pDist = 110 + Math.random() * 80;
        particles.push({
          x: blackHole.x + Math.cos(pAng) * pDist,
          y: blackHole.y + Math.sin(pAng) * pDist,
          vx: -Math.cos(pAng) * 240 - Math.sin(pAng) * 110,
          vy: -Math.sin(pAng) * 240 + Math.cos(pAng) * 110,
          life: 1,
          maxLife: 0.6,
          color: ['#ffffff', '#ffd066', '#fb923c', '#c084fc'][Math.floor(Math.random() * 4)],
          size: Math.random() * 3 + 1.5
        });
      }

      // Absorción total por el horizonte de sucesos -> Victoria del nivel
      if (dist < 36) {
        running = false;
        cancelAnimationFrame(frame);
        screenShake = 16;
        window.OrbitaAudio?.play('level');
        saveRecord();
        showVictoryOverlay();
        return;
      }
    } else {
      // Vuelo aerodinámico estándar de la nave
      ship.vy += 760 * dt;
      ship.y += ship.vy * dt;

      const targetAngle = Math.max(-0.45, Math.min(0.65, ship.vy / 520));
      ship.angle += (targetAngle - ship.angle) * 0.18;

      // Techo
      if (ship.y < 16) {
        ship.y = 16;
        ship.vy = Math.max(40, -ship.vy * 0.4);
        ship.shieldTime = 0.35;
        screenShake = 3;
      }
      if (ship.shieldTime > 0) ship.shieldTime -= dt;
      if (ship.invulnerable > 0) ship.invulnerable -= dt;

      // Caída al vacío (suelo)
      if (ship.y > 425) {
        if (hasShield) {
          triggerShieldAbsorb();
          ship.y = 410;
          ship.vy = -260;
        } else {
          if (crash()) return;
        }
      }
    }

    if (screenShake > 0) screenShake -= dt * 18;
    if (levelBannerTimer > 0) levelBannerTimer -= dt;

    const speed = 190 + level * 20;
    const gap = Math.max(136, 175 - level * 6);

    // Generador de portales cuánticos si no hay un agujero negro activo
    if (!blackHole.active) {
      spawn -= dt;
      if (spawn <= 0) {
        const center = 110 + Math.random() * 220;
        pipes.push({
          x: 830,
          center,
          gap,
          scored: false,
          pulse: Math.random() * Math.PI * 2
        });

        const roll = Math.random();
        if (roll < 0.36) {
          collectibles.push({
            type: 'core',
            x: 830 + 22,
            y: center + (Math.random() - 0.5) * 35,
            taken: false,
            rot: 0
          });
        } else if (roll < 0.48 && !hasShield) {
          collectibles.push({
            type: 'shield',
            x: 830 + 22,
            y: center + (Math.random() - 0.5) * 45,
            taken: false,
            rot: 0
          });
        }

        spawn = 1.75 - Math.min(0.5, level * 0.06);
      }

      // Generador de asteroides orbitales (a partir de Sector 2)
      if (level >= 1) {
        asteroidSpawn -= dt;
        if (asteroidSpawn <= 0) {
          const rad = 14 + Math.random() * 12;
          asteroids.push({
            x: 840,
            y: 60 + Math.random() * 320,
            r: rad,
            rot: 0,
            rotSpeed: (Math.random() - 0.5) * 3,
            bob: Math.random() * Math.PI * 2,
            speed: speed * (0.85 + Math.random() * 0.3)
          });
          asteroidSpawn = Math.max(2.4, 5.0 - level * 0.4);
        }
      }
    }

    // Actualizar portales
    for (const p of pipes) {
      p.x -= speed * dt;
      p.pulse += dt * 4;

      if (!p.scored && p.x + 40 < ship.x) {
        p.scored = true;
        score++;
        window.OrbitaAudio?.play('score');
        popups.push({ x: ship.x, y: ship.y - 20, text: '+1', alpha: 1, color: '#a7ead8' });

        // Activar el Agujero Negro si se alcanza la meta del sector
        const curTarget = levels[level].target || (level + 1) * 8;
        if (!blackHole.active && score >= curTarget) {
          blackHole.active = true;
          blackHole.x = 880;
          blackHole.y = 220;
          blackHole.phase = 'pulling';
          blackHole.pulse = 0;
          window.OrbitaAudio?.play('level');
          levelBanner = '¡ANOMALÍA DETECTADA: AGUJERO NEGRO!';
          levelBannerTimer = 3.5;
          screenShake = 8;
          $('#game-status').textContent = '¡Agujero Negro detectado! Cruza el horizonte de sucesos.';
        }
        $('#game-score').textContent = score;
      }

      if (ship.invulnerable <= 0 && !blackHole.active) {
        const pLeft = p.x + 4;
        const pRight = p.x + 42;
        const topPillarBottom = p.center - p.gap / 2 + 3;
        const bottomPillarTop = p.center + p.gap / 2 - 3;

        if (ship.x + 14 > pLeft && ship.x - 14 < pRight) {
          if (ship.y - 9 < topPillarBottom || ship.y + 9 > bottomPillarTop) {
            if (crash()) return;
          }
        }
      }
    }

    // Actualizar asteroides
    for (let i = asteroids.length - 1; i >= 0; i--) {
      const ast = asteroids[i];
      ast.x -= ast.speed * dt;
      ast.rot += ast.rotSpeed * dt;
      ast.bob += dt * 2;
      ast.y += Math.sin(ast.bob) * 22 * dt;

      if (ast.x < -60) {
        asteroids.splice(i, 1);
        continue;
      }

      if (ship.invulnerable <= 0 && !blackHole.active) {
        const dist = Math.hypot(ship.x - ast.x, ship.y - ast.y);
        if (dist < ast.r + 11) {
          for (let k = 0; k < 10; k++) {
            particles.push({
              x: ast.x,
              y: ast.y,
              vx: (Math.random() - 0.5) * 160,
              vy: (Math.random() - 0.5) * 160,
              life: 1,
              maxLife: 0.4,
              color: '#94a3b8',
              size: 3
            });
          }
          asteroids.splice(i, 1);
          if (crash()) return;
        }
      }
    }

    // Actualizar coleccionables
    for (const c of collectibles) {
      c.x -= speed * dt;
      c.rot += dt * 3;
      if (!c.taken && Math.hypot(ship.x - c.x, ship.y - c.y) < 28) {
        c.taken = true;
        if (c.type === 'shield') {
          hasShield = true;
          updateHUDShield();
          window.OrbitaAudio?.play('level');
          popups.push({ x: c.x, y: c.y - 15, text: '¡ESCUDO OBTENIDO!', alpha: 1, color: '#38bdf8' });
        } else {
          score += 2;
          window.OrbitaAudio?.play('score');
          popups.push({ x: c.x, y: c.y - 15, text: '+2 BONUS!', alpha: 1, color: '#ffd066' });
          $('#game-score').textContent = score;
        }

        for (let i = 0; i < 14; i++) {
          particles.push({
            x: c.x,
            y: c.y,
            vx: (Math.random() - 0.5) * 170,
            vy: (Math.random() - 0.5) * 170,
            life: 1,
            maxLife: 0.45,
            color: c.type === 'shield' ? '#38bdf8' : '#ffd066',
            size: 3.5
          });
        }
      }
    }

    pipes = pipes.filter(p => p.x > -70);
    collectibles = collectibles.filter(c => c.x > -50 && !c.taken);

    if (!blackHole.active) {
      const curShip = SHIPS[currentShipIndex];
      particles.push({
        x: ship.x - 18,
        y: ship.y + (Math.random() - 0.5) * 4,
        vx: -130 - Math.random() * 40,
        vy: (Math.random() - 0.5) * 20,
        life: 1,
        maxLife: 0.35,
        color: curShip.color,
        size: Math.random() * 3.5 + 2
      });
    }

    for (const p of particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt / p.maxLife;
    }
    particles = particles.filter(p => p.life > 0);

    for (const pop of popups) {
      pop.y -= dt * 35;
      pop.alpha -= dt * 1.2;
    }
    popups = popups.filter(pop => pop.alpha > 0);

    render(dt);
    frame = requestAnimationFrame(tick);
  }

  function render(dt) {
    const curLevel = levels[level];
    const secColor = curLevel.color;
    const curShip = SHIPS[currentShipIndex];

    ctx.save();
    if (screenShake > 0.5) {
      const sx = (Math.random() - 0.5) * screenShake;
      const sy = (Math.random() - 0.5) * screenShake;
      ctx.translate(sx, sy);
    }

    const bgGrad = ctx.createLinearGradient(0, 0, 0, 440);
    bgGrad.addColorStop(0, '#040913');
    bgGrad.addColorStop(0.5, '#071424');
    bgGrad.addColorStop(1, '#03070f');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 800, 440);

    // Primera nebulosa cósmica profunda
    const nebGrad1 = ctx.createRadialGradient(680, 240, 20, 680, 240, 380);
    nebGrad1.addColorStop(0, curLevel.bgNebula);
    nebGrad1.addColorStop(1, 'transparent');
    ctx.fillStyle = nebGrad1;
    ctx.globalAlpha = 0.72;
    ctx.fillRect(0, 0, 800, 440);

    // Segunda nebulosa cromática secundaria
    const nebGrad2 = ctx.createRadialGradient(160, 120, 10, 160, 120, 280);
    nebGrad2.addColorStop(0, curLevel.glow);
    nebGrad2.addColorStop(1, 'transparent');
    ctx.fillStyle = nebGrad2;
    ctx.globalAlpha = 0.32;
    ctx.fillRect(0, 0, 800, 440);
    ctx.globalAlpha = 1;

    starTwinkleTime += dt * 2.5;

    // Capa 1 de estrellas distantes con parpadeo cósmico
    for (const s of starsLayer1) {
      if (running && !paused) s.x = (s.x - dt * s.speed + 800) % 800;
      const tw = Math.sin(starTwinkleTime + s.seed) * 0.25;
      ctx.globalAlpha = Math.max(0.15, Math.min(0.9, s.alpha + tw));
      ctx.fillStyle = curLevel.starsColor;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Capa 2 de estrellas brillantes cercanas
    for (const s of starsLayer2) {
      if (running && !paused) s.x = (s.x - dt * s.speed + 800) % 800;
      const tw = Math.cos(starTwinkleTime * 1.3 + s.seed) * 0.3;
      ctx.globalAlpha = Math.max(0.25, Math.min(1.0, s.alpha + tw));
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Galaxia espiral majestuosa en el fondo cósmico profundo
    drawSpiralGalaxy(ctx, 640, 150, galaxyAngle, curLevel.color);

    // Estrellas fugaces cruzando el firmamento espacial
    drawShootingStars(ctx, dt);

    for (const p of pipes) {
      const topH = p.center - p.gap / 2;
      const botY = p.center + p.gap / 2;
      const botH = 440 - botY;

      // Filamento de gravedad iónica entre ambos cuerpos planetarios
      const beamAlpha = 0.28 + Math.sin(p.pulse) * 0.18;
      ctx.save();
      ctx.globalAlpha = beamAlpha;
      ctx.strokeStyle = secColor;
      ctx.lineWidth = 2.2;
      ctx.shadowColor = secColor;
      ctx.shadowBlur = 14;
      ctx.setLineDash([7, 7]);
      ctx.lineDashOffset = -p.pulse * 10;
      ctx.beginPath();
      ctx.moveTo(p.x + 23, topH);
      ctx.lineTo(p.x + 23, botY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      drawPlanetObstacle(p.x, 0, 46, topH, true, secColor, p.pulse, level);
      drawPlanetObstacle(p.x, botY, 46, botH, false, secColor, p.pulse + 1.2, level);
    }

    for (const ast of asteroids) {
      ctx.save();
      ctx.translate(ast.x, ast.y);
      ctx.rotate(ast.rot);

      ctx.fillStyle = '#263445';
      ctx.strokeStyle = '#475d74';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const points = 7;
      for (let i = 0; i < points; i++) {
        const ang = (i / points) * Math.PI * 2;
        const rad = ast.r * (i % 2 === 0 ? 1 : 0.78);
        const px = Math.cos(ang) * rad;
        const py = Math.sin(ang) * rad;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#17222f';
      ctx.beginPath();
      ctx.arc(-ast.r * 0.3, -ast.r * 0.2, ast.r * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (blackHole.active) {
      drawBlackHole(ctx, blackHole.x, blackHole.y, blackHole.r, blackHole.pulse, secColor);
    }

    for (const c of collectibles) {
      if (c.taken) continue;
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rot);

      if (c.type === 'shield') {
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 16;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 11, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🛡', 0, 1);
      } else {
        ctx.shadowColor = '#ffd066';
        ctx.shadowBlur = 14;
        ctx.fillStyle = '#ffd066';
        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.lineTo(7, 0);
        ctx.lineTo(0, 9);
        ctx.lineTo(-7, 0);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    for (const p of particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (!isDestroyed) {
      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.rotate(ship.angle);

      if (blackHole.active) {
        // Deformación relativista spaghettification
        const dx = blackHole.x - ship.x;
        const dy = blackHole.y - ship.y;
        const dist = Math.hypot(dx, dy);
        const stretch = Math.max(1, Math.min(2.8, 220 / Math.max(45, dist)));
        ctx.scale(stretch, 1 / Math.sqrt(stretch));
      }

      if (hasShield || ship.shieldTime > 0) {
        ctx.save();
        ctx.strokeStyle = hasShield ? '#38bdf8' : '#a7ead8';
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = 0.85;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(0, 0, 24, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      const flameLen = 14 + Math.random() * 9 + (ship.vy < 0 ? 10 : 0);
      const flameGrad = ctx.createLinearGradient(-12, 0, -12 - flameLen, 0);
      flameGrad.addColorStop(0, '#ffffff');
      flameGrad.addColorStop(0.35, curShip.flameColor);
      flameGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.moveTo(-10, -4);
      ctx.lineTo(-12 - flameLen, 0);
      ctx.lineTo(-10, 4);
      ctx.closePath();
      ctx.fill();

      curShip.draw(ctx, ship, secColor);
      ctx.restore();
    } else {
      // Dibujar desintegración de fragmentos de nave y ondas expansivas
      drawDebrisAndExplosion(ctx);
    }

    for (const pop of popups) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, pop.alpha);
      ctx.fillStyle = pop.color;
      ctx.font = 'bold 16px Manrope, sans-serif';
      ctx.shadowColor = pop.color;
      ctx.shadowBlur = 10;
      ctx.fillText(pop.text, pop.x, pop.y);
      ctx.restore();
    }

    if (levelBannerTimer > 0) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, levelBannerTimer);
      ctx.fillStyle = 'rgba(7, 18, 30, 0.85)';
      ctx.fillRect(180, 25, 440, 50);
      ctx.strokeStyle = secColor;
      ctx.lineWidth = 1.8;
      ctx.strokeRect(180, 25, 440, 50);
      ctx.fillStyle = secColor;
      ctx.font = 'bold 18px Syne, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(levelBanner, 400, 56);
      ctx.restore();
    }

    if (paused) {
      ctx.fillStyle = 'rgba(8, 17, 28, 0.88)';
      ctx.fillRect(0, 0, 800, 440);
      ctx.fillStyle = '#f2f5f4';
      ctx.font = '600 26px Syne, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('VUELO EN PAUSA', 400, 210);
      ctx.font = '13px Manrope, sans-serif';
      ctx.fillStyle = '#aab6cc';
      ctx.fillText('Presiona P o el botón Continuar para reanudar', 400, 245);
    }

    ctx.restore();
  }

  function drawPlanetObstacle(x, y, w, h, isTop, color, pulse, levelIndex) {
    if (h <= 0) return;
    ctx.save();

    const cx = x + w / 2;
    // Radio del cuerpo planetario: armonioso con la colisión y de aspecto cósmico imponente
    const radius = Math.max(34, Math.min(52, h > 60 ? 44 : h * 0.7));
    // La superficie del planeta que mira hacia la nave queda exactamente alineada con la apertura
    const cy = isTop ? y + h - radius : y + radius;

    // Resplandor y halo atmosférico del planeta
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.24 + Math.sin(pulse) * 0.08;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Columna de plasma / gravedad estelar que ancla el planeta a los bordes superior o inferior
    if (isTop && cy - radius > 0) {
      const stemGrad = ctx.createLinearGradient(cx - radius * 0.7, 0, cx + radius * 0.7, 0);
      stemGrad.addColorStop(0, 'rgba(8, 16, 26, 0.95)');
      stemGrad.addColorStop(0.5, color);
      stemGrad.addColorStop(1, 'rgba(8, 16, 26, 0.95)');
      ctx.fillStyle = stemGrad;
      ctx.fillRect(cx - 14, 0, 28, cy - radius + 8);
    } else if (!isTop && cy + radius < 440) {
      const stemGrad = ctx.createLinearGradient(cx - radius * 0.7, 0, cx + radius * 0.7, 0);
      stemGrad.addColorStop(0, 'rgba(8, 16, 26, 0.95)');
      stemGrad.addColorStop(0.5, color);
      stemGrad.addColorStop(1, 'rgba(8, 16, 26, 0.95)');
      ctx.fillStyle = stemGrad;
      ctx.fillRect(cx - 14, cy + radius - 8, 28, 440 - (cy + radius - 8));
    }

    // Iluminación 3D esférica estelar
    const lx = cx - radius * 0.35;
    const ly = cy - radius * 0.35;
    const sphereGrad = ctx.createRadialGradient(lx, ly, radius * 0.08, cx, cy, radius);

    // Tipos de planetas y lunas dinámicos según el sector cósmico
    const pType = (levelIndex + (isTop ? 0 : 1)) % 4;
    if (pType === 0) {
      // Gigante de Hielo / Océano Cósmico (Turquesa / Esmeralda)
      sphereGrad.addColorStop(0, '#e0f9f6');
      sphereGrad.addColorStop(0.25, color);
      sphereGrad.addColorStop(0.7, '#0d2b38');
      sphereGrad.addColorStop(1, '#040b12');
    } else if (pType === 1) {
      // Planeta Volcánico / Cobre Solar (Magma / Óxido)
      sphereGrad.addColorStop(0, '#ffecd1');
      sphereGrad.addColorStop(0.28, color);
      sphereGrad.addColorStop(0.75, '#3b180d');
      sphereGrad.addColorStop(1, '#0c0503');
    } else if (pType === 2) {
      // Nebular Amatista / Gigante Cuántico (Violeta / Neón)
      sphereGrad.addColorStop(0, '#fae8ff');
      sphereGrad.addColorStop(0.3, color);
      sphereGrad.addColorStop(0.72, '#280c3b');
      sphereGrad.addColorStop(1, '#07020d');
    } else {
      // Púlsar de Titanio / Astro Eléctrico (Azul Estelar)
      sphereGrad.addColorStop(0, '#ffffff');
      sphereGrad.addColorStop(0.25, color);
      sphereGrad.addColorStop(0.68, '#0d2d2a');
      sphereGrad.addColorStop(1, '#04100e');
    }

    // Recorte de esfera para las bandas y relieve
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = sphereGrad;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    // Bandas climáticas y anillos atmosféricos en la superficie del planeta
    ctx.globalAlpha = 0.28;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    for (let b = -2; b <= 2; b++) {
      ctx.beginPath();
      const by = cy + b * (radius * 0.32);
      ctx.ellipse(cx, by, radius * 0.95, radius * 0.18, 0.15, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Gran Vórtice / Mancha de Tormenta planetaria
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.ellipse(cx + (isTop ? -8 : 10), cy + (isTop ? 6 : -6), radius * 0.28, radius * 0.14, -0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore(); // fin del recorte

    // Sistema de Anillos Planetarios Órbitas tipo Saturno
    if (levelIndex % 2 === 0 || isTop) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.2;
      ctx.globalAlpha = 0.65 + Math.sin(pulse) * 0.15;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius * 1.55, radius * 0.38, -0.32, 0, Math.PI * 2);
      ctx.stroke();

      // Anillo secundario difuso
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius * 1.78, radius * 0.44, -0.32, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Baliza de advertencia o núcleo de ionización en el extremo más cercano a la nave
    ctx.save();
    const beaconY = isTop ? y + h - 5 : y + 5;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(cx, beaconY, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  function drawSpiralGalaxy(c, gx, gy, angle, color) {
    c.save();
    c.translate(gx, gy);
    c.rotate(angle);

    // Núcleo brillante y difuso de la galaxia
    const coreGrad = c.createRadialGradient(0, 0, 1, 0, 0, 48);
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.25, color);
    coreGrad.addColorStop(0.6, 'rgba(49, 46, 129, 0.45)');
    coreGrad.addColorStop(1, 'transparent');
    c.fillStyle = coreGrad;
    c.beginPath();
    c.arc(0, 0, 48, 0, Math.PI * 2);
    c.fill();

    // Brazos espirales con cúmulos estelares
    const arms = 2;
    for (let a = 0; a < arms; a++) {
      const armOffset = a * Math.PI;
      for (let i = 0; i < 55; i++) {
        const t = (i / 55) * 3.2;
        const rad = 10 + t * 26;
        const theta = armOffset + t * 2.3;
        const px = Math.cos(theta) * rad;
        const py = Math.sin(theta) * (rad * 0.48); // Inclinación elíptica 3D
        const alpha = Math.max(0.08, 0.7 - i * 0.011);
        c.globalAlpha = alpha;
        c.fillStyle = i % 3 === 0 ? '#ffffff' : color;
        c.beginPath();
        c.arc(px, py, Math.random() * 1.6 + 0.7, 0, Math.PI * 2);
        c.fill();
      }
    }
    c.restore();
  }

  function drawShootingStars(c, dt) {
    for (const ss of shootingStars) {
      if (!ss.active) {
        ss.life -= dt;
        if (ss.life <= 0) {
          ss.active = true;
          ss.x = Math.random() * 450;
          ss.y = Math.random() * 140;
          ss.life = ss.maxLife;
        }
        continue;
      }
      ss.x += ss.vx * dt;
      ss.y += ss.vy * dt;
      ss.life -= dt;
      if (ss.life <= 0 || ss.x > 840 || ss.y > 440) {
        ss.active = false;
        ss.life = Math.random() * 3.5 + 1.8;
        continue;
      }

      const grad = c.createLinearGradient(ss.x, ss.y, ss.x - ss.len, ss.y - ss.len * 0.48);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.35, '#38bdf8');
      grad.addColorStop(1, 'transparent');
      c.save();
      c.strokeStyle = grad;
      c.lineWidth = 1.9;
      c.beginPath();
      c.moveTo(ss.x, ss.y);
      c.lineTo(ss.x - ss.len, ss.y - ss.len * 0.48);
      c.stroke();
      c.restore();
    }
  }

  function drawBlackHole(c, x, y, r, pulse, themeColor) {
    c.save();

    // 1. Chorro relativista polar vertical (Jets cuánticos hiperenergéticos)
    const jetGrad = c.createLinearGradient(x, y - 220, x, y + 220);
    jetGrad.addColorStop(0, 'transparent');
    jetGrad.addColorStop(0.35, 'rgba(56, 189, 248, 0.45)');
    jetGrad.addColorStop(0.5, '#ffffff');
    jetGrad.addColorStop(0.65, 'rgba(192, 132, 252, 0.45)');
    jetGrad.addColorStop(1, 'transparent');
    c.fillStyle = jetGrad;
    c.fillRect(x - 3.5, y - 220, 7, 440);

    // 2. Halo de curvatura gravitacional y lente de Einstein
    const lensGrad = c.createRadialGradient(x, y, r * 0.7, x, y, r * 2.9);
    lensGrad.addColorStop(0, 'transparent');
    lensGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.42)');
    lensGrad.addColorStop(0.65, 'rgba(192, 132, 252, 0.35)');
    lensGrad.addColorStop(1, 'transparent');
    c.fillStyle = lensGrad;
    c.beginPath();
    c.arc(x, y, r * 2.9, 0, Math.PI * 2);
    c.fill();

    // 3. Disco de Acreción relativista giratorio con Doppler Shift
    c.save();
    c.translate(x, y);
    c.rotate(-0.28);

    const diskGrad = c.createRadialGradient(0, 0, r * 0.88, 0, 0, r * 2.5);
    diskGrad.addColorStop(0, '#ffffff');
    diskGrad.addColorStop(0.28, '#f59e0b');
    diskGrad.addColorStop(0.6, '#ea580c');
    diskGrad.addColorStop(0.82, themeColor || '#c084fc');
    diskGrad.addColorStop(1, 'transparent');

    c.fillStyle = diskGrad;
    c.beginPath();
    c.ellipse(0, 0, r * 2.5, r * 0.68, 0, 0, Math.PI * 2);
    c.fill();
    c.restore();

    // 4. Horizonte de Sucesos: Vacío gravitacional absoluto (negro impenetrable)
    c.fillStyle = '#000000';
    c.shadowColor = '#000000';
    c.shadowBlur = 14;
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();

    // 5. Filamento brillante frontal superacelerado (Efecto Doppler relativista)
    c.save();
    c.translate(x, y);
    c.rotate(-0.28);
    c.strokeStyle = '#ffffff';
    c.lineWidth = 3.8;
    c.shadowColor = '#fde047';
    c.shadowBlur = 16;
    c.beginPath();
    c.ellipse(0, 0, r * 1.55, r * 0.44, 0, 0, Math.PI);
    c.stroke();
    c.restore();

    // 6. Esfera fotónica crítica
    c.strokeStyle = '#e0f2fe';
    c.lineWidth = 2;
    c.shadowColor = '#38bdf8';
    c.shadowBlur = 18;
    c.beginPath();
    c.arc(x, y, r + 2.5, 0, Math.PI * 2);
    c.stroke();

    c.restore();
  }

  function drawDebrisAndExplosion(c) {
    // 1. Ondas expansivas térmicas de plasma
    for (const sw of shockwaves) {
      c.save();
      c.globalAlpha = sw.alpha;
      c.strokeStyle = sw.color;
      c.lineWidth = 3.5 * sw.alpha;
      c.shadowColor = sw.color;
      c.shadowBlur = 20;
      c.beginPath();
      c.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
      c.stroke();
      c.restore();
    }

    // 2. Fragmentos físicos de fuselaje de la nave girando en el espacio
    for (const d of debrisList) {
      c.save();
      c.translate(d.x, d.y);
      c.rotate(d.rot);
      c.fillStyle = d.color;
      c.strokeStyle = '#ffffff';
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(-d.w / 2, -d.h / 2);
      c.lineTo(d.w / 2, -d.h / 3);
      c.lineTo(d.w / 3, d.h / 2);
      c.lineTo(-d.w / 2, d.h / 3);
      c.closePath();
      c.fill();
      c.stroke();

      // Fuego residual en el fragmento metálico
      c.fillStyle = '#ff6b4a';
      c.beginPath();
      c.arc(0, 0, 2.5, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }
  }

  $('#game-start').onclick = start;
  render(0);

  window.OrbitaGame = {
    state: () => ({ running, paused, score, level, record, currentShip: SHIPS[currentShipIndex].name }),
    setShip: id => {
      const idx = SHIPS.findIndex(s => s.id === id);
      if (idx !== -1) {
        currentShipIndex = idx;
        updateShipSelectionUI();
        render(0);
      }
    }
  };
})();
