# Orbit: búsqueda y disponibilidad

## Lo que funciona ahora

- Biblioteca editorial de 26 películas y series, con títulos originales, nombres en español, carátulas y fuentes.
- Recomendaciones por género y tipo (cine, series, familia, ciencia ficción, etc.).
- Precios de una o varias plataformas, combos y contexto de la selección anterior.
- Preguntas frecuentes: compra, activación, soporte, dispositivos, deportes y música.
- Búsqueda externa de series en TVmaze y consulta de películas en la tienda de Apple cuando esa API devuelve resultados.
- Selector de 25 países y enlaces para consultar disponibilidad en JustWatch.
- Respuestas de error si la red no está disponible; no inventa un proveedor.

La biblioteca indica **plataforma de origen o selección editorial**, no disponibilidad actual por país. Un resultado de la tienda Apple no significa que esté incluido en Apple TV+. Orbit es una guía programada con búsqueda, **no un modelo de IA generativa**.

## Activar disponibilidad por país dentro del chat

El servidor incluido puede consultar TMDB/JustWatch. Requiere una credencial propia de TMDB, que no se incluyó ni se inventó.

1. Obtén un token de lectura en tu cuenta de TMDB y revisa las condiciones de uso para tu sitio.
2. Define la variable de entorno `TMDB_READ_TOKEN` **en el servidor**, nunca en los archivos de JavaScript del navegador.
3. Con Node 20 o posterior, ejecuta `node server.cjs` desde esta carpeta, o usa `INICIAR.bat`.
4. Abre `http://127.0.0.1:4174`.

Orbit detecta esa conexión. Busca películas y series y distingue las suscripciones de compra/alquiler. Las respuestas incluyen la atribución a JustWatch/TMDB y su enlace. Se conserva una caché de una hora para evitar consultas repetidas.

Sin token, el servidor sigue mostrando la página y Orbit utiliza la biblioteca y las fuentes públicas. GitHub Pages solo aloja la versión estática; para esta conexión necesitas alojar también el servidor.

Se verificó la integración con respuestas de prueba. **No se verificó una consulta autenticada real**, porque no hay una credencial configurada.

Documentación: [TVmaze](https://www.tvmaze.com/api), [proveedores de películas en TMDB](https://developer.themoviedb.org/reference/movie-watch-providers), [proveedores de series en TMDB](https://developer.themoviedb.org/reference/tv-series-watch-providers).
