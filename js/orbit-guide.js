(()=>{
  'use strict';
  const $ = s => document.querySelector(s);
  const dialog = $('#assistant');
  const log = $('#chat');
  const input = $('#chat-input');
  const country = $('#orbit-country');
  const getLib = () => window.ORBIT_LIBRARY || [];
  const platforms = window.ORBITA?.platforms || [];

  let busy = false;
  let recommendationContext = {};
  let lastIds = [];
  let lastTitle = '';
  let remoteAvailable = false;
  let currentSkipCallback = null;

  const cache = new Map();
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const pBy = id => platforms.find(p => p.id === id);

  if (!dialog || !log || !input) return;

  if (country) {
    try {
      const saved = localStorage.getItem('orbit-country');
      if (saved && [...country.options].some(o => o.value === saved)) country.value = saved;
    } catch {}

    country.onchange = () => {
      try {
        localStorage.setItem('orbit-country', country.value);
      } catch {}
      const countryName = country.selectedOptions?.[0]?.text || country.value;
      appendBotStream('Usaré ' + countryName + ' para los enlaces de disponibilidad regional. Puedes volver a consultar por cualquier título.');
    };
  }

  function open() {
    if (!dialog.open) dialog.showModal();
    input.focus();
  }

  // Creación de mensajes en el chat
  function append(type, text) {
    const el = document.createElement('div');
    el.className = type;
    el.textContent = text;
    log.append(el);
    while (log.children.length > 36) log.firstElementChild.remove();
    log.scrollTop = log.scrollHeight;
    return el;
  }

  // EFECTO MÁQUINA DE ESCRIBIR / STREAMING PARA LA IA ORBIT
  async function appendBotStream(text, onComplete) {
    const el = append('bot', text);
    if (onComplete) await onComplete(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  // Si el usuario hace click en el chat mientras se escribe, salta al texto completo de inmediato
  log.addEventListener('click', () => {
    if (currentSkipCallback) currentSkipCallback();
  });

  function link(el, label, url) {
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'https:') return;
    } catch {
      return;
    }
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = label;
    el.append(document.createElement('br'), a);
  }

  function availability(el, title) {
    const url = 'https://www.justwatch.com/' + country.value.toLowerCase() + '/buscar?q=' + encodeURIComponent(title);
    link(el, 'Consultar dónde verla en ' + country.selectedOptions[0].text + ' ↗', url);
  }

  function combo(el, ids) {
    ids = [...new Set(ids)].filter(pBy);
    if (!ids.length) return;
    lastIds = ids;
    const c = window.OrbitaPricing?.calculate(ids) || { monthly: 5, annual: 0, bonus: false };
    const actions = document.createElement('div');
    actions.className = 'answer-actions';
    const b = document.createElement('button');
    b.textContent = 'Personalizar ' + (ids.length === 1 ? pBy(ids[0]).name : 'este combo');
    b.onclick = () => location.href = 'combos.html?apps=' + encodeURIComponent(ids.join(','));
    actions.append(b);
    el.append(actions);

    const note = document.createElement('small');
    note.className = 'readout';
    note.textContent = (c.monthly ? '$' + c.monthly.toFixed(2) + ' USD/mes' : '') + (c.annual ? (c.monthly ? ' + ' : '') + '$4 USD/año por Canva' : '') + (c.chatgpt ? (c.monthly || c.annual ? ' + ' : '') + '$5 USD / 4 meses por ChatGPT Plus' : '') + (c.bonus ? ' · Spotify de regalo por 1 mes' : '');
    el.append(note);
  }

  function titleCards(el, list) {
    const wrap = document.createElement('div');
    wrap.className = 'answer-titles';
    list.slice(0, 4).forEach(m => {
      const b = document.createElement('button');
      b.className = 'answer-title';
      if (m.image) {
        const img = document.createElement('img');
        img.src = m.image;
        img.alt = '';
        img.loading = 'lazy';
        b.append(img);
      }
      const text = document.createElement('span');
      const strong = document.createElement('strong');
      const small = document.createElement('small');
      const em = document.createElement('em');
      strong.textContent = m.title;
      small.textContent = m.type + ' · ' + m.genre;
      em.textContent = pBy(m.platform)?.name || m.origin || 'Consultar disponibilidad';
      text.append(strong, small, em);
      b.append(text);
      b.onclick = () => ask('¿Dónde puedo ver ' + m.title + '?');
      wrap.append(b);
    });
    el.append(wrap);
  }

  function distance(a, b) {
    let row = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 0; i < a.length; i++) {
      const next = [i + 1];
      for (let j = 0; j < b.length; j++) {
        next.push(Math.min(next[j] + 1, row[j + 1] + 1, row[j] + (a[i] === b[j] ? 0 : 1)));
      }
      row = next;
    }
    return row[b.length];
  }

  function extract(text) {
    const quoted = text.match(/["“](.+?)["”]/);
    if (quoted) return quoted[1].trim();
    return norm(text).replace(/^(hola\s+)?(en que (app|aplicacion|plataforma) (esta|veo|puedo ver)|donde (puedo |se puede )?(ver|veo|esta|encuentro)|quiero ver|busca(me)?|tienes|tienen|que (es|tal es)|de que trata|hablame de|ver)\s+/, '').replace(/^(la |el )?(pelicula|serie)\s+/, '').replace(/\s+(en netflix|en disney|en colombia|en ecuador|en mexico|por favor)$/, '').trim();
  }

  const aliasMap = {
    netflix: ['netflix', 'netflis'],
    disneyplus: ['disney', 'disney plus', 'disneyplus', 'marvel', 'star wars', 'pixar', 'espn'],
    hbomax: ['hbo', 'hbo max', 'max', 'warner'],
    primevideo: ['prime', 'amazon prime', 'prime video', 'amazon'],
    appletv: ['apple tv', 'apple', 'appletv'],
    paramount: ['paramount', 'paramount plus', 'paramount+'],
    spotify: ['spotify', 'musica'],
    vix: ['vix', 'vix premium', 'telenovelas'],
    canva: ['canva', 'canva pro', 'diseno'],
    chatgpt: ['chatgpt', 'chat gpt', 'openai', 'gpt', 'gpt4', 'gpt 4', 'ia', 'inteligencia artificial']
  };

  const titleSynonyms = {
    'duna': 'dune',
    'el juego del calamar': 'squid game',
    'intensamente': 'inside out',
    'casa del dragon': 'house of the dragon',
    'juego de tronos': 'game of thrones',
    'vengadores': 'avengers',
    'los anillos de poder': 'the rings of power',
    'anillos de poder': 'the rings of power',
    'senor de los anillos': 'the rings of power',
    'el lobo de wall street': 'the wolf of wall street',
    'caballero de la noche': 'the dark knight',
    'batman': 'the batman',
    'spiderman': 'spider-man: across the spider-verse',
    'spider man': 'spider-man: across the spider-verse',
    'hombre arana': 'spider-man: across the spider-verse',
    'interestelar': 'interstellar',
    'gladiador': 'gladiator',
    'gladiador 2': 'gladiator ii',
    'gladiator 2': 'gladiator ii',
    'chicas pesadas': 'mean girls',
    'el nino y la garza': 'the boy and the heron',
    'mision imposible': 'mission: impossible'
  };

  function detectPlatforms(q) {
    return platforms.filter(p => (aliasMap[p.id] || [p.name]).some(a => (' ' + q + ' ').includes(' ' + a + ' '))).map(p => p.id);
  }

  async function fetchJSON(url) {
    const r = await fetch(url, { signal: AbortSignal.timeout(7500) });
    if (!r.ok) throw Error('Servicio no disponible');
    return r.json();
  }

  async function lookup(title) {
    const key = country.value + ':' + title;
    if (cache.has(key)) return cache.get(key);
    if (remoteAvailable) {
      const data = await fetchJSON('/api/lookup?q=' + encodeURIComponent(title) + '&country=' + country.value);
      cache.set(key, data);
      return data;
    }
    const attempts = await Promise.allSettled([
      fetchJSON('https://api.tvmaze.com/search/shows?q=' + encodeURIComponent(title)),
      fetchJSON('https://itunes.apple.com/search?term=' + encodeURIComponent(title) + '&entity=movie&country=' + country.value.toLowerCase() + '&limit=3')
    ]);
    const shows = attempts[0].status === 'fulfilled' ? attempts[0].value.slice(0, 3).map(x => ({
      title: x.show.name,
      type: 'Serie',
      origin: x.show.webChannel?.name || x.show.network?.name || '',
      url: x.show.url,
      year: x.show.premiered?.slice(0, 4) || ''
    })) : [];
    const movies = attempts[1].status === 'fulfilled' ? attempts[1].value.results?.slice(0, 2).map(x => ({
      title: x.trackName,
      type: 'Película',
      url: x.trackViewUrl,
      year: x.releaseDate?.slice(0, 4) || '',
      origin: ''
    })) : [];
    const result = { results: [...shows, ...movies], offline: attempts.every(x => x.status === 'rejected') };
    if (!result.offline) {
      if (cache.size >= 30) cache.delete(cache.keys().next().value);
      cache.set(key, result);
    }
    return result;
  }

  async function answer(text) {
    const q = norm(text);
    let title = extract(text);
    const ids = detectPlatforms(q);

    // Búsqueda inteligente por sinónimos de título en español
    for (const [syn, real] of Object.entries(titleSynonyms)) {
      if (q.includes(syn) || title.includes(syn)) {
        title = real;
        break;
      }
    }

    const wantsRecommendations = /recomiend|recomenda|que veo|que ver|suger|otras?|otros?|mas opciones|anime|novelas|peliculas|series|sin terror|comedia|ciencia ficcion/.test(q) && !/donde|de que trata/.test(q);
    if (wantsRecommendations) {
      const selection = window.OrbitRecommendations.recommend(text, getLib(), recommendationContext);
      recommendationContext = selection;
      const parts = [selection.filters.type, ...selection.filters.genres, ...selection.filters.platforms.map(id => pBy(id)?.name)].filter(Boolean);
      const message = selection.results.length
        ? 'Para ' + (parts.join(' · ') || 'tu próximo rato libre') + ', estas son mis propuestas. Son una selección editorial; verifica la disponibilidad en tu país.'
        : 'No encontré más títulos que cumplan esos filtros en mi selección. Prueba otro género, formato o plataforma.';
      await appendBotStream(message, el => {
        titleCards(el, selection.results);
        if (selection.remaining) {
          const actions = document.createElement('div'); actions.className = 'answer-actions';
          const more = document.createElement('button'); more.textContent = 'Ver otras opciones'; more.onclick = () => ask('otras opciones'); actions.append(more); el.append(actions);
        }
      });
      return;
    }
    let matched = window.OrbitRecommendations.findTitle(extract(text), getLib());
    if (!matched.length) matched = window.OrbitRecommendations.findTitle(title, getLib());
    if (matched.length) {
      lastTitle = matched[0].title;
      lastIds = [matched[0].platform];
      const m = matched[0];
      const p = pBy(m.platform);

      // Sincroniza la atmósfera visual con la plataforma encontrada
      window.OrbitaColors?.set(m.platform);

      const respText = `✦ ${m.title} (${m.year || 'año por confirmar'}) es ${m.type === 'Serie' ? 'una serie' : m.type === 'Anime' ? 'un anime' : m.type === 'Novela' ? 'una novela' : 'una película'} de ${m.genre.toLowerCase().replaceAll(',', ', ')}. En la selección editorial de ${p ? p.name : 'Órbita'} ($3/mes en plan individual o $5/mes en combo de 2). ${m.esSummary || ''}`;

      await appendBotStream(
        respText,
        async el => {
          titleCards(el, matched);

          // Botón directo para pedir por WhatsApp
          const waOrderUrl = 'https://wa.me/' + window.ORBITA.phone + '?text=' + encodeURIComponent(`Hola Órbita, quiero contratar ${p ? p.name : 'streaming'} para ver ${m.title}. ¿Tienen disponibilidad?`);
          link(el, 'Pedir ' + (p ? p.name : m.title) + ' por WhatsApp ↗', waOrderUrl);

          if (/parecid|similar|otra como/.test(q)) {
            const other = getLib().filter(x => x.id !== m.id && x.genre.split(',').some(g => m.genre.includes(g))).slice(0, 3);
            await appendBotStream('Si te gusta ese estilo, también te recomiendo:', el2 => titleCards(el2, other));
          }

          if (remoteAvailable) {
            try {
              const live = await lookup(m.original);
              const result = live.results?.find(x => norm(x.title) === norm(m.title) || norm(x.title) === norm(m.original)) || live.results?.[0];
              if (result) {
                const info = document.createElement('p');
                info.textContent = result.providers?.length
                  ? 'Disponibilidad de suscripción en ' + country.selectedOptions[0].text + ': ' + result.providers.map(x => x.provider_name).join(', ')
                  : 'No hay suscripciones registradas para este título en tu región.';
                el.append(info);
                link(el, 'Fuente de disponibilidad: JustWatch / TMDB ↗', result.url);
              }
            } catch {}
          }
          availability(el, m.original);
          combo(el, [m.platform]);
        }
      );
      return;
    }

    // Consulta específica sobre precios y planes de plataformas individuales
    if (ids.length === 1 && /precio|cuanto|cuesta|vale|info|caracteristicas|plan/.test(q)) {
      const p = pBy(ids[0]);
      if (p) {
        const pMsg = `${p.name} en Órbita cuesta solo $${p.price} USD/${p.period}. Incluye ${p.tagline}. Compatible con Smart TV, celulares, tablets, consolas y computadoras. Además, si la combinas con otra plataforma de video, el par te queda en solo $5/mes y recibes 1 mes de Spotify de regalo.`;
        await appendBotStream(pMsg, el => {
          combo(el, [p.id]);
          const waUrl = 'https://wa.me/' + window.ORBITA.phone + '?text=' + encodeURIComponent(`Hola Órbita, quisiera pedir ${p.name} ($${p.price}/${p.period}).`);
          link(el, 'Pedir ' + p.name + ' por WhatsApp ↗', waUrl);
        });
        return;
      }
    }

    if (/precio|cuanto|cuesta|vale|costo|combo|barat|presupuesto/.test(q) || ids.length) {
      const use = ids.length ? ids : lastIds;
      const introText = use.length
        ? 'Para tu selección de ' + use.map(id => pBy(id).name).join(' + ') + ':'
        : 'Una plataforma individual cuesta $3 USD/mes. Cada combo de 2 cuesta $5/mes. Con dos plataformas de video, ¡recibes Spotify de regalo por 1 mes! Canva Pro ($4/año) y ChatGPT Plus ($5 / 4 meses) tienen tarifas promocionales independientes.';
      
      await appendBotStream(introText, el => {
        if (use.length) combo(el, use);
        else combo(el, ['netflix', 'disneyplus']);
        if (/barat|presupuesto/.test(q)) {
          const note = document.createElement('p');
          note.textContent = 'Si solo quieres una app, el plan de $3 USD es la opción más económica. No necesitas combo obligatorio.';
          el.append(note);
        }
      });
      return;
    }

    if (/pagar|pago|comprar|contratar|activar|activacion|entrega/.test(q)) {
      await appendBotStream('Elige una plataforma o combo, abre WhatsApp y confirma disponibilidad. Al validar el pago, el asesor te entrega las credenciales y pasos de activación de inmediato con garantía completa.', el => {
        link(el, 'Hablar con un asesor por WhatsApp ↗', 'https://wa.me/' + window.ORBITA.phone + '?text=' + encodeURIComponent('Hola, quiero consultar formas de pago y activación.'));
      });
      return;
    }

    if (/soporte|problema|funciona|error|garantia|renovar|cancelar|reembolso/.test(q)) {
      await appendBotStream('Puedo orientarte con dudas generales. Para soporte técnico de cuenta, garantía o renovaciones, escríbenos directamente por WhatsApp y nuestro equipo te dará asistencia personalizada garantizada.', el => {
        link(el, 'Contactar soporte por WhatsApp ↗', 'https://wa.me/' + window.ORBITA.phone + '?text=' + encodeURIComponent('Hola, necesito soporte: ' + text));
      });
      return;
    }

    if (/dispositivo|televisor|smart tv|pantalla|pin|4k|celular|privad|compatible/.test(q)) {
      await appendBotStream('Los planes de Órbita son compatibles con Smart TV (Samsung, LG, TCL, Hisense), celulares Android e iOS, tablets, PlayStation, Xbox, Chromecast, Amazon Fire TV y PC/Mac. Incluyen perfiles privados con PIN y calidad Ultra HD 4K según la plataforma. Para consultar la compatibilidad exacta de tu dispositivo, confírmanos por WhatsApp.');
      return;
    }

    if (/aburrido|aburr|que hago|no se que ver|no sabes|sin ideas|ayudame a elegir|indeciso|no encuentro/.test(q)) {
      const moodList = getLib().filter(m => ['Severance', 'Interstellar', 'The Last of Us', 'Fallout', 'Merlina', 'Breaking Bad'].includes(m.title));
      await appendBotStream('Te entiendo, a veces hay tanto para elegir que es difícil decidir. Aquí van los títulos que más engancha a la gente desde el primer episodio o escena:', el => {
        titleCards(el, moodList);
      });
      return;
    }

    if (/futbol|deporte|espn|formula|liga/.test(q)) {
      await appendBotStream('Para deportes en vivo, te recomiendo Disney+ (señal ESPN completa con Champions, F1 y Tenis) y ViX.', el => {
        combo(el, ['disneyplus', 'vix']);
      });
      return;
    }

    if (/musica|podcast|cancion/.test(q)) {
      await appendBotStream('Spotify es la opción perfecta: música sin anuncios y podcasts por $3 USD/mes. Recuerda que al pedir 2 de video, ¡te lo llevas de regalo por un mes!', el => {
        combo(el, ['spotify']);
      });
      return;
    }

    if (/chatgpt|chat gpt|inteligencia artificial|openai|gpt/.test(q)) {
      await appendBotStream('El plan anunciado de ChatGPT Plus es de $5 USD por 4 meses. Confirma con Órbita las condiciones de acceso y las funciones incluidas antes de pedirlo.', el => {
        combo(el, ['chatgpt']);
      });
      return;
    }

    const genres = [
      [/ciencia ficcion|sci.fi|espacio|galaxia|futuro|nave|robot|inteligencia artificial/, 'Ciencia ficción'],
      [/terror|horror|miedo|susto|suspenso oscuro|gore/, 'terror'],
      [/comedia|reir|divertid|gracioso|humor|chiste/, 'comedia'],
      [/familia|nino|infantil|disney|pixar|kids/, 'familia'],
      [/anime|animacion|dibujos|manga|cartoon/, 'Animación'],
      [/accion|pelea|explosion|superheroe|marvel|dc|batalla/, 'acción'],
      [/suspenso|misterio|thriller|policial|crimen|detective/, 'Misterio'],
      [/aventura|exploracion|viaje|expedicion/, 'aventura'],
      [/drama|emocion|llanto|sentimiento|historico/, 'Drama'],
      [/fantasia|magia|dragon|elfo|bruja|hechizo/, 'fantasía'],
      [/romance|amor|pareja|novela|romantico/, 'romance'],
      [/documental|realidad|historia real|biografic/, 'documental']
    ];
    const genre = genres.find(([r]) => r.test(q));
    if (genre || /recomiend|recomenda|que veo|que ver|peliculas buenas|series buenas|sugerir|sugerencia|que hay|algo bueno/.test(q)) {
      let list = genre ? getLib().filter(m => norm(m.genre).includes(norm(genre[1]))) : getLib().filter(m => ['Severance', 'Fallout', 'Dune: Parte Dos', 'Oppenheimer', 'Interstellar', 'The Last of Us', 'Merlina', 'Breaking Bad', 'Gladiator II', 'Stranger Things'].includes(m.title));
      if (/pelicula/.test(q)) list = list.filter(m => m.type === 'Película');
      if (/serie/.test(q)) list = list.filter(m => m.type === 'Serie');
      if (!list.length) list = getLib().slice(0, 6);
      const genreMsg = genre ? `Para ${genre[1]}, aquí van mis recomendaciones estelares del catálogo:` : 'Aquí tienes los títulos más aclamados del momento. Toca cualquiera para saber en qué plataforma verla:';
      await appendBotStream(genreMsg, el => {
        titleCards(el, list);
      });
      return;
    }

    if (/quien eres|que puedes|ayuda|como funciona|eres una ia|que sabes|que haces|para que sirves/.test(q)) {
      await appendBotStream('Soy Orbit, una guía local de entretenimiento. Puedo recomendar por formato, género y plataforma, encontrar fichas y calcular combos. No soy un modelo de IA conectado. Para disponibilidad actual uso enlaces regionales y, si está configurado, TMDB / JustWatch.');
      return;
    }

    if (title.length < 2) {
      await appendBotStream('Dime el título de una película o serie que tengas en mente, por ejemplo “The Last of Us”, “Interstellar” o “Merlina”.');
      return;
    }

    // Consulta de disponibilidad externa
    const data = await lookup(title);
    const msg = data.offline
      ? 'No pude conectar temporalmente con los servidores de búsqueda externa, pero aquí tienes el enlace directo para consultar tu región:'
      : data.results?.length
        ? 'Encontré estas coincidencias para “' + title + '”:'
        : 'No encontré una coincidencia exacta para “' + title + '”. Puedes revisar la disponibilidad directamente aquí:';

    await appendBotStream(msg, el => {
      for (const r of (data.results || []).slice(0, 4)) {
        const line = document.createElement('p');
        line.textContent = r.title + ' (' + (r.year || r.type) + ')' + (r.origin ? ' · Origen: ' + r.origin : '');
        el.append(line);
        if (r.providers) {
          const names = r.providers.map(p => p.provider_name).join(', ');
          const p = document.createElement('p');
          p.textContent = names
            ? 'Incluida en ' + country.selectedOptions[0].text + ': ' + names
            : 'No hay proveedores de suscripción registrados para este país actualmente.';
          el.append(p);
          link(el, 'Disponibilidad: JustWatch / TMDB ↗', r.url);
        } else {
          if (r.url) link(el, 'Ver ficha oficial de ' + r.title + ' ↗', r.url);
        }
      }
      if (!data.results?.length) availability(el, title);
      lastTitle = title;
    });
  }

  async function ask(text) {
    open();
    if (busy) return;
    const message = text.trim().slice(0, 300);
    if (!message) return;

    append('user', message);
    busy = true;

    const send = $('#chat-form button');
    send.disabled = true;

    // Indicador futurista mientras Orbit procesa
    const typing = document.createElement('div');
    typing.className = 'typing';
    typing.setAttribute('aria-label', 'Orbit está consultando la galaxia...');
    typing.innerHTML = '<span class="typing-label">✦ Orbit está pensando</span><i></i><i></i><i></i>';
    log.append(typing);
    log.scrollTop = log.scrollHeight;

    try {
      await answer(message);
    } catch {
      await appendBotStream('Ocurrió un error al consultar la galaxia de contenidos. Inténtalo nuevamente o escribe el título por WhatsApp.');
      availability(log.lastElementChild, extract(message));
    } finally {
      typing.remove();
      busy = false;
      send.disabled = false;
      log.scrollTop = log.scrollHeight;
    }
  }

  $('#chat-form').onsubmit = e => {
    e.preventDefault();
    if (busy) return;
    const text = input.value;
    input.value = '';
    ask(text);
  };

  document.querySelectorAll('[data-assistant]').forEach(b => b.onclick = open);
  document.querySelectorAll('[data-ask]').forEach(b => b.onclick = () => ask(b.dataset.ask));

  const clearBtn = $('#btn-clear-chat');
  if (clearBtn) {
    clearBtn.onclick = () => {
      if (busy) return;
      recommendationContext = {}; lastIds = []; lastTitle = "";
      log.replaceChildren(); append("bot", "Conversación reiniciada. Dime un género, formato o plataforma y buscamos tu próxima historia.");
      if (window.OrbitaAudio?.play) {
        try { window.OrbitaAudio.play('score'); } catch {}
      }
    };
  }

  window.OrbitGuide = { open, ask };

  if (location.protocol !== 'file:') {
    fetch('/api/status').then(r => r.ok ? r.json() : null).then(s => {
      remoteAvailable = !!s?.providers;
      if (remoteAvailable) {
        $('.assistant-note').textContent = 'Disponibilidad regional en tiempo real (JustWatch / TMDB). Confírmala antes de contratar.';
      }
    }).catch(() => {});
  }
})();
