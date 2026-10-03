# Órbita Streaming

Sitio estático para explorar plataformas y preparar pedidos por WhatsApp. Abre index.html o ejecuta `node server.cjs` y visita http://127.0.0.1:4174.

## Edición orbital

- Portada despejada con imagen de Andor, material de cristal y un carrusel editorial accesible.
- Introducción con el mismo planeta negro y órbita del encabezado; omisión, Escape y movimiento reducido.
- Descubre: 87 fichas únicas, filtros independientes de películas, series, anime, novelas y plataforma; enlaces profundos por título, formato o servicio.
- 27 títulos incorporados, 32 imágenes descargadas con fuentes registradas; 11 fichas duplicadas o incorrectas retiradas.
- Orbit: recomendaciones locales por formato, género y plataforma, exclusión de terror y continuación sin repetir opciones. No está conectado a un modelo generativo.
- País seleccionable para consultar disponibilidad. La selección editorial no garantiza que un título esté incluido en cada país o plan.
- Precios, contacto y cálculo de combos conservados. No se envían pedidos automáticamente.

## Mantener el sitio

- js/data.js: plataformas, contacto y tarifas.
- js/library.js: selección editorial y sinopsis.
- js/recommendations.js: recomendaciones y resolución de títulos.
- js/orbit-guide.js: conversación, precios y consulta regional.
- js/pearl.js: navegación y carrusel.
- css/pearl.css y css/orbital.css: diseño compartido y superficies.
- assets/content-sources.json: procedencia del nuevo material visual.

Las imágenes promocionales pertenecen a sus respectivos titulares. Las fichas incluyen sus fuentes; TVmaze aporta metadatos e imágenes, no disponibilidad comercial por país.

## Disponibilidad regional opcional

server.cjs consulta TMDB / JustWatch únicamente si existe TMDB_READ_TOKEN en el entorno del servidor. Esa clave nunca debe incluirse en archivos públicos. En GitHub Pages se utilizan el catálogo local y enlaces regionales de consulta.

## Verificación

`node --test tests/*.test.cjs` cubre introducción, filtros del recomendador, seguimiento sin repeticiones y consistencia de imágenes. Las cuatro rutas se verificaron también en navegador a 1440 y 390 píxeles.

## Referencias

- [Materiales de Apple](https://developer.apple.com/design/human-interface-guidelines/materials) y [Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/).
- [PLUTO](https://www.netflix.com/title/81281344), [Delicious in Dungeon](https://www.netflix.com/title/81564899), [Klaus](https://www.netflix.com/title/80183187), [Pinocho](https://www.netflix.com/title/80218455).
- [El amor invencible](https://vix.com/es-es/detail/series-4271), [La Usurpadora](https://vix.com/es-es/detail/series-561).
- [Fundación](https://tv.apple.com/us/show/fundacion/umc.cmc.5983fipzqbicvrve6jdfep4x3?l=es), [The Gorge](https://www.apple.com/tv-pr/originals/the-gorge/), [1923](https://www.paramountplus.com/shows/1923/).
