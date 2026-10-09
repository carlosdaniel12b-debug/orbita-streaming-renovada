(()=>{
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const root = document.documentElement;
  const lib = window.ORBIT_LIBRARY || [];
  const P = window.ORBITA?.platforms || [];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  
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

  function getTrailerId(item) { return window.ORBIT_TRAILERS?.[item?.id]?.video || null; }

  function openMovie(id) {
    const m = lib.find(x => x.id === id);
    if (!m) return;
    const p = platform(m.platform);
    const trailerId = getTrailerId(m);
    
    // Activa la atmósfera de color de la app que tiene esta película
    window.OrbitaColors?.set(m.platform);

    const trailerHtml = '<button class="detail-trailer-button" type="button" data-trailer="'+m.id+'">'+(trailerId?'Ver mini tráiler':'Buscar tráiler')+' <span aria-hidden="true">↗</span></button>';

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
      ${trailerHtml}
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

  const detailsDialog = $('#details');
  if (detailsDialog) {
    detailsDialog.addEventListener('close', () => {
      const iframe = detailsDialog.querySelector('iframe');
      if (iframe) iframe.src = '';
    });
  }

  // Delegación global para botones con atributo [data-ask]
  document.addEventListener('click', e => {
    const askTarget = e.target.closest('[data-ask]');
    if (askTarget) {
      e.preventDefault();
      const query = askTarget.dataset.ask;
      if (query && window.OrbitGuide) {
        window.OrbitGuide.ask(query);
      }
    }
  });

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

    const params = new URLSearchParams(location.search);
    let activeType = ['Película','Serie','Anime','Novela'].includes(params.get('tipo')) ? params.get('tipo') : 'all';
    let activePlatform = params.get('plataforma') || 'all';
    let searchQ = params.get('q') || '';

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
        const badge = m.badge || '';
        return `
          <article class="liquid-glass descubre-card" data-movie="${m.id}" aria-label="${m.title}">
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
                <span class="descubre-year">${m.year || ''}</span>
              </div>
              <h3 class="descubre-card-title">${m.title}</h3>
              <p class="descubre-card-genre">${m.type} · ${m.genre.split(',')[0]}</p><div class="card-actions"><button type="button" data-trailer="${m.id}">${window.ORBIT_TRAILERS?.[m.id] ? 'Ver tráiler' : 'Buscar tráiler'}</button><button type="button" data-open-movie="${m.id}">Ficha <span aria-hidden="true">↗</span></button></div>
            </div>
          </article>
        `;
      }).join('');

      $$('#descubre-grid [data-movie]').forEach(el => {
        el.onclick = event => { if (!event.target.closest('[data-trailer]')) openMovie(el.dataset.movie); };
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

    if (searchInput) searchInput.value = searchQ;
    if (searchClear) searchClear.style.display = searchQ ? 'inline-block' : 'none';
    typeChips.forEach(b => { const on = b.dataset.type === activeType; b.classList.toggle('active', on); b.setAttribute('aria-pressed', String(on)); });
    platformChips.forEach(b => { const on = b.dataset.platform === activePlatform || platform(activePlatform).name === b.dataset.platform; b.classList.toggle('active', on); b.setAttribute('aria-pressed', String(on)); });
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
    let pointerFrame = 0;
    let pointerX = 0, pointerY = 0;
    const resetDepth = () => {
      pointerX = pointerY = 0;
      hero.style.setProperty('--depth-x', '0px');
      hero.style.setProperty('--depth-y', '0px');
    };
    hero.addEventListener('pointermove', event => {
      if (paused || reduce.matches || matchMedia('(max-width:700px)').matches || event.pointerType !== 'mouse') return;
      const box = hero.getBoundingClientRect();
      pointerX = ((event.clientX - box.left) / box.width - .5) * 16;
      pointerY = ((event.clientY - box.top) / box.height - .5) * 10;
      if (!pointerFrame) pointerFrame = requestAnimationFrame(() => {
        hero.style.setProperty('--depth-x', `${pointerX}px`);
        hero.style.setProperty('--depth-y', `${pointerY}px`);
        pointerFrame = 0;
      });
    });
    hero.addEventListener('pointerleave', resetDepth);
    reduce.addEventListener('change', resetDepth);
    document.querySelector('.motion-toggle')?.addEventListener('click', resetDepth);
  }

  initHeroCinematic();

  // Sincronización de reducción de movimiento
  const motion = $('.motion-toggle');
  function motionSync() {
    root.classList.toggle('motion-paused', paused || reduce.matches);
    if (motion) {
      motion.disabled = reduce.matches;
      motion.innerHTML = (paused ? "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">\n  <path d=\"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z\" />\n</svg>" : "<svg class=\"ui-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">\n  <rect x=\"14\" y=\"3\" width=\"5\" height=\"18\" rx=\"1\" />\n  <rect x=\"5\" y=\"3\" width=\"5\" height=\"18\" rx=\"1\" />\n</svg>");
      motion.setAttribute('aria-pressed', String(paused));
      motion.setAttribute('aria-label', paused ? 'Activar efectos' : 'Pausar efectos');
    }
    $$('[data-replay]').forEach(b => b.disabled = false);
    if (paused || reduce.matches) {
      closeIntro();
      $$('.feature-image,.combo-visual,.arcade-art,.movie-card,.platform-card').forEach(el => el.style.transform = '');
      $$('.movie-card .poster-wrap img').forEach(im => im.style.transform = '');
    }

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

  // The portal owns its lifecycle independently of optional visual engines.
  function closeIntro() { window.OrbitaPortal?.close(); }
  function play() { if (window.OrbitaPortal) window.OrbitaPortal.play(); else location.href = 'index.html'; }
  if (!$('#intro')) $$('[data-replay]').forEach(button => button.addEventListener('click', play));

  motionSync();

})();
