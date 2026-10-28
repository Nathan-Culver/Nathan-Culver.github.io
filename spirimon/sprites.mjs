import {COLORS,hash,rng} from './engine.mjs';
const cache=new Map(),images=new Map();
export function shade(hex,n){const v=parseInt(hex.slice(1),16);return'#'+[v>>16,(v>>8)&255,v&255].map(x=>Math.max(0,Math.min(255,x+n)).toString(16).padStart(2,'0')).join('');}
function ellipse(c,x,y,rx,ry,color){c.fillStyle=color;for(let yy=-ry;yy<=ry;yy++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-yy*yy/(ry*ry))));c.fillRect(Math.round(x-w),Math.round(y+yy),w*2+1,1);}}
function poly(c,pts,color){c.fillStyle=color;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
export function spiritSprite(sp,form=0){const key=sp.id+':'+form;if(cache.has(key))return cache.get(key);const c=document.createElement('canvas');c.width=c.height=64;const p=c.getContext('2d');p.imageSmoothingEnabled=false;const r=rng(sp.identity),main=COLORS[sp.base],accent=COLORS[sp.alter],dark=shade(main,-65),light=shade(main,35);const growth=form*2+(sp.identity%3);const body=(x,y,rx,ry)=>{ellipse(p,x,y,rx+1,ry+1,'#152927');ellipse(p,x,y,rx,ry,dark);ellipse(p,x-1,y-2,rx-1,ry-2,main);ellipse(p,x-3,y-4,Math.max(2,rx-5),Math.max(2,ry-5),light);};const rect=(x,y,w,h,col)=>{p.fillStyle=col;p.fillRect(x,y,w,h);};const eye=(x,y)=>{rect(x,y,4,4,'#142a29');rect(x+1,y,3,2,'#f0e9ae');rect(x+2,y,1,2,'#fffbe1');};
ellipse(p,32,57,20+growth,3,'#162d2a');
if(['Beast','Monstrosity'].includes(sp.base)){
poly(p,[[39,37],[53,31],[58,16],[59,38],[51,46],[39,47]],dark);poly(p,[[45,36],[53,33],[56,23],[55,39],[48,43]],accent);
body(31,40,16+growth,10+growth);rect(19-growth,44,7,10,dark);rect(37+growth,44,7,10,dark);rect(17-growth,52,10,3,main);rect(36+growth,52,10,3,main);body(21,28,12+growth,11+growth);
poly(p,[[10,21],[12,7-growth],[22,19]],dark);poly(p,[[26,19],[34,10-growth],[32,28]],dark);poly(p,[[13,18],[14,12-growth],[19,19]],accent);poly(p,[[27,19],[31,15],[30,24]],accent);body(13,34,8,5);eye(17,25);rect(6,33,3,3,'#122321');rect(13,38,8,1,dark);
if(sp.body.includes('stag')||form>0){poly(p,[[15,13],[13,3],[11,3],[13,10],[8,7],[7,9],[14,15]],accent);poly(p,[[29,14],[34,3],[36,3],[34,10],[41,7],[41,10],[31,17]],accent);}
if(sp.base==='Monstrosity')poly(p,[[31,35],[39,12],[54,9],[45,26],[57,22],[46,38]],accent);
}else if(['Humanoid','Giant','Construct','Fiend'].includes(sp.base)){
const broad=sp.base==='Giant'?5:0;body(32,35,11+broad+growth,14);rect(21-broad,43,8,12,dark);rect(35+broad,43,8,12,dark);rect(18-broad,53,12,4,main);rect(34+broad,53,12,4,main);body(17-broad-growth,35,5,12);body(47+broad+growth,35,5,12);body(32,16,10+growth,10);eye(25,15);eye(35,15);
if(sp.base==='Construct'){rect(23,12,18,3,accent);rect(25,28,14,13,dark);rect(29,31,6,7,accent);rect(26,47,2,5,accent);rect(38,47,2,5,accent);}
if(sp.base==='Fiend'){poly(p,[[22,13],[18,1],[28,10]],accent);poly(p,[[37,9],[46,1],[43,17]],accent);poly(p,[[46,43],[57,44],[58,31],[62,35],[60,48],[46,48]],main);}
if(sp.base==='Giant'){rect(22,7,20,6,'#d6d2b3');rect(26,23,12,7,'#d6d2b3');rect(25,26,14,1,dark);}
}else if(sp.base==='Plant'){
poly(p,[[26,53],[23,40],[14,35],[12,29],[21,33],[28,40],[29,25],[36,24],[35,42],[46,33],[52,32],[49,40],[35,48],[37,56]],dark);
poly(p,[[15,48],[4,37],[17,35],[27,46]],accent);poly(p,[[38,47],[49,32],[61,34],[49,49]],main);body(32,23,17+growth,16+growth);ellipse(p,32,22,13+growth,9,dark);ellipse(p,32,22,10+growth,6,'#432e3f');for(let i=0;i<5;i++)poly(p,[[22+i*5,15],[24+i*5,21],[26+i*5,15]],'#e8dcb6');ellipse(p,24,13,4,3,light);eye(23,28);eye(37,28);rect(26,52,13,4,dark);
}else if(sp.base==='Ooze'){
body(32,44,23+growth,12+growth);body(30,32,17+growth,15);body(33,21,11,10);ellipse(p,23,28,6,7,light);eye(25,33);eye(38,34);rect(30,42,7,2,dark);ellipse(p,45,46,4,3,accent);ellipse(p,17,46,3,2,accent);
}else if(sp.base==='Aberration'){
for(let i=0;i<6;i++){const x=11+i*8;poly(p,[[x,35],[x-3,49],[x+1,55],[x+6,50],[x+4,46],[x+1,49],[x+2,35]],i%2?accent:dark);}
body(32,28,21+growth,17+growth);eye(19,23);eye(31,19);eye(42,28);eye(28,33);ellipse(p,39,16,4,3,accent);
}else if(sp.base==='Elemental'){
for(let i=0;i<5;i++){const x=14+i*8;poly(p,[[x-5,44],[x-1,18-Math.floor(r()*12)],[x+4,29],[x+8,7+i*2],[x+11,43]],i%2?accent:main);}
body(32,40,18+growth,12);ellipse(p,31,37,11,10,light);eye(23,34);eye(36,34);poly(p,[[26,51],[33,58],[40,50]],accent);
}else{
const isUndead=sp.base==='Undead';const wing=sp.base==='Celestial'?'#e6d8a0':accent;
for(const side of[-1,1]){poly(p,[[32+side*5,25],[32+side*24,10],[32+side*27,25],[32+side*12,39]],shade(wing,-30));poly(p,[[32+side*7,27],[32+side*23,17],[32+side*21,29],[32+side*10,36]],wing);}
body(32,36,12+growth,15+growth);body(32,21,11,10);eye(25,20);eye(35,20);if(isUndead){rect(27,27,10,4,dark);for(let i=0;i<3;i++)rect(28+i*3,27,1,4,light);poly(p,[[21,42],[16,55],[28,51],[32,58],[38,51],[48,54],[43,42]],main);}else{rect(27,48,4,7,dark);rect(35,48,4,7,dark);}if(sp.base==='Celestial'){ellipse(p,32,6,12+growth,3,accent);ellipse(p,32,6,9+growth,1,'#19372f');}
}
if(sp.alter==='Plant'){for(const[x,y]of[[19,20],[39,32],[45,42]]){poly(p,[[x,y],[x-7,y-7],[x+3,y-6],[x+5,y+2]],'#5e9b68');rect(x-2,y-5,2,4,'#a8cc80');}}
if(sp.alter==='Construct'){rect(18,33,10,5,accent);rect(37,42,7,7,accent);rect(19,34,2,2,'#d3e0cf');}
if(sp.alter==='Celestial'){ellipse(p,32,5,12,2,accent);}
if(sp.alter==='Fiend'||sp.alter==='Monstrosity'){poly(p,[[18,19],[15,6],[24,17]],accent);poly(p,[[39,16],[46,4],[44,23]],accent);}
if(sp.alter==='Undead'){rect(25,40,14,2,'#ddd9bc');rect(29,37,2,9,'#ddd9bc');}
if(sp.alter==='Fey'){poly(p,[[41,34],[55,18],[58,31],[45,42]],accent);rect(53,14,2,2,'#f9e3a3');}
if(sp.alter==='Elemental'){for(let i=0;i<5;i++){const x=13+Math.floor(r()*40),y=8+Math.floor(r()*36);rect(x,y,2,3,accent);}}
if(sp.alter==='Aberration'){eye(40,38);poly(p,[[45,42],[58,44],[60,52],[55,54],[54,50],[57,48],[45,47]],accent);}
if(sp.alter==='Ooze'){rect(18,44,3,9,accent);rect(42,42,4,10,accent);}
if(sp.alter==='Beast'){poly(p,[[14,21],[14,12],[20,19]],accent);}
if(sp.alter==='Humanoid'){rect(13,34,4,9,accent);rect(11,40,8,3,accent);}
if(sp.alter==='Giant'){rect(36,45,9,7,accent);}
if(form>0){rect(30,32,5,5,'#e6d492');rect(31,33,3,3,'#fff0b9');}
if(form===2){for(const[x,y]of[[8,20],[51,8],[54,43],[10,46]]){rect(x,y-2,1,5,accent);rect(x-2,y,5,1,accent);}}
if(sp.domains.length){ellipse(p,51,13,5,5,'#d7bb75');rect(50,9,2,8,'#fff1c0');rect(47,12,8,2,'#fff1c0');}
cache.set(key,c);return c;}
export function drawSpirit(ctx,sp,form,x,y,size=96,flip=false){
 ctx.save();ctx.imageSmoothingEnabled=false;let source=spiritSprite(sp,form),reference=false;
 const url=sp.portrait&&size>=80?sp.portrait:sp.sprites?.[form];
 if(url&&(/^data:image\/(png|webp);base64,/.test(url)||/^\.\/assets\/[a-z-]+\.webp$/.test(url))){
  if(!images.has(url)){const img=new Image();img.onload=()=>globalThis.spirimonArtLoaded?.();img.src=url;images.set(url,img);}
  const img=images.get(url);if(img.complete&&img.naturalWidth){source=img;reference=!!sp.portrait;}
 }
 const ratio=source.height/source.width,stageScale=reference?[.8,.9,1][form]:1;
 const w=size*stageScale,h=Math.min(size,w*ratio),dx=(size-w)/2,dy=size-h-4;
 if(reference)ctx.globalCompositeOperation='multiply';
 if(flip){ctx.translate(x+size,y);ctx.scale(-1,1);ctx.drawImage(source,dx,dy,w,h);}else ctx.drawImage(source,x+dx,y+dy,w,h);
 ctx.restore();
}
export function renderSpiritCanvases(root=document){root.querySelectorAll('canvas[data-species]').forEach(c=>{const sp=globalThis.spirimonSpecies?.[c.dataset.species];if(!sp)return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);drawSpirit(ctx,sp,Number(c.dataset.form)||0,0,0,c.width);});}
export function drawPerson(ctx,x,y,role='player',tick=0,face='down',moving=false){
 ctx.save();ctx.translate(Math.round(x),Math.round(y));const q=(a,b,w,h,col)=>{ctx.fillStyle=col;ctx.fillRect(a,b,w,h);};
 const step=moving?Math.round(Math.sin(tick/1000*Math.PI*4)*2):0;
 ellipse(ctx,16,29,9,3,'#355f4455');
 const coat={player:'#b94535',keeper:'#eee2bb',merchant:'#ba914f',rival:'#537994',scholar:'#8b7399'}[role],ink='#423e35';
 q(10,22,5,7+Math.max(0,step),'#424c52');q(18,22,5,7+Math.max(0,-step),'#424c52');q(9,28+step,7,3,ink);q(18,28-step,7,3,ink);
 q(9,13,15,11,ink);q(10,13,13,10,coat);q(7,15+step,4,9,coat);q(23,15-step,3,9,coat);
 q(10,23,13,2,'#d6be83');q(15,16,3,7,'#e8d9b4');q(17,14,2,6,'#e8d9b4');
 q(11,4,11,10,'#ecc99b');q(10,2,13,5,'#443b31');q(8,6,5,7,'#443b31');q(21,6,3,7,'#443b31');
 if(face!=='up'){if(face!=='right')q(14,9,2,2,ink);if(face!=='left')q(20,9,2,2,ink);}else q(12,6,10,6,'#443b31');
 if(role==='player'){q(9,4,15,3,'#a63d32');q(20,5,6,2,'#e0aa60');q(23,7,4,3,'#c64e36');q(23,20-step,3,2,'#6c8b78');}
 if(role==='merchant'){poly(ctx,[[2,8],[16,-1],[29,8]],'#b8995b');q(3,8,26,2,'#7b623d');}
 if(role==='keeper'){q(9,3,15,4,'#ded9b4');q(7,7,5,6,'#d8d1b1');}
 ctx.restore();
}
export function drawTile(ctx,type,x,y,seed,biome){const r=rng(seed);const q=(a,b,w,h,col)=>{ctx.fillStyle=col;ctx.fillRect(x+a,y+b,w,h);};const grass=biome==='ash'?'#b1ac73':biome==='fen'?'#7ca89a':biome==='highland'?'#abc77a':'#8bbd64';q(0,0,32,32,grass);for(let i=0;i<8;i++)q(Math.floor(r()*30),Math.floor(r()*30),2,1,r()<.5?'#a4cc76':'#75a756');
if(type==='path'){q(0,0,32,32,'#d7c391');q(0,1,32,2,'#e8d6a7');for(let i=0;i<7;i++)q(Math.floor(r()*30),Math.floor(r()*30),2+r()*3,1,'#b9ab85');}
if(type==='water'){q(0,0,32,32,'#4b9cba');q(0,4,32,2,'#6bbbd0');q(7,17,17,2,'#a1deed');q(2,26,13,1,'#639d94');q(21,9,9,1,'#9fbfac');}
if(type==='grass'){for(let i=0;i<6;i++){const a=2+Math.floor(r()*27),b=4+Math.floor(r()*23);q(a,b,2,7,'#3f6e3e');q(a-2,b+1,2,3,'#83a35b');q(a+2,b+2,2,4,'#91ab66');}}
if(type==='flower'){for(let i=0;i<3;i++){const a=3+Math.floor(r()*25),b=3+Math.floor(r()*23);q(a,b+3,1,5,'#3c724b');q(a-2,b,5,3,i%2?'#ded092':'#c6abaf');q(a,b+1,1,1,'#f2e3a9');}}
if(type==='tree'){q(12,17,8,15,'#594d36');q(15,18,3,13,'#756143');ellipse(ctx,x+16,y+27,14,4,'#426940');ellipse(ctx,x+16,y+14,16,14,'#316f43');ellipse(ctx,x+14,y+10,13,11,'#4c9550');ellipse(ctx,x+11,y+7,9,6,'#78b958');q(8,7,6,2,'#add776');q(21,18,6,2,'#244d39');}
if(type==='tree'&&seed%5===0){ellipse(ctx,x+16,y+14,16,13,'#c9798f');ellipse(ctx,x+14,y+10,14,10,'#efa3b1');ellipse(ctx,x+11,y+7,9,6,'#ffd0d2');q(6,6,4,2,'#ffe4d7');q(22,14,4,2,'#dc8b9d');}if(type==='tree'&&seed%7===0){q(0,0,32,29,grass);for(let j=0;j<3;j++){q(6+j*8,2+j*3,3,29-j*3,'#3e8b4b');for(let k=0;k<4;k++){q(5+j*8,5+k*7,5,1,'#a1c875');poly(ctx,[[x+6+j*8,y+8+k*6],[x+j*8,y+4+k*6],[x+4+j*8,y+12+k*6]],'#4c9951');}}}if(type==='rock'){ellipse(ctx,x+17,y+24,13,6,'#476648');poly(ctx,[[x+3,y+24],[x+7,y+12],[x+17,y+8],[x+27,y+15],[x+29,y+25]],'#7b8873');poly(ctx,[[x+7,y+12],[x+17,y+8],[x+23,y+14],[x+14,y+18],[x+5,y+22]],'#9ba28a');q(17,21,9,3,'#64745f');}
if(type==='well'){ellipse(ctx,x+16,y+27,15,4,'#4a6748');q(4,12,24,14,'#8b927d');q(7,14,18,7,'#365b58');q(2,10,28,5,'#b7b399');q(5,22,22,5,'#a6a68d');q(12,6,8,7,'#738b80');}
if(type==='guild'||type==='house'){q(0,0,32,32,'#7d7156');q(0,3,32,2,'#b7a27b');q(0,17,32,1,'#a3906c');q(0,30,32,2,'#544d3c');q(1,0,2,32,'#665a43');}
}

export function drawBuilding(ctx,x,y,guild=false){
 const q=(a,b,w,h,col)=>{ctx.fillStyle=col;ctx.fillRect(Math.round(x+a),Math.round(y+b),w,h);};
 const w=guild?160:128,roof=guild?'#476f77':'#a84c3d',roofLight=guild?'#739397':'#cf7050',timber='#633e2e';
 q(-2,94,w+4,11,'#8d8a73');q(2,47,w-4,48,'#f0dfb5');q(4,85,w-8,10,'#b99972');q(7,48,6,45,timber);q(w-13,48,6,45,timber);q(5,58,w-10,4,timber);q(5,91,w-10,4,timber);
 // Swept tiled eaves, timber rafters and layered ridge caps.
 poly(ctx,[[x-9,y+50],[x+4,y+46],[x+22,y+21],[x+w-22,y+21],[x+w-4,y+46],[x+w+9,y+50],[x+w+5,y+55],[x-5,y+55]],timber);
 poly(ctx,[[x-12,y+45],[x+3,y+45],[x+25,y+15],[x+w-25,y+15],[x+w-3,y+45],[x+w+12,y+45],[x+w+8,y+50],[x-8,y+50]],roof);
 q(24,12,w-48,5,roofLight);q(20,16,w-40,3,timber);
 for(let row=0;row<5;row++){const inset=22-row*5,yy=22+row*5;q(inset,yy,w-inset*2,2,roofLight);for(let col=inset+4;col<w-inset;col+=12)q(col,yy-3,1,4,'#253f433f');}
 q(-12,42,10,3,roofLight);q(w+2,42,10,3,roofLight);q(-14,37,4,8,roof);q(w+10,37,4,8,roof);
 if(guild){poly(ctx,[[x+34,y+23],[x+48,y+3],[x+w-48,y+3],[x+w-34,y+23]],roof);q(47,0,w-94,4,roofLight);q(36,23,w-72,4,timber);q(44,18,w-88,2,roofLight);q(w/2-12,30,24,18,'#e5c878');q(w/2-10,32,20,14,'#794534');q(w/2-2,35,4,8,'#e6c17c');}
 q(w/2-14,63,28,32,timber);q(w/2-11,66,22,29,'#3d4b3b');q(w/2-1,66,2,29,'#b88b55');
 for(const xx of[22,w-44]){q(xx,65,22,19,timber);q(xx+2,67,18,15,'#e6c581');q(xx+9,66,2,18,timber);q(xx,74,22,2,timber);}
 for(const xx of[12,w-23]){q(xx+4,54,2,9,timber);q(xx,62,11,14,'#a43f32');q(xx+2,64,7,10,'#dc6c43');q(xx+4,62,3,14,'#e6a75e');q(xx+4,76,2,6,'#b45435');}
 q(w/2-22,96,44,4,'#b7ac8c');q(w/2-27,100,54,4,'#d8c5a0');
}
export function drawTownDecor(ctx,x,y){
 const q=(a,b,w,h,col)=>{ctx.fillStyle=col;ctx.fillRect(Math.round(x+a),Math.round(y+b),w,h);};
 // Vermilion shrine gate, with upturned crossbeam ends.
 q(2,6,7,49,'#8b3c2c');q(54,6,7,49,'#8b3c2c');q(4,7,3,46,'#d36d45');q(56,7,3,46,'#d36d45');q(-4,6,72,6,'#b74b32');q(6,21,51,5,'#b74b32');q(-8,1,80,6,'#3f4d43');q(-10,-2,8,5,'#3f4d43');q(66,-2,8,5,'#3f4d43');q(29,11,6,10,'#e1c486');q(0,54,12,4,'#797d68');q(52,54,12,4,'#797d68');
}
