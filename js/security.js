/**
 * ÓRBITA STREAMING — CAPA DE SEGURIDAD Y PROTECCIÓN
 * Protege contra inspección no autorizada, iframes maliciosos y extracción de datos.
 */
(() => {
  'use strict';

  // 1. Anti-Clickjacking (Prevenir que incrusten la web en iframes externos)
  try {
    if (window.top !== window.self) {
      window.top.location = window.self.location;
    }
  } catch (e) {
    // Si hay bloqueo de origen cruzado, ocultar el body
    document.documentElement.style.display = 'none';
  }

  // 2. Bloquear clic derecho (Menú contextual de inspección)
  document.addEventListener('contextmenu', e => {
    // Permitir clic derecho únicamente en inputs o textareas si fuera necesario
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    e.preventDefault();
  }, { passive: false });

  // 3. Bloquear atajos de teclado para ver código fuente o abrir DevTools
  document.addEventListener('keydown', e => {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+I (Inspeccionar), Ctrl+Shift+J (Consola), Ctrl+Shift+C (Inspeccionar elemento)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
      e.preventDefault();
      return false;
    }

    // Ctrl+U (Ver código fuente), Ctrl+S (Guardar página)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      return false;
    }
  }, { passive: false });

  // 4. Bloquear arrastre de imágenes y posters para evitar descarga indebida
  document.addEventListener('dragstart', e => {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'A') {
      e.preventDefault();
    }
  }, { passive: false });

  // 5. Limpieza de mensajes sensibles en consola
  try {
    if (typeof console !== 'undefined') {
      console.log('%cÓrbita Streaming%c — Plataforma Protegida y Cifrada', 'color:#087f70;font-size:16px;font-weight:bold;', 'color:#536371;font-size:12px;');
    }
  } catch (_) {}

  // 6. Protección de Privacidad: Ocultar número telefónico en el texto visible
  // El número solo se conecta internamente al hacer clic en el enlace oficial de WhatsApp
  function hidePhoneNumbers() {
    try {
      const walker = document.createTreeWalker(document.body || document.documentElement, NodeFilter.SHOW_TEXT, null, false);
      let node;
      const phoneRegex = /\+?593[\s\-]?[0-9]{2}[\s\-]?[0-9]{3}[\s\-]?[0-9]{4}/g;
      while ((node = walker.nextNode())) {
        if (node.parentElement && !['SCRIPT', 'STYLE'].includes(node.parentElement.tagName)) {
          if (phoneRegex.test(node.nodeValue)) {
            node.nodeValue = node.nodeValue.replace(phoneRegex, 'Chatear por WhatsApp');
          }
        }
      }
    } catch (_) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hidePhoneNumbers);
  } else {
    hidePhoneNumbers();
  }
})();
