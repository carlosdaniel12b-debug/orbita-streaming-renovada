/* Shared chrome: immediate input, bounded motion, no dependency on animation completion. */
(()=>{'use strict';
 const header=document.querySelector('.header');
 let frame=0;
 const update=()=>{header?.classList.toggle('scrolled',scrollY>24);frame=0;};
 addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(update);},{passive:true});update();
 const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');
 const desktop=matchMedia('(min-width:901px)');
 desktop.addEventListener('change',()=>{if(desktop.matches&&nav?.classList.contains('open'))menu?.click();});
 document.querySelectorAll('.pearl-faq-list details').forEach(item=>item.addEventListener('toggle',()=>{if(item.open)document.querySelectorAll('.pearl-faq-list details[open]').forEach(other=>{if(other!==item)other.open=false;});}));
})();
