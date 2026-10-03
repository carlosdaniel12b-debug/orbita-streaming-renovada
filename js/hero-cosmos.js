/**
 * ÓRBITA STREAMING — HERO CINEMATOGRÁFICO Y MÉTODOS DE PAGO
 * Selección manual de historias con movimiento ligero y modal de pagos.
 */
(() => {
  'use strict';

  // =========================================================================
  // 1. UNIVERSO DE CARTAS CÓSMICAS (HERO STACK)
  // =========================================================================
  const COSMIC_STORIES = [
    {
      id: 'andor',
      title: 'Andor',
      subtitle: 'Una galaxia. Miles de historias.',
      platform: 'disneyplus',
      platformName: 'Disney+',
      category: 'Serie · Ciencia ficción & Aventura',
      quality: '4K Ultra HD · IMAX Enhanced',
      backdrop: 'assets/backdrops/andor-scene.jpg',
      poster: 'assets/posters/s52341.jpg',
      trailerId: 's52341',
      description: 'En una era rebelde, Cassian Andor descubre la diferencia que puede marcar en la batalla contra el Imperio.',
      companionTitle: 'Para los fans de Star Wars',
      companionBadge: 'Recomendada',
      accentColor: '#00d2ff'
    },
    {
      id: 'severance',
      title: 'Severance',
      subtitle: '¿Qué pasa cuando divides tu mente?',
      platform: 'appletv',
      platformName: 'Apple TV+',
      category: 'Serie · Misterio & Thriller psicológico',
      quality: '4K HDR · Dolby Vision',
      backdrop: 'assets/backdrops/severance-scene.jpg',
      poster: 'assets/posters/s44933.jpg',
      trailerId: 's44933',
      description: 'Un procedimiento quirúrgico separa los recuerdos del trabajo y los de la vida personal. Nada es lo que parece.',
      companionTitle: 'Para tu próxima maratón',
      companionBadge: 'Misterio de culto',
      accentColor: '#38bdf8'
    },
    {
      id: 'lastofus',
      title: 'The Last of Us',
      subtitle: 'Cuando la oscuridad cae, solo queda resistir.',
      platform: 'hbomax',
      platformName: 'Max',
      category: 'Serie · Drama & Acción postapocalíptica',
      quality: '4K HDR · Audio Atmos',
      backdrop: 'assets/backdrops/lastofus.jpg',
      poster: 'assets/posters/s46562.jpg',
      trailerId: 's46562',
      description: 'Veinte años después de la caída de la civilización, Joel es contratado para sacar a Ellie de una zona de cuarentena.',
      companionTitle: 'Obra maestra de Max',
      companionBadge: 'Premiada',
      accentColor: '#9333ea'
    },
    {
      id: 'dune2',
      title: 'Dune: Parte Dos',
      subtitle: 'El destino del cosmos en la arena de Arrakis.',
      platform: 'hbomax',
      platformName: 'Max',
      category: 'Película · Ciencia ficción épica',
      quality: '4K Ultra HD · Dolby Vision',
      backdrop: 'assets/backdrops/dune.jpg',
      poster: 'assets/posters/m_dune2.jpg',
      trailerId: 'm_dune2',
      description: 'Paul Atreides se une a Chani y a los Fremen mientras busca venganza contra los conspiradores que destruyeron a su familia.',
      companionTitle: 'Cine de gran escala',
      companionBadge: 'Taquillazo mundial',
      accentColor: '#f59e0b'
    },
    {
      id: 'pluto',
      title: 'PLUTO',
      subtitle: 'En un mundo de máquinas, los recuerdos son mortales.',
      platform: 'netflix',
      platformName: 'Netflix',
      category: 'Anime · Ciencia ficción & Misterio',
      quality: 'Full HD 1080p · Ultra Audio',
      backdrop: 'assets/backdrops/pluto-scene.jpg',
      poster: 'assets/posters/s66998.jpg',
      trailerId: 's66998',
      description: 'El detective robot Gesicht investiga los asesinatos de los robots más avanzados y sus aliados humanos.',
      companionTitle: 'Joyas del anime contemporáneo',
      companionBadge: 'Aclamada por la crítica',
      accentColor: '#e50914'
    },
    {
      id: 'strangerthings',
      title: 'Stranger Things',
      subtitle: 'Secretos prohibidos en el laboratorio de Hawkins.',
      platform: 'netflix',
      platformName: 'Netflix',
      category: 'Serie · Ciencia ficción & Sobrenatural',
      quality: '4K Ultra HD · Sonido Espacial',
      backdrop: 'assets/backdrops/strangerthings.jpg',
      poster: 'assets/posters/s2993.jpg',
      trailerId: 's2993',
      description: 'Un grupo de amigos se enfrenta a misterios gubernamentales y a fuerzas sobrenaturales terroríficas en los años 80.',
      companionTitle: 'La serie más vista',
      companionBadge: 'Fenómeno global',
      accentColor: '#ef4444'
    },
    {
      id: 'arcane',
      title: 'Arcane',
      subtitle: 'Dos hermanas. Dos ciudades. Una revolución.',
      platform: 'netflix',
      platformName: 'Netflix',
      category: 'Serie · Animación de culto & Aventura',
      quality: '4K HDR · Audio Envolvente',
      backdrop: 'assets/backdrops/arcane.jpg',
      poster: 'assets/posters/s55138.jpg',
      trailerId: 's55138',
      description: 'En medio del conflicto entre las ciudades gemelas de Piltover y Zaun, dos hermanas luchan en bandos rivales.',
      companionTitle: 'Animación sin precedentes',
      companionBadge: 'Premio Emmy',
      accentColor: '#06b6d4'
    },
    {
      id: '1923',
      title: '1923',
      subtitle: 'La dinastía Dutton frente al nuevo siglo.',
      platform: 'paramount',
      platformName: 'Paramount+',
      category: 'Serie · Western & Drama de época',
      quality: '4K Ultra HD · Sonido Cinemático',
      backdrop: 'assets/backdrops/1923-scene.jpg',
      poster: 'assets/posters/s60550.jpg',
      trailerId: 's60550',
      description: 'Harrison Ford y Helen Mirren protagonizan la lucha de la familia Dutton por conservar su legado en Montana.',
      companionTitle: 'Universo Yellowstone',
      companionBadge: 'Exclusiva',
      accentColor: '#0064ff'
    },
    {
      id: 'novela',
      title: 'El amor invencible',
      subtitle: 'Venganza, secretos y segundas oportunidades.',
      platform: 'vix',
      platformName: 'ViX',
      category: 'Novela · Drama & Romance apasionado',
      quality: 'Full HD · Transmisión sin cortes',
      backdrop: 'assets/backdrops/novela-scene.jpg',
      poster: 'assets/posters/s74573.jpg',
      trailerId: 's74573',
      description: 'Tras perderlo todo en el pasado, Leona vuelve con una nueva identidad dispuesta a hacer justicia por sus hijos.',
      companionTitle: 'Para ver en familia',
      companionBadge: 'Éxito en ViX',
      accentColor: '#ea580c'
    },
    {
      id: 'fallout',
      title: 'Fallout',
      subtitle: 'El apocalipsis nunca había tenido tanto estilo.',
      platform: 'primevideo',
      platformName: 'Prime Video',
      category: 'Serie · Aventura & Humor negro',
      quality: '4K HDR · Audio 5.1',
      backdrop: 'assets/backdrops/fallout.jpg',
      poster: 'assets/posters/s77383.jpg',
      trailerId: 's77383',
      description: 'Una ingenua habitante del Refugio sale a la superficie irradiada y descubre un yermo tan violento como fascinante.',
      companionTitle: 'Aventura nuclear',
      companionBadge: 'Tendencia global',
      accentColor: '#10b981'
    },
    {
      id: 'gemini',
      title: 'Gemini AI Pro',
      subtitle: '5 TB en la nube y la inteligencia artificial más potente.',
      platform: 'gemini',
      platformName: 'Google Gemini',
      category: 'Productividad & IA · Gemini 3.8 Pro',
      quality: '5 TB Almacenamiento · 2M Tokens',
      backdrop: 'assets/backdrops/severance-scene.jpg',
      poster: 'assets/icons/gemini.svg',
      trailerId: 's44933',
      description: '5 TB (5,000 GB) en Google One / Drive / Fotos + el modelo más inteligente Gemini 3.8 con contexto masivo de 2M tokens. Activación directa mediante link por $3 USD.',
      companionTitle: 'Espacio masivo e Inteligencia Artificial',
      companionBadge: '5 TB + Link Directo · $3',
      accentColor: '#4285f4'
    }
  ];

  // =========================================================================
  // 2. MODAL DE MÉTODOS DE PAGO LIQUID GLASS
  // =========================================================================
  let paymentModalEl = null;

  function initPaymentModal() {
    if (document.getElementById('orbita-payment-modal')) return;

    paymentModalEl = document.createElement('dialog');
    paymentModalEl.id = 'orbita-payment-modal';
    paymentModalEl.className = 'payment-modal-dialog liquid-glass';
    paymentModalEl.setAttribute('aria-modal', 'true');
    paymentModalEl.setAttribute('aria-labelledby', 'payment-modal-title');

    paymentModalEl.innerHTML = `
      <div class="payment-modal-backdrop" data-close-payment></div>
      <div class="payment-sheet liquid-glass">
        <div class="payment-sheet-handle" aria-hidden="true"></div>
        <div class="payment-header">
          <div class="payment-platform-info">
            <div class="payment-logo-wrap">
              <img id="payment-platform-icon" src="assets/icons/disneyplus.svg" alt="" class="payment-logo"/>
            </div>
            <div>
              <span class="payment-eyebrow" id="payment-platform-tag">Plataforma Oficial</span>
              <h2 id="payment-modal-title">Disney+</h2>
            </div>
          </div>
          <div class="payment-price-pill">
            <span class="payment-amount" id="payment-price">$3</span>
            <span class="payment-period">USD / mes</span>
          </div>
          <button type="button" class="payment-close-btn" data-close-payment aria-label="Cerrar ventana de pago">✕</button>
        </div>

        <div class="payment-perks-row" id="payment-perks">
          <span class="perk-chip"><svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Perfil 100% privado</span>
          <span class="perk-chip"><svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Ultra HD 4K</span>
          <span class="perk-chip"><svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Entrega en 5 min</span>
        </div>

        <div class="payment-methods-section">
          <div class="payment-section-head">
            <svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="3"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            <h3>Elige tu método de pago preferido</h3>
          </div>
          <div class="payment-methods-grid">
            <label class="payment-card-method is-selected" data-method="Transferencia Bancaria (Pichincha · Guayaquil · Deuna)">
              <input type="radio" name="pay_option" value="Transferencia Bancaria (Pichincha · Guayaquil · Deuna)" checked class="sr-only"/>
              <div class="method-indicator"></div>
              <div class="method-body">
                <div class="method-title-row">
                  <span class="method-name">Transferencias en Ecuador</span>
                  <span class="method-tag tag-ecuador">🇪🇨 Pichincha · Guayaquil · Deuna!</span>
                </div>
                <p class="method-desc">Transferencia directa sin recargos. Activación y verificación inmediata.</p>
              </div>
            </label>

            <label class="payment-card-method" data-method="Binance Pay / USDT (Cripto)">
              <input type="radio" name="pay_option" value="Binance Pay / USDT (Cripto)" class="sr-only"/>
              <div class="method-indicator"></div>
              <div class="method-body">
                <div class="method-title-row">
                  <span class="method-name">Binance Pay (Cripto)</span>
                  <span class="method-tag tag-crypto">🟡 USDT · Binance ID</span>
                </div>
                <p class="method-desc">Envío directo de billetera a billetera con 0% de comisión internacional.</p>
              </div>
            </label>

            <label class="payment-card-method" data-method="PayPal / Tarjetas Internacionales">
              <input type="radio" name="pay_option" value="PayPal / Tarjetas Internacionales" class="sr-only"/>
              <div class="method-indicator"></div>
              <div class="method-body">
                <div class="method-title-row">
                  <span class="method-name">PayPal / Tarjeta Internacional</span>
                  <span class="method-tag tag-global">🌐 Visa · Mastercard · Débito</span>
                </div>
                <p class="method-desc">Pago internacional seguro con protección en dólares estadounidenses.</p>
              </div>
            </label>
          </div>

          <div class="hero-binance-detail" id="hero-binance-panel" style="display:none; margin-top: 14px; padding: 14px; border-radius: 14px; background: rgba(245, 158, 11, 0.09); border: 1px solid rgba(245, 158, 11, 0.35);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <span style="font-size:12px; color:#f59e0b; font-weight:700;">UID Binance Oficial: <strong style="letter-spacing:1px; color:#fff;">1176541421</strong></span>
              <button type="button" class="btn-copy-uid" id="hero-copy-binance-btn" style="background:rgba(245,158,11,0.22); border:1px solid #f59e0b; color:#fff; border-radius:8px; padding:5px 10px; font-size:11px; cursor:pointer;">Copiar UID</button>
            </div>
            <label for="hero-binance-tx" style="font-size:11.5px; color:#cedee4; display:block; margin-bottom:5px; font-weight:500;">Ingresa tu Código / ID de Transacción Binance:</label>
            <input type="text" id="hero-binance-tx" placeholder="Ej: 489201938 o ID de orden" style="width:100%; box-sizing:border-box; padding:9px 12px; border-radius:8px; background:#081522; border:1px solid #f59e0b; color:#fff; font-size:13px;" />
            <small style="display:block; color:#9cb1bc; font-size:10.5px; margin-top:5px;">Envía el monto por Binance Pay a nuestro UID y pega el código para verificar tu entrega al instante.</small>
          </div>
        </div>

        <div class="payment-guarantee-box">
          <div class="guarantee-icon">✦</div>
          <div class="guarantee-text">
            <strong>Activación en 5 a 10 minutos con garantía total</strong>
            <span>Te acompañamos por WhatsApp con los datos de acceso y soporte continuo.</span>
          </div>
        </div>

        <div class="payment-actions">
          <a id="payment-whatsapp-btn" class="payment-btn-primary button" href="https://wa.me/593998226756" target="_blank" rel="noopener">
            <svg class="ui-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.27-2.42 5.82a8.18 8.18 0 01-5.82 2.41h-.01c-1.44 0-2.85-.38-4.09-1.11l-.29-.17-3.12.82.83-3.04-.19-.3a8.214 8.214 0 01-1.26-4.43c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.5-1.4-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.45 1.03 2.62.13.17 1.78 2.71 4.3 3.8.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z"/></svg>
            <span>Pedir por WhatsApp ahora</span>
          </a>
          <a id="payment-catalog-btn" class="payment-btn-secondary pearl-link" href="catalogo.html">
            <span>Ver ficha en catálogo ↗</span>
          </a>
        </div>
      </div>
    `;

    document.body.append(paymentModalEl);

    // Eventos de selección de método de pago
    const methodCards = paymentModalEl.querySelectorAll('.payment-card-method');
    methodCards.forEach(card => {
      card.addEventListener('click', () => {
        methodCards.forEach(c => c.classList.remove('is-selected'));
        card.classList.add('is-selected');
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
        updateWhatsAppLink();
      });
    });

    const heroCopyBtn = paymentModalEl.querySelector('#hero-copy-binance-btn');
    if (heroCopyBtn) {
      heroCopyBtn.onclick = () => {
        navigator.clipboard?.writeText('1176541421').catch(() => {});
        heroCopyBtn.textContent = '✓ ¡Copiado!';
        setTimeout(() => { heroCopyBtn.textContent = 'Copiar UID'; }, 2500);
      };
    }

    const heroTxInput = paymentModalEl.querySelector('#hero-binance-tx');
    if (heroTxInput) {
      heroTxInput.addEventListener('input', updateWhatsAppLink);
    }

    // Cierre
    paymentModalEl.querySelectorAll('[data-close-payment]').forEach(el => {
      el.addEventListener('click', closePaymentModal);
    });
    paymentModalEl.addEventListener('keydown', e => {
      if (e.key === 'Escape') closePaymentModal();
    });
  }

  let currentPlatformState = null;

  function updateWhatsAppLink() {
    if (!paymentModalEl || !currentPlatformState) return;
    const selectedRadio = paymentModalEl.querySelector('input[name="pay_option"]:checked');
    const method = selectedRadio ? selectedRadio.value : 'Transferencia Bancaria (Pichincha · Guayaquil · Deuna)';
    const platName = currentPlatformState.name;
    const price = currentPlatformState.price || 3;
    const phone = window.ORBITA?.phone || '593998226756';
    const isBinance = method.includes('Binance');
    const heroBinancePanel = paymentModalEl.querySelector('#hero-binance-panel');
    if (heroBinancePanel) {
      heroBinancePanel.style.display = isBinance ? 'block' : 'none';
    }

    const txCode = (paymentModalEl.querySelector('#hero-binance-tx')?.value || '').trim();

    let msg;
    if (isBinance && txCode) {
      msg = `¡Hola Órbita Streaming! Acabo de realizar el pago por Binance Pay.\n\n📱 Plataforma adquirida: *${platName}*\n💰 Monto transferido: *$${price}.00 USD (USDT)*\n🔑 Mi Código / ID de Transacción Binance: *${txCode}*\n🎯 Binance UID Destino: *1176541421*\n\nAdjunto el comprobante de la transferencia para la entrega y activación inmediata de mi cuenta.`;
    } else if (currentPlatformState.id === 'gemini') {
      msg = `Hola Órbita Streaming, deseo adquirir *Gemini AI Pro* (5 TB de almacenamiento + IA Gemini 3.8) por $3 USD (varios meses - activación directa por link). Mi forma de pago seleccionada es: *${method}*. ¿Tienen disponibilidad inmediata para proceder?`;
    } else {
      msg = `Hola Órbita Streaming, deseo adquirir la plataforma *${platName}* ($${price} USD/${currentPlatformState.period || 'mes'}). Mi forma de pago seleccionada es: *${method}*. ¿Tienen disponibilidad inmediata para proceder?`;
    }

    const waBtn = paymentModalEl.querySelector('#payment-whatsapp-btn');
    if (waBtn) {
      waBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    }
  }


  function openPaymentModal(platformKey, customTitle) {
    initPaymentModal();
    const platData = (window.ORBITA?.platforms || []).find(p => p.id === platformKey) || {
      id: platformKey || 'streaming',
      name: customTitle || (platformKey ? platformKey.toUpperCase() : 'Plataforma'),
      price: 3,
      period: 'mes',
      icon: 'assets/icons/' + (platformKey || 'netflix') + '.svg',
      tagline: 'Ultra HD 4K • Perfil Privado',
      features: ['Calidad Ultra HD 4K', 'Perfil privado con PIN', 'Soporte 24/7']
    };

    currentPlatformState = platData;

    const iconEl = paymentModalEl.querySelector('#payment-platform-icon');
    const titleEl = paymentModalEl.querySelector('#payment-modal-title');
    const tagEl = paymentModalEl.querySelector('#payment-platform-tag');
    const priceEl = paymentModalEl.querySelector('#payment-price');
    const periodEl = paymentModalEl.querySelector('.payment-period');
    const perksEl = paymentModalEl.querySelector('#payment-perks');
    const catLink = paymentModalEl.querySelector('#payment-catalog-btn');

    if (iconEl) {
      iconEl.src = platData.icon || `assets/icons/${platData.id}.svg`;
      iconEl.alt = platData.name;
    }
    if (titleEl) titleEl.textContent = platData.name;
    if (tagEl) tagEl.textContent = platData.tagline || 'Streaming Premium';
    if (priceEl) priceEl.textContent = `$${platData.price || 3}`;
    if (periodEl) periodEl.textContent = `USD / ${platData.period || 'mes'}`;
    if (catLink) catLink.href = `catalogo.html?plataforma=${platData.id}`;

    if (platData.id === 'gemini') {
      if (perksEl) {
        perksEl.innerHTML = `
          <span class="perk-chip"><svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Activación por Link Directo</span>
          <span class="perk-chip"><svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> 5 TB Google One / Drive</span>
          <span class="perk-chip"><svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Mejor IA Gemini 3.8</span>
        `;
      }
    } else {
      if (perksEl) {
        perksEl.innerHTML = `
          <span class="perk-chip"><svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Perfil 100% privado</span>
          <span class="perk-chip"><svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Ultra HD 4K</span>
          <span class="perk-chip"><svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Entrega en 5 min</span>
        `;
      }
    }

    updateWhatsAppLink();

    if (typeof paymentModalEl.showModal === 'function') {
      paymentModalEl.showModal();
    } else {
      paymentModalEl.setAttribute('open', '');
    }
    paymentModalEl.classList.add('is-open');
    document.body.classList.add('payment-open');
  }

  function closePaymentModal() {
    if (!paymentModalEl) return;
    paymentModalEl.classList.remove('is-open');
    document.body.classList.remove('payment-open');
    setTimeout(() => {
      if (typeof paymentModalEl.close === 'function') {
        paymentModalEl.close();
      } else {
        paymentModalEl.removeAttribute('open');
      }
    }, 250);
  }

  window.openPaymentModal = openPaymentModal;
  window.closePaymentModal = closePaymentModal;

  // Interceptar botones con data-platform-pay en cualquier lugar del sitio
  document.addEventListener('click', e => {
    const payTrigger = e.target.closest('[data-platform-pay]');
    if (payTrigger) {
      e.preventDefault();
      e.stopPropagation();
      const plat = payTrigger.dataset.platformPay;
      const title = payTrigger.dataset.platformTitle || '';
      openPaymentModal(plat, title);
    }
  });

  // =========================================================================
  // 3. HERO CINEMATOGRÁFICO: SELECCIÓN MANUAL SIN BUCLES DE ANIMACIÓN
  // =========================================================================
  class CinematicHero {
    constructor(container) {
      const stories=COSMIC_STORIES.filter(s=>['andor','severance','pluto'].includes(s.id));
      container.classList.add('cinematic-scene');
      container.innerHTML='<svg class="hero-orbit-frame" aria-hidden="true" viewBox="0 0 700 600"><ellipse cx="350" cy="290" rx="330" ry="210" transform="rotate(-25 350 290)"/><ellipse cx="350" cy="290" rx="305" ry="185" transform="rotate(-25 350 290)"/><circle cx="634" cy="142" r="7"/></svg><div class="cinematic-stage"></div><div class="cinematic-selector" role="group" aria-label="Elegir historia destacada"></div><p class="cinematic-status sr-only" role="status"></p>';
      const stage=container.querySelector('.cinematic-stage'),selector=container.querySelector('.cinematic-selector');
      const reduce=matchMedia('(prefers-reduced-motion:reduce)'),desktop=matchMedia('(min-width:701px)');
      let current=0;
      let timer=null,visible=true,hovered=false,playing=true;
      const panels=stories.map((story,index)=>{
        const panel=document.createElement('article');panel.className='cinematic-panel';panel.hidden=index!==0;
        panel.innerHTML='<img class="cinematic-image" width="1777" height="1000" alt="'+story.title+'" src="'+story.backdrop+'" '+(index===0?'fetchpriority="high"':'loading="lazy"')+'/>'+
          '<div class="cinematic-caption"><span>'+story.platformName+' · '+story.category.split(' · ')[0]+'</span><h2>'+story.title+'</h2><p>'+story.subtitle+'</p><div class="cinematic-actions"><button type="button" data-trailer="'+story.trailerId+'"><svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="m8 5 11 7-11 7Z"/></svg>Ver tráiler</button><a href="descubre.html?q='+encodeURIComponent(story.title)+'">Explorar historia <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a></div></div>';
        stage.append(panel);
        const button=document.createElement('button');button.type='button';button.className='cinematic-choice';button.setAttribute('aria-pressed',String(index===0));button.innerHTML='<img src="'+story.poster+'" width="40" height="54" alt=""/><span><strong>'+story.title+'</strong><small>'+story.platformName+'</small></span>';
        button.addEventListener('click',event=>{
          if(index===current)return;
          panels[current].getAnimations().forEach(a=>a.cancel());panels[current].hidden=true;panel.hidden=false;current=index;
          selector.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));
          if(event.detail!==-1)container.querySelector('.cinematic-status').textContent=story.title+' en '+story.platformName;
          window.OrbitaColors?.set(story.platform);
          if(event.detail&&desktop.matches&&!reduce.matches&&!document.documentElement.classList.contains('motion-paused')){panel.animate([{opacity:.35},{opacity:1}],{duration:280,easing:'cubic-bezier(.16,1,.3,1)'});panel.querySelector('.cinematic-image').animate([{transform:'scale(1.035)'},{transform:'scale(1)'}],{duration:600,easing:'cubic-bezier(.16,1,.3,1)'});}
        });selector.append(button);return panel;
      });
      const playback=document.createElement('div');playback.className='hero-playback';
      const toggle=document.createElement('button');toggle.type='button';playback.append(toggle);container.append(playback);
      const blocked=()=>reduce.matches||document.documentElement.classList.contains('motion-paused');
      const schedule=()=>{clearTimeout(timer);toggle.disabled=blocked();toggle.textContent=playing&&!blocked()?'Pausar historias':'Reproducir historias';toggle.setAttribute('aria-pressed',String(playing&&!blocked()));if(!playing||blocked()||!visible||hovered||document.hidden||container.contains(document.activeElement))return;timer=setTimeout(()=>{if(!document.querySelector('dialog[open]')&&!document.documentElement.classList.contains('intro-pending'))selector.children[(current+1)%stories.length].dispatchEvent(new MouseEvent('click',{detail:-1}));schedule();},6500);};
      toggle.addEventListener('click',()=>{playing=!playing;schedule();});
      container.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){hovered=true;schedule();}});
      container.addEventListener('pointerleave',()=>{hovered=false;schedule();});
      container.addEventListener('focusin',schedule);container.addEventListener('focusout',()=>queueMicrotask(schedule));
      selector.addEventListener('click',schedule);reduce.addEventListener('change',schedule);document.addEventListener('visibilitychange',schedule);
      new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
      new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.2}).observe(container);
      window.addEventListener('pagehide',()=>clearTimeout(timer));schedule();
    }
  }

  // =========================================================================
  // 4. INICIALIZACIÓN AUTOMÁTICA AL CARGAR EL DOM
  // =========================================================================
  function bootCosmos() {
    initPaymentModal();

    const heroScene = document.querySelector('.orbital-scene');
    if (heroScene) {
      new CinematicHero(heroScene);
    }

    // Convertir el dock de plataformas en disparadores de Métodos de Pago Liquid Glass
    const dockLinks = document.querySelectorAll('.platform-dock a');
    dockLinks.forEach(link => {
      link.addEventListener('click', e => {
        // En desktop y mobile, abrir modal con los métodos de pago de esa plataforma
        const href = link.getAttribute('href') || '';
        const match = href.match(/plataforma=([a-z0-9_-]+)/i);
        if (match && match[1]) {
          e.preventDefault();
          const platId = match[1];
          const platName = link.querySelector('span')?.textContent || platId;
          openPaymentModal(platId, platName);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootCosmos);
  } else {
    bootCosmos();
  }

})();
