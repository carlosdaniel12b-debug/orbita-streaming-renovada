/* Intro never waits for CSS animation events to release the page. */
(()=>{'use strict';
const dialog=document.getElementById('welcome');if(!dialog)return;
const reduce=matchMedia('(prefers-reduced-motion:reduce)');let timer,exitTimer,safetyTimer,previous,leaving=false;
function releaseGuard(){document.documentElement.classList.remove('welcome-pending');}
function finish(){
 clearTimeout(timer);clearTimeout(exitTimer);clearTimeout(safetyTimer);clearTimeout(window.orbitaWelcomeFallback);releaseGuard();
 if(dialog.open){try{dialog.close();}catch(e){dialog.removeAttribute('open');}}
 leaving=false;dialog.classList.remove('welcome-leaving');
}
function close(){if(!dialog.open)return finish();if(leaving)return;clearTimeout(timer);if(reduce.matches)return finish();leaving=true;releaseGuard();dialog.classList.add('welcome-leaving');exitTimer=setTimeout(finish,420);}
function open(){
 if(dialog.open)return;previous=document.activeElement;dialog.classList.remove('welcome-leaving');
 // Arm recovery before attempting any dialog or animation work.
 safetyTimer=setTimeout(finish,3200);
 try{dialog.showModal();}catch(e){finish();return;}
 releaseGuard();timer=setTimeout(close,2100);
}
dialog.addEventListener('close',()=>{clearTimeout(timer);clearTimeout(exitTimer);clearTimeout(safetyTimer);clearTimeout(window.orbitaWelcomeFallback);releaseGuard();(previous&&previous!==document.body?previous:document.getElementById('hero-main-cta'))?.focus({preventScroll:true});});
dialog.addEventListener('cancel',event=>{event.preventDefault();finish();});
document.getElementById('welcome-skip')?.addEventListener('click',close);
document.addEventListener('DOMContentLoaded',()=>{document.getElementById('welcome-replay')?.addEventListener('click',open);},{once:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden)finish();});
addEventListener('pagehide',finish);addEventListener('pageshow',()=>{if(!dialog.open)releaseGuard();});reduce.addEventListener?.('change',()=>{if(reduce.matches)finish();});
let seen=false;try{seen=sessionStorage.getItem('orbita-brand-intro-seen')==='1';sessionStorage.setItem('orbita-brand-intro-seen','1');}catch{seen=true;}
if(!seen&&!reduce.matches&&!location.hash)open();else finish();
})();
