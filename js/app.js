/* Órbita — navegación, catálogo y pedidos. Sin dependencias externas. */
(()=>{'use strict';
const {platforms,editorial,phone}=window.ORBITA;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const byId=id=>platforms.find(p=>p.id===id);
const money=n=>'$'+n.toFixed(2);
const wa=text=>'https://wa.me/'+phone+'?text='+encodeURIComponent(text);
const storage={get(k){try{return localStorage.getItem(k)}catch{return null}},set(k,v){try{localStorage.setItem(k,v)}catch{}}};
const normalize=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
let selected=new Set();try{const saved=JSON.parse(storage.get('orbita-selection')||'[]');if(Array.isArray(saved))selected=new Set(saved.filter(id=>byId(id)))}catch{}
let toastTimer;
function toast(text){$('.toast').textContent=text;$('.toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('.toast').classList.remove('show'),2400)}
function calculate(ids){const list=[...new Set(ids)].map(byId).filter(Boolean),videos=list.filter(p=>p.category==='cinema').length;const bonus=videos>=2;const paid=list.filter(p=>p.period==='mes'&&!(p.id==='spotify'&&bonus));const monthly=Math.floor(paid.length/2)*5+(paid.length%2)*3;const annual=list.some(p=>p.id==='canva')?4:0;const chatgpt=list.some(p=>p.id==='chatgpt')?5:0;const gemini=list.some(p=>p.id==='gemini')?3:0;return {list,bonus,monthly,annual,chatgpt,gemini,total:monthly+annual+chatgpt+gemini,savings:paid.length*3-monthly}}
window.OrbitaPricing={calculate};
function orderMessage(ids, selectedPaymentMethod){
  const c=calculate(ids);
  const pay = selectedPaymentMethod || window.OrbitaPayments?.label() || 'Transferencia (Pichincha, Guayaquil, Deuna, PayPal o Binance)';
  return `Hola Órbita, quiero adquirir: ${c.list.map(p=>p.name).join(' + ')}.\n${c.monthly?`Plan mensual: ${money(c.monthly)} USD/mes.\n`:''}${c.annual?'Canva Pro: $4.00 USD/año.\n':''}${c.chatgpt?'ChatGPT Plus: $5.00 USD / 4 meses.\n':''}${c.gemini?'Gemini AI Pro (5 TB + IA 3.8): $3.00 USD (varios meses - activación por link directo).\n':''}${c.bonus?'Incluye Spotify de regalo por 1 mes (promoción por confirmar).\n':''}Total inicial: ${money(c.total)} USD.\nForma de pago seleccionada: ${pay}.\n¿Tienen disponibilidad inmediata para proceder?`;
}
function navigateCombo(ids){storage.set('orbita-selection',JSON.stringify(ids));location.href='combos.html?apps='+encodeURIComponent(ids.join(','))}
function showDialog(dialog){if(!dialog.open)dialog.showModal()}
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
$$('dialog').forEach(d=>d.addEventListener('click',e=>{const r=d.getBoundingClientRect();if(e.target===d&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))d.close()}));
function details(id,story=false){
  const p=byId(id);
  if(!p)return;
  const e=editorial.find(x=>x.id===id);
  const binanceUid = '1176541421';

  $('#detail-body').innerHTML=`
    <div class="detail-top-head">
      <img class="detail-logo" src="${p.icon}" alt="${p.name}">
      <div class="detail-head-info">
        <h2 id="detail-title">${story?e.title:p.name}</h2>
        <span class="detail-tagline">${story?e.desc:p.tagline}</span>
      </div>
      <div class="detail-price-pill">
        <span class="detail-price-val">$${p.price}</span>
        <span class="detail-price-per">USD / ${p.period}</span>
      </div>
    </div>

    <div class="detail-payments-box">
      <div class="payments-box-header">
        <span class="payments-box-title">Selecciona tu Forma de Pago</span>
        <span class="payments-box-badge">0% comisión · Activación 5 min</span>
      </div>
      <div class="payments-chips" id="detail-pay-chips">
        <button type="button" class="pay-chip is-selected" data-pay="ecuador"><span class="chip-flag">🇪🇨</span> Ecuador (Pichincha · Guayaquil · Deuna)</button>
        <button type="button" class="pay-chip" data-pay="binance"><span class="chip-dot" style="background:#f59e0b"></span> Binance Pay (USDT)</button>
        <button type="button" class="pay-chip" data-pay="paypal"><span class="chip-dot" style="background:#38bdf8"></span> PayPal · Tarjetas</button>
      </div>

      <!-- Panel Ecuador -->
      <div class="pay-method-panel" id="panel-ecuador">
        <p class="pay-panel-desc">Transferencias directas e interbancarias en Ecuador sin comisiones:</p>
        <div class="pay-banks-tags">
          <span class="bank-chip">Banco Pichincha</span>
          <span class="bank-chip">Banco Guayaquil</span>
          <span class="bank-chip">Deuna! (QR / Celular)</span>
        </div>
        <a class="button pay-cta-btn" id="btn-pay-ecuador" href="${wa(`¡Hola Órbita Streaming! Deseo adquirir ${p.name} ($${p.price} USD / ${p.period}) con Transferencia en Ecuador (Pichincha · Guayaquil · Deuna). ¿Me facilitan los datos para transferir?`)}" target="_blank" rel="noopener">
          <span>Pedir por WhatsApp (Transferencia Ecuador) ↗</span>
        </a>
      </div>

      <!-- Panel Binance Pay -->
      <div class="pay-method-panel" id="panel-binance" style="display:none">
        <div class="binance-box">
          <div class="binance-box-header">
            <span class="binance-badge">🟡 Binance Pay Cripto</span>
            <span class="binance-zero-fee">0% comisión</span>
          </div>
          <div class="binance-uid-display">
            <div class="binance-uid-label">UID de Binance Destino:</div>
            <div class="binance-uid-value-row">
              <strong class="binance-uid-code" id="binance-uid-num">${binanceUid}</strong>
              <button type="button" class="binance-copy-btn" id="binance-copy-btn">
                <svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                <span id="binance-copy-txt">Copiar UID</span>
              </button>
            </div>
            <small class="binance-total-hint">Monto a transferir: <strong>$${p.price}.00 USDT</strong></small>
          </div>
          <div class="binance-tx-input-wrap">
            <label for="binance-tx-input" class="binance-tx-label">Ingresa tu ID / Código de Transacción Binance:</label>
            <input type="text" id="binance-tx-input" class="binance-tx-input" placeholder="Ej: 489201938 o ID de orden" autocomplete="off" />
            <small class="binance-tx-hint">Envía el monto a nuestro UID en Binance y escribe el código para entregar tu cuenta de inmediato.</small>
          </div>
          <button type="button" class="button pay-cta-btn button-binance" id="btn-confirm-binance">
            <span>Confirmar Transferencia Binance y Enviar por WhatsApp ↗</span>
          </button>
        </div>
      </div>

      <!-- Panel PayPal -->
      <div class="pay-method-panel" id="panel-paypal" style="display:none">
        <p class="pay-panel-desc">Pago internacional con protección en dólares estadounidenses:</p>
        <div class="pay-banks-tags">
          <span class="bank-chip">Saldo PayPal</span>
          <span class="bank-chip">Tarjetas de Crédito</span>
          <span class="bank-chip">Tarjetas de Débito</span>
        </div>
        <a class="button pay-cta-btn" id="btn-pay-paypal" href="${wa(`¡Hola Órbita Streaming! Deseo adquirir ${p.name} ($${p.price} USD / ${p.period}) con PayPal / Tarjeta Internacional. ¿Me facilitan el enlace de pago de PayPal?`)}" target="_blank" rel="noopener">
          <span>Pedir por WhatsApp (PayPal) ↗</span>
        </a>
      </div>
    </div>

    ${story?`<img class="detail-cover" src="assets/${e.image}" alt="" onerror="this.hidden=true"><p class="muted">${e.desc}</p><a class="text-link" href="${e.url}" target="_blank" rel="noopener">Explorar en la fuente oficial ↗</a>`:`<p class="muted">${p.tagline}</p><ul class="detail-features">${p.features.map(f=>'<li>'+f+'</li>').join('')}</ul><p class="fine-print">Compatible con: ${p.devices.join(', ')}. Confirma disponibilidad al instante por WhatsApp.</p>`}

    <div class="detail-actions">
      <button class="button ghost" id="add-to-combo">Añadir a mi combo</button>
    </div>
  `;

  $('#add-to-combo')?.addEventListener('click',()=>navigateCombo([...new Set([...selected,id])]));
  
  const payChips = $$('#detail-pay-chips .pay-chip');
  payChips.forEach(chip => {
    chip.addEventListener('click', () => {
      payChips.forEach(c => c.classList.remove('is-selected'));
      chip.classList.add('is-selected');
      const m = chip.dataset.pay;
      $('#panel-ecuador').style.display = m === 'ecuador' ? 'block' : 'none';
      $('#panel-binance').style.display = m === 'binance' ? 'block' : 'none';
      $('#panel-paypal').style.display = m === 'paypal' ? 'block' : 'none';
    });
  });

  const copyBtn = $('#binance-copy-btn');
  if (copyBtn) {
    copyBtn.onclick = async () => {
      const txt = $('#binance-copy-txt');
      try {
        if (!navigator.clipboard?.writeText) throw Error('clipboard');
        await navigator.clipboard.writeText(binanceUid);
        if(txt)txt.textContent = 'Copiado ✓';
        toast('UID de Binance copiado: ' + binanceUid);
      } catch {
        const range=document.createRange(); range.selectNodeContents($('#binance-uid-num'));
        const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
        toast('No se pudo copiar. Selecciona y copia el UID manualmente.');
      }
      setTimeout(() => { if(txt)txt.textContent='Copiar UID'; },2500);
    };
  }

  const binanceConfirmBtn = $('#btn-confirm-binance');
  if (binanceConfirmBtn) {
    binanceConfirmBtn.onclick = () => {
      const txInput = $('#binance-tx-input');
      const txCode = (txInput?.value || '').trim();
      if (!txCode) {
        if (txInput) {
          txInput.focus();
          txInput.style.borderColor = '#f59e0b';
          txInput.style.boxShadow = '0 0 12px rgba(245, 158, 11, 0.4)';
        }
        toast('Por favor escribe el código o ID de tu transferencia Binance.');
        return;
      }
      const msg = `¡Hola Órbita Streaming! Acabo de realizar el pago por Binance Pay.\n\n📱 Plataforma adquirida: *${p.name}*\n💰 Monto transferido: *$${p.price}.00 USD (USDT)*\n🔑 Código / ID de Transacción Binance: *${txCode}*\n🎯 Binance UID Destino: *${binanceUid}*\n\nAdjunto el comprobante para la entrega y activación inmediata de mi cuenta.`;
      window.open(wa(msg), '_blank', 'noopener,noreferrer');
    };
  }

  showDialog($('#details'));
}
$$('[data-detail]').forEach(b=>b.addEventListener('click',()=>details(b.dataset.detail)));
$$('[data-story]').forEach(b=>b.addEventListener('click',()=>details(b.dataset.story,true)));
document.addEventListener('click', e => {
  if (e.target.closest('.platform-whatsapp') || e.target.closest('[data-trailer]')) return;
  const card = e.target.closest('.platform-card');
  if (card && !e.target.closest('button, a')) {
    const btn = card.querySelector('[data-detail]');
    const cardId = btn?.dataset?.detail || card.dataset.name;
    if (cardId && byId(cardId)) {
      e.preventDefault();
      details(cardId);
    }
  }
});
const menu=$('.menu-toggle'),nav=$('.nav');
if(menu&&nav){
  function toggleNav(forceState){
    const isCurrentlyOpen=nav.classList.contains('open');
    const nextState=forceState!==undefined?forceState:!isCurrentlyOpen;
    menu.setAttribute('aria-expanded',String(nextState));
    menu.setAttribute('aria-label',nextState?'Cerrar menú':'Abrir menú');
    menu.innerHTML=nextState
      ?'<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
      :'<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>';
    nav.classList.toggle('open',nextState);
    if(nextState){
      document.body.classList.add('mobile-nav-active');
    }else{
      document.body.classList.remove('mobile-nav-active');
    }
  }

  menu.addEventListener('click',e=>{
    e.stopPropagation();
    toggleNav();
  });

  nav.querySelectorAll('a, button').forEach(el=>{
    el.addEventListener('click',()=>{
      if(nav.classList.contains('open')) toggleNav(false);
    });
  });

  document.addEventListener('click',e=>{
    if(nav.classList.contains('open')){
      if(!nav.contains(e.target)&&!menu.contains(e.target)&&!e.target.closest?.('.menu-toggle')){
        toggleNav(false);
      }
    }
  });

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&nav.classList.contains('open')){
      toggleNav(false);
      menu.focus();
    }
  });
}

let category='all';function filter(){const term=normalize($('#search').value||'').trim();let count=0;$$('.catalog-grid .platform-card').forEach(card=>{const cat=card.dataset.category||'';const name=normalize(card.dataset.name||'');const show=(category==='all'||cat===category)&&name.includes(term);card.hidden=!show;card.style.display=show?'flex':'none';card.classList.toggle('is-hidden',!show);if(show)count++});$('#result-count').textContent=count+' plataforma'+(count===1?'':'s')+' para explorar';$('.empty-state').hidden=count>0}
if($('#search')){$('#search').addEventListener('input',filter);$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.filter;$$('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));filter()}));$('#reset-filters').addEventListener('click',()=>{$('#search').value='';$('[data-filter="all"]').click();$('#search').focus()});const id=new URLSearchParams(location.search).get('plataforma');if(byId(id))details(id)}
$$('[data-rail]').forEach(b=>b.addEventListener('click',()=>$('.discovery-rail').scrollBy({left:Number(b.dataset.rail)*300,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('motion-paused')?'instant':'smooth'})));
function renderSelection(){storage.set('orbita-selection',JSON.stringify([...selected]));$$('input[name="platform"]').forEach(i=>i.checked=selected.has(i.value));const c=calculate([...selected]);$('#selected-list').innerHTML=c.list.length?c.list.map(p=>`<div class="selected-row"><span><img src="${p.icon}" alt="">${p.name}${p.id==='spotify'&&c.bonus?' (regalo)':''}</span><button data-remove="${p.id}" aria-label="Quitar ${p.name}">×</button></div>`).join(''):'<p class="muted">Elige una plataforma para empezar.</p>';$('#summary-totals').innerHTML=`<div class="summary-divider">${c.monthly?`<div class="total-row"><span>Plan mensual</span><strong>${money(c.monthly)} <small>/ mes</small></strong></div>`:''}${c.annual?'<div class="total-row"><span>Canva Pro anual</span><strong>$4.00 <small>/ año</small></strong></div>':''}${c.chatgpt?'<div class="total-row"><span>ChatGPT Plus (4 meses)</span><strong>$5.00 <small>/ 4 meses</small></strong></div>':''}${c.gemini?'<div class="total-row"><span>Gemini AI Pro (5 TB)</span><strong>$3.00 <small>/ varios meses</small></strong></div>':''}<div class="total-row"><span>Total inicial</span><strong>${money(c.total)}</strong></div>${c.savings?`<p class="fine-print">Ahorras ${money(c.savings)} al mes con tu combo.</p>`:''}${c.bonus?'<p class="bonus">♫ Spotify incluido de regalo por 1 mes.</p>':''}</div>`;$('#order').disabled=!c.list.length;$$('[data-remove]').forEach(b=>b.addEventListener('click',()=>{selected.delete(b.dataset.remove);renderSelection();$('#summary-title').setAttribute('tabindex','-1');$('#summary-title').focus()}))}
if($('#order')){const params=new URLSearchParams(location.search);if(params.has('apps'))selected=new Set(params.get('apps').split(',').filter(id=>byId(id)));const legacy={cine:['netflix','hbomax'],total:['netflix','spotify'],trio:['netflix','disneyplus','hbomax']};if(legacy[params.get('combo')])selected=new Set(legacy[params.get('combo')]);$$('input[name="platform"]').forEach(i=>i.addEventListener('change',()=>{i.checked?selected.add(i.value):selected.delete(i.value);renderSelection()}));$('#clear-selection').addEventListener('click',()=>{selected.clear();renderSelection()});$$('[data-preset]').forEach(b=>b.addEventListener('click',()=>{selected=new Set(b.dataset.preset.split(','));renderSelection();toast('Combo seleccionado. Puedes personalizarlo.')}));$('#order').addEventListener('click',()=>{if(selected.size)window.open(wa(orderMessage([...selected])),'_blank','noopener,noreferrer')});renderSelection()}

})();
