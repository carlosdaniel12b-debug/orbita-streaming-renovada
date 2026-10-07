/* Native view timelines provide optional depth without scroll interception. */
(() => {
 'use strict';
 const hero=document.querySelector('.kinetic-hero');
 if(!hero)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const sync=()=>hero.classList.toggle('kinetic-motion',!reduce.matches&&!document.documentElement.classList.contains('motion-paused'));
 reduce.addEventListener('change',sync);
 new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
 sync();
})();
