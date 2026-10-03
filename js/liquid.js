/* Órbita — Liquid Glass Engine & Native App Motion Experience */
(()=>{'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],lib=window.ORBIT_LIBRARY||[];

// 1. Atmósfera Cósmica & Caústicas de Cristal Líquido Dinámico
if(!document.querySelector('.liquid-atmosphere')){
  const atmosphere=document.createElement('div');
  atmosphere.className='liquid-atmosphere';
  atmosphere.setAttribute('aria-hidden','true');
  atmosphere.innerHTML='<div class="liquid-caustic caustic-1"></div><div class="liquid-caustic caustic-2"></div><div class="liquid-caustic caustic-3"></div>';
  document.body.prepend(atmosphere);
}

// 2. Gestión de Métodos de Pago: Solo Ecuador, PayPal y Binance
const paymentLabels={
  transferencia:'Transferencia bancaria en Ecuador (Pichincha, Guayaquil, Produbanco, Deuna)',
  paypal:'PayPal (Tarjetas internacionales USD o saldo PayPal)',
  binance:'Binance Pay / USDT (TRC20, BEP20 sin comisiones)'
};

let payment='transferencia';
try{
  const saved=localStorage.getItem('orbita-payment');
  if(paymentLabels[saved]) payment=saved;
}catch{}

window.OrbitaPayments={
  get:()=>payment,
  label:()=>paymentLabels[payment]||paymentLabels.transferencia,
  methods:()=>Object.keys(paymentLabels)
};

// Escuchar cambios de pago en combos.html o modales
function syncPaymentInputs(){
  document.querySelectorAll('input[name="payment"]').forEach(input=>{
    input.checked=(input.value===payment);
    input.onchange=()=>{
      payment=input.value;
      try{localStorage.setItem('orbita-payment',payment);}catch{}
      document.querySelectorAll('.payment-option').forEach(opt=>{
        const inp=opt.querySelector('input');
        opt.classList.toggle('is-selected',inp?.checked);
      });
    };
  });
}
syncPaymentInputs();

// 3. Efectos de Reflejo Especular y Cristal Líquido Interactivo al mover puntero o táctil
const fine=matchMedia('(hover:hover) and (pointer:fine)'),reduce=matchMedia('(prefers-reduced-motion:reduce)');
function setupLiquidReflection(){
  const cards=$$('.platform-card,.plan-glass,.order-summary,.service-glass,.descubre-card,.pick-card,.feature-card-glass');
  cards.forEach(card=>{
    let frame=0;
    card.addEventListener('pointermove',e=>{
      if(reduce.matches||document.documentElement.classList.contains('motion-paused')||frame)return;
      const x=e.clientX,y=e.clientY;
      frame=requestAnimationFrame(()=>{
        const r=card.getBoundingClientRect();
        card.style.setProperty('--light-x',((x-r.left)/r.width*100)+'%');
        card.style.setProperty('--light-y',((y-r.top)/r.height*100)+'%');
        frame=0;
      });
    },{passive:true});
    card.addEventListener('pointerleave',()=>{
      card.style.removeProperty('--light-x');
      card.style.removeProperty('--light-y');
    });
  });
}
setupLiquidReflection();

// 4. Mini Reproductor Flotante de Cristal Líquido (Mini Cortos / Tráilers)
const player=document.createElement('aside');
player.className='mini-trailer liquid-glass';
player.hidden=true;
player.setAttribute('role','dialog');
player.setAttribute('aria-modal','true');
player.setAttribute('aria-labelledby','mini-trailer-title');

player.innerHTML=`
  <div class="mini-trailer-backdrop" data-trailer-close></div>
  <div class="mini-trailer-sheet">
    <div class="mini-trailer-pull-indicator" aria-hidden="true"></div>
    <div class="mini-trailer-head">
      <div class="mini-trailer-meta">
        <span class="mini-trailer-badge" id="mini-trailer-badge">Corto oficial</span>
        <h2 id="mini-trailer-title">Avance</h2>
        <span class="mini-trailer-platform" id="mini-trailer-platform"></span>
      </div>
      <button type="button" class="mini-trailer-close" aria-label="Cerrar tráiler" data-trailer-close>×</button>
    </div>
    <div class="mini-trailer-screen">
      <div class="mini-trailer-loading"><span class="liquid-spinner"></span> Preparando mini corto…</div>
    </div>
    <div class="mini-trailer-foot">
      <span class="mini-trailer-note" id="mini-trailer-channel">Reproducción optimizada</span>
      <div class="mini-trailer-actions">
        <button type="button" class="mini-trailer-unmute" id="mini-trailer-unmute">🔊 Activar sonido</button>
        <a id="mini-trailer-yt" target="_blank" rel="noopener noreferrer" class="mini-trailer-link">Ver en YouTube ↗</a>
      </div>
    </div>
  </div>
`;
document.body.append(player);

let returnFocus=null;
let activeIframe=null;
let currentVideoId=null;

const closePlayer=()=>{
  player.hidden=true;
  player.classList.remove('is-active');
  const screen=player.querySelector('.mini-trailer-screen');
  if(screen) screen.replaceChildren();
  activeIframe=null;
  currentVideoId=null;
  document.body.classList.remove('preview-open');
  if(returnFocus?.isConnected) returnFocus.focus({preventScroll:true});
};

player.querySelectorAll('[data-trailer-close]').forEach(el=>el.addEventListener('click',closePlayer));
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&!player.hidden){
    e.preventDefault();
    closePlayer();
  }
});

// Mapeo amigable de plataformas a tráilers destacados si se pide la plataforma directamente
const platformFeaturedTrailers={
  netflix:{id:'s66998',title:'PLUTO (Anime)',platform:'Netflix',badge:'Anime · Ciencia Ficción'},
  disneyplus:{id:'s52341',title:'Andor',platform:'Disney+',badge:'Serie · Aventura'},
  hbomax:{id:'s46562',title:'The Last of Us',platform:'Max',badge:'Serie · Drama & Acción'},
  primevideo:{id:'m_bladerunner2049',title:'Blade Runner 2049',platform:'Prime Video',badge:'Película · Ciencia Ficción'},
  paramount:{id:'s60550',title:'1923',platform:'Paramount+',badge:'Serie · Western'},
  vix:{id:'s74573',title:'El amor invencible',platform:'ViX',badge:'Novela · Romance'},
  appletv:{id:'s44933',title:'Severance',platform:'Apple TV+',badge:'Serie · Misterio'}
};

function preview(id,trigger){
  if(!id) return;
  returnFocus=trigger||document.activeElement;
  const openDialog=document.querySelector('dialog[open]');
  if(openDialog&&openDialog.id!=='details') openDialog.close();

  let targetId=id;
  let customTitle='', customPlatform='', customBadge='';

  if(platformFeaturedTrailers[id]){
    const feat=platformFeaturedTrailers[id];
    targetId=feat.id;
    customTitle=feat.title;
    customPlatform=feat.platform;
    customBadge=feat.badge;
  }

  const m=lib.find(x=>x.id===targetId||x.title.toLowerCase()===targetId.toLowerCase());
  const trailer=window.ORBIT_TRAILERS?.[targetId]||window.ORBIT_TRAILERS?.[m?.id];

  const titleEl=$('#mini-trailer-title');
  const badgeEl=$('#mini-trailer-badge');
  const platEl=$('#mini-trailer-platform');
  const noteEl=$('#mini-trailer-channel');
  const ytLink=$('#mini-trailer-yt');
  const unmuteBtn=$('#mini-trailer-unmute');
  const screen=$('.mini-trailer-screen');

  const titleText=customTitle||m?.title||trailer?.title||'Mini Tráiler';
  titleEl.textContent=titleText;

  // Clasificación de formato: Anime, Novela, Serie, Película
  let formatBadge=customBadge;
  if(!formatBadge&&m){
    const g=m.genre||'';
    const isAnime=g.toLowerCase().includes('anime')||m.type==='Anime'||m.title==='PLUTO'||m.title==='Arcane';
    const isNovela=g.toLowerCase().includes('novela')||g.toLowerCase().includes('telenovela')||m.type==='Novela';
    if(isAnime) formatBadge='Anime Destacado';
    else if(isNovela) formatBadge='Telenovela';
    else formatBadge=m.type==='Serie'?'Serie':'Película';
  }
  badgeEl.textContent=formatBadge||'Mini Corto Oficial';

  const platName=customPlatform||(m?.platform?(m.platform.toUpperCase()):'Streaming');
  platEl.textContent=platName;

  screen.replaceChildren();

  if(trailer&&trailer.video){
    currentVideoId=trailer.video;
    ytLink.href=trailer.url||`https://www.youtube.com/watch?v=${trailer.video}`;
    ytLink.style.display='inline-flex';
    noteEl.textContent=trailer.channel?`Canal oficial · ${trailer.channel}`:'Canal verificado';

    // Crear iframe con YouTube sin cookies y con reproducción optimizada
    const iframe=document.createElement('iframe');
    iframe.src=`https://www.youtube-nocookie.com/embed/${trailer.video}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`;
    iframe.title='Tráiler oficial de '+titleText;
    iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen=true;
    iframe.referrerPolicy='strict-origin-when-cross-origin';
    activeIframe=iframe;

    screen.append(iframe);

    // Botón para recargar con sonido si el usuario lo solicita
    unmuteBtn.style.display='inline-flex';
    unmuteBtn.onclick=()=>{
      iframe.src=`https://www.youtube-nocookie.com/embed/${trailer.video}?autoplay=1&mute=0&playsinline=1&rel=0&modestbranding=1`;
      unmuteBtn.style.display='none';
    };
  }else{
    const fallbackBox=document.createElement('div');
    fallbackBox.className='mini-trailer-fallback';
    fallbackBox.innerHTML=`<p>Buscando el mejor tráiler oficial para <strong>${titleText}</strong>.</p>`;
    screen.append(fallbackBox);
    ytLink.href=`https://www.youtube.com/results?search_query=${encodeURIComponent(titleText+' trailer oficial')}`;
    ytLink.textContent='Buscar en YouTube ↗';
    unmuteBtn.style.display='none';
    noteEl.textContent='Consulta directa';
  }

  player.hidden=false;
  requestAnimationFrame(()=>{
    player.classList.add('is-active');
  });
  document.body.classList.add('preview-open');
  $('.mini-trailer-close')?.focus({preventScroll:true});
}

// Delegación global para botones con [data-trailer]
document.addEventListener('click',e=>{
  const trigger=e.target.closest('[data-trailer]');
  if(!trigger) return;
  e.preventDefault();
  e.stopPropagation();
  preview(trigger.dataset.trailer,trigger);
},true);

// 5. Soporte para simulación de audio en tarjeta Spotify
document.addEventListener('click',e=>{
  const audioTrigger=e.target.closest('[data-audio-demo]');
  if(!audioTrigger) return;
  e.preventDefault();
  const bars=audioTrigger.closest('.service-spotify')?.querySelectorAll('.service-wave i');
  if(bars){
    bars.forEach(b=>{
      b.style.animationDuration=(0.4+Math.random()*0.6)+'s';
      b.classList.toggle('is-dancing');
    });
  }
});

// 6. Enriquecimiento de Tarjetas de Catálogo (Botón Corto, Spotify Hi-Fi, Canva Pro, ChatGPT Plus)
function enhanceCatalogCards(){
  const cards=$$('.catalog-grid .platform-card');
  if(!cards.length) return;

  cards.forEach(card=>{
    const cat=card.dataset.category||'';
    const name=(card.dataset.name||'').toLowerCase();
    const bottom=card.querySelector('.platform-bottom');
    if(!bottom) return;

    let actions=bottom.querySelector('.platform-actions');
    const roundBtn=bottom.querySelector('.round-button');
    if(!actions&&roundBtn){
      actions=document.createElement('div');
      actions.className='platform-actions';
      roundBtn.parentNode.insertBefore(actions,roundBtn);
      actions.appendChild(roundBtn);
    }

    if(cat==='cinema'){
      const platKey=name.replace(/\+/g,'plus').replace(/\s+/g,'');
      const mappedId=platKey==='primevideo'?'primevideo':
                     platKey==='disneyplus'?'disneyplus':
                     platKey==='max'?'hbomax':
                     platKey==='paramountplus'?'paramount':
                     platKey==='vix'?'vix':
                     platKey==='appletvplus'?'appletv':'netflix';

      if(actions&&!actions.querySelector('.platform-trailer-btn')){
        const btn=document.createElement('button');
        btn.type='button';
        btn.className='platform-trailer-btn';
        btn.dataset.trailer=mappedId;
        btn.setAttribute('aria-label',`Ver mini corto de ${card.querySelector('h3')?.textContent||name}`);
        btn.innerHTML='<span aria-hidden="true">▶</span> Corto';
        actions.insertBefore(btn,roundBtn);
      }
    }

    if(name.includes('spotify')){
      card.classList.add('service-spotify');
      if(!card.querySelector('.service-wave')){
        const wave=document.createElement('div');
        wave.className='service-wave';
        wave.setAttribute('aria-hidden','true');
        wave.style.cssText='height:36px;margin:10px 0 14px;gap:4px;display:flex;align-items:flex-end;';
        wave.innerHTML=`
          <i style="--bar:14px"></i><i style="--bar:24px"></i><i style="--bar:34px"></i>
          <i style="--bar:20px"></i><i style="--bar:38px"></i><i style="--bar:28px"></i>
          <i style="--bar:18px"></i><i style="--bar:32px"></i><i style="--bar:22px"></i>
        `;
        const p=card.querySelector('p');
        if(p) p.after(wave);
      }
      const tag=card.querySelector('.tag');
      if(tag&&!tag.textContent.includes('Hi-Fi')){
        tag.textContent='Música · Hi-Fi Lossless';
        tag.style.background='rgba(29, 185, 84, 0.18)';
        tag.style.color='#0e7033';
        tag.style.borderColor='rgba(29, 185, 84, 0.35)';
      }
    }

    if(name.includes('canva')){
      card.classList.add('service-canva');
      if(!card.querySelector('.service-colors')){
        const colors=document.createElement('div');
        colors.className='service-colors';
        colors.setAttribute('aria-hidden','true');
        colors.style.cssText='height:36px;margin:10px 0 14px;display:flex;align-items:center;';
        colors.innerHTML=`
          <span style="width:32px;height:32px;border-radius:10px;display:inline-block;"></span>
          <span style="width:32px;height:32px;border-radius:10px;margin-left:-10px;display:inline-block;"></span>
          <span style="width:32px;height:32px;border-radius:10px;margin-left:-10px;display:inline-block;"></span>
        `;
        const p=card.querySelector('p');
        if(p) p.after(colors);
      }
      const tag=card.querySelector('.tag');
      if(tag&&!tag.textContent.includes('Pro VIP')){
        tag.textContent='Diseño & Kit Pro';
        tag.style.background='rgba(125, 42, 232, 0.18)';
        tag.style.color='#6119b3';
        tag.style.borderColor='rgba(125, 42, 232, 0.35)';
      }
    }

    if(name.includes('chatgpt')){
      card.classList.add('service-chatgpt');
      if(!card.querySelector('.service-prompt')){
        const prompt=document.createElement('div');
        prompt.className='service-prompt';
        prompt.style.cssText='margin:10px 0 14px;padding:8px 12px;font-size:11.5px;border-radius:14px;display:flex;align-items:center;gap:8px;';
        prompt.innerHTML='<span class="service-prompt-orb"></span> GPT-4o, DALL·E 3 & Canvas';
        const p=card.querySelector('p');
        if(p) p.after(prompt);
      }
      const tag=card.querySelector('.tag');
      if(tag&&!tag.textContent.includes('GPT-4o')){
        tag.textContent='IA Avanzada · GPT-4o';
        tag.style.background='rgba(16, 163, 127, 0.18)';
        tag.style.color='#0b785d';
        tag.style.borderColor='rgba(16, 163, 127, 0.35)';
      }
    }
  });
}
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',enhanceCatalogCards);
}else{
  enhanceCatalogCards();
}

// 7. Sincronización del muelle móvil nativo (Tab Bar)
function updateMobileDock(){
  const path=location.pathname.split('/').pop()||'index.html';
  $$('.mobile-dock a').forEach(a=>{
    const href=a.getAttribute('href');
    const isCurrent=(href===path)||(path===''&&href==='index.html')||(path==='index.html'&&href==='index.html');
    if(isCurrent){
      a.setAttribute('aria-current','page');
    }else{
      a.removeAttribute('aria-current');
    }
  });
}
updateMobileDock();

window.OrbitaPreview={open:preview,close:closePlayer};

})();
