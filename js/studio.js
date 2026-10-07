/* Complete poster artwork and semantic links; no continuous animation loop. */
(() => {
 'use strict';
 const grid=document.querySelector('#cinema-series-grid');
 if(!grid)return;
 const library=window.ORBIT_LIBRARY||[], platforms=window.ORBITA?.platforms||[];
 const titles=['Severance','Andor','Fallout','Arcane','The Last of Us','For All Mankind'];
 const selected=titles.map(title=>library.find(m=>m.title===title)).filter(Boolean);
 for(const m of selected){
  const link=document.createElement('a');link.className='orbit-pick-card';link.href='descubre.html?q='+encodeURIComponent(m.title);
  const cover=document.createElement('div');cover.className='orbit-pick-cover';
  const img=document.createElement('img');img.src=m.image;img.alt='';img.width=500;img.height=750;img.loading='lazy';img.decoding='async';cover.append(img);
  const title=document.createElement('h3');title.textContent=m.title;
  const meta=document.createElement('small');meta.textContent=(platforms.find(p=>p.id===m.platform)?.name||m.platform)+' · '+m.year;
  link.append(cover,title,meta);grid.append(link);
 }
})();
