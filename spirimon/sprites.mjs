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
export function drawSpirit(ctx,sp,form,x,y,size=96,flip=false){ctx.save();ctx.imageSmoothingEnabled=false;let source=spiritSprite(sp,form);const url=sp.sprites?.[form];if(url&&/^data:image\/png;base64,/.test(url)){if(!images.has(url)){const img=new Image();img.src=url;images.set(url,img);}const img=images.get(url);if(img.complete&&img.naturalWidth)source=img;}if(flip){ctx.translate(x+size,y);ctx.scale(-1,1);ctx.drawImage(source,0,0,size,size);}else ctx.drawImage(source,x,y,size,size);ctx.restore();}
export function renderSpiritCanvases(root=document){root.querySelectorAll('canvas[data-species]').forEach(c=>{const sp=globalThis.spirimonSpecies?.[c.dataset.species];if(!sp)return;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);drawSpirit(ctx,sp,Number(c.dataset.form)||0,0,0,c.width);});}
export function drawPerson(ctx,x,y,role='player',tick=0){ctx.save();ctx.translate(Math.round(x),Math.round(y));const q=(a,b,w,h,col)=>{ctx.fillStyle=col;ctx.fillRect(a,b,w,h);};ellipse(ctx,16,29,10,3,'#16342b');const coat={player:'#b9c4a3',keeper:'#d6b877',merchant:'#b8795f',rival:'#899dc2',scholar:'#b6a0bb'}[role];q(9,13,14,11,'#243930');q(10,13,12,10,coat);q(7,16,4,8,coat);q(22,16,4,8,coat);q(10,23,5,7,'#303d36');q(18,23,5,7,'#303d36');q(9,28,7,3,'#26382f');q(18,28,7,3,'#26382f');q(11,4,11,10,'#d7b78a');q(9,2,15,5,'#493d32');q(8,6,5,7,'#493d32');q(20,7,3,6,'#493d32');q(14,9,2,2,'#26362d');q(19,9,2,2,'#26362d');q(11,14,3,9,'#6b8b72');q(9,18,4,2,'#d8b985');q(11,23,12,2,'#826b49');if(role==='player'){q(20,16,3,2,'#d8b985');q(24,20,3,3,'#a2c6b1');}ctx.restore();}
export function drawTile(ctx,type,x,y,seed,biome){const r=rng(seed);const q=(a,b,w,h,col)=>{ctx.fillStyle=col;ctx.fillRect(x+a,y+b,w,h);};const grass=biome==='ash'?'#6c7250':biome==='fen'?'#4f7769':biome==='highland'?'#7a8d5e':'#638750';q(0,0,32,32,grass);for(let i=0;i<8;i++)q(Math.floor(r()*30),Math.floor(r()*30),2,1,r()<.5?'#769758':'#557b49');
if(type==='path'){q(0,0,32,32,'#b5a47b');q(0,1,32,2,'#c4b187');for(let i=0;i<7;i++)q(Math.floor(r()*30),Math.floor(r()*30),2+r()*3,1,'#9e916d');}
if(type==='water'){q(0,0,32,32,'#3d777b');q(0,4,32,2,'#528e8b');q(7,17,17,2,'#71aaa0');q(2,26,13,1,'#639d94');q(21,9,9,1,'#9fbfac');}
if(type==='grass'){for(let i=0;i<6;i++){const a=2+Math.floor(r()*27),b=4+Math.floor(r()*23);q(a,b,2,7,'#3f6e3e');q(a-2,b+1,2,3,'#83a35b');q(a+2,b+2,2,4,'#91ab66');}}
if(type==='flower'){for(let i=0;i<3;i++){const a=3+Math.floor(r()*25),b=3+Math.floor(r()*23);q(a,b+3,1,5,'#3c724b');q(a-2,b,5,3,i%2?'#ded092':'#c6abaf');q(a,b+1,1,1,'#f2e3a9');}}
if(type==='tree'){q(12,17,8,15,'#594d36');q(15,18,3,13,'#756143');ellipse(ctx,x+16,y+27,14,4,'#426940');ellipse(ctx,x+16,y+14,16,14,'#2d5b40');ellipse(ctx,x+14,y+10,13,11,'#386e48');ellipse(ctx,x+11,y+7,9,6,'#54834e');q(8,7,6,2,'#719a5a');q(21,18,6,2,'#244d39');}
if(type==='rock'){ellipse(ctx,x+17,y+24,13,6,'#476648');poly(ctx,[[x+3,y+24],[x+7,y+12],[x+17,y+8],[x+27,y+15],[x+29,y+25]],'#7b8873');poly(ctx,[[x+7,y+12],[x+17,y+8],[x+23,y+14],[x+14,y+18],[x+5,y+22]],'#9ba28a');q(17,21,9,3,'#64745f');}
if(type==='well'){ellipse(ctx,x+16,y+27,15,4,'#4a6748');q(4,12,24,14,'#8b927d');q(7,14,18,7,'#365b58');q(2,10,28,5,'#b7b399');q(5,22,22,5,'#a6a68d');q(12,6,8,7,'#738b80');}
if(type==='guild'||type==='house'){q(0,0,32,32,'#7d7156');q(0,3,32,2,'#b7a27b');q(0,17,32,1,'#a3906c');q(0,30,32,2,'#544d3c');q(1,0,2,32,'#665a43');}
}
export function drawBuilding(ctx,x,y,guild=false){const q=(a,b,w,h,col)=>{ctx.fillStyle=col;ctx.fillRect(x+a,y+b,w,h);};const w=guild?160:128;ctx.fillStyle='#374f3c';ctx.fillRect(x-4,y+95,w+8,20);q(5,47,w-10,54,'#d1bd8c');q(5,82,w-10,19,'#9c8c64');q(9,50,5,49,'#716548');q(w-14,50,5,49,'#716548');poly(ctx,[[x-7,y+50],[x+22,y+4],[x+w-22,y+4],[x+w+7,y+50]],guild?'#577b72':'#a36e51');for(let i=0;i<6;i++)q(1+i*4,43-i*7,w-2-i*8,2,guild?'#6c9183':'#b3835b');q(-7,49,w+14,5,guild?'#385b54':'#77513f');q(w/2-12,70,24,31,'#4d4c39');q(w/2-8,74,16,27,'#343e32');q(24,64,22,20,'#596e5d');q(26,66,18,16,'#e4cb8a');q(34,65,3,19,'#786d4c');q(w-46,64,22,20,'#596e5d');q(w-44,66,18,16,'#e4cb8a');q(w-36,65,3,19,'#786d4c');if(guild){q(w/2-16,22,32,28,'#d7c38f');q(w/2-12,26,24,20,'#50786a');ctx.strokeStyle='#e0ca8b';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x+w/2,y+36,7,0,Math.PI*2);ctx.stroke();q(w-29,-3,13,27,'#8b8e72');q(w-31,-5,17,5,'#b4ae85');}}
