/* Deterministic, explainable recommendations. No remote model or secret keys. */
((root)=>{
 const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
 const genres=[['ciencia ficcion',/ciencia ficcion|sci fi|espacio|futur|robot/],['terror',/terror|horror|miedo/],['comedia',/comedia|reir|humor|divertid/],['romance',/romance|romantic|amor|pareja/],['misterio',/misterio|detective/],['suspenso',/suspenso|thriller/],['fantasia',/fantasia|magia|dragon/],['accion',/accion|pelea|superheroe/],['aventura',/aventura/],['drama',/drama/],['familia',/familia|ninos|infantil/]];
 const aliases={netflix:['netflix','netflis'],disneyplus:['disney','disney plus'],hbomax:['hbo','max'],primevideo:['prime','amazon'],appletv:['apple','apple tv'],paramount:['paramount'],vix:['vix']};
 function recommend(text,library,previous={}){
  const q=norm(text),again=/\botras?\b|\botros?\b|mas opciones|mas recomendaciones/.test(q);
  const platforms=Object.entries(aliases).filter(([,a])=>a.some(s=>(' '+q+' ').includes(' '+s+' '))).map(([id])=>id);
  const type=/anime/.test(q)?'Anime':/novela/.test(q)?'Novela':/pelicula/.test(q)?'Película':/serie/.test(q)?'Serie':null;
  const excluded=genres.filter(([g])=>new RegExp('(?:sin|no|evitar) '+g).test(q)).map(([g])=>g);
  const wanted=genres.filter(([g,re])=>re.test(q)&&!excluded.includes(g)).map(([g])=>g);
  const filters={platforms:platforms.length?platforms:(again?previous.filters?.platforms||[]:[]),type:type||(again?previous.filters?.type:null),genres:wanted.length?wanted:(again?previous.filters?.genres||[]:[]),excluded:excluded.length?excluded:(again?previous.filters?.excluded||[]:[])};
  const used=again?previous.seen||[]:[];
  const list=library.filter(m=>{
   const genre=norm(m.genre);
   return (!filters.platforms.length||filters.platforms.includes(m.platform))&&(!filters.type||m.type===filters.type)&&!filters.excluded.some(g=>genre.includes(g))&&(!filters.genres.length||filters.genres.some(g=>genre.includes(g)||(g==='misterio'&&genre.includes('suspenso'))||(g==='familia'&&genre.includes('familiar'))))&&!used.includes(m.id);
  });
  const results=list.slice(0,4);
  return {results,filters,seen:[...used,...results.map(m=>m.id)],remaining:Math.max(0,list.length-results.length)};
 }
 function findTitle(text,library){
  const q=norm(text).replace(/^(donde puedo ver|donde ver|quiero ver|buscame|busca|de que trata|hablame de) /,'');
  if(q.length<2)return [];
  const scored=library.map(m=>{let score=0;for(const alias of [m.title,m.original,...(m.aliases||[])]){const a=norm(alias);if(!a)continue;if(a===q)score=Math.max(score,1000+a.length);else if((' '+q+' ').includes(' '+a+' '))score=Math.max(score,100+a.length);else if(q.length>=4&&a.includes(q))score=Math.max(score,q.length);}return {m,score};}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
  return scored.filter(x=>x.score===scored[0]?.score).map(x=>x.m);
 }
 const api={norm,recommend,findTitle};if(typeof module!=='undefined')module.exports=api;else root.OrbitRecommendations=api;
})(typeof window==='undefined'?globalThis:window);
