# Validación

## Ajuste de intro, sonido y colores

- Simulada una carga lenta bloqueando el primer script: la intro ya está visible y la página permanece oculta antes de ejecutar la aplicación.
- Comprobado salto de intro antes de que terminen de cargar los scripts: no reaparece después ni deja bloqueado el contenido.
- Retiradas las tres tarjetas flotantes de la Tierra.
- Colores de Netflix y Spotify comprobados mediante interacción con el catálogo; el acento alcanza el logo, los controles y los anillos 3D.
- Audio comprobado con Web Audio: no se crea antes del gesto de inicio; genera voces al despegar; pausa y cierre silencian las voces; silenciar persiste al recargar.
- Sin excepciones del navegador en estas comprobaciones.

Comprobada el 1 de octubre de 2026 con Microsoft Edge automatizado.

- Las tres páginas cargan sin errores de JavaScript ni respuestas de recursos fallidas.
- Revisadas a 360, 390, 768 y 1440 píxeles, sin desbordamiento horizontal de la página.
- Todas las imágenes referenciadas cargan y se decodifican correctamente.
- Filtros de categoría, buscador, estado vacío y restablecimiento comprobados.
- Detalles de plataformas y cierre con Escape comprobados.
- Asistente probado con consulta de combo y texto parecido a HTML; se muestra como texto, sin ejecutarse.
- Nueve casos de precios: selección vacía, Canva anual, plataforma individual, dos plataformas, promo Spotify, tres plataformas, plan mixto mensual/anual y cuatro plataformas.
- Persistencia de selección al recargar y botones de selección comprobados.
- Pedido de Netflix + Disney + Canva: mensaje de WhatsApp con $5/mes, $4/año y $9 iniciales; número original correcto. Se verificó la URL, sin enviar mensajes ni realizar una compra.
- Menú móvil, Escape, salto de intro y movimiento reducido comprobados.
- Apertura directa por `file://` y cálculo de combo comprobados.
- Capturas completas revisadas de inicio y combos en escritorio; vistas móviles revisadas.

No se prueba una activación real ni disponibilidad de cuentas: eso depende del negocio y se confirma por WhatsApp. La selección editorial no se actualiza automáticamente.

## Revisión de movimiento

| Antes | Después | Motivo |
| --- | --- | --- |
| Varios efectos y motor 3D cargados por CDN | Intro acotada de 2,6 s y parallax con canvas/CSS locales | Conservar la entrada espacial y reducir dependencias |
| Cambios ambientales y movimiento continuo en múltiples componentes | Parallax ligado al desplazamiento y animación concentrada en la entrada | Mantener legibles catálogo y precios |
| Sin control unificado de los efectos | Pausa visible y preferencia del sistema | Respetar sensibilidad al movimiento |
| Intro con interacción detrás | Contenido inerte durante la entrada, salto y restauración del foco | Navegación por teclado coherente |

Veredicto: aprobado en la revisión de código y capturas. Transiciones de interfaz entre 150 y 250 ms, movimiento de hover solo con puntero preciso, transform/opacity para el parallax, intro cancelada al ocultar la página. No se ha medido FPS en dispositivos físicos de baja gama.

## Validación de la segunda edición

- Tres páginas en 360, 390, 768 y 1440 px sin desbordamiento horizontal; sin excepciones de JavaScript ni recursos locales fallidos.
- Tierra 3D verificada por HTTP y al abrir index.html directamente. Pausa y movimiento reducido comprobados.
- Intro: final automático, salto, Escape, repetición y desbloqueo del contenido; el logo ya no recibe foco automático.
- 26 carátulas locales verificadas; filtros de películas/series/música y búsqueda de títulos comprobados.
- Orbit: Coco→Disney+, Merlina→Netflix, combos, recomendaciones, país y pregunta contextual de precio comprobados. Búsqueda real de Breaking Bad por TVmaze comprobada.
- Integración opcional TMDB verificada con datos de prueba y error 502. Falta token para probar proveedores reales autenticados.
- Arcade: inicio, impulso, pausa, colisión, reintento y cierre comprobados. No se simuló un recorrido completo por los seis sectores.
- Precios mixtos mensual/anual se mantienen correctos.
- Carátulas optimizadas de 18.9 MB a 2.6 MB.
