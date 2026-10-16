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

  // 2. Calculadora Interactiva de Ahorro
  const calcBox = document.getElementById('calculadora-ahorro');
  if (calcBox) {
    const retailPrices = {
      netflix: { name: 'Netflix', retail: 15.49, orbita: 3.00, monthlyCombo: true },
      disneyplus: { name: 'Disney+', retail: 13.99, orbita: 3.00, monthlyCombo: true },
      max: { name: 'Max', retail: 15.99, orbita: 3.00, monthlyCombo: true },
      primevideo: { name: 'Prime Video', retail: 8.99, orbita: 3.00, monthlyCombo: true },
      spotify: { name: 'Spotify Premium', retail: 10.99, orbita: 3.00, monthlyCombo: true },
      appletv: { name: 'Apple TV+', retail: 9.99, orbita: 3.00, monthlyCombo: true },
      paramount: { name: 'Paramount+', retail: 7.99, orbita: 3.00, monthlyCombo: true },
      canva: { name: 'Canva Pro', retail: 12.99, orbita: 4.00, monthlyCombo: false }
    };

    const inputs = calcBox.querySelectorAll('.savings-selector-grid input[type="checkbox"]');
    const retailValEl = calcBox.querySelector('#calc-retail-val');
    const orbitaValEl = calcBox.querySelector('#calc-orbita-val');
    const savingsMonthlyEl = calcBox.querySelector('#calc-savings-monthly');
    const savingsYearlyEl = calcBox.querySelector('#calc-savings-yearly');
    const ctaBtn = calcBox.querySelector('#calc-whatsapp-cta');

    function updateSavings() {
      const selected = [];
      inputs.forEach(input => {
        if (input.checked && retailPrices[input.value]) {
          selected.push(retailPrices[input.value]);
        }
      });

      if (selected.length === 0) {
        if (retailValEl) retailValEl.textContent = '$0.00';
        if (orbitaValEl) orbitaValEl.textContent = '$0.00';
        if (savingsMonthlyEl) savingsMonthlyEl.textContent = '$0.00';
        if (savingsYearlyEl) savingsYearlyEl.textContent = 'Selecciona al menos 1 servicio';
        if (ctaBtn) {
          ctaBtn.href = 'https://wa.me/593998226756?text=' + encodeURIComponent('Hola Órbita, quisiera consultar sobre los planes de streaming.');
        }
        return;
      }

      // Cálculo de precio oficial
      const totalRetail = selected.reduce((sum, item) => sum + item.retail, 0);

      // Tarifa Órbita: combos 2 por $5 en plataformas mensuales, Canva $4
      const monthlyItems = selected.filter(item => item.monthlyCombo);
      const otherItems = selected.filter(item => !item.monthlyCombo);
      const monthlyOrbita = Math.floor(monthlyItems.length / 2) * 5 + (monthlyItems.length % 2) * 3;
      const otherOrbita = otherItems.reduce((sum, item) => sum + item.orbita, 0);
      const totalOrbita = monthlyOrbita + otherOrbita;

      const savedMonthly = Math.max(0, totalRetail - totalOrbita);
      const savedYearly = savedMonthly * 12;

      if (retailValEl) retailValEl.textContent = '$' + totalRetail.toFixed(2);
      if (orbitaValEl) orbitaValEl.textContent = '$' + totalOrbita.toFixed(2);
      if (savingsMonthlyEl) savingsMonthlyEl.textContent = '$' + savedMonthly.toFixed(2);
      if (savingsYearlyEl) savingsYearlyEl.textContent = '¡Ahorras aprox. $' + savedYearly.toFixed(0) + ' USD al año!';

      if (ctaBtn) {
        const names = selected.map(s => s.name).join(' + ');
        const msg = `Hola Órbita, calculé mi ahorro en la web y quiero este combo: ${names}.\nTarifa Órbita: $${totalOrbita.toFixed(2)} USD/mes.\n¿Tienen disponibilidad inmediata para proceder?`;
        ctaBtn.href = 'https://wa.me/593998226756?text=' + encodeURIComponent(msg);
      }
    }

    inputs.forEach(input => input.addEventListener('change', updateSavings));
    updateSavings();
  }
})();
