const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const source=fs.readFileSync(require('node:path').join(__dirname,'../js/portal.js'),'utf8');
function setup({reduced=false,paused=false,seen=false,storageBlocked=false}={}){
 let now=0,id=0;const timers=new Map();const listeners={};
 function el(){const e={hidden:false,inert:false,isConnected:true,tagName:'DIV',listeners:{},className:''};e.classList={contains:c=>e.className.split(' ').includes(c),add:(...cs)=>{e.className=[...new Set([...e.className.split(' '),...cs])].join(' ')},remove:(...cs)=>{e.className=e.className.split(' ').filter(c=>!cs.includes(c)).join(' ')}};e.addEventListener=(n,fn)=>e.listeners[n]=fn;e.focus=()=>doc.activeElement=e;return e;}
 const root=el(),body=el(),intro=el(),button=el(),main=el(),cta=el(),existing=el();existing.inert=true;
 const doc={documentElement:root,body,activeElement:body,hidden:false,getElementById:n=>n==='intro'?intro:cta,querySelectorAll:()=>[],addEventListener:(n,fn)=>listeners[n]=fn};body.children=[intro,main,existing];intro.querySelector=()=>button;intro.contains=e=>e===button;
 const media={matches:reduced,addEventListener:(n,fn)=>listeners.reduce=fn};const win={addEventListener:(n,fn)=>listeners[n]=fn};
 vm.runInNewContext(source,{window:win,document:doc,matchMedia:()=>media,sessionStorage:{getItem:()=>{if(storageBlocked)throw Error('blocked');return seen?'1':null},setItem:()=>{if(storageBlocked)throw Error('blocked');seen=true}},localStorage:{getItem:()=>paused?'paused':null},setTimeout:(fn,delay)=>{timers.set(++id,{at:now+delay,fn});return id},clearTimeout:id=>timers.delete(id)});
 function advance(ms){const end=now+ms;for(;;){const next=[...timers].sort((a,b)=>a[1].at-b[1].at)[0];if(!next||next[1].at>end)break;now=next[1].at;timers.delete(next[0]);next[1].fn()}now=end;}
 return {intro,main,existing,root,doc,win,listeners,button,advance};
}
test('auto-exits without Three.js, GSAP or animation callbacks',()=>{const x=setup();assert.equal(x.main.inert,true);x.advance(2600);assert.equal(x.intro.hidden,true);assert.equal(x.main.inert,false);assert.equal(x.existing.inert,true);assert.equal(x.root.classList.contains('intro-pending'),false)});
test('repeated close does not extend the exit deadline',()=>{const x=setup();x.win.OrbitaPortal.close();x.advance(300);x.win.OrbitaPortal.close();x.advance(350);assert.equal(x.intro.hidden,true)});
test('replay receives a fresh deadline and unlocks',()=>{const x=setup();x.advance(2600);x.win.OrbitaPortal.play();assert.equal(x.intro.hidden,false);x.advance(2600);assert.equal(x.main.inert,false)});
test('reduced motion and saved pause skip the portal',()=>{for(const options of [{reduced:true},{paused:true}]){const x=setup(options);assert.equal(x.intro.hidden,true);assert.equal(x.main.inert,false)}});
test('Escape exits and tab suspension unlocks immediately',()=>{const x=setup();x.listeners.keydown({key:'Escape',preventDefault(){}});x.advance(650);assert.equal(x.intro.hidden,true);x.win.OrbitaPortal.play();x.doc.hidden=true;x.listeners.visibilitychange();assert.equal(x.intro.hidden,true);assert.equal(x.main.inert,false)});

test('hero reveal waits until the portal has cleared',()=>{const x=setup();x.advance(1900);assert.equal(x.doc.body.classList.contains('arrival'),false);x.advance(650);assert.equal(x.intro.hidden,true);assert.equal(x.doc.body.classList.contains('arrival'),true)});

test('automatic intro is skipped on a returning session; explicit replay works',()=>{const x=setup({seen:true});assert.equal(x.intro.hidden,true);assert.equal(x.root.classList.contains('returning-visit'),true);x.win.OrbitaPortal.play();assert.equal(x.intro.hidden,false);assert.equal(x.root.classList.contains('returning-visit'),false);x.advance(2600);assert.equal(x.main.inert,false)});
test('blocked session storage cannot block entry',()=>{const x=setup({storageBlocked:true});x.advance(2600);assert.equal(x.intro.hidden,true);assert.equal(x.main.inert,false)});
