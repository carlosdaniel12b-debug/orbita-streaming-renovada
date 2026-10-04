(()=>{'use strict';
const scene=document.querySelector('.hero-dimensional .cinematic-scene'),card=scene?.querySelector('.cinematic-stage');if(!card)return;
const desktop=matchMedia('(min-width:701px) and (hover:hover) and (pointer:fine)'),reduce=matchMedia('(prefers-reduced-motion:reduce)');let frame=0;
const reset=()=>{cancelAnimationFrame(frame);frame=0;card.style.removeProperty('transform');};
card.addEventListener('pointermove',event=>{if(!desktop.matches||reduce.matches||document.documentElement.classList.contains('motion-paused')||event.pointerType!=='mouse')return;
const b=card.getBoundingClientRect(),x=(event.clientX-b.left)/b.width-.5,y=(event.clientY-b.top)/b.height-.5;
if(!frame)frame=requestAnimationFrame(()=>{card.style.transform=`rotateY(${x*2}deg) rotateX(${-y*2}deg)`;frame=0;});},{passive:true});
card.addEventListener('pointerleave',reset);desktop.addEventListener('change',reset);reduce.addEventListener('change',reset);new MutationObserver(reset).observe(document.documentElement,{attributes:true,attributeFilter:['class']});document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();});
})();
