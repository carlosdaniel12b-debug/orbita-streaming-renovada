(() => {
  'use strict';
  const grid = document.querySelector('#orbit-pick-grid');
  if (!grid) return;

  // Curated selection from library.js; covers Película, Serie, Anime, and Novela.
  const curatedPicks = [
    {
      "id": "s44933",
      "title": "Severance",
      "platform": "appletv",
      "type": "Serie",
      "genre": "Drama,Ciencia ficción,Misterio",
      "year": "2022",
      "image": "assets/optimized/s44933.webp",
      "summary": "Empleados de una corporación se someten a un procedimiento quirúrgico que separa sus recuerdos laborales de sus vidas personales."
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
      "genre": "Ciencia ficción,Aventura",
      "year": "2024",
      "image": "assets/optimized/s49041.webp",
      "summary": "Una joven abandona un refugio subterráneo y descubre el peligroso mundo que quedó después de una guerra nuclear."
    },
    {
      "id": "s60920",
      "title": "The Penguin",
      "platform": "hbomax",
      "type": "Serie",
      "genre": "Crimen,Drama",
      "year": "2024",
      "image": "assets/optimized/s60920.webp",
      "summary": "Oz Cobb busca el poder en el mundo criminal de Gotham tras los acontecimientos de The Batman."
    },
    {
      "id": "m_gladiator2",
      "title": "Gladiador II",
      "platform": "paramount",
      "type": "Película",
      "genre": "Acción,Aventura,Drama",
      "year": "2024",
      "image": "assets/optimized/m_gladiator2.webp",
      "summary": "Años después de presenciar la muerte de Máximo, Lucio debe entrar en el Coliseo tras ser conquistado su hogar."
    },
    {
      "id": "m_the-gorge",
      "title": "El abismo secreto",
      "platform": "appletv",
      "type": "Película",
      "genre": "Ciencia ficción,Acción",
      "year": "2025",
      "image": "assets/optimized/m_the-gorge.webp",
      "summary": "Dos agentes de élite vigilan los extremos de un abismo misterioso y descubren juntos la amenaza que esconde."
    },
    {
      "id": "s75632",
      "title": "The Pitt",
      "platform": "hbomax",
      "type": "Serie",
      "genre": "Drama,Medicina",
      "year": "2025",
      "image": "assets/optimized/s75632.webp",
      "summary": "Un equipo de urgencias afronta las decisiones críticas y el desgaste de un turno en un hospital de Pittsburgh."
    },
    {
      "id": "s38052",
      "title": "Silo",
      "platform": "appletv",
      "type": "Serie",
      "genre": "Ciencia ficción,Misterio",
      "year": "2023",
      "image": "assets/optimized/s38052.webp",
      "summary": "En un futuro postapocalíptico, diez mil personas viven en un silo subterráneo gigante lleno de secretos sobre el exterior."
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
      "genre": "Drama,Aventura",
      "year": "2023",
      "image": "assets/optimized/s46562.webp",
      "summary": "Joel debe acompañar a Ellie por un mundo devastado por una infección. Su relación es el centro de un viaje peligroso."
    },
    {
      "id": "s44458",
      "title": "Ted Lasso",
      "platform": "appletv",
      "type": "Serie",
      "genre": "Comedia,Drama",
      "year": "2020",
      "image": "assets/optimized/s44458.webp",
      "summary": "Un carismático entrenador de fútbol americano dirige un equipo de la Premier League británica con optimismo inquebrantable."
    },
    {
      "id": "m_topgun",
      "title": "Top Gun: Maverick",
      "platform": "paramount",
      "type": "Película",
      "genre": "Acción,Drama",
      "year": "2022",
      "image": "assets/optimized/m_topgun.webp",
      "summary": "Después de treinta años como uno de los mejores aviadores, Maverick entrena a un grupo de graduados para una misión imposible."
    },
    {
      "id": "m_oppenheimer",
      "title": "Oppenheimer",
      "platform": "primevideo",
      "type": "Película",
      "genre": "Drama,Historia",
      "year": "2023",
      "image": "assets/optimized/m_oppenheimer.webp",
      "summary": "La historia del físico J. Robert Oppenheimer y su rol en el Proyecto Manhattan y el desarrollo de la bomba atómica."
    },
    {
      "id": "m_spiderverse",
      "title": "Spider-Man: A través del Spider-Verso",
      "platform": "hbomax",
      "type": "Película",
      "genre": "Animación,Acción,Aventura",
      "year": "2023",
      "image": "assets/optimized/m_spiderverse.webp",
      "summary": "Miles Morales es catapultado a través del Multiverso, donde se encuentra con un equipo encargado de proteger su existencia."
    },
    {
      "id": "m7",
      "title": "Finch",
      "platform": "appletv",
      "type": "Película",
      "genre": "Ciencia ficción,Drama",
      "year": "2021",
      "image": "assets/optimized/m7.webp",
      "summary": "Un hombre construye un robot para cuidar de su perro en una Tierra devastada y emprende un viaje con ambos."
    },
    {
      "id": "s73023",
      "title": "Dandadan",
      "platform": "primevideo",
      "type": "Anime",
      "genre": "Anime,Acción,Sobrenatural",
      "year": "2024",
      "image": "assets/optimized/s73023.webp",
      "summary": "Una estudiante que cree en fantasmas y un compañero obsesionado con ovnis descubren que ambos fenómenos son peligrosamente reales."
    },
    {
      "id": "s77383",
      "title": "Sakamoto Days",
      "platform": "hbomax",
      "type": "Anime",
      "genre": "Anime,Acción,Comedia",
      "year": "2025",
      "image": "assets/optimized/s77383.webp",
      "summary": "El sicario más legendario se retira por amor y abre una tienda de barrio, pero su pasado regresa para ponerlo a prueba."
    },
    {
      "id": "s69046",
      "title": "Tragones y Mazmorras",
      "platform": "primevideo",
      "type": "Anime",
      "genre": "Anime,Fantasía,Aventura",
      "year": "2024",
      "image": "assets/optimized/s69046.webp",
      "summary": "Un grupo de aventureros se adentra en un calabozo cocinando a las criaturas que derrotan para rescatar a su compañera."
    },
    {
      "id": "s48945",
      "title": "Cyberpunk: Edgerunners",
      "platform": "hbomax",
      "type": "Anime",
      "genre": "Anime,Ciencia ficción,Acción",
      "year": "2022",
      "image": "assets/optimized/s48945.webp",
      "summary": "En una metrópolis obsesionada con las modificaciones corporales, un joven callejero arriesga todo como mercenario."
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
  const initial = ['s44933', 'm_dune2', 's49041', 's60920'];
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
      card.dataset.platform = item.platform;
      const cover = document.createElement('div');
      cover.className = 'orbit-pick-cover';
      const image = document.createElement('img');
      image.src = item.image;
      image.alt = item.title;
      image.width = 400;
      image.height = 560;
      image.loading = first ? 'eager' : 'lazy';
      image.decoding = 'async';
      const label = document.createElement('span');
      label.className = 'orbit-pick-badge';
      label.textContent = displayPlatform(item.platform) + ' · ' + item.type;
      const playBtn = document.createElement('button');
      playBtn.type = 'button';
      playBtn.className = 'orbit-pick-trailer';
      playBtn.dataset.trailer = item.id;
      playBtn.setAttribute('aria-label', 'Ver tráiler de ' + item.title);
      playBtn.innerHTML = '<span aria-hidden="true">▶</span> Tráiler';
      cover.append(image, label, playBtn);

      const title = document.createElement('h3');
      title.textContent = item.title;
      const description = document.createElement('p');
      description.textContent = item.summary;
      const meta = document.createElement('small');
      meta.innerHTML = `<span class="orbit-pick-genre">${item.genre.split(',').slice(0, 2).join(' · ')} · ${item.year}</span><span class="orbit-pick-explore">Ver ficha ↗</span>`;
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
