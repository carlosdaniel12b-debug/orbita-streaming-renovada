/* Inspired by Scroll World's section pacing and scroll-driven progress.
   This is an approved still-image adaptation, not its generated-video pipeline. */
(()=>{'use strict';
 const section=document.querySelector('.orbit-journey');if(!section)return;
 const root=document.documentElement,reduce=matchMedia('(prefers-reduced-motion:reduce)');
 const scenes=[...section.querySelectorAll('.journey-scene')],buttons=[...section.querySelectorAll('[data-journey-step]')];
 let frame=0,enabled=false,active=-1,visible=false;
 const clamp=(n,min=0,max=1)=>Math.min(max,Math.max(min,n));
 const smooth=n=>n*n*(3-2*n);
 function draw(){
  frame=0;if(!enabled||document.hidden)return;
  const rect=section.getBoundingClientRect(),stage=section.querySelector('.journey-stage');
  const distance=Math.max(1,rect.height-stage.clientHeight),progress=clamp(-rect.top/distance),position=progress*3;
  const current=Math.min(2,Math.floor(position)),paused=root.classList.contains('motion-paused');
  const blend=paused||current===2?0:smooth(clamp((position-current-.76)/.24));
  scenes.forEach((scene,i)=>{
   const opacity=i===current?1-blend:i===current+1?blend:0;
   scene.style.opacity=opacity;const selected=i===(blend>.5?Math.min(2,current+1):current);
   scene.style.pointerEvents=selected?'auto':'none';scene.inert=!selected;scene.setAttribute('aria-hidden',String(!selected));
   const local=clamp(position-i),img=scene.querySelector('img'),copy=scene.querySelector('.journey-copy');
   img.style.transform=paused?'none':`scale(${1.025+local*.1}) translate3d(${-local*1.7}%,${local*-1}%,0)`;
   copy.style.transform=paused?'none':`translate3d(0,${-local*16}px,0)`;
  });
  const next=blend>.5?Math.min(2,current+1):current;
  buttons.forEach((b,i)=>{b.setAttribute('aria-current',i===next?'step':'false');b.querySelector('i').style.transform=`scaleX(${clamp(position-i)})`;});
  active=next;
 }
 function request(){if(enabled&&!frame)frame=requestAnimationFrame(draw);}
 function mode(){
  enabled=!reduce.matches;section.classList.toggle('journey-enhanced',enabled);
  if(enabled){draw();}else{cancelAnimationFrame(frame);frame=0;scenes.forEach(s=>{s.inert=false;s.removeAttribute('aria-hidden');s.style.removeProperty('opacity');s.style.removeProperty('pointer-events');s.querySelector('img').style.removeProperty('transform');s.querySelector('.journey-copy').style.removeProperty('transform');});}
 }
 buttons.forEach((b,i)=>b.addEventListener('click',()=>{
  if(!enabled)return;const stage=section.querySelector('.journey-stage'),start=scrollY+section.getBoundingClientRect().top,span=section.offsetHeight-stage.clientHeight;
  scrollTo({top:start+span*((i+.18)/3),behavior:root.classList.contains('motion-paused')?'instant':'smooth'});
 }));
 // Prevent hidden-slide focus when a keyboard user jumps through controls.
 section.addEventListener('focusin',e=>{const scene=e.target.closest('.journey-scene');if(scene&&enabled){const i=scenes.indexOf(scene);if(i!==active)buttons[i].click();}});
 addEventListener('scroll',()=>{if(visible)request();},{passive:true});
 addEventListener('resize',request,{passive:true});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)request();},{rootMargin:'100px'}).observe(section);
 new MutationObserver(request).observe(root,{attributes:true,attributeFilter:['class']});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)request();});
 reduce.addEventListener('change',mode);addEventListener('pageshow',request);mode();
})();
