const fs=require('node:fs'),path=require('node:path'),CleanCSS=require('clean-css');
const root=path.resolve(__dirname,'..');
const names=['styles','pearl','flows','binance','orbit-editorial','modern','renewal','typography','intro-cinematic','glass','liquid','mobile','mobile-refined'];
const css=names.map(name=>(name==='typography'?fs.readFileSync(path.join(root,'css',name+'.css'),'utf8'):fs.readFileSync(path.join(root,'css',name+'.css'),'utf8').replace(/@font-face\s*\{[^}]+\}/g,''))).join('\n');
const result=new CleanCSS({level:1,rebase:false}).minify(css);
if(result.errors.length)throw Error(result.errors.join('\n'));
fs.writeFileSync(path.join(root,'css/site.min.css'),result.styles);
console.log('Shared CSS: '+Buffer.byteLength(result.styles)+' bytes');
