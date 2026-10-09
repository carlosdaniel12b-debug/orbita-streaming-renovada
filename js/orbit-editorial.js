/* Recommendations stay in this browser. No model, account or network request. */
(() => {
 'use strict';
 const library=window.ORBIT_LIBRARY||[],platforms=window.ORBITA?.platforms||[];
 const displayPlatform=id=>platforms.find(p=>p.id===id)?.name||id;
 const grid=document.querySelector('#orbit-pick-grid');
 if(!grid)return;
 const types={all:null,movie:'Película',series:'Serie',anime:'Anime',novela:'Novela'};
 let mood='all',seen=['s41414','m_nimona','s48830'];
 const initial=['s41414','m_nimona','s48830'];

 function render(first=false){
  if(first && grid.children.length>=3){
   // Pre-rendered in HTML: instantly visible without JS wait time!
   return;
  }
  const currentLib = window.ORBIT_LIBRARY || library;
  const pool=currentLib.filter(m=>!types[mood]||m.type===types[mood]);
  let available=pool.filter(m=>!seen.includes(m.id));
  if(available.length<3)available=pool;
  for(let i=available.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[available[i],available[j]]=[available[j],available[i]];}
  const selected=(first && initial.length)?initial.map(id=>currentLib.find(m=>m.id===id)).filter(Boolean):available.slice(0,3);
  seen=[...seen,...selected.map(m=>m.id)].slice(-9);

  grid.style.opacity = '0.5';
  grid.style.transform = 'translateY(4px)';
  grid.style.transition = 'opacity 140ms ease-out, transform 140ms ease-out';

  setTimeout(() => {
   grid.replaceChildren(...selected.map((m, idx)=>{
    const a=document.createElement('a');a.className='orbit-pick-card';a.href='descubre.html?q='+encodeURIComponent(m.title);
    a.style.animation = `orbit-card-pop 320ms cubic-bezier(0.16, 1, 0.3, 1) ${idx * 60}ms both`;
    const cover=document.createElement('div');cover.className='orbit-pick-cover';
    const img=document.createElement('img');img.src=m.image;img.alt=m.title;img.width=400;img.height=280;img.loading='lazy';img.decoding='async';
    const label=document.createElement('span');label.textContent=displayPlatform(m.platform)+' · '+m.type;cover.append(img,label);
    const title=document.createElement('h3');title.textContent=m.title;
    const text=document.createElement('p');text.textContent=m.esSummary||m.summary;
    const meta=document.createElement('small');meta.textContent=m.genre.split(',').join(' · ')+' · '+m.year;
    a.append(cover,title,text,meta);return a;
   }));
   grid.style.opacity = '1';
   grid.style.transform = 'none';
   if(!first){
    const status = document.querySelector('#orbit-pick-status');
    if(status) status.textContent='Tres recomendaciones: '+selected.map(m=>m.title).join(', ')+'.';
   }
  }, 60);
 }

 document.querySelectorAll('[data-orbit-mood]').forEach(button=>button.addEventListener('click',()=>{
  mood=button.dataset.orbitMood;seen=[];
  document.querySelectorAll('[data-orbit-mood]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();
 }));
 document.querySelector('#orbit-refresh')?.addEventListener('click',()=>render());
 render(true);
})();
