/* Acentos por plataforma: vista previa con ratón/teclado, selección persistente y brillo atmosférico */
(()=>{
  'use strict';
  const root = document.documentElement;
  const colors = {
    netflix: {
      accent: '#ff6b7a',
      bg: '#15090e',
      glow: 'rgba(229, 9, 20, 0.45)',
      blue: '#ffa8b2',
      second: '#ff8f9a',
      brand: '#e50914'
    },
    disneyplus: {
      accent: '#79b4ff',
      bg: '#080f24',
      glow: 'rgba(20, 75, 230, 0.48)',
      blue: '#b3d5ff',
      second: '#90beff',
      brand: '#113ccf'
    },
    hbomax: {
      accent: '#be95ff',
      bg: '#120922',
      glow: 'rgba(110, 39, 197, 0.48)',
      blue: '#dfceff',
      second: '#ceafff',
      brand: '#6e27c5'
    },
    primevideo: {
      accent: '#5cd0f8',
      bg: '#071724',
      glow: 'rgba(0, 168, 225, 0.48)',
      blue: '#a8e7fb',
      second: '#7de0ff',
      brand: '#00a8e1'
    },
    paramount: {
      accent: '#84b2ff',
      bg: '#081329',
      glow: 'rgba(0, 100, 255, 0.45)',
      blue: '#bad3ff',
      second: '#9cc1ff',
      brand: '#0064ff'
    },
    vix: {
      accent: '#ff8a55',
      bg: '#1b0d07',
      glow: 'rgba(255, 80, 0, 0.48)',
      blue: '#ffbfa1',
      second: '#ffa477',
      brand: '#ff5000'
    },
    appletv: {
      accent: '#dbe7ed',
      bg: '#0e151d',
      glow: 'rgba(160, 185, 205, 0.38)',
      blue: '#f1f6f9',
      second: '#c2d5df',
      brand: '#a2aaad'
    },
    spotify: {
      accent: '#5be893',
      bg: '#071b12',
      glow: 'rgba(29, 185, 84, 0.48)',
      blue: '#9cf4c3',
      second: '#6bf0a2',
      brand: '#1db954'
    },
    canva: {
      accent: '#5ce3e7',
      bg: '#061b1e',
      glow: 'rgba(0, 196, 204, 0.45)',
      blue: '#a4f2f5',
      second: '#70eaee',
      brand: '#00c4cc'
    },
    gemini: {accent:'#7182c4',bg:'#111827',glow:'rgba(92,112,210,.2)',blue:'#dce5fa',second:'#bac7ef',brand:'#667bd0'},
    chatgpt: {
      accent: '#10a37f',
      bg: '#041712',
      glow: 'rgba(16, 163, 127, 0.48)',
      blue: '#6ee7b7',
      second: '#34d399',
      brand: '#10a37f'
    }
  };

  let selected = null;
  let preview = null;
  const surfaces={netflix:'#f8f2f4',disneyplus:'#f0f5fc',hbomax:'#f5f2fa',primevideo:'#eef7fa',paramount:'#f0f4fc',vix:'#faf4ef',appletv:'#f3f5f7',spotify:'#eff7f1',canva:'#eff8f8',chatgpt:'#eff6f4',gemini:'#f2f3fb'};

  function findPlatformId(el) {
    const node = el?.closest?.('[data-detail],.platform-card,.pick-card,[data-movie],.brand-strip a');
    if (!node) return null;
    if (node.matches('.pick-card')) {
      return node.querySelector('input')?.value || null;
    }
    if (node.dataset.movie) {
      return window.ORBIT_LIBRARY?.find(m => m.id === node.dataset.movie)?.platform || null;
    }
    if (node.matches('.brand-strip a')) {
      try {
        const u = new URL(node.href, location.href);
        return u.searchParams.get('plataforma') || null;
      } catch {
        return null;
      }
    }
    return node.dataset.detail || node.dataset.name || node.querySelector('[data-detail]')?.dataset.detail || null;
  }

  function apply() {
    const id = preview || selected;
    root.dataset.platform = id || '';
    root.style.setProperty('--orbit-surface',surfaces[id]||'#f4f6f9');
    root.style.setProperty('--orbit-wash',id&&colors[id]?colors[id].brand+'18':'#d0e6eb80');
    if (id && colors[id]) {
      const c = colors[id];
      root.style.setProperty('--coral', document.body.classList.contains('pearl-world') ? '#087f70' : c.accent);
      root.style.setProperty('--accent2', c.second);
      if (!document.body.classList.contains('pearl-world')) root.style.setProperty('--bg', c.bg);
      root.style.setProperty('--blue', c.blue);
      root.style.setProperty('--platform-glow', c.glow);
      root.style.setProperty('--platform-color', c.brand);
      root.style.setProperty('--platform-active', '1');
    } else {
      ['--coral', '--accent2', '--bg', '--blue', '--platform-glow', '--platform-color'].forEach(v => root.style.removeProperty(v));
      root.style.setProperty('--platform-active', '0');
    }
  }

  // Detect URL search param on load (e.g. catalogo.html?plataforma=netflix)
  try {
    const params = new URLSearchParams(location.search);
    const initial = params.get('plataforma') || params.get('apps')?.split(',')[0];
    if (initial && colors[initial]) {
      selected = initial;
      apply();
    }
  } catch {}

  document.addEventListener('pointerover', e => {
    if (e.pointerType !== 'mouse') return;
    const found = findPlatformId(e.target);
    if (found !== preview) {
      preview = found;
      apply();
    }
  });

  document.addEventListener('pointerout', e => {
    if (e.pointerType !== 'mouse') return;
    const next = findPlatformId(e.relatedTarget);
    if (next !== preview) {
      preview = next;
      apply();
    }
  });

  document.addEventListener('focusin', e => {
    const found = findPlatformId(e.target);
    if (found) {
      preview = found;
      apply();
    }
  });

  document.addEventListener('focusout', e => {
    const next = findPlatformId(e.relatedTarget);
    if (next !== preview) {
      preview = next;
      apply();
    }
  });

  document.addEventListener('click', e => {
    const id = findPlatformId(e.target);
    if (id && colors[id]) {
      selected = id;
      preview = null;
      apply();
    }
  });

  document.addEventListener('change', e => {
    if (e.target.matches('input[name="platform"]')) {
      const checked = [...document.querySelectorAll('input[name="platform"]:checked')];
      selected = e.target.checked ? e.target.value : (checked.at(-1)?.value || null);
      preview = null;
      apply();
    }
  });

  document.getElementById('clear-selection')?.addEventListener('click', () => {
    selected = null;
    preview = null;
    apply();
  });

  window.OrbitaColors = {
    reset() {
      selected = null;
      preview = null;
      apply();
    },
    set(id) {
      if (id && colors[id]) {
        selected = id;
        preview = null;
        apply();
      }
    },
    color: () => colors[preview || selected]?.accent || null,
    current: () => preview || selected || null
  };
})();
