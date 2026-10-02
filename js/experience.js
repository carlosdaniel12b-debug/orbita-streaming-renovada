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
      if (document.body.dataset.page === 'index' && typeof play === 'function') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        play();
      } else {
        location.href = 'index.html';
      }
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
    const count = isMobile ? 22 : Math.min(95, Math.max(50, Math.floor((cW * cH) / 14000)));
    cosmosStars = [];
    for (let i = 0; i < count; i++) {
      const depth = Math.random(); // 0: lejana, 1: cercana
      cosmosStars.push({
        x: Math.random() * cW,
        y: Math.random() * cH,
        size: (isMobile ? 0.5 : 0.65) + depth * 0.9,
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
    if (document.hidden || window.scrollY > 950) {
      cosmosRaf = requestAnimationFrame(renderCosmos);
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

    const isMobile = window.innerWidth < 768;
    const isDialogOpen = Boolean(document.querySelector('dialog[open]'));
    if (isDialogOpen || (isMobile && window.scrollY > 700)) {
      cosmosRaf = null;
      return;
    }

    cosmosRaf = requestAnimationFrame(renderCosmos);
  }

  function startCosmos() {
    if (!cosmosRaf && !paused && !reduce.matches && !document.hidden && cCtx) {
      const isMobile = window.innerWidth < 768;
      const isDialogOpen = Boolean(document.querySelector('dialog[open]'));
      if (isDialogOpen || (isMobile && window.scrollY > 700)) return;
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

  window.addEventListener('scroll', () => {
    if (window.innerWidth < 768) {
      if (window.scrollY > 700) {
        stopCosmos();
      } else {
        startCosmos();
      }
    }
  }, { passive: true });

  window.addEventListener('orbit:dialog-open', stopCosmos);
  window.addEventListener('orbit:dialog-close', startCosmos);
  document.querySelectorAll('dialog').forEach(dlg => {
    dlg.addEventListener('close', startCosmos);
    dlg.addEventListener('cancel', startCosmos);
  });

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
      camera = new T.PerspectiveCamera(36, 1, .1, 100);
      camera.position.set(0, 0, 8.6);

      const loader = new T.TextureLoader();
      const map = loader.load(window.EARTH_TEXTURE || 'assets/earth.jpg');
      map.encoding = T.sRGBEncoding;

      globe = new T.Mesh(new T.SphereGeometry(1.28, 64, 48), new T.MeshPhongMaterial({ map, color: 0x1a364d, shininess: 16, specular: 0x22445b }));
      globe.rotation.set(0.08, 1.35, 0.12);
      scene.add(globe);

      clouds = new T.Mesh(new T.SphereGeometry(1.31, 48, 32), new T.MeshPhongMaterial({ map: loader.load(window.CLOUD_TEXTURE || 'assets/clouds.png'), transparent: true, opacity: .36, depthWrite: false }));
      clouds.rotation.set(0.08, 1.40, 0.12);
      scene.add(clouds);

      const atmosphere = new T.Mesh(new T.SphereGeometry(1.35, 48, 32), new T.ShaderMaterial({
        uniforms: { glowColor: { value: new T.Color(0xa7ead8) } },
        vertexShader: 'varying vec3 n; varying vec3 v; void main(){n=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}',
        fragmentShader: 'uniform vec3 glowColor;varying vec3 n;varying vec3 v;void main(){float a=pow(1.-max(dot(n,v),0.),3.2);gl_FragColor=vec4(glowColor,a*.75);}',
        transparent: true,
        depthWrite: false,
        side: T.FrontSide
      }));
      scene.add(atmosphere);

      rings = new T.Group();
      [1.68, 1.86, 2.04].forEach((radius, i) => {
        const r = new T.Mesh(new T.TorusGeometry(radius, .007 + i * .002, 16, 200), new T.MeshBasicMaterial({ color: palette[theme][0], transparent: true, opacity: .88 - i * .16 }));
        r.rotation.x = 1.15;
        r.rotation.y = -.35;
        r.rotation.z = .22;
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

      const heroElem = document.getElementById('hero-cinematic') || document.querySelector('.hero');
      function size() {
        const w = heroElem ? heroElem.clientWidth : window.innerWidth;
        const h = heroElem ? heroElem.clientHeight : window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        // En pantallas angostas (móviles verticales), alejamos la cámara para que los anillos se vean 100% completos
        camera.position.z = (w < h) ? 10.5 : 8.6;
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
    } catch (e) {
      root.classList.remove('webgl-ready');
    }
  }

  // RENDER OPTIMIZADO ON-DEMAND PARA 60/120 FPS FLUIDO SIN LAG
  let needsPlanetRender = true;
  let currentRingsColor = new THREE.Color(palette[theme][0]);

  function renderPlanet() {
    if (!renderer || !scene || !camera) return;
    renderer.render(scene, camera);
  }

  function loop() {
    requestAnimationFrame(loop);
    if (document.hidden) return;

    if (renderer && inView && window.scrollY < 800) {
      const targetHex = window.OrbitaColors?.color() || palette[theme][0];
      const targetColor = new THREE.Color(targetHex);

      // Lerp suave del color de los anillos solo cuando hay transición de plataforma
      if (rings && !currentRingsColor.equals(targetColor)) {
        currentRingsColor.lerp(targetColor, 0.08);
        rings.children.forEach(r => r.material.color.copy(currentRingsColor));
        renderPlanet();
      } else if (needsPlanetRender) {
        renderPlanet();
        needsPlanetRender = false;
      }
    }
  }
  requestAnimationFrame(loop);

  // ==========================================================================
  // HERO CINEMÁTICO: NAVEGACIÓN Y COMPORTAMIENTO ULTRA-FLUIDO
  // ==========================================================================
  function initHeroCinematic() {
    const hero = document.getElementById('hero-cinematic');
    if (!hero) return;

    const header = document.getElementById('main-header') || document.querySelector('.header');

    // Control de navbar ligero con rAF
    let ticking = false;
    const updateHeader = () => {
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 35);
      }
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
    updateHeader();
  }

  initHeroCinematic();

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

  // ==========================================================================
  // MOTOR DE LA INTRO GALÁCTICA ULTRA-OPTIMIZADA 60FPS
  // ==========================================================================
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

  function unlockPage() {
    root.classList.remove('intro-pending');
    document.documentElement.classList.remove('intro-pending');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    lock(false);
    arrived();
    if (window.ScrollTrigger) {
      setTimeout(() => window.ScrollTrigger.refresh(), 100);
    }
  }

  function closeIntro() {
    clearTimeout(introTimer);
    cancelAnimationFrame(introFrame);
    if (window.OrbitaBoot) {
      clearTimeout(window.OrbitaBoot.timer);
      window.OrbitaBoot.pending = false;
      window.OrbitaBoot.skipped = true;
    }
    unlockPage();

    if (!intro) return;

    intro.classList.add('leaving');
    intro.style.pointerEvents = 'none';

    if (intro.contains(document.activeElement)) {
      document.activeElement.blur();
      if (previous && previous !== document.body && previous.isConnected) {
        previous.focus({ preventScroll: true });
      }
    }

    const copy = $('.intro-copy');
    if (copy) copy.style.transform = 'none';

    clearTimeout(restoreTimer);
    restoreTimer = setTimeout(() => {
      intro.classList.add('dismissed');
      intro.hidden = true;
      intro.style.setProperty('display', 'none', 'important');
      intro.style.setProperty('visibility', 'hidden', 'important');
      intro.style.setProperty('pointer-events', 'none', 'important');
      intro.style.setProperty('opacity', '0', 'important');
      intro.classList.remove('leaving');
      intro.classList.remove('turbo-warp');
      unlockPage();
    }, 450);
  }

  window.closeOrbitaIntro = closeIntro;
  if (window.OrbitaBoot) {
    window.OrbitaBoot.dismiss = closeIntro;
  }

  // Interacción de dirección (steering) en la intro para PC y móvil con centrado perfecto
  const handleSteer = (clientX, clientY) => {
    targetSteerX = (clientX / innerWidth - 0.5) * 2;
    targetSteerY = (clientY / innerHeight - 0.5) * 2;

    const copy = $('.intro-copy');
    if (copy) {
      copy.style.transform = `perspective(1000px) rotateX(${-targetSteerY * 7}deg) rotateY(${targetSteerX * 9}deg) translateZ(8px)`;
    }

    const rings = $('.portal-rings');
    if (rings) {
      rings.style.transform = `perspective(1000px) rotateX(${56 - targetSteerY * 10}deg) rotateY(${-18 + targetSteerX * 12}deg)`;
    }
  };

  intro?.addEventListener('pointermove', e => {
    handleSteer(e.clientX, e.clientY);
  });

  intro?.addEventListener('pointerleave', () => {
    targetSteerX = 0;
    targetSteerY = 0;
    const copy = $('.intro-copy');
    if (copy) copy.style.transform = 'none';
    const rings = $('.portal-rings');
    if (rings) rings.style.transform = '';
  });

  intro?.addEventListener('touchmove', e => {
    if (e.touches && e.touches[0]) {
      handleSteer(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (warp && (!intro || !intro.hidden)) {
      warp.width = innerWidth;
      warp.height = innerHeight;
    }
  }, { passive: true });

  // Modo Turbo Warp (Hipersalto) al mantener presionado en PC y móvil
  intro?.addEventListener('pointerdown', e => {
    if (e.target.closest('.intro-skip')) return;
    isHolding = true;
    targetSpeed = 4.2;
    intro.classList.add('turbo-warp');

    const swColors = ['#5de0ff', '#38bdf8', '#a7ead8', '#c084fc', '#f472b6', '#fbbf24'];
    shockwaves.push({
      x: e.clientX || innerWidth / 2,
      y: e.clientY || innerHeight / 2,
      radius: 14,
      maxRadius: Math.max(innerWidth, innerHeight) * 0.85,
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

  // Renderizador del túnel hiperespacial a 60 FPS puros (SIN shadowBlur)
  function warpFrame(t) {
    if (intro.hidden || document.hidden || !ctx) return;

    // Suavizado lerp de dirección y velocidad
    steerX += (targetSteerX - steerX) * 0.08;
    steerY += (targetSteerY - steerY) * 0.08;
    warpSpeed += (targetSpeed - warpSpeed) * 0.14;

    const w = warp.width;
    const h = warp.height;
    const cx = w / 2 + steerX * (w * 0.22);
    const cy = h / 2 + steerY * (h * 0.22);

    ctx.clearRect(0, 0, w, h);

    // Fondo de aurora cósmica hiperespacial radiante
    const nebGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(w, h) * 0.7);
    nebGrad.addColorStop(0, warpSpeed > 2 ? 'rgba(93, 224, 255, 0.32)' : 'rgba(167, 234, 216, 0.16)');
    nebGrad.addColorStop(0.35, warpSpeed > 2 ? 'rgba(192, 132, 252, 0.20)' : 'rgba(56, 189, 248, 0.09)');
    nebGrad.addColorStop(0.7, warpSpeed > 2 ? 'rgba(244, 114, 182, 0.12)' : 'rgba(14, 28, 48, 0.06)');
    nebGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = nebGrad;
    ctx.fillRect(0, 0, w, h);

    const elapsed = (t - flightStart) / 1000;
    simulatedProgress += (warpSpeed > 2 ? 0.024 : 0.0085);

    // Actualizar medidor HUD cósmico
    const hudBar = $('#intro-hud-bar');
    const hudPct = $('#intro-warp-pct');
    const hudState = $('#intro-warp-state');
    const progressClamped = Math.min(1, simulatedProgress);

    if (hudBar) hudBar.style.transform = `scaleX(${progressClamped})`;
    if (hudPct) hudPct.textContent = `${Math.floor(progressClamped * 100)}%`;
    if (hudState) hudState.textContent = warpSpeed > 2 ? 'VELOCIDAD LUZ: 4.0X' : 'VELOCIDAD LUZ: 1.0X';

    // Dibujar estrellas en túnel 3D hiperespacial
    const fov = 480;
    for (let i = 0; i < particles.length; i++) {
      const s = particles[i];
      const step = (1.2 + elapsed * 0.35) * warpSpeed * 9.5;
      s.z -= step;
      if (s.z <= 1) {
        s.z = 1000 + Math.random() * 200;
        s.x = (Math.random() - 0.5) * w * 1.6;
        s.y = (Math.random() - 0.5) * h * 1.6;
      }

      const k = fov / s.z;
      const x = cx + s.x * k;
      const y = cy + s.y * k;

      if (x < -60 || x > w + 60 || y < -60 || y > h + 60) continue;

      const prevK = fov / (s.z + step * 3.6);
      const prevX = cx + s.x * prevK;
      const prevY = cy + s.y * prevK;

      const alpha = Math.min(1, Math.max(0.12, 1 - s.z / 1000));

      ctx.strokeStyle = s.color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = s.size * (warpSpeed > 2 ? 1.6 : 1.0);
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Destello brillante en la cabeza de la estrella cuando se acerca
      if (s.z < 420) {
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = Math.min(1, alpha * 1.2);
        ctx.beginPath();
        ctx.arc(x, y, s.size * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Dibujar ondas de choque cósmicas
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      sw.radius += 24 * warpSpeed;
      sw.alpha *= 0.92;

      if (sw.alpha < 0.02 || sw.radius > sw.maxRadius) {
        shockwaves.splice(i, 1);
        continue;
      }

      ctx.strokeStyle = sw.color || '#5de0ff';
      ctx.globalAlpha = sw.alpha;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;

    // Si se completa el salto cósmico, transición cinematográfica a la app
    if (simulatedProgress >= 1) {
      closeIntro();
      return;
    }

    introFrame = requestAnimationFrame(warpFrame);
  }

  function play() {
    if (paused || reduce.matches) {
      window.OrbitaBoot?.dismiss();
      arrived();
      return;
    }
    if (window.OrbitaBoot) {
      clearTimeout(window.OrbitaBoot.timer);
      window.OrbitaBoot.pending = true;
      window.OrbitaBoot.skipped = false;
    }
    root.classList.add('intro-pending');
    clearTimeout(restoreTimer);
    clearTimeout(introTimer);

    previous = document.activeElement;
    intro.classList.remove('dismissed');
    intro.classList.remove('leaving');
    intro.classList.remove('turbo-warp');
    intro.removeAttribute('hidden');
    intro.hidden = false;
    intro.style.removeProperty('display');
    intro.style.removeProperty('visibility');
    intro.style.removeProperty('pointer-events');
    intro.style.removeProperty('opacity');
    document.body.classList.remove('arrival');
    intro.setAttribute('role', 'dialog');
    intro.setAttribute('aria-modal', 'true');
    intro.setAttribute('aria-label', 'Viaje de entrada en órbita');
    document.body.style.overflow = 'hidden';
    lock(true);

    $('.intro-skip')?.focus({ preventScroll: true });

    warp.width = innerWidth;
    warp.height = innerHeight;
    const isMobile = innerWidth < 768;
    const warpColors = ['#5de0ff', '#38bdf8', '#a7ead8', '#c084fc', '#f472b6', '#fbbf24', '#60a5fa', '#ffffff'];
    particles = Array.from({ length: isMobile ? 110 : 230 }, () => ({
      x: (Math.random() - 0.5) * innerWidth * 1.6,
      y: (Math.random() - 0.5) * innerHeight * 1.6,
      z: Math.random() * 1000,
      size: 0.9 + Math.random() * 1.3,
      color: warpColors[Math.floor(Math.random() * warpColors.length)]
    }));
    shockwaves = [];
    steerX = steerY = targetSteerX = targetSteerY = 0;
    warpSpeed = targetSpeed = 1;
    simulatedProgress = 0;

    const hudBar = $('#intro-hud-bar');
    if (hudBar) hudBar.style.transform = 'scaleX(0)';

    flightStart = performance.now();
    cancelAnimationFrame(introFrame);
    introFrame = requestAnimationFrame(warpFrame);
    introTimer = setTimeout(closeIntro, 2600);
  }

  $('.intro-skip')?.addEventListener('click', closeIntro);
  $('.intro-emblem')?.addEventListener('click', closeIntro);

  $$('[data-replay]').forEach(b => b.onclick = () => {
    paused = false;
    motionSync();
    play();
  });

  addEventListener('keydown', e => {
    if (e.key === 'Escape' || e.key === 'Enter') closeIntro();
    if (e.code === 'Space' && !intro.hidden && document.activeElement?.tagName !== 'BUTTON') {
      targetSpeed = 4.2;
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

  // Inicio garantizado de la intro en index.html sin bloqueo de sessionStorage
  if (document.body.dataset.page === 'index' && !paused && !reduce.matches) {
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
