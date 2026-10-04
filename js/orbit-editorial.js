/* Recommendations stay in this browser. No model, account or network request. */
(() => {
 'use strict';
 const library=window.ORBIT_LIBRARY||[],platforms=window.ORBITA?.platforms||[];
 const displayPlatform=id=>platforms.find(p=>p.id===id)?.name||id;
 const grid=document.querySelector('#orbit-pick-grid');
 if(!grid)return;
 const types={all:null,movie:'Película',series:'Serie',anime:'Anime',novela:'Novela'};
 let mood='all',seen=[];
 const initial=['s41414','m_nimona','s48830'];
 function render(first=false){
  const pool=library.filter(m=>!types[mood]||m.type===types[mood]);
  let available=pool.filter(m=>!seen.includes(m.id));
  if(available.length<3)available=pool;
  for(let i=available.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[available[i],available[j]]=[available[j],available[i]];}
  const selected=first?initial.map(id=>library.find(m=>m.id===id)).filter(Boolean):available.slice(0,3);
  seen=[...seen,...selected.map(m=>m.id)].slice(-9);
  grid.replaceChildren(...selected.map(m=>{
   const a=document.createElement('a');a.className='orbit-pick-card';a.href='descubre.html?q='+encodeURIComponent(m.title);
   const cover=document.createElement('div');cover.className='orbit-pick-cover';
   const img=document.createElement('img');img.src=m.image;img.alt='';img.width=400;img.height=280;img.loading='lazy';img.decoding='async';
   const label=document.createElement('span');label.textContent=displayPlatform(m.platform)+' · '+m.type;cover.append(img,label);
   const title=document.createElement('h3');title.textContent=m.title;
   const text=document.createElement('p');text.textContent=m.esSummary||m.summary;
   const meta=document.createElement('small');meta.textContent=m.genre.split(',').join(' · ')+' · '+m.year;
   a.append(cover,title,text,meta);return a;
  }));
  if(!first)document.querySelector('#orbit-pick-status').textContent='Tres recomendaciones: '+selected.map(m=>m.title).join(', ')+'.';
 }
 document.querySelectorAll('[data-orbit-mood]').forEach(button=>button.addEventListener('click',()=>{
  mood=button.dataset.orbitMood;seen=[];
  document.querySelectorAll('[data-orbit-mood]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();
 }));
 document.querySelector('#orbit-refresh').addEventListener('click',()=>render());
 render(true);
})();
