# Órbita Streaming · Nueva edición

Abre **index.html** para ver el sitio. No requiere instalación, compilación, claves ni servicios externos para mostrar el diseño. Conserva esta carpeta completa para que funcionen las imágenes y las tres páginas.

## Segunda edición

Rediseño cinematográfico con Tierra 3D, atmósfera, nubes y anillos en movimiento; tres ambientes de color; logo vectorial completo sin foco automático; tipografía Syne + Manrope; intro con portal y viaje estelar; transiciones de página, revelados, inclinación de tarjetas y parallax.

Flappy Space vuelve con seis sectores, teclado/táctil, pausa, reinicio y récord persistente.

Orbit incorpora una biblioteca de 26 títulos, preguntas frecuentes, recomendaciones y búsqueda externa. Consulta ORBIT-CONEXION.md para el alcance y la conexión opcional a TMDB/JustWatch.

## Qué incluye

- Inicio nuevo con fondo espacial original, intro de entrada en órbita, parallax y carrusel editorial.
- Catálogo de nueve plataformas con buscador, filtros y detalles.
- Configurador con selección persistente, combos sugeridos y resumen de cargos mensuales/anuales.
- Pedidos por WhatsApp al número original **+593 99 822 6756**.
- Orbit: guía automática local de plataformas y precios. No está conectado a un modelo de IA.
- Diseño adaptable a móvil, navegación por teclado, diálogos y control para pausar efectos. Respeta movimiento reducido del sistema.

## Precios

Todos los precios son USD. Una plataforma mensual: $3. Cada par: $5. Canva: $4/año, separado de la renovación mensual. Al seleccionar dos plataformas de video, Spotify se incluye por un mes como regalo; si también se marca Spotify, no se duplica el cobro. La promoción se confirma por WhatsApp.

Ejemplos: Netflix $3/mes; Netflix + Disney $5/mes; ambos + Canva $9 inicialmente ($5/mes + $4/año); Canva sola $4/año.

## Editar

- `js/data.js`: contacto, plataformas, precios informativos y selección editorial.
- `js/app.js`: reglas de combos, catálogo y pedidos.
- `js/experience.js`: Tierra 3D, intro, transiciones y parallax.
- `js/orbit-guide.js`: preguntas, recomendaciones y búsquedas de Orbit.
- `js/library.js`: 26 títulos, sinopsis, alias y carátulas.
- `js/game.js`: Flappy Space.
- `js/game-audio.js`: sonidos del juego y preferencia de silencio.
- `js/platform-colors.js`: acentos por plataforma al enfocar, pasar el ratón o seleccionar.
- `css/styles.css` y `css/experience.css`: colores, diseño y vistas móviles.
- `assets/`: imágenes, tipografía y logotipos locales.

Las reglas de combo están en `calculate()` dentro de `js/app.js`. Si cambias tarifas, actualiza también las frases de precios de las páginas y las respuestas de Orbit.

## Publicación

Sube las páginas, las carpetas `js`, `css` y `assets` a un alojamiento estático o GitHub Pages. Para disponibilidad en tiempo real necesitas alojar también el servidor: consulta `ORBIT-CONEXION.md`. Esta entrega **no fue publicada** y no modifica tu carpeta original. No contiene scripts de extracción de credenciales ni de publicación automática al repositorio anterior.

## Contenido

La galería es una selección editorial con fichas y fuentes; no es un catálogo conectado en tiempo real. Revisa `FUENTES.md` para actualizarla. Los títulos no se presentan como estrenos de hoy. La disponibilidad varía según país y plan. Las compras se coordinan por WhatsApp: no hay pasarela de pago ni activación automática.

Consulta `REVISION.md` y `VALIDACION.md` para el inventario y las comprobaciones de la entrega.
