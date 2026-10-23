/* Intro never waits for CSS animation events to release the page. */
(()=>{'use strict';
const dialog=document.getElementById('welcome');if(!dialog)return;
const reduce=matchMedia('(prefers-reduced-motion:reduce)');let timer,exitTimer,safetyTimer,previous;
function releaseGuard(){document.documentElement.classList.remove('welcome-pending');}
function finish(){
 clearTimeout(timer);clearTimeout(exitTimer);clearTimeout(safetyTimer);clearTimeout(window.orbitaWelcomeFallback);releaseGuard();
 if(dialog.open){try{dialog.close();}catch(e){dialog.removeAttribute('open');}}
 dialog.classList.remove('welcome-leaving');
}
function close(){if(!dialog.open)return finish();clearTimeout(timer);if(reduce.matches)return finish();dialog.classList.add('welcome-leaving');clearTimeout(exitTimer);exitTimer=setTimeout(finish,180);}
function open(){
 if(dialog.open)return;previous=document.activeElement;dialog.classList.remove('welcome-leaving');
 // Arm recovery before attempting any dialog or animation work.
 safetyTimer=setTimeout(finish,2400);
 try{dialog.showModal();}catch(e){finish();return;}
 releaseGuard();timer=setTimeout(close,1400);
}
dialog.addEventListener('close',()=>{clearTimeout(timer);clearTimeout(exitTimer);clearTimeout(safetyTimer);clearTimeout(window.orbitaWelcomeFallback);releaseGuard();(previous&&previous!==document.body?previous:document.getElementById('hero-main-cta'))?.focus({preventScroll:true});});
dialog.addEventListener('cancel',event=>{event.preventDefault();finish();});
document.getElementById('welcome-skip')?.addEventListener('click',finish);
document.addEventListener('DOMContentLoaded',()=>{document.getElementById('welcome-replay')?.addEventListener('click',open);},{once:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden)finish();});
addEventListener('pagehide',finish);addEventListener('pageshow',()=>{if(!dialog.open)releaseGuard();});reduce.addEventListener?.('change',()=>{if(reduce.matches)finish();});
let seen=false;try{seen=sessionStorage.getItem('orbita-brand-intro-seen')==='1';sessionStorage.setItem('orbita-brand-intro-seen','1');}catch{seen=true;}
if(!seen&&!reduce.matches&&!location.hash)open();else finish();
})();
