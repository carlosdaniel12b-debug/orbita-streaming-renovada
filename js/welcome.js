/* Native dialog retains keyboard focus; timers bound both entrance and exit. */
(()=>{'use strict';
const dialog=document.getElementById('welcome');if(!dialog)return;
const reduce=matchMedia('(prefers-reduced-motion:reduce)');let timer,exitTimer,previous;
function finish(){clearTimeout(timer);clearTimeout(exitTimer);if(dialog.open)dialog.close();dialog.classList.remove('welcome-leaving');}
function close(){clearTimeout(timer);if(!dialog.open||dialog.classList.contains('welcome-leaving'))return;if(reduce.matches)return finish();dialog.classList.add('welcome-leaving');exitTimer=setTimeout(finish,260);}
function open(){if(dialog.open)return;previous=document.activeElement;dialog.classList.remove('welcome-leaving');try{dialog.showModal();}catch(e){}document.documentElement.classList.remove('welcome-pending');clearTimeout(window.orbitaWelcomeFallback);timer=setTimeout(close,1800);}
dialog.addEventListener('close',()=>{clearTimeout(timer);clearTimeout(exitTimer);(previous&&previous!==document.body?previous:document.getElementById('hero-main-cta'))?.focus({preventScroll:true});});
dialog.addEventListener('cancel',event=>{event.preventDefault();finish();});
document.getElementById('welcome-skip')?.addEventListener('click',finish);
document.addEventListener('DOMContentLoaded',()=>{document.getElementById('welcome-replay')?.addEventListener('click',open);},{once:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden)finish();});
addEventListener('pagehide',finish);reduce.addEventListener('change',()=>{if(reduce.matches)finish();});
let seen=false;try{seen=sessionStorage.getItem('orbita-brand-intro-seen')==='1';sessionStorage.setItem('orbita-brand-intro-seen','1');}catch{seen=true;}
if(!seen&&!reduce.matches&&!location.hash)open();
else {document.documentElement.classList.remove('welcome-pending');clearTimeout(window.orbitaWelcomeFallback);}
})();
