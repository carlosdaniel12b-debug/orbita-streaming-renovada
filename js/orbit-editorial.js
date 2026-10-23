(() => {
  'use strict';
  const grid = document.querySelector('#orbit-pick-grid');
  if (!grid) return;

  // Small selection from library.js; the full discovery catalogue is not loaded here.
  const curatedPicks = [
  {
    "id": "s44933",
    "title": "Severance",
    "platform": "appletv",
    "type": "Serie",
    "genre": "Drama,Science-Fiction,Misterio",
    "year": "2022",
    "image": "assets/optimized/s44933.webp",
    "summary": "Empleados de una corporación se someten a un procedimiento quirúrgico que separa quirúrgicamente sus recuerdos laborales de sus vidas personales."
  },
  {
    "id": "m_dune2",
    "title": "Dune: Parte Dos",
    "platform": "hbomax",
    "type": "Película",
    "genre": "Ciencia ficción,Aventura",
    "year": "2024",
    "image": "assets/optimized/m_dune2.webp",
    "summary": "Paul Atreides se une a Chani y a los Fremen mientras busca venganza contra los conspiradores que destruyeron a su familia."
  },
  {
    "id": "s49041",
    "title": "Fallout",
    "platform": "primevideo",
    "type": "Serie",
    "genre": "Ciencia ficción,aventura",
    "year": "2024",
    "image": "assets/optimized/s49041.webp",
    "summary": "Una joven abandona un refugio subterráneo y descubre el peligroso mundo que quedó después de una guerra nuclear."
  },
  {
    "id": "s53777",
    "title": "Landman",
    "platform": "paramount",
    "type": "Serie",
    "genre": "Drama",
    "year": "2024",
    "image": "assets/optimized/s53777.webp",
    "summary": "Un intermediario del negocio petrolero en Texas intenta resolver conflictos entre trabajadores, empresarios y su propia familia."
  },
  {
    "id": "s46562",
    "title": "The Last of Us",
    "platform": "hbomax",
    "type": "Serie",
    "genre": "Drama,aventura",
    "year": "2023",
    "image": "assets/optimized/s46562.webp",
    "summary": "Joel debe acompañar a Ellie por un mundo devastado por una infección. Su relación es el centro de un viaje peligroso."
  },
  {
    "id": "s44458",
    "title": "Ted Lasso",
    "platform": "appletv",
    "type": "Serie",
    "genre": "Drama,Comedia,Sports",
    "year": "2020",
    "image": "assets/optimized/s44458.webp",
    "summary": "Un carismático entrenador de fútbol americano es contratado para dirigir un equipo de la Premier League británica con optimismo inquebrantable."
  },
  {
    "id": "m_topgun",
    "title": "Top Gun: Maverick",
    "platform": "paramount",
    "type": "Película",
    "genre": "Acción,Drama",
    "year": "2022",
    "image": "assets/optimized/m_topgun.webp",
    "summary": "Después de treinta años de servicio como uno de los mejores aviadores de la Armada, Maverick entrena a un destacamento de graduados para una misión especializada."
  },
  {
    "id": "m7",
    "title": "Finch",
    "platform": "appletv",
    "type": "Película",
    "genre": "Ciencia ficción,drama",
    "year": "2021",
    "image": "assets/optimized/m7.webp",
    "summary": "Un hombre construye un robot para cuidar de su perro en una Tierra devastada y emprende un viaje con ambos."
  },
  {
    "id": "s44267",
    "title": "Teresa",
    "platform": "vix",
    "type": "Novela",
    "genre": "Drama,Romance",
    "year": "2010",
    "image": "assets/optimized/s44267.webp",
    "summary": "Una joven ambiciosa intenta escapar de la pobreza y debe elegir entre sus sentimientos y el mundo que desea."
  },
  {
    "id": "s16276",
    "title": "Rubí",
    "platform": "vix",
    "type": "Novela",
    "genre": "Drama,Romance",
    "year": "2004",
    "image": "assets/optimized/s16276.webp",
    "summary": "La ambición de Rubí transforma las vidas de quienes confían en ella y pone a prueba sus afectos."
  },
  {
    "id": "s74573",
    "title": "El amor invencible",
    "platform": "vix",
    "type": "Novela",
    "genre": "Drama,Romance",
    "year": "2023",
    "image": "assets/optimized/s74573.webp",
    "summary": "Leona reconstruye su vida mientras busca a sus hijos y la verdad sobre quienes destruyeron a su familia."
  },
  {
    "id": "s16277",
    "title": "La usurpadora",
    "platform": "vix",
    "type": "Novela",
    "genre": "Drama,Romance",
    "year": "1998",
    "image": "assets/optimized/s16277.webp",
    "summary": "Dos mujeres idénticas intercambian sus lugares y desatan secretos en una familia marcada por las apariencias."
  },
  {
    "id": "s24562",
    "title": "La fea más bella",
    "platform": "vix",
    "type": "Novela",
    "genre": "Romance,Comedia",
    "year": "2006",
    "image": "assets/optimized/s24562.webp",
    "summary": "Leticia llega a una productora donde su talento y su historia de amor desafían las apariencias."
  }
];
  window.ORBIT_LIBRARY = window.ORBIT_LIBRARY || curatedPicks;
 const platforms = window.ORBITA?.platforms || [];
  const library = curatedPicks.filter(item => platforms.some(platform => platform.id === item.platform));
  const displayPlatform = id => platforms.find(platform => platform.id === id)?.name || '';
  const types = { all: null, movie: 'Película', series: 'Serie', anime: 'Anime', novela: 'Novela' };
  const initial = ['s44933', 'm_dune2', 's66998', 's49041'];
  const status = document.querySelector('#orbit-pick-status');
  const moodButtons = [...document.querySelectorAll('[data-orbit-mood]')];
  let mood = 'all';
  let previous = [];

  function shuffled(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function render(first = false) {
    const pool = library.filter(item => !types[mood] || item.type === types[mood]);
    // Prioritize unseen titles, then fill the row without creating duplicates.
    const fresh = shuffled(pool.filter(item => !previous.includes(item.id)));
    const repeated = shuffled(pool.filter(item => previous.includes(item.id)));
    const preferred = first ? initial.map(id => library.find(item => item.id === id)).filter(Boolean) : [];
    const selected = [...preferred, ...fresh, ...repeated]
      .filter((item, index, all) => all.findIndex(other => other.id === item.id) === index)
      .slice(0, 4);
    previous = selected.map(item => item.id);

    grid.replaceChildren(...selected.map(item => {
      const card = document.createElement('a');
      card.className = 'orbit-pick-card';
      card.href = 'descubre.html?q=' + encodeURIComponent(item.title);
      const cover = document.createElement('div');
      cover.className = 'orbit-pick-cover';
      const image = document.createElement('img');
      image.src = item.image;
      image.alt = '';
      image.width = 400;
      image.height = 280;
      image.loading = 'lazy';
      image.decoding = 'async';
      const label = document.createElement('span');
      label.textContent = displayPlatform(item.platform) + ' · ' + item.type;
      cover.append(image, label);
      const title = document.createElement('h3');
      title.textContent = item.title;
      const description = document.createElement('p');
      description.textContent = item.summary;
      const meta = document.createElement('small');
      meta.textContent = item.genre.split(',').join(' · ') + ' · ' + item.year;
      card.append(cover, title, description, meta);
      return card;
    }));
    if (!first && status) status.textContent = selected.length + ' recomendaciones: ' + selected.map(item => item.title).join(', ') + '.';
  }

  moodButtons.forEach(button => button.addEventListener('click', () => {
    if (!Object.hasOwn(types, button.dataset.orbitMood)) return;
    mood = button.dataset.orbitMood;
    previous = [];
    moodButtons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    render();
  }));
  document.querySelector('#orbit-refresh')?.addEventListener('click', () => render());
  render(true);
})();
