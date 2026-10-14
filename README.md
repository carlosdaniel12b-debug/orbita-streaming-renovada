# Órbita Streaming

Sitio estático para explorar plataformas, descubrir títulos y preparar un pedido por WhatsApp.

## Desarrollo

Ejecuta `node server.cjs` y abre http://127.0.0.1:4174.

- `index.html`: portada y recomendaciones.
- `catalogo.html`: plataformas y búsqueda.
- `combos.html`: selección, cálculo y preparación del pedido.
- `descubre.html`: biblioteca editorial y filtros.
- `legal.html`: términos y privacidad.

## Estilos

`css/renewal.css` define la edición perla, azul y cristal translúcido para las cinco páginas. `home.css`, `pages.css` y `legal.css` contienen los estilos base de cada grupo de páginas. `liquid-glass-motion.css` organiza las tarjetas adicionales del catálogo y los combos. Las hojas individuales antiguas, ya integradas en los estilos base, se retiraron para evitar duplicados.

## Datos y comportamiento

`js/data.js` contiene tarifas y contacto; `js/library.js`, la biblioteca editorial; `js/recommendations.js` y `js/orbit-guide.js`, las recomendaciones locales. Los pedidos requieren una acción del visitante y no se envían automáticamente.

La selección editorial no garantiza disponibilidad comercial en cada país. Las imágenes pertenecen a sus titulares; se conservan las fuentes en `assets/content-sources.json`.

## Verificación

`node --test tests/portal.test.cjs tests/recommendations.test.cjs tests/orbit-local.test.cjs`

## Publicación

GitHub Pages publica la raíz de la rama `main`. El servidor opcional consulta disponibilidad regional únicamente si existe `TMDB_READ_TOKEN` en el entorno. No se deben incluir credenciales en archivos públicos.
