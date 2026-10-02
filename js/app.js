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
function calculate(ids){const list=[...new Set(ids)].map(byId).filter(Boolean),videos=list.filter(p=>p.category==='cinema').length;const bonus=videos>=2;const paid=list.filter(p=>p.period==='mes'&&!(p.id==='spotify'&&bonus));const monthly=Math.floor(paid.length/2)*5+(paid.length%2)*3;const annual=list.some(p=>p.id==='canva')?4:0;const chatgpt=list.some(p=>p.id==='chatgpt')?5:0;return {list,bonus,monthly,annual,chatgpt,total:monthly+annual+chatgpt,savings:paid.length*3-monthly}}
window.OrbitaPricing={calculate};
function orderMessage(ids){const c=calculate(ids);return `Hola Órbita, quiero solicitar: ${c.list.map(p=>p.name).join(' + ')}.\n${c.monthly?`Plan mensual: ${money(c.monthly)} USD/mes.\n`:''}${c.annual?'Canva Pro: $4.00 USD/año.\n':''}${c.chatgpt?'ChatGPT Plus: $5.00 USD / 4 meses.\n':''}${c.bonus?'Incluye Spotify de regalo por 1 mes (promoción por confirmar).\n':''}Total inicial: ${money(c.total)} USD.\nQuisiera confirmar disponibilidad, condiciones y forma de pago.`}
function navigateCombo(ids){storage.set('orbita-selection',JSON.stringify(ids));location.href='combos.html?apps='+encodeURIComponent(ids.join(','))}
function showDialog(dialog){if(!dialog.open)dialog.showModal()}
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
$$('dialog').forEach(d=>d.addEventListener('click',e=>{const r=d.getBoundingClientRect();if(e.target===d&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))d.close()}));
function details(id,story=false){const p=byId(id);if(!p)return;const e=editorial.find(x=>x.id===id);$('#detail-body').innerHTML=`<img class="detail-logo" src="${p.icon}" alt="${p.name}"><h2 id="detail-title">${story?e.title:p.name}</h2>${story?`<img class="detail-cover" src="assets/${e.image}" alt="" onerror="this.hidden=true"><p class="muted">${e.desc}</p><a class="text-link" href="${e.url}" target="_blank" rel="noopener">Explorar en la fuente oficial ↗</a>`:`<p class="muted">${p.tagline}</p><ul class="detail-features">${p.features.map(f=>'<li>'+f+'</li>').join('')}</ul><p class="fine-print">Compatible con: ${p.devices.join(', ')}. Confirma características y disponibilidad del plan por WhatsApp.</p>`}<div class="detail-price">$${p.price}<small> USD / ${p.period}</small></div><div class="detail-actions"><a class="button" href="${wa(orderMessage([id]))}" target="_blank" rel="noopener">Pedir por WhatsApp ↗</a><button class="button ghost" id="add-to-combo">Añadir a mi combo</button></div>`;$('#add-to-combo').addEventListener('click',()=>navigateCombo([...new Set([...selected,id])]));showDialog($('#details'))}
$$('[data-detail]').forEach(b=>b.addEventListener('click',()=>details(b.dataset.detail)));
$$('[data-story]').forEach(b=>b.addEventListener('click',()=>details(b.dataset.story,true)));
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

let category='all';function filter(){const term=normalize($('#search').value);let count=0;$$('.catalog-grid .platform-card').forEach(card=>{const show=(category==='all'||card.dataset.category===category)&&normalize(card.dataset.name).includes(term);card.hidden=!show;if(show)count++});$('#result-count').textContent=count+' plataforma'+(count===1?'':'s')+' para explorar';$('.empty-state').hidden=count>0}
if($('#search')){$('#search').addEventListener('input',filter);$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.filter;$$('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));filter()}));$('#reset-filters').addEventListener('click',()=>{$('#search').value='';$('[data-filter="all"]').click();$('#search').focus()});const id=new URLSearchParams(location.search).get('plataforma');if(byId(id))details(id)}
$$('[data-rail]').forEach(b=>b.addEventListener('click',()=>$('.discovery-rail').scrollBy({left:Number(b.dataset.rail)*300,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('motion-paused')?'instant':'smooth'})));
function renderSelection(){storage.set('orbita-selection',JSON.stringify([...selected]));$$('input[name="platform"]').forEach(i=>i.checked=selected.has(i.value));const c=calculate([...selected]);$('#selected-list').innerHTML=c.list.length?c.list.map(p=>`<div class="selected-row"><span><img src="${p.icon}" alt="">${p.name}${p.id==='spotify'&&c.bonus?' (regalo)':''}</span><button data-remove="${p.id}" aria-label="Quitar ${p.name}">×</button></div>`).join(''):'<p class="muted">Elige una plataforma para empezar.</p>';$('#summary-totals').innerHTML=`<div class="summary-divider">${c.monthly?`<div class="total-row"><span>Plan mensual</span><strong>${money(c.monthly)} <small>/ mes</small></strong></div>`:''}${c.annual?'<div class="total-row"><span>Canva Pro anual</span><strong>$4.00 <small>/ año</small></strong></div>':''}${c.chatgpt?'<div class="total-row"><span>ChatGPT Plus (4 meses)</span><strong>$5.00 <small>/ 4 meses</small></strong></div>':''}<div class="total-row"><span>Total inicial</span><strong>${money(c.total)}</strong></div>${c.savings?`<p class="fine-print">Ahorras ${money(c.savings)} al mes con tu combo.</p>`:''}${c.bonus?'<p class="bonus">♫ Spotify incluido de regalo por 1 mes.</p>':''}</div>`;$('#order').disabled=!c.list.length;$$('[data-remove]').forEach(b=>b.addEventListener('click',()=>{selected.delete(b.dataset.remove);renderSelection();$('#summary-title').setAttribute('tabindex','-1');$('#summary-title').focus()}))}
if($('#order')){const params=new URLSearchParams(location.search);if(params.has('apps'))selected=new Set(params.get('apps').split(',').filter(id=>byId(id)));const legacy={cine:['netflix','hbomax'],total:['netflix','spotify'],trio:['netflix','disneyplus','hbomax']};if(legacy[params.get('combo')])selected=new Set(legacy[params.get('combo')]);$$('input[name="platform"]').forEach(i=>i.addEventListener('change',()=>{i.checked?selected.add(i.value):selected.delete(i.value);renderSelection()}));$('#clear-selection').addEventListener('click',()=>{selected.clear();renderSelection()});$$('[data-preset]').forEach(b=>b.addEventListener('click',()=>{selected=new Set(b.dataset.preset.split(','));renderSelection();toast('Combo seleccionado. Puedes personalizarlo.')}));$('#order').addEventListener('click',()=>{if(selected.size)window.open(wa(orderMessage([...selected])),'_blank','noopener,noreferrer')});renderSelection()}

})();
