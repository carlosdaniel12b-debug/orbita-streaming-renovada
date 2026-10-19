/* One-shot vertical reveals; all content remains visible if JS or animation is unavailable. */
(()=>{'use strict';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(reduced.matches||!('IntersectionObserver' in window)||!Element.prototype.animate)return;
 const active=new Set();
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   observer.unobserve(entry.target);
   if(reduced.matches)return;
   const motion=entry.target.animate([{opacity:.35,translate:'0 22px'},{opacity:1,translate:'0 0'}],{duration:440,easing:'cubic-bezier(.2,.7,.25,1)'});
   active.add(motion);motion.finished.then(()=>active.delete(motion),()=>active.delete(motion));
  });
 },{threshold:.12,rootMargin:'0px 0px -24px 0px'});
 document.querySelectorAll('.pearl-section-head,.orbit-collection-copy,.service-glass,.platform-card,.pick-card,.device-note,.orbit-concierge,.combo-assurance').forEach(el=>{
  if(el.getBoundingClientRect().top>=innerHeight-32)observer.observe(el);
 });
 const stop=()=>{observer.disconnect();active.forEach(animation=>animation.cancel());active.clear();};
 reduced.addEventListener('change',event=>{if(event.matches)stop();});
 addEventListener('pagehide',stop,{once:true});
})();
