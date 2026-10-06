/**
 * ORBITA STREAMING — Fluid Orb WebGL
 * Animated WebGL orb with drifting fluid shading.
 * Inspired by swamimalode07/rare-ui/fluid-orb (rareui.com)
 * Implemented as vanilla WebGL — no React/npm required.
 *
 * Usage:
 *   <canvas class="fluid-orb"
 *     data-color1="#0a9a80"
 *     data-color2="#66518d"
 *     data-color3="#38bdf8"
 *     data-size="300">
 *   </canvas>
 */
(()=>{
  'use strict';

  const VERT=`attribute vec2 a_pos;void main(){gl_Position=vec4(a_pos,0.0,1.0);}`;

  const FRAG=`
precision highp float;
uniform float u_time;
uniform vec2  u_res;
uniform vec3  u_c1;
uniform vec3  u_c2;
uniform vec3  u_c3;
uniform float u_alpha;

float hash(vec2 p){p=fract(p*vec2(127.1,311.7));p+=dot(p,p+43.21);return fract(p.x*p.y);}

float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
}

float fbm(vec2 p){
  float v=0.0,a=0.5;
  mat2 R=mat2(cos(0.5),sin(0.5),-sin(0.5),cos(0.5));
  for(int i=0;i<5;i++){v+=a*noise(p);p=R*p*2.13;a*=0.47;}
  return v;
}

void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*u_res)/min(u_res.x,u_res.y);
  float r=length(uv);
  const float R=0.42;
  if(r>R+0.01){gl_FragColor=vec4(0.0);return;}

  float z=sqrt(max(0.0,R*R-r*r));
  vec3 N=normalize(vec3(uv,z));

  float theta=acos(clamp(N.z,-1.0,1.0));
  float phi=atan(N.y,N.x);
  vec2 suv=vec2(phi/6.28318+0.5,theta/3.14159);

  float t=u_time*0.22;
  vec2 q=vec2(fbm(suv*3.0+vec2(t*0.85,t*0.31)),fbm(suv*3.0+vec2(t*0.38,t*0.82)));
  vec2 s=vec2(fbm(suv*4.2+1.8*q+vec2(t*0.74,-t*0.42)),fbm(suv*4.2+1.8*q+vec2(-t*0.48,t*0.69)));
  float f=fbm(suv*3.6+1.9*s);

  vec3 col=mix(u_c1,u_c2,clamp(f+0.5*q.x,0.0,1.0));
  col=mix(col,u_c3,clamp(s.y*0.85+0.15,0.0,1.0));
  col=mix(col,u_c1*1.35,clamp(f*f*0.65,0.0,1.0));

  vec3 L=normalize(vec3(0.55,0.85,1.4));
  vec3 V=vec3(0.0,0.0,1.0);
  float diff=max(0.0,dot(N,L));
  vec3 H=normalize(L+V);
  float spec=pow(max(0.0,dot(N,H)),70.0);
  col=col*(0.28+0.72*diff)+vec3(0.96)*spec*0.5;

  float rim=1.0-dot(N,V);
  col+=u_c3*0.22*pow(rim,3.5);
  col+=u_c1*0.14*pow(max(0.0,1.0-r/R),4.5);

  float alpha=smoothstep(R+0.01,R-0.025,r)*u_alpha;
  gl_FragColor=vec4(col*alpha,alpha);
}
`;

  function hex2rgb(h){
    const n=parseInt((h||'#000000').replace('#',''),16);
    return [(n>>16&255)/255,(n>>8&255)/255,(n&255)/255];
  }

  function compile(gl,type,src){
    const s=gl.createShader(type);
    gl.shaderSource(s,src);gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){
      console.error('[FluidOrb] Shader:',gl.getShaderInfoLog(s));return null;
    }
    return s;
  }

  function createOrb(canvas,opts){
    opts=Object.assign({color1:'#0a9a80',color2:'#66518d',color3:'#38bdf8',size:300,speed:1,alpha:1},opts);
    const dpr=Math.min(window.devicePixelRatio||1,2);
    const S=opts.size;
    canvas.width=S*dpr;canvas.height=S*dpr;
    canvas.style.width=S+'px';canvas.style.height=S+'px';

    const gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:false,antialias:true});
    if(!gl){console.warn('[FluidOrb] WebGL unavailable');return null;}

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

    const vert=compile(gl,gl.VERTEX_SHADER,VERT);
    const frag=compile(gl,gl.FRAGMENT_SHADER,FRAG);
    if(!vert||!frag)return null;

    const prog=gl.createProgram();
    gl.attachShader(prog,vert);gl.attachShader(prog,frag);gl.linkProgram(prog);
    if(!gl.getProgramParameter(prog,gl.LINK_STATUS)){
      console.error('[FluidOrb] Link:',gl.getProgramInfoLog(prog));return null;
    }
    gl.useProgram(prog);

    const buf=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    const aPos=gl.getAttribLocation(prog,'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos,2,gl.FLOAT,false,0,0);

    const u={
      time:gl.getUniformLocation(prog,'u_time'),
      res:gl.getUniformLocation(prog,'u_res'),
      c1:gl.getUniformLocation(prog,'u_c1'),
      c2:gl.getUniformLocation(prog,'u_c2'),
      c3:gl.getUniformLocation(prog,'u_c3'),
      alpha:gl.getUniformLocation(prog,'u_alpha'),
    };
    gl.uniform2f(u.res,canvas.width,canvas.height);
    gl.uniform3fv(u.c1,hex2rgb(opts.color1));
    gl.uniform3fv(u.c2,hex2rgb(opts.color2));
    gl.uniform3fv(u.c3,hex2rgb(opts.color3));
    gl.uniform1f(u.alpha,opts.alpha);

    let rafId=null,startTs=null,timeOffset=0,paused=false,pausedAt=0,destroyed=false;
    const mq=matchMedia('(prefers-reduced-motion:reduce)');

    function frame(ts){
      if(destroyed)return;
      rafId=requestAnimationFrame(frame);
      if(paused)return;
      if(!startTs)startTs=ts;
      gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(u.time,((ts-startTs)/1000+timeOffset)*opts.speed);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    }
    function pause(){if(paused||destroyed)return;paused=true;pausedAt=performance.now();}
    function resume(){if(!paused||destroyed)return;timeOffset+=(performance.now()-pausedAt)/1000;startTs=null;paused=false;}
    function sync(){
      (mq.matches||document.documentElement.classList.contains('motion-paused'))?pause():resume();
    }
    mq.addEventListener('change',sync);
    new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
    document.addEventListener('visibilitychange',()=>{document.hidden?pause():resume();});
    new IntersectionObserver(entries=>{entries[0].isIntersecting?resume():pause();},{threshold:0.05}).observe(canvas);

    sync();
    rafId=requestAnimationFrame(frame);
    return{
      destroy(){destroyed=true;if(rafId)cancelAnimationFrame(rafId);},
      setAlpha(a){gl.useProgram(prog);gl.uniform1f(u.alpha,a);}
    };
  }

  function init(){
    document.querySelectorAll('canvas.fluid-orb').forEach(c=>{
      if(c._fluidOrb)return;
      const d=c.dataset;
      const inst=createOrb(c,{
        color1:d.color1||'#0a9a80',
        color2:d.color2||'#66518d',
        color3:d.color3||'#38bdf8',
        size:parseInt(d.size||'300',10),
        speed:parseFloat(d.speed||'1'),
        alpha:parseFloat(d.alpha||'1'),
      });
      if(inst)c._fluidOrb=inst;
    });
  }

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}
  else{init();}
  window.FluidOrb={mount:createOrb,init};
})();
