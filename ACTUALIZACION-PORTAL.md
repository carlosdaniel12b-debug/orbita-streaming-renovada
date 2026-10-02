# Actualización visual — 2 de octubre de 2026

## Entrada y estabilidad
- Portal autónomo de 2,55 segundos, omisible con botón, Escape o Enter.
- Cierre de seguridad independiente de Three.js, GSAP y eventos de animación.
- Restablecimiento de foco y de la interacción al terminar, repetir, cambiar de pestaña o volver desde el historial.
- Correcciones de `lastScroll` inexistente y del acceso a `THREE` en páginas que no cargan esa biblioteca.
- Respeto de movimiento reducido y preferencia de pausa guardada.

## Dirección visual
- Referencia: grabación proporcionada por el usuario, composición de MODERN / HOMES con objeto central.
- Adaptación: ÓRBITA en el plano posterior, planeta y anillos reales en 3D en el plano intermedio, STREAMING delante.
- Revelación tipográfica con máscara, breve desenfoque y controles escalonados. Profundidad suave con puntero de escritorio.
- Acabado liquid glass con reflejos, transparencia y desenfoque de fondo; alternativa sólida para navegadores sin soporte.
- Iconos SVG locales de Lucide; licencia en assets/icons/LUCIDE-LICENSE.txt. No requiere peticiones a CDN.
- Composición específica para móvil, menú táctil, separación de controles y barra inferior.

## Verificación
- `node --test tests/portal.test.cjs`: 5 casos aprobados (salida automática, cierre repetido, repetición, movimiento reducido/pausa y Escape/pestaña oculta).
- Sintaxis de todos los archivos JavaScript y `git diff --check` correctos.
- Navegador: vistas de 1440×900 y 390×844, sin desbordamiento horizontal en inicio; salida y repetición de la intro, menú móvil, catálogo, búsqueda, detalles y selección de combos.
- Netflix + Disney+: $5 y Spotify de regalo; selección de prueba limpiada.
- Sin errores JavaScript observados en las cuatro rutas durante las comprobaciones.
- Movimiento reducido probado en el controlador; pausa persistida también probada en navegador.
- Las pruebas móviles corresponden a un viewport de navegador, no a un dispositivo físico.

## Recursos
- Impeccable: https://github.com/pbakaus/impeccable (instalado en el entorno de Codex).
- Lucide: https://github.com/lucide-icons/lucide (iconos y licencia descargados).
- Se conservan las tipografías, imágenes y bibliotecas locales existentes.
