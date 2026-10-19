(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const grid = $('#descubre-grid');
  if (!grid) return;
  const library = window.ORBIT_LIBRARY || [];
  const platforms = window.ORBITA?.platforms || [];
  const platform = id => platforms.find(item => item.id === id);
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const escape = value => String(value || '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const params = new URLSearchParams(location.search);
  const search = $('#descubre-search-input');
  let type = params.get('tipo') || 'all';
  let service = params.get('plataforma') || 'all';
  if (platform(service)) service = platform(service).name;
  search.value = params.get('q') || '';
  if (![...document.querySelectorAll('[data-type]')].some(item => item.dataset.type === type)) type = 'all';
  if (![...document.querySelectorAll('[data-platform]')].some(item => item.dataset.platform === service)) service = 'all';

  function render() {
    const query = normalize(search.value.trim());
    const matches = library.filter(item => platform(item.platform) &&
      (type === 'all' || item.type === type) &&
      (service === 'all' || platform(item.platform)?.name === service) &&
      normalize([item.title, item.genre, platform(item.platform)?.name, ...(item.aliases || [])].join(' ')).includes(query));
    grid.innerHTML = matches.map(item => `<article class="descubre-card">
      <button class="descubre-cover" type="button" data-movie="${escape(item.id)}" aria-label="Ver detalles de ${escape(item.title)}"><img src="${escape(item.image)}" alt="" loading="lazy" decoding="async" width="300" height="450"/></button>
      <div class="descubre-card-body"><div class="descubre-card-meta"><span>${escape(platform(item.platform)?.name)}</span><span>${escape(item.year)}</span></div>
      <h2><button type="button" data-movie="${escape(item.id)}">${escape(item.title)}</button></h2><p>${escape(item.type)} · ${escape(item.genre.split(',')[0])}</p>
      ${window.ORBIT_TRAILERS?.[item.id] ? `<button class="descubre-trailer" type="button" data-trailer-id="${escape(item.id)}">▷ Ver tráiler</button>` : ''}</div></article>`).join('');
    $('#descubre-count').textContent = matches.length;
    $('#descubre-empty').style.display = matches.length ? 'none' : 'block';
    $('#descubre-search-clear').style.display = search.value ? 'block' : 'none';
    document.querySelectorAll('[data-type]').forEach(button => {const active = button.dataset.type === type; button.classList.toggle('active', active); button.setAttribute('aria-pressed', active);});
    document.querySelectorAll('[data-platform]').forEach(button => {const active = button.dataset.platform === service; button.classList.toggle('active', active); button.setAttribute('aria-pressed', active);});
    const url = new URL(location.href);
    for (const [key, value] of [['q',search.value.trim()],['tipo',type],['plataforma',service]]) {
      value && value !== 'all' ? url.searchParams.set(key,value) : url.searchParams.delete(key);
    }
    history.replaceState(null, '', url);
  }
  function showDetails(id) {
    const item = library.find(movie => movie.id === id);
    if (!item) return;
    const dialog = $('#details');
    $('#detail-body').innerHTML = `<div class="story-detail"><img src="${escape(item.image)}" alt="" width="180" height="270"/><div><span class="eyebrow">${escape(platform(item.platform)?.name)} · ${escape(item.type)} · ${escape(item.year)}</span><h2 id="detail-title">${escape(item.title)}</h2><p>${escape(item.esSummary || item.summary)}</p><p class="muted">${escape(item.genre.replaceAll(',', ' · '))}</p><p class="regional-note">Confirma la disponibilidad en tu país antes de contratar.</p><div class="story-actions"><a class="button" href="catalogo.html?plataforma=${encodeURIComponent(item.platform)}">Ver plataforma ↗</a>${window.ORBIT_TRAILERS?.[id] ? `<button class="button ghost" type="button" data-trailer-id="${escape(id)}">Ver tráiler</button>` : ''}</div></div></div>`;
    if (!dialog.open) dialog.showModal();
  }
  function playTrailer(id) {
    const trailer = window.ORBIT_TRAILERS?.[id];
    if (!trailer || !/^[a-zA-Z0-9_-]{11}$/.test(trailer.video)) return;
    if ($('#details')?.open) $('#details').close();
    let modal = $('#orbit-trailer-modal');
    if (!modal) {
      modal = document.createElement('dialog');
      modal.id = 'orbit-trailer-modal';
      modal.setAttribute('aria-label','Reproductor de tráiler');
      document.body.append(modal);
      modal.addEventListener('close', () => modal.replaceChildren());
      modal.addEventListener('cancel', () => modal.replaceChildren());
    }
    modal.innerHTML = `<button type="button" class="button trailer-close">Cerrar tráiler ×</button><iframe src="https://www.youtube-nocookie.com/embed/${trailer.video}?autoplay=1" title="${escape(trailer.title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe><a href="https://www.youtube.com/watch?v=${trailer.video}" target="_blank" rel="noopener">Abrir en YouTube ↗</a>`;
    modal.querySelector('button').addEventListener('click', () => modal.close());
    modal.showModal();
  }
  document.addEventListener('click', event => {
    const trailer = event.target.closest('[data-trailer-id]');
    if (trailer) return playTrailer(trailer.dataset.trailerId);
    const movie = event.target.closest('[data-movie]');
    if (movie) showDetails(movie.dataset.movie);
  });
  search.addEventListener('input', render);
  $('#descubre-search-clear').addEventListener('click', () => {search.value = ''; render(); search.focus();});
  document.querySelectorAll('[data-type]').forEach(button => button.addEventListener('click', () => {type = button.dataset.type; render();}));
  document.querySelectorAll('[data-platform]').forEach(button => button.addEventListener('click', () => {service = button.dataset.platform; render();}));
  const reset = () => {type = service = 'all'; search.value = ''; render();};
  $('#descubre-reset-filters').addEventListener('click', reset);
  $('#descubre-empty-reset').addEventListener('click', reset);
  render();
})();
