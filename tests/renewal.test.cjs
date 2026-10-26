const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');

test('all page assets and internal link fragments resolve',()=>{
  for(const file of ['index.html','catalogo.html','combos.html','descubre.html','legal.html']){
    const html=read(file);
    for(const match of html.matchAll(/(?:src|href|srcset)="([^"\s]+)"/g)){
      const url=match[1];
      if(/^(?:https?:|data:|mailto:|tel:)/.test(url))continue;
      const [pathname,fragment]=url.split('#');
      const target=decodeURIComponent(pathname.split('?')[0])||file;
      assert.ok(fs.existsSync(path.join(root,target)),`${file}: ${url}`);
      if(fragment&&target.endsWith('.html'))assert.ok(read(target).includes(`id="${fragment}"`),`${file}: missing ${url}`);
    }
    assert.equal((html.match(/rel="stylesheet"/g)||[]).length,1,`${file}: shared CSS only`);
  }
});

test('all 64 home selections agree with the checkout pricing and link',()=>{
  const base={window:{},document:{querySelector(){},querySelectorAll(){return [];}},localStorage:{getItem(){return null;}}};
  vm.runInNewContext(read('js/data.js'),base);
  vm.runInNewContext(read('js/app.js').split('function orderMessage(')[0]+'})();',base);
  const values=['paramount','hbomax','primevideo','appletv','spotify','canva'];
  const inputs=values.map(value=>({value,checked:false,addEventListener(_,fn){this.change=fn;}}));
  const nodes=Object.fromEntries(['calc-selection-count','calc-monthly-val','calc-initial-val','calc-plan-note','calc-whatsapp-cta'].map(id=>[id,{textContent:'',removeAttribute(){}}]));
  const box={querySelectorAll(){return inputs;},querySelector(s){return nodes[s.slice(1)];}};
  vm.runInNewContext(read('js/home-additions.js'),{window:base.window,document:{getElementById(){return box;},querySelectorAll(){return [];}}});
  for(let mask=0;mask<64;mask++){
    const ids=values.filter((_,i)=>mask&(1<<i));
    inputs.forEach(input=>input.checked=ids.includes(input.value));inputs[0].change();
    const quote=base.window.OrbitaPricing.calculate(ids);
    assert.equal(nodes['calc-initial-val'].textContent,'$'+quote.total.toFixed(2));
    assert.equal(nodes['calc-monthly-val'].textContent,'$'+quote.monthly.toFixed(2));
    const url=new URL(nodes['calc-whatsapp-cta'].href,'https://example.test/');
    assert.equal(url.searchParams.get('apps')||'',ids.join(','));
    if(ids.includes('canva'))assert.match(nodes['calc-plan-note'].textContent,/año/);
  }
  assert.equal(base.window.OrbitaPricing.calculate(['paramount','hbomax','spotify']).total,5);
  assert.equal(base.window.OrbitaPricing.calculate(['paramount','hbomax','canva']).total,9);
});

function welcome({seen=false,reduced=false}={}){
  const timers=new Map(),delays=new Map(),listeners={},docListeners={},rootClasses=new Set(['welcome-pending']);let id=0;
  const dialog={open:false,classList:{contains(){return false;},add(){},remove(){}},addEventListener(k,fn){listeners[k]=fn;},showModal(){this.open=true;},close(){this.open=false;listeners.close?.();}};
  const skip={addEventListener(_,fn){this.click=fn;}};
  const context={window:{},location:{hash:''},matchMedia(){return {matches:reduced,addEventListener(){}};},sessionStorage:{getItem(){return seen?'1':null;},setItem(){}},setTimeout(fn,ms){timers.set(++id,fn);delays.set(id,ms);return id;},clearTimeout(id){timers.delete(id);},addEventListener(){},document:{activeElement:null,body:{},hidden:false,documentElement:{classList:{remove(k){rootClasses.delete(k);}}},getElementById(k){return k==='welcome'?dialog:k==='welcome-skip'?skip:null;},addEventListener(k,fn){docListeners[k]=fn;}}};
  vm.runInNewContext(read('js/welcome.js'),context);
  return {dialog,timers,rootClasses,skip,listeners,run(ms){const key=[...timers.keys()].find(k=>delays.get(k)===ms);assert.ok(key,`Missing timer ${ms}`);const fn=timers.get(key);timers.delete(key);fn();}};
}
test('welcome opens synchronously before page content and always releases the guard',()=>{
  const html=read('index.html');
  assert.ok(html.indexOf('welcome-pending')<html.indexOf('<body'));
  assert.ok(html.indexOf('<script src="js/welcome.js')<html.indexOf('<main'));
  const first=welcome();assert.equal(first.dialog.open,true);assert.equal(first.rootClasses.size,0);
  first.skip.click();assert.equal(first.dialog.open,true);first.run(420);assert.equal(first.dialog.open,false);assert.equal(first.timers.size,0);
  const returning=welcome({seen:true});assert.equal(returning.dialog.open,false);assert.equal(returning.rootClasses.size,0);
  const reduced=welcome({reduced:true});assert.equal(reduced.dialog.open,false);assert.equal(reduced.rootClasses.size,0);
});
test('welcome Escape closes immediately and automatic deadline is bounded',()=>{
  const x=welcome();x.listeners.cancel({preventDefault(){}});assert.equal(x.dialog.open,false);
  const auto=welcome();auto.run(1400);auto.run(420);assert.equal(auto.dialog.open,false);
});

test('welcome safety deadline releases the page even if the normal close callback never runs',()=>{const x=welcome();x.run(2400);assert.equal(x.dialog.open,false);assert.equal(x.rootClasses.size,0);assert.equal(x.timers.size,0);});


test('repeated entry clicks do not extend the crossfade deadline',()=>{const x=welcome();x.skip.click();x.skip.click();x.run(420);assert.equal(x.dialog.open,false);assert.equal(x.timers.size,0);});
