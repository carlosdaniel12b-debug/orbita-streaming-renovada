(()=>{
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const root = document.documentElement;
  const lib = window.ORBIT_LIBRARY || [];
  const P = window.ORBITA?.platforms || [];
  const reduce = { matches: false, addEventListener: () => {} };
  
  let paused = false;
  try {
    paused = localStorage.getItem('orbita-motion') === 'paused';
  } catch {}

  const platform = id => P.find(p => p.id === id) || { name: id, id };
  const normal = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');



  window.OrbitaExperience = {
    openMovie,
    lib,
    motion: () => !paused,
    replayIntro: () => {
      sessionStorage.removeItem('orbita-v2-intro');
      location.reload();
    }
  };

  // Crear o verificar halo ambiental cósmico en el DOM
  if (!$('.ambient-glow')) {
    const ambient = document.createElement('div');
    ambient.className = 'ambient-glow';
    ambient.setAttribute('aria-hidden', 'true');
    document.body.prepend(ambient);
  }

  // FONDO CÓSMICO SUTIL Y PROFESIONAL (Estrellas microscópicas, destellos orgánicos y fugaces etéreas)
  let cosmosCanvas = $('#ambient-cosmos');
  if (!cosmosCanvas) {
    cosmosCanvas = document.createElement('canvas');
    cosmosCanvas.id = 'ambient-cosmos';
    cosmosCanvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(cosmosCanvas);
  }
  const cCtx = cosmosCanvas?.getContext('2d');
  let cW = 0, cH = 0, cDpr = 1;
  let cosmosStars = [];
  let shootingStars = [];
  let lastShootingStarTime = performance.now() - 2500;
  let mouseParallax = { tx: 0, ty: 0, x: 0, y: 0 };
  let cosmosRaf = null;

  function initCosmosStars() {
    if (!cW || !cH) return;
    const isMobile = cW < 768;
    const count = isMobile ? 38 : Math.min(105, Math.max(55, Math.floor((cW * cH) / 13500)));
    cosmosStars = [];
    for (let i = 0; i < count; i++) {
      const depth = Math.random(); // 0: lejana, 1: cercana
      cosmosStars.push({
        x: Math.random() * cW,
        y: Math.random() * cH,
        size: (isMobile ? 0.55 : 0.65) + depth * 1.0,
        baseAlpha: 0.14 + depth * 0.42,
        twinkleSpeed: 0.7 + Math.random() * 2.0,
        twinklePhase: Math.random() * Math.PI * 2,
        depth: 0.004 + depth * 0.018,
        color: depth > 0.72 
          ? (Math.random() > 0.5 ? 'rgba(167,234,216,' : 'rgba(201,223,238,') 
          : 'rgba(242,245,255,'
      });
    }
  }

  function resizeCosmos() {
    if (!cosmosCanvas || !cCtx) return;
    const isMobile = window.innerWidth < 768;
    cDpr = isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.5);
    cW = window.innerWidth;
    cH = window.innerHeight;
    cosmosCanvas.width = cW * cDpr;
    cosmosCanvas.height = cH * cDpr;
    cCtx.setTransform(1, 0, 0, 1, 0, 0);
    cCtx.scale(cDpr, cDpr);
    initCosmosStars();
  }

  function spawnShootingStar() {
    if (!cW || !cH) return;
    const startX = Math.random() * (cW * 0.75);
    const startY = Math.random() * (cH * 0.4);
    const angle = 0.45 + (Math.random() - 0.5) * 0.22; // ~26 a 38 grados
    const speed = 12 + Math.random() * 8;
    shootingStars.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      length: 65 + Math.random() * 75,
      life: 1.0,
      decay: 0.024 + Math.random() * 0.016,
      width: 1.0 + Math.random() * 0.6
    });
  }

  function renderCosmos(now) {
    if (paused || reduce.matches) {
      cosmosRaf = null;
      return;
    }
    if (!cCtx) return;
    cCtx.clearRect(0, 0, cW, cH);

    // Suavizado lerp de mouse parallax (muy sutil y flotante)
    mouseParallax.x += (mouseParallax.tx - mouseParallax.x) * 0.04;
    mouseParallax.y += (mouseParallax.ty - mouseParallax.y) * 0.04;

    const t = now * 0.001;

    // Dibujar estrellas orgánicas
    for (let i = 0; i < cosmosStars.length; i++) {
      const s = cosmosStars[i];
      const alpha = Math.max(0.06, Math.min(0.9, s.baseAlpha + Math.sin(t * s.twinkleSpeed + s.twinklePhase) * 0.3));
      const px = (s.x + mouseParallax.x * s.depth + cW) % cW;
      const py = (s.y + mouseParallax.y * s.depth + cH) % cH;

      cCtx.fillStyle = s.color + alpha + ')';
      cCtx.beginPath();
      cCtx.arc(px, py, s.size, 0, Math.PI * 2);
      cCtx.fill();

      // Halo sutil para estrellas de mayor magnitud
      if (s.size > 1.35 && alpha > 0.45) {
        cCtx.fillStyle = s.color + (alpha * 0.2) + ')';
        cCtx.beginPath();
        cCtx.arc(px, py, s.size * 2.2, 0, Math.PI * 2);
        cCtx.fill();
      }
    }

    // Gestionar estrellas fugaces (cada ~3.5-6 seg, vibrantes y cósmicas)
    if (now - lastShootingStarTime > 3800 + Math.random() * 3200) {
      spawnShootingStar();
      lastShootingStarTime = now;
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      ss.x += ss.vx;
      ss.y += ss.vy;
      ss.life -= ss.decay;

      if (ss.life <= 0 || ss.x > cW + 120 || ss.y > cH + 120) {
        shootingStars.splice(i, 1);
        continue;
      }

      const mag = Math.hypot(ss.vx, ss.vy) || 1;
      const tailX = ss.x - (ss.vx / mag) * ss.length;
      const tailY = ss.y - (ss.vy / mag) * ss.length;

      const grad = cCtx.createLinearGradient(tailX, tailY, ss.x, ss.y);
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(0.7, `rgba(167,234,216,${ss.life * 0.35})`);
      grad.addColorStop(1, `rgba(255,255,255,${ss.life * 0.85})`);

      cCtx.strokeStyle = grad;
      cCtx.lineWidth = ss.width;
      cCtx.lineCap = 'round';
      cCtx.beginPath();
      cCtx.moveTo(tailX, tailY);
      cCtx.lineTo(ss.x, ss.y);
      cCtx.stroke();
    }

    cosmosRaf = requestAnimationFrame(renderCosmos);
  }

  function startCosmos() {
    if (!cosmosRaf && !paused && !reduce.matches && !document.hidden && cCtx) {
      cosmosRaf = requestAnimationFrame(renderCosmos);
    }
  }

  function stopCosmos() {
    if (cosmosRaf) {
      cancelAnimationFrame(cosmosRaf);
      cosmosRaf = null;
    }
  }

  resizeCosmos();
  window.addEventListener('resize', resizeCosmos, { passive: true });
  window.addEventListener('pointermove', e => {
    mouseParallax.tx = (e.clientX - cW / 2);
    mouseParallax.ty = (e.clientY - cH / 2);
  }, { passive: true });

  startCosmos();

  function openMovie(id) {
    const m = lib.find(x => x.id === id);
    if (!m) return;
    const p = platform(m.platform);
    
    // Activa la atmósfera de color de la app que tiene esta película
    window.OrbitaColors?.set(m.platform);

    $('#detail-body').innerHTML = `
      <div class="movie-detail-layout">
        <img src="${m.image || 'assets/space.webp'}" alt="Póster de ${m.title}">
        <div>
          <span class="eyebrow">${m.type} / ${m.year}</span>
          <h2 id="detail-title">${m.title}</h2>
          <p>${m.genre}</p>
          <span class="pill" style="border-color:var(--coral)">${p.name}</span>
        </div>
      </div>
      <p class="movie-detail-note">${m.esSummary || ''}</p>
      <p class="movie-detail-note">${m.type === 'Serie' ? 'Plataforma de origen o selección editorial' : 'Película de la selección editorial'}: <strong>${p.name}</strong>. La disponibilidad depende del país y puede cambiar. Pregúntale a Orbit para consultar tu región.</p>
      <a class="movie-detail-source" href="${m.source}" target="_blank" rel="noopener">Consultar la fuente ↗</a>
      <div class="detail-actions">
        <button class="button" id="ask-movie">Preguntar a Orbit ↗</button>
        <a class="button ghost" href="combos.html?apps=${m.platform}">Elegir ${p.name}</a>
      </div>
    `;

    $('#ask-movie').onclick = () => {
      $('#details').close();
      window.OrbitGuide?.ask('¿Dónde puedo ver ' + m.title + '?');
    };

    if (!$('#details').open) $('#details').showModal();
  }

  // PARALLAX REAL MULTI-CAPA EN TARJETAS DE PELÍCULAS
  // Interacción fluida y ligera de tarjeta (sin layout thrashing ni bloqueos)
  function setupMovieParallax(card) {
    // La elevación e iluminación se delegan a aceleración por hardware en CSS
    // garantizando un carrusel a 60fps sin tirones
  }

  // Renderizado del carrusel destacado en la página de inicio (14 títulos estelares optimizados)
  let cinema = 'all', limit = 14;
  function renderMovies() {
    if (!$('#movie-grid')) return;

    if (cinema === 'music') {
      $('#movie-grid').innerHTML = `
        <article class="music-feature">
          <img src="assets/music.jpg" alt="Descubrimiento musical de Spotify">
          <div>
            <span class="eyebrow">La banda sonora de tu día</span>
            <h3>El siguiente tema<br>puede ser tu favorito.</h3>
            <p>Descubre música, playlists y podcasts en Spotify.</p>
            <a class="button" href="catalogo.html?plataforma=spotify">Explorar Spotify ↗</a>
          </div>
        </article>
      `;
      const mb = $('#more-movies');
      if (mb) mb.hidden = true;
      return;
    }

    const q = normal($('#movie-search')?.value || '');
    const list = lib.filter(m => (cinema === 'all' || m.type === cinema) && normal([m.title, ...m.aliases, m.genre, platform(m.platform).name].join(' ')).includes(q));

    $('#movie-grid').innerHTML = list.slice(0, limit).map((m, i) => {
      const badgeText = m.badge || (i % 7 === 0 ? 'Recomendada' : i % 4 === 0 ? 'Top 10' : i === 1 ? 'Estreno' : '');
      const badgeClass = badgeText === 'Top 10' ? 'gold' : badgeText === 'Estreno' ? 'hot' : '';
      return `
        <button class="movie-card" data-movie="${m.id}" style="--i:${i}" aria-label="Ver ${m.title}">
          <div class="poster-wrap">
            ${badgeText ? `<span class="movie-badge ${badgeClass}">${badgeText}</span>` : ''}
            <img src="${m.image || 'assets/space.webp'}" alt="Póster de ${m.title}" loading="lazy" draggable="false">
            <div class="poster-glare"></div>
            <div class="movie-platform">
              <span>${platform(m.platform).name}</span>
              ${m.year ? `<span class="movie-year">${m.year}</span>` : '<span>↗</span>'}
            </div>
          </div>
          <h3>${m.title}</h3>
          <p>${m.type} · ${m.genre.split(',')[0]}</p>
        </button>
      `;
    }).join('') || `
      <div class="movie-empty">
        <h3>Orbit puede ayudarte a buscar.</h3>
        <p class="muted">Prueba otro título o explora el catálogo completo en Descubre.</p>
        <a class="button" href="descubre.html">Ir a Descubre (70+ títulos) ↗</a>
      </div>
    `;

    const moreBtn = $('#more-movies');
    if (moreBtn) {
      moreBtn.hidden = false;
      moreBtn.innerHTML = `Ver catálogo completo en Descubre (71 títulos) ↗`;
      moreBtn.onclick = () => location.href = 'descubre.html';
    }

    $$('#movie-grid [data-movie]').forEach(b => {
      b.onclick = () => openMovie(b.dataset.movie);
    });

    $$('[data-assistant]').forEach(b => b.onclick = () => window.OrbitGuide?.open());
  }

  if ($('#movie-grid')) {
    const movieGrid = $('#movie-grid');
    const carouselPrev = $('#movie-carousel-prev');
    const carouselNext = $('#movie-carousel-next');

    // Botones de navegación con scroll suave (2 tarjetas a la vez)
    if (carouselPrev) {
      carouselPrev.onclick = () => {
        movieGrid.scrollBy({ left: -476, behavior: 'smooth' });
      };
    }
    if (carouselNext) {
      carouselNext.onclick = () => {
        movieGrid.scrollBy({ left: 476, behavior: 'smooth' });
      };
    }

    // Desplazamiento horizontal con rueda del ratón
    movieGrid.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && Math.abs(e.deltaY) > 8) {
        if (e.shiftKey) return;
        movieGrid.scrollLeft += e.deltaY * 0.95;
      }
    }, { passive: true });

    // Cancelar arrastre nativo de imágenes HTML5 que causaba que se trabara el carrusel
    movieGrid.addEventListener('dragstart', (e) => e.preventDefault());

    // Controlador de arrastre con Pointer Capture y fricción cinética (NO SE TRABA NUNCA)
    let isPointerDown = false;
    let startX = 0;
    let scrollStart = 0;
    let lastX = 0;
    let velocity = 0;
    let lastTime = 0;
    let hasMoved = false;
    let momentumAnimId = null;

    function cancelGlide() {
      if (momentumAnimId) {
        cancelAnimationFrame(momentumAnimId);
        momentumAnimId = null;
      }
    }

    movieGrid.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      cancelGlide();
      isPointerDown = true;
      hasMoved = false;
      startX = e.clientX;
      lastX = e.clientX;
      scrollStart = movieGrid.scrollLeft;
      lastTime = performance.now();
      velocity = 0;
      try {
        movieGrid.setPointerCapture(e.pointerId);
      } catch (err) {}
      movieGrid.classList.add('is-dragging');
    });

    movieGrid.addEventListener('pointermove', (e) => {
      if (!isPointerDown) return;
      const x = e.clientX;
      const dx = x - startX;
      if (Math.abs(dx) > 5) {
        hasMoved = true;
      }
      movieGrid.scrollLeft = scrollStart - dx;

      const now = performance.now();
      const dt = now - lastTime;
      if (dt > 8) {
        velocity = (x - lastX) / dt;
        lastX = x;
        lastTime = now;
      }
    });

    function finishDrag(e) {
      if (!isPointerDown) return;
      isPointerDown = false;
      movieGrid.classList.remove('is-dragging');
      try {
        movieGrid.releasePointerCapture(e.pointerId);
      } catch (err) {}

      // Si el usuario soltó con inercia (flick), aplicar desaceleración suave
      if (Math.abs(velocity) > 0.15) {
        let currentVel = velocity * 18;
        const glide = () => {
          if (Math.abs(currentVel) < 0.25 || isPointerDown) {
            cancelGlide();
            return;
          }
          movieGrid.scrollLeft -= currentVel;
          currentVel *= 0.93; // Factor de fricción ultra suave
          momentumAnimId = requestAnimationFrame(glide);
        };
        momentumAnimId = requestAnimationFrame(glide);
      }
    }

    movieGrid.addEventListener('pointerup', finishDrag);
    movieGrid.addEventListener('pointercancel', finishDrag);

    // Evitar abrir modal si el usuario arrastró el carrusel
    movieGrid.addEventListener('click', (e) => {
      if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
        hasMoved = false;
      }
    }, true);

    $$('[data-cinema]').forEach(b => b.onclick = () => {
      cinema = b.dataset.cinema;
      limit = 14;
      $$('[data-cinema]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      renderMovies();
    });

    const searchInput = $('#movie-search');
    if (searchInput) {
      searchInput.oninput = () => {
        limit = 20;
        renderMovies();
      };
    }

    const moreBtn = $('#more-movies');
    if (moreBtn) {
      moreBtn.onclick = () => {
        location.href = 'descubre.html';
      };
    }

    renderMovies();
  }

  // PÁGINA INDEPENDIENTE DESCUBRE (71+ TÍTULOS CON FILTROS Y BÚSQUEDA LIQUID GLASS)
  function initDescubrePage() {
    const grid = $('#descubre-grid');
    if (!grid) return;

    let activeType = 'all';
    let activePlatform = 'all';
    let searchQ = '';

    const searchInput = $('#descubre-search-input');
    const searchClear = $('#descubre-search-clear');
    const typeChips = $$('#descubre-type-chips .chip-btn');
    const platformChips = $$('#descubre-platform-chips .chip-btn');
    const countEl = $('#descubre-count');
    const emptyEl = $('#descubre-empty');
    const resetBtn = $('#descubre-reset-filters');
    const emptyResetBtn = $('#descubre-empty-reset');

    function filterAndRender() {
      const q = normal(searchQ.trim());
      const filtered = lib.filter(m => {
        const matchesType = activeType === 'all' || 
          (activeType === 'music' ? m.type === 'music' || m.genre.toLowerCase().includes('música') || m.platform === 'spotify' : m.type === activeType);
        
        const platInfo = platform(m.platform);
        const matchesPlat = activePlatform === 'all' || 
          platInfo.name.toLowerCase() === activePlatform.toLowerCase() ||
          m.platform.toLowerCase() === activePlatform.toLowerCase();

        const searchBlob = normal([m.title, ...(m.aliases || []), m.genre, platInfo.name, m.year].join(' '));
        const matchesSearch = !q || searchBlob.includes(q);

        return matchesType && matchesPlat && matchesSearch;
      });

      if (countEl) countEl.textContent = filtered.length;

      if (filtered.length === 0) {
        grid.innerHTML = '';
        if (emptyEl) emptyEl.style.display = 'block';
        return;
      }

      if (emptyEl) emptyEl.style.display = 'none';

      grid.innerHTML = filtered.map((m, i) => {
        const platInfo = platform(m.platform);
        const badge = m.badge || (i % 7 === 0 ? 'Recomendada' : i % 5 === 0 ? 'Top 10' : '');
        return `
          <article class="liquid-glass descubre-card" data-movie="${m.id}" tabindex="0" role="button" aria-label="Ver detalles de ${m.title}">
            <div class="descubre-card-poster">
              ${badge ? `<span class="movie-badge ${badge.includes('Top') ? 'gold' : badge.includes('Estreno') ? 'hot' : ''}">${badge}</span>` : ''}
              <img src="${m.image || 'assets/space.webp'}" alt="Póster de ${m.title}" loading="lazy">
              <div class="descubre-card-overlay">
                <span class="descubre-play-btn">Ver ficha ↗</span>
              </div>
            </div>
            <div class="descubre-card-body">
              <div class="descubre-card-meta">
                <span class="descubre-platform-badge">${platInfo.name}</span>
                <span class="descubre-year">${m.year || '2025'}</span>
              </div>
              <h3 class="descubre-card-title">${m.title}</h3>
              <p class="descubre-card-genre">${m.type} · ${m.genre.split(',')[0]}</p>
            </div>
          </article>
        `;
      }).join('');

      $$('#descubre-grid [data-movie]').forEach(el => {
        el.onclick = () => openMovie(el.dataset.movie);
        el.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openMovie(el.dataset.movie); } };
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', e => {
        searchQ = e.target.value;
        if (searchClear) searchClear.style.display = searchQ ? 'inline-block' : 'none';
        filterAndRender();
      });
    }

    if (searchClear) {
      searchClear.onclick = () => {
        if (searchInput) searchInput.value = '';
        searchQ = '';
        searchClear.style.display = 'none';
        filterAndRender();
        searchInput?.focus();
      };
    }

    typeChips.forEach(btn => {
      btn.onclick = () => {
        typeChips.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        activeType = btn.dataset.type;
        filterAndRender();
      };
    });

    platformChips.forEach(btn => {
      btn.onclick = () => {
        platformChips.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        activePlatform = btn.dataset.platform;
        filterAndRender();
      };
    });

    function resetAllFilters() {
      activeType = 'all';
      activePlatform = 'all';
      searchQ = '';
      if (searchInput) searchInput.value = '';
      if (searchClear) searchClear.style.display = 'none';
      typeChips.forEach((b, i) => { b.classList.toggle('active', i === 0); b.setAttribute('aria-pressed', String(i === 0)); });
      platformChips.forEach((b, i) => { b.classList.toggle('active', i === 0); b.setAttribute('aria-pressed', String(i === 0)); });
      filterAndRender();
    }

    if (resetBtn) resetBtn.onclick = resetAllFilters;
    if (emptyResetBtn) emptyResetBtn.onclick = resetAllFilters;

    filterAndRender();
  }

  initDescubrePage();

  // Parallax e inclinación 3D para tarjetas de plataformas
  function tilt(el) {
    if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    const img = el.querySelector('.platform-top img');
    const btn = el.querySelector('.round-button');
    el.addEventListener('pointermove', e => {
      if (paused || reduce.matches) return;
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${-ny * 12}deg) rotateY(${nx * 14}deg) translateY(-6px)`;
      if (img) img.style.transform = `scale(1.08) translate3d(${-nx * 10}px, ${-ny * 10}px, 12px)`;
      if (btn) btn.style.transform = `scale(1.05) translateZ(16px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
      if (img) img.style.transform = '';
      if (btn) btn.style.transform = '';
    });
  }

  $$('.platform-card').forEach(tilt);

  const observer = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      observer.unobserve(e.target);
    }
  }), { threshold: .08 });

  $$('.section-head,.combo-banner,.arcade-promo,.steps,.faq,.page-heading').forEach(e => {
    e.classList.add('reveal-ready');
    observer.observe(e);
  });

  // Selector de temas (Aurora, Atardecer, Océano)
  const palette = {
    aurora: ['#a7ead8', '#c7dbe9'],
    sunset: ['#ffc5a0', '#f0bfd7'],
    ocean: ['#a9d8fc', '#97dccc']
  };

  let theme = 'aurora';
  try {
    theme = localStorage.getItem('orbita-theme') || theme;
  } catch {}

  function setTheme(t) {
    if (!palette[t]) t = 'aurora';
    theme = t;
    root.dataset.theme = t;
    window.OrbitaColors?.reset();
    $$('button[data-theme]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.theme === t)));
    try {
      localStorage.setItem('orbita-theme', t);
    } catch {}
  }

  setTheme(theme);
  $$('button[data-theme]').forEach(b => b.onclick = () => setTheme(b.dataset.theme));

  // Escena 3D Three.js del Planeta y Anillos
  let renderer, scene, camera, globe, clouds, rings, stars, light, inView = true;
  const canvas = $('#planet-scene');
  let targetX = 0, targetY = 0;

  if (canvas && window.THREE) {
    try {
      const T = window.THREE;
      renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(devicePixelRatio, window.innerWidth < 768 ? 1.0 : 1.5));
      renderer.outputEncoding = T.sRGBEncoding;
      scene = new T.Scene();
      camera = new T.PerspectiveCamera(38, 1, .1, 100);
      camera.position.set(0, 0, 8);

      const loader = new T.TextureLoader();
      const map = loader.load(window.EARTH_TEXTURE || 'assets/earth.jpg');
      map.encoding = T.sRGBEncoding;

      globe = new T.Mesh(new T.SphereGeometry(1.68, 64, 48), new T.MeshPhongMaterial({ map, color: 0x1a364d, shininess: 16, specular: 0x22445b }));
      globe.rotation.z = .15;
      scene.add(globe);

      clouds = new T.Mesh(new T.SphereGeometry(1.71, 48, 32), new T.MeshPhongMaterial({ map: loader.load(window.CLOUD_TEXTURE || 'assets/clouds.png'), transparent: true, opacity: .36, depthWrite: false }));
      scene.add(clouds);

      const atmosphere = new T.Mesh(new T.SphereGeometry(1.75, 48, 32), new T.ShaderMaterial({
        uniforms: { glowColor: { value: new T.Color(0xa7ead8) } },
        vertexShader: 'varying vec3 n; varying vec3 v; void main(){n=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}',
        fragmentShader: 'uniform vec3 glowColor;varying vec3 n;varying vec3 v;void main(){float a=pow(1.-max(dot(n,v),0.),3.2);gl_FragColor=vec4(glowColor,a*.75);}',
        transparent: true,
        depthWrite: false,
        side: T.FrontSide
      }));
      scene.add(atmosphere);

      rings = new T.Group();
      [2.15, 2.30, 2.52].forEach((radius, i) => {
        const r = new T.Mesh(new T.TorusGeometry(radius, .006 + i * .0015, 12, 180), new T.MeshBasicMaterial({ color: palette[theme][0], transparent: true, opacity: .85 - i * .18 }));
        r.rotation.x = 1.2;
        r.rotation.y = -.4;
        r.rotation.z = .25;
        rings.add(r);
      });
      scene.add(rings);

      const geo = new T.BufferGeometry(), positions = new Float32Array(900);
      for (let i = 0; i < 900; i++) positions[i] = (Math.random() - .5) * 24;
      geo.setAttribute('position', new T.BufferAttribute(positions, 3));
      stars = new T.Points(geo, new T.PointsMaterial({ color: 0xc5e0ec, size: .018, transparent: true, opacity: .8 }));
      scene.add(stars);

      scene.add(new T.AmbientLight(0x8fa3b7, 1.0));
      light = new T.DirectionalLight(0xffffff, 2.4);
      light.position.set(-4, 3, 5);
      scene.add(light);

      const warm = new T.PointLight(0xffeedd, 1.4, 25);
      warm.position.set(4, -2, 2);
      scene.add(warm);

      function size() {
        const r = canvas.getBoundingClientRect();
        const w = Math.max(r.width || canvas.clientWidth || 0, 360);
        const h = Math.max(r.height || canvas.clientHeight || 0, 360);
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      }
      size();
      new ResizeObserver(size).observe(canvas);
      root.classList.add('webgl-ready');

      // Observador con amplio margen vertical para que el planeta nunca desaparezca al desplazarse
      new IntersectionObserver(es => {
        inView = es[0].isIntersecting;
      }, { rootMargin: '600px 0px 600px 0px' }).observe(canvas);

      canvas.addEventListener('webglcontextlost', e => {
        e.preventDefault();
        root.classList.remove('webgl-ready');
        renderer = null;
      });

      document.querySelector('.hero')?.addEventListener('pointermove', e => {
        targetX = (e.clientX / innerWidth - .5) * .25;
        targetY = (e.clientY / innerHeight - .5) * .12;
      });
    } catch (e) {
      root.classList.remove('webgl-ready');
    }
  }

  // LOOP PRINCIPAL DE ANIMACIÓN Y PARALLAX DE SCROLL
  let time = 0, lastScroll = -1;
  function loop(t) {
    requestAnimationFrame(loop);
    if (document.hidden) return;

    const moving = !paused && !reduce.matches;
    const delta = Math.min(.04, (t - time) / 1000 || .016);
    time = t;

    // Renderizado Three.js del planeta cósmico (optimizado para no sobrecargar GPU en móvil)
    const maxScroll = window.innerWidth < 768 ? 950 : 1400;
    const shouldRenderGlobe = renderer && (inView || window.scrollY < maxScroll);
    if (shouldRenderGlobe) {
      if (moving) {
        globe.rotation.y += delta * .07;
        clouds.rotation.y += delta * .085;
        rings.rotation.z = Math.sin(t * .00015) * .05;
        stars.rotation.y += delta * .003;
        camera.position.x += (targetX - camera.position.x) * .035;
        camera.position.y += (targetY - camera.position.y) * .035;
        camera.lookAt(0, 0, 0);
      }
      // Los anillos del planeta reaccionan al color de la plataforma activa
      const targetColor = new THREE.Color(window.OrbitaColors?.color() || palette[theme][0]);
      rings.children.forEach(r => r.material.color.lerp(targetColor, .04));
      renderer.render(scene, camera);
    }

    const y = scrollY;
    if (y !== lastScroll) {
      lastScroll = y;
      const factor = innerWidth < 760 ? .45 : 1;
      const vh = innerHeight;

      // Parallax en secciones visuales ligeras
      $$('.feature-image,.combo-visual,.arcade-art').forEach(el => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom > 0 && r.top < vh) {
          el.style.transform = moving ? `translate3d(0,${Math.max(-65, Math.min(65, (vh / 2 - r.top - r.height / 2) * .13 * factor))}px,0)` : '';
        }
      });
    }
  }
  requestAnimationFrame(loop);

  // Sincronización de reducción de movimiento
  const motion = $('.motion-toggle');
  function motionSync() {
    root.classList.toggle('motion-paused', paused);
    if (motion) {
      motion.disabled = false;
      motion.setAttribute('aria-pressed', String(paused));
      motion.setAttribute('aria-label', paused ? 'Activar efectos' : 'Pausar efectos');
    }
    $$('[data-replay]').forEach(b => b.disabled = false);
    if (paused) {
      stopCosmos();
      closeIntro();
      window.OrbitaGallery?.pause();
      $$('.feature-image,.combo-visual,.arcade-art,.movie-card,.platform-card').forEach(el => el.style.transform = '');
      $$('.movie-card .poster-wrap img').forEach(im => im.style.transform = '');
    } else {
      startCosmos();
      window.OrbitaGallery?.resume();
    }
    lastScroll = -1;
  }
  if (motion) {
    motion.onclick = () => {
      paused = !paused;
      try {
        localStorage.setItem('orbita-motion', paused ? 'paused' : 'active');
      } catch {}
      motionSync();
    };
  }
  reduce.addEventListener('change', motionSync);

  // MOTOR DE LA INTRO CINEMÁTICA INTERACTIVA
  const intro = $('#intro');
  const warp = $('#warp');
  const ctx = warp?.getContext('2d');
  let introTimer, introFrame, restoreTimer, previous;
  let flightStart = 0;
  let particles = [];
  let shockwaves = [];
  let steerX = 0, steerY = 0, targetSteerX = 0, targetSteerY = 0;
  let warpSpeed = 1, targetSpeed = 1, isHolding = false;
  let simulatedProgress = 0;

  function lock(value) {
    [...document.body.children].filter(el => el !== intro && !['SCRIPT', 'NOSCRIPT'].includes(el.tagName)).forEach(el => el.inert = value);
  }

  function arrived() {
    document.body.classList.add('arrival');
  }

  function closeIntro() {
    clearTimeout(introTimer);
    cancelAnimationFrame(introFrame);
    if (window.OrbitaBoot) {
      clearTimeout(window.OrbitaBoot.timer);
      window.OrbitaBoot.pending = false;
    }
    root.classList.remove('intro-pending');
    if (!intro || intro.hidden) return;

    intro.classList.add('leaving');
    lock(false);
    document.body.style.overflow = '';

    if (intro.contains(document.activeElement)) {
      document.activeElement.blur();
      if (previous && previous !== document.body && previous.isConnected) {
        previous.focus({ preventScroll: true });
      }
    }

    arrived();
    clearTimeout(restoreTimer);
    restoreTimer = setTimeout(() => {
      intro.hidden = true;
      intro.classList.remove('leaving');
      intro.classList.remove('turbo-warp');
    }, 670);
  }

  // Interacción de dirección (steering) en la intro
  intro?.addEventListener('pointermove', e => {
    targetSteerX = (e.clientX / innerWidth - 0.5) * 2;
    targetSteerY = (e.clientY / innerHeight - 0.5) * 2;

    const copy = $('.intro-copy');
    if (copy) {
      copy.style.transform = `translate(-50%, -50%) perspective(900px) rotateX(${-targetSteerY * 9}deg) rotateY(${targetSteerX * 11}deg) translateZ(14px)`;
    }

    const rings = $('.portal-rings');
    if (rings) {
      rings.style.transform = `perspective(900px) rotateX(${55 - targetSteerY * 12}deg) rotateY(${-20 + targetSteerX * 15}deg)`;
    }
  });

  // Modo Turbo Warp (Hipersalto) al mantener presionado
  intro?.addEventListener('pointerdown', e => {
    if (e.target.closest('.intro-skip')) return;
    isHolding = true;
    targetSpeed = 3.6;
    intro.classList.add('turbo-warp');

    // Onda de choque de hipersalto en el punto de contacto
    const swColors = ['#38bdf8', '#c084fc', '#f472b6', '#a7ead8', '#5de0ff', '#fbbf24'];
    shockwaves.push({
      x: e.clientX,
      y: e.clientY,
      radius: 12,
      maxRadius: Math.max(innerWidth, innerHeight) * 0.75,
      alpha: 0.95,
      color: swColors[Math.floor(Math.random() * swColors.length)]
    });

    try {
      window.OrbitaAudio?.unlock();
      window.OrbitaAudio?.play('flap');
    } catch {}
  });

  window.addEventListener('pointerup', () => {
    if (isHolding) {
      isHolding = false;
      targetSpeed = 1;
      intro?.classList.remove('turbo-warp');
    }
  });

  window.addEventListener('pointercancel', () => {
    isHolding = false;
    targetSpeed = 1;
    intro?.classList.remove('turbo-warp');
  });

  intro?.addEventListener('dblclick', () => closeIntro());

  function warpFrame(t) {
    if (intro.hidden || document.hidden || !ctx) return;

    // Suavizado lerp de dirección y velocidad
    steerX += (targetSteerX - steerX) * 0.08;
    steerY += (targetSteerY - steerY) * 0.08;
    warpSpeed += (targetSpeed - warpSpeed) * 0.12;

    const w = warp.width;
    const h = warp.height;
    const cx = w / 2 + steerX * (w * 0.22);
    const cy = h / 2 + steerY * (h * 0.22);

    ctx.clearRect(0, 0, w, h);

    // Fondo de aurora cósmica hiperespacial radiante con colores vivos
    const nebGrad = ctx.createRadialGradient(cx, cy, 15, cx, cy, Math.max(w, h) * 0.65);
    nebGrad.addColorStop(0, warpSpeed > 2 ? 'rgba(56, 189, 248, 0.35)' : 'rgba(167, 234, 216, 0.18)');
    nebGrad.addColorStop(0.35, warpSpeed > 2 ? 'rgba(192, 132, 252, 0.22)' : 'rgba(56, 189, 248, 0.10)');
    nebGrad.addColorStop(0.7, warpSpeed > 2 ? 'rgba(244, 114, 182, 0.14)' : 'rgba(30, 58, 138, 0.08)');
    nebGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = nebGrad;
    ctx.fillRect(0, 0, w, h);

    const elapsed = (t - flightStart) / 1000;
    simulatedProgress += 0.006 * warpSpeed;

    // Aceleración de la barra de progreso al activar hipersalto
    const line = $('.intro-track span');
    if (line && warpSpeed > 2) {
      line.style.transform = `scaleX(${Math.min(1, simulatedProgress)})`;
    }

    // Dibujar estrellas en túnel hiperespacial con paleta policromática
    for (const s of particles) {
      const speed = (1 + elapsed * 0.55) * warpSpeed;
      s.z -= speed * 8.5;
      if (s.z < 1) {
        s.z = 1000;
        s.x = (Math.random() - 0.5) * w * 1.5;
        s.y = (Math.random() - 0.5) * h * 1.5;
      }

      const k = 650 / s.z;
      const x = s.x * k + cx;
      const y = s.y * k + cy;
      const alpha = Math.max(0.06, 1 - s.z / 1000);

      ctx.save();
      ctx.strokeStyle = s.color || '#a7ead8';
      ctx.globalAlpha = Math.min(1, alpha * (warpSpeed > 2 ? 1.8 : 1.2));
      ctx.lineWidth = warpSpeed > 2 ? 2.6 : 1.3;
      ctx.shadowColor = s.color || '#a7ead8';
      ctx.shadowBlur = warpSpeed > 2 ? 10 : 4;

      ctx.beginPath();
      ctx.moveTo(x, y);

      const streak = warpSpeed > 2 ? 0.055 : 0.025;
      ctx.lineTo(x + (x - cx) * streak * speed, y + (y - cy) * streak * speed);
      ctx.stroke();
      ctx.restore();
    }

    // Dibujar ondas de choque cósmicas cromáticas
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      sw.radius += 18 * warpSpeed;
      sw.alpha *= 0.93;

      if (sw.alpha < 0.02 || sw.radius > sw.maxRadius) {
        shockwaves.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.strokeStyle = sw.color || '#38bdf8';
      ctx.globalAlpha = sw.alpha;
      ctx.shadowColor = sw.color || '#38bdf8';
      ctx.shadowBlur = 16;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Si el usuario mantiene pulsado hipersalto hasta completarlo, entrar automáticamente
    if (simulatedProgress >= 1 && isHolding) {
      closeIntro();
      return;
    }

    introFrame = requestAnimationFrame(warpFrame);
  }

  function play() {
    if (paused || reduce.matches) return;
    if (window.OrbitaBoot) {
      clearTimeout(window.OrbitaBoot.timer);
      window.OrbitaBoot.pending = false;
    }
    root.classList.remove('intro-pending');
    clearTimeout(restoreTimer);
    clearTimeout(introTimer);

    previous = document.activeElement;
    intro.hidden = false;
    intro.classList.remove('leaving');
    intro.classList.remove('turbo-warp');
    document.body.classList.remove('arrival');
    intro.setAttribute('role', 'dialog');
    intro.setAttribute('aria-modal', 'true');
    intro.setAttribute('aria-label', 'Viaje de entrada en órbita');
    document.body.style.overflow = 'hidden';
    lock(true);

    $('.intro-skip')?.focus({ preventScroll: true });

    warp.width = innerWidth;
    warp.height = innerHeight;
    const warpColors = ['#5de0ff', '#38bdf8', '#a7ead8', '#c084fc', '#f472b6', '#fbbf24', '#60a5fa', '#ffffff'];
    particles = Array.from({ length: innerWidth < 760 ? 110 : 220 }, () => ({
      x: (Math.random() - .5) * innerWidth * 1.5,
      y: (Math.random() - .5) * innerHeight * 1.5,
      z: Math.random() * 1000,
      color: warpColors[Math.floor(Math.random() * warpColors.length)]
    }));
    shockwaves = [];
    steerX = steerY = targetSteerX = targetSteerY = 0;
    warpSpeed = targetSpeed = 1;
    simulatedProgress = 0;

    const line = $('.intro-track span');
    if (line) {
      line.style.animation = 'none';
      void line.offsetWidth;
      line.style.animation = '';
    }

    // Agregar indicador interactivo de UX si no existe
    if (!$('.intro-hint') && $('.intro-copy')) {
      const hint = document.createElement('div');
      hint.className = 'intro-hint';
      hint.innerHTML = '<span class="intro-hint-dot"></span><span>Mueve el cursor para guiar el hiperespacio · Mantén pulsado para acelerar</span>';
      $('.intro-copy').append(hint);
    }

    flightStart = performance.now();
    introFrame = requestAnimationFrame(warpFrame);
    introTimer = setTimeout(closeIntro, 3100);
  }

  $('.intro-skip')?.addEventListener('click', closeIntro);

  $$('[data-replay]').forEach(b => b.onclick = () => {
    paused = false;
    motionSync();
    play();
  });

  addEventListener('keydown', e => {
    if (e.key === 'Escape') closeIntro();
    if (e.code === 'Space' && !intro.hidden && document.activeElement?.tagName !== 'BUTTON') {
      targetSpeed = 3.6;
      intro.classList.add('turbo-warp');
    }
  });

  addEventListener('keyup', e => {
    if (e.code === 'Space' && !intro.hidden) {
      targetSpeed = 1;
      intro.classList.remove('turbo-warp');
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      closeIntro();
      stopCosmos();
    } else if (!paused) {
      startCosmos();
    }
  });

  motionSync();

  let seen = false;
  try {
    seen = sessionStorage.getItem('orbita-v2-intro') === 'yes';
    sessionStorage.setItem('orbita-v2-intro', 'yes');
  } catch {}

  if (!seen && !window.OrbitaBoot?.skipped && document.body.dataset.page === 'index' && !paused) {
    play();
  } else {
    window.OrbitaBoot?.dismiss();
    arrived();
  }

  // Galería de fondos inmersivos interactiva (Backdrops cinematográficos panorámicos)
  function initImmersiveGallery() {
    const section = $('#immersive-feature');
    if (!section) return;

    const slides = $$('#feature-slides .feature-slide');
    const dots = $$('#feature-dots .feature-dot');
    const prevBtn = $('#feature-prev');
    const nextBtn = $('#feature-next');
    const universeBadge = $('#feature-universe-badge');
    const askBtn = $('#feature-btn-ask');

    if (!slides.length) return;

    let currentIndex = 0;
    let autoTimer = null;
    let isHovered = false;

    function showSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      currentIndex = index;

      slides.forEach((sl, i) => {
        sl.classList.toggle('active', i === currentIndex);
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });

      const currentSlide = slides[currentIndex];
      if (currentSlide && universeBadge) {
        const title = currentSlide.dataset.title || '';
        const platform = currentSlide.dataset.platform || '';
        universeBadge.textContent = `${title} · ${platform}`;
        if (askBtn) {
          askBtn.dataset.ask = `Cuéntame sobre ${title} y qué planes de ${platform} tienen`;
        }
      }
    }

    function nextSlide() {
      showSlide(currentIndex + 1);
    }

    function prevSlide() {
      showSlide(currentIndex - 1);
    }

    function startTimer() {
      stopTimer();
      if (!paused && !reduce.matches && !isHovered) {
        autoTimer = setInterval(nextSlide, 5500);
      }
    }

    function stopTimer() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showSlide(idx);
        startTimer();
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startTimer();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startTimer();
      });
    }

    section.addEventListener('mouseenter', () => {
      isHovered = true;
      stopTimer();
    });

    section.addEventListener('mouseleave', () => {
      isHovered = false;
      startTimer();
    });

    // Soporte para gestos táctiles (swipe)
    let touchStartX = 0;
    let touchStartY = 0;
    section.addEventListener('touchstart', e => {
      if (!e.changedTouches || !e.changedTouches[0]) return;
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
      isHovered = true;
      stopTimer();
    }, { passive: true });

    section.addEventListener('touchend', e => {
      if (!e.changedTouches || !e.changedTouches[0]) return;
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) nextSlide();
        else prevSlide();
      }
      isHovered = false;
      startTimer();
    }, { passive: true });

    showSlide(0);
    startTimer();

    window.OrbitaGallery = {
      next: nextSlide,
      prev: prevSlide,
      goTo: showSlide,
      pause: stopTimer,
      resume: startTimer
    };
  }

  initImmersiveGallery();

  // Transiciones de navegación suaves entre páginas
  const transition = document.createElement('div');
  transition.className = 'page-transition';
  document.body.append(transition);

  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a || a.target || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button || reduce.matches || paused) return;
    const url = new URL(a.href, location.href);
    if (url.origin === location.origin && url.pathname !== location.pathname && url.pathname.endsWith('.html')) {
      e.preventDefault();
      transition.classList.add('active');
      setTimeout(() => location.href = url.href, 180);
    }
  });

  addEventListener('pageshow', () => transition.classList.remove('active'));
})();
