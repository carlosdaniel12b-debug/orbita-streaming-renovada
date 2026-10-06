# Órbita · Recorrido sin servicios de pago

Adaptación autorizada de Scroll World: https://github.com/oso95/scroll-world

La versión original genera vídeos de cámara con Monid/Higgsfield. Esta adaptación usa tres imágenes locales con zoom, desplazamiento y fundido ligados al scroll. No genera vídeos ni realiza solicitudes a proveedores de pago, y no se presenta como un vuelo 3D generado.

Sustituye la antigua franja de ciencia ficción por un recorrido de cine, series y música. Mantiene el resto de Inicio y la intro. Controles de escena, avance reversible, enlace para salir, foco limitado a la escena visible, pausa de efectos y lectura estática con movimiento reducido. La altura usa svh para evitar saltos por la barra del navegador móvil.

Validación: tres pruebas del recorrido y ocho del portal aprobadas. Navegación entre las tres escenas y carga de las imágenes comprobadas en navegador; revisión a 390 px sin desbordamiento horizontal; sin errores de JavaScript. Intro comparada con la copia previa: idéntica. No se ha probado en un iPhone físico.

Archivos: index.html, css/scroll-orbita.css, js/scroll-orbita.js y tests/scroll-orbita.test.cjs.
