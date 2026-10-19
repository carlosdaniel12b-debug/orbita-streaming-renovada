# Renovación visual y rendimiento — 18 octubre 2026

La portada usa una imagen panorámica de Severance, navegación compacta, superficies translúcidas en verde salvia y azul gris, y tarjetas secundarias en menta, lavanda, melocotón y azul. La composición toma como referencia la jerarquía y el uso de contenido de https://www.apple.com/apple-tv/; la implementación es propia, con HTML, CSS y JavaScript nativos y los recursos existentes del proyecto.

- Se conserva la intro original de la marca con un movimiento orbital breve. Se abre de forma síncrona antes del contenido, una vez por sesión. Escape, Entrar ahora y movimiento reducido permiten saltarla; puede repetirse desde el pie.
- Las tarjetas no desplazan los logos al pasar el cursor. Los logos blancos usan bases oscuras; Prime Video y Paramount usan bases claras.
- La portada presenta cuatro recomendaciones por filtro, tres colecciones y cuatro tarjetas de servicios. Se eliminan secciones grandes y repetidas.
- El calculador usa la misma función de precios que Combos, conserva la selección al navegar y separa las duraciones mensuales y anuales.
- Descubre permite combinar búsqueda, formato y plataforma, abrir detalles y reproducir tráileres bajo demanda. Cerrar el reproductor, incluso con Escape, destruye el iframe.
- Orbit carga el catálogo completo al abrirse. La portada solo carga una selección pequeña inicialmente.
- No se carga Disney ni se añaden bibliotecas de animación. La tipografía utiliza fuentes del sistema. Las imágenes secundarias usan carga diferida.

## Verificación

`npm test`: regresiones existentes, enlaces/recursos locales, guardia de intro y sus salidas, y 64 combinaciones de la calculadora contra el checkout.

Revisión en navegador a 390 × 844 y 1440 × 900: portada, catálogo, fichas/pagos, resumen móvil, filtros de Descubre, vacío de búsqueda, cierre de tráiler y recomendaciones de Orbit. No se envían pedidos ni se realizan pagos durante las pruebas.

82 imágenes del catálogo convertidas a WebP, conservando originales. Consultar el informe de entrega para los bytes medidos; el ahorro de transferencia no equivale a una medición de tiempo de carga en todos los dispositivos.

## Mantenimiento

El sitio se puede publicar como archivos estáticos; no requiere npm en producción. `css/site.min.css` ya está compilado y es compartido por las cinco páginas.

Para editar estilos: modificar `css/renewal.css` (o la fuente base pertinente), ejecutar `npm ci` y `npm run build:css`, y guardar también `css/site.min.css`. El compilador combina los estilos usados y elimina declaraciones de fuentes descargadas. `npm start` inicia la vista previa local en http://127.0.0.1:4174.

Los precios y duraciones permanecen definidos en `js/data.js` y la lógica común de `js/app.js`. Los originales de las imágenes permanecen disponibles para futuras ediciones.

## Ajuste del 19 de octubre de 2026

Se retira el calculador repetido de la portada. Los accesos de la portada llevan directamente a Combos y ya no cargan el script del calculador. Se añade respuesta visual breve (160–180 ms) a tarjetas completas, botones, ventanas y preguntas frecuentes; las animaciones respetan movimiento reducido y no desplazan los logos por separado.
