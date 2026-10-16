/* A short, optional welcome; native dialog handles focus and Escape. */
(()=>{'use strict';
const dialog=document.getElementById('welcome');if(!dialog)return;
const reduce=matchMedia('(prefers-reduced-motion:reduce)');let timer,previous;
function close(){clearTimeout(timer);if(dialog.open)dialog.close();}
function open(){if(dialog.open)return;previous=document.activeElement;dialog.showModal();timer=setTimeout(close,1100);}
dialog.addEventListener('close',()=>{clearTimeout(timer);(previous&&previous!==document.body?previous:document.getElementById('hero-main-cta'))?.focus({preventScroll:true});});
document.getElementById('welcome-skip').addEventListener('click',close);
document.getElementById('welcome-replay')?.addEventListener('click',open);
document.addEventListener('visibilitychange',()=>{if(document.hidden)close();});
addEventListener('pagehide',close);reduce.addEventListener('change',()=>{if(reduce.matches)close();});
let seen=false;try{seen=sessionStorage.getItem('orbita-welcome-seen')==='1';sessionStorage.setItem('orbita-welcome-seen','1');}catch{seen=true;}
if(!seen&&!reduce.matches&&!location.hash)open();
})();
