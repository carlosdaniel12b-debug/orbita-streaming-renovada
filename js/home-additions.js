(()=>{'use strict';

  // 1. Selector de planes para tardes/noches (existente)
  const plans = {
    solo: { symbol: '✦', title: 'Una pausa solo para ti.', text: 'Ponte cómodo y encuentra una película para desconectar a tu ritmo.', label: 'Encontrar una película', url: 'descubre.html?tipo=Pel%C3%ADcula' },
    pareja: { symbol: '♡', title: 'El próximo episodio, juntos.', text: 'Una serie, algo rico y ese «solo un capítulo más» que ya conoces.', label: 'Elegir una serie', url: 'descubre.html?tipo=Serie' },
    familia: { symbol: '☀', title: 'Una historia para compartir.', text: 'Explora animación y encuentra una opción para ver juntos. Revisa la clasificación de edad antes de elegir.', label: 'Explorar animación', url: 'descubre.html?q=animaci%C3%B3n' }
  };
  document.querySelectorAll('[data-evening]').forEach(button => button.addEventListener('click', () => {
    const plan = plans[button.dataset.evening];
    if (!plan) return;
    document.querySelectorAll('[data-evening]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    const panel = document.querySelector('.evening-panel');
    if (!panel) return;
    panel.querySelector('.evening-symbol').textContent = plan.symbol;
    panel.querySelector('h3').textContent = plan.title;
    panel.querySelector('p').textContent = plan.text;
    const link = panel.querySelector('a');
    if (link) { link.textContent = plan.label + ' ↗'; link.href = plan.url; }
  }));

  // One pricing source for the home quote and the full combo configurator.
  const calcBox = document.getElementById('calculadora-ahorro');
  const calculate = window.OrbitaPricing?.calculate;
  if (!calcBox || !calculate) return;

  const platforms = window.ORBITA?.platforms || [];
  const inputs = [...calcBox.querySelectorAll('.savings-selector-grid input[type="checkbox"]')];
  const countEl = calcBox.querySelector('#calc-selection-count');
  const monthlyEl = calcBox.querySelector('#calc-monthly-val');
  const initialEl = calcBox.querySelector('#calc-initial-val');
  const noteEl = calcBox.querySelector('#calc-plan-note');
  const cta = calcBox.querySelector('#calc-whatsapp-cta');
  const money = amount => '$' + amount.toFixed(2);

  function updateQuote() {
    const ids = inputs.filter(input => input.checked && platforms.some(platform => platform.id === input.value))
      .map(input => input.value);
    const quote = calculate(ids);
    if (countEl) countEl.textContent = quote.list.length + (quote.list.length === 1 ? ' plataforma' : ' plataformas');
    if (monthlyEl) monthlyEl.textContent = money(quote.monthly);
    if (initialEl) initialEl.textContent = money(quote.total);

    if (noteEl) {
      const notes = quote.list.filter(platform => platform.period !== 'mes')
        .map(platform => platform.name + ': ' + money(platform.price) + ' / ' + platform.period + '.');
      if (quote.bonus) notes.push('Spotify de regalo por 1 mes, sujeto a confirmación.');
      if (!quote.list.length) notes.push('Elige tus plataformas para ver el total.');
      else if (!notes.length) notes.push('Confirma disponibilidad y condiciones al pedir.');
      noteEl.textContent = notes.join(' ');
    }
    if (cta) {
      cta.href = quote.list.length ? 'combos.html?apps=' + encodeURIComponent(quote.list.map(platform => platform.id).join(',')) : 'combos.html';
      cta.removeAttribute('target');
      cta.removeAttribute('rel');
    }
  }

  inputs.forEach(input => input.addEventListener('change', updateQuote));
  updateQuote();
})();
