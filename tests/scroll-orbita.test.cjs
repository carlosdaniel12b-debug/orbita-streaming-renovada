const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../js/scroll-orbita.js'),'utf8');
function setup(){
 let top=0;const classes=new Set(),events={},media={matches:false,addEventListener(_,fn){this.change=fn;}};
 const style=()=>({removeProperty(k){delete this[k];}});
 const scenes=Array.from({length:3},()=>{const img={style:style()},copy={style:style()};return {style:style(),inert:false,attrs:{},querySelector(s){return s==='img'?img:copy;},setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];}};});
 const buttons=scenes.map(()=>({attrs:{},bar:{style:style()},setAttribute(k,v){this.attrs[k]=v;},querySelector(){return this.bar;},addEventListener(_,f){this.click=f;}}));
 const section={classList:{toggle(){}},getBoundingClientRect:()=>({top,height:2400}),offsetHeight:2400,querySelector:()=>({clientHeight:800}),querySelectorAll:s=>s==='.journey-scene'?scenes:buttons,addEventListener(){}};
 const root={classList:{contains:k=>classes.has(k)}};
 vm.runInNewContext(source,{document:{querySelector:()=>section,documentElement:root,hidden:false,addEventListener(){}},matchMedia:()=>media,requestAnimationFrame:f=>{events.frame=f;return 1;},cancelAnimationFrame(){},IntersectionObserver:class{constructor(f){events.visibility=f;}observe(){}},MutationObserver:class{constructor(f){events.mutation=f;}observe(){}},addEventListener:(k,f)=>events[k]=f,scrollTo(){},scrollY:0});
 events.visibility([{isIntersecting:true}]);
 return {scenes,buttons,media,classes,at(p){top=-1600*p;events.scroll();events.frame?.();}};
}
test('scroll journey always paints a scene, including its final frame',()=>{const s=setup();for(const p of [0,.2,.29,.333,.6,.666,.9,1]){s.at(p);const visible=s.scenes.filter(x=>Number(x.style.opacity)>.01);assert(visible.length>0);assert.equal(s.scenes.filter(x=>x.attrs['aria-hidden']==='false').length,1);}assert.equal(s.scenes[2].style.opacity,1);});
test('reduced motion returns every scene to accessible static content',()=>{const s=setup();s.at(.5);s.media.matches=true;s.media.change();for(const scene of s.scenes){assert.equal(scene.inert,false);assert.equal(scene.attrs['aria-hidden'],undefined);assert.equal(scene.style.opacity,undefined);}});
test('motion pause removes image zoom while retaining scene navigation',()=>{const s=setup();s.classes.add('motion-paused');s.at(.7);assert.equal(s.scenes[2].querySelector('img').style.transform,'none');assert.equal(s.buttons[2].attrs['aria-current'],'step');});
