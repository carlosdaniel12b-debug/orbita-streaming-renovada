/* ==========================================================================
   ÓRBITA STREAMING — INTERACCIONES MODERNAS (BEHANCE EDITION)
   Control del Spotlight, Búsqueda Rápida e Interacciones Sin Redundancia
   ========================================================================== */
(() => {
  'use strict';

  // Sincronizar etiquetas de búsqueda rápida en el Hero
  document.querySelectorAll('[data-hero-search-tag]').forEach(tagBtn => {
    tagBtn.addEventListener('click', () => {
      const q = tagBtn.dataset.heroSearchTag;
      const input = document.getElementById('hero-query');
      if (input) {
        input.value = q;
        input.focus();
      }
    });
  });

  // Asegurar que el FAQ cierre otros acordeones al abrir uno (estilo Apple/Behance)
  document.querySelectorAll('.pearl-faq-list details').forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        document.querySelectorAll('.pearl-faq-list details[open]').forEach(other => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

})();
