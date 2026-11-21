const fs=require("fs");let W,O,py;
function B(s,wk,bs){let pv=new Int32Array(wk.length).fill(-2);pv[s]=-1;let q=[s];for(let c of q)for(let d=0;d<4;d++){let n=c+O[d];if(wk[n]&&!bs.has(n)&&pv[n]<-1){pv[n]=c*4+d;q.push(n)}}return pv}
function P(a,b,wk,bs){if(a===b)return"";let pv=B(a,wk,bs);if(pv[b]<-1)return null;let s="",u=b;while(u!==a){let p=pv[u];s="udlr"[p%4]+s;u=p>>2}return s}
function S(cells,wkr,b0,gl,po){
let N=wkr.length,live=new Uint8Array(N);
for(let g of gl)live[g]=1;
let ch=1;while(ch){ch=0;for(let c of cells){if(live[c])continue;for(let d=0;d<4;d++)if(live[c+O[d]]&&wkr[c-O[d]]){live[c]=1;ch=1;break}}}
let start=b0.slice().sort((a,b)=>a-b);
let K=(bs,r)=>{let k=r;for(let b of bs)k=k*512+b;return k};
let rp0=B(po,wkr,new Set(start)).findIndex(v=>v+2);
let q=[{b:start,r:rp0,p:-1,s:-1}],seen=new Map([[K(start,rp0),0]]),f=-1,x=-1;
for(let h=0;h<q.length&&x<0;h++){
let nd=q[h],bs=new Set(nd.b),pv=B(nd.r,wkr,bs);
let done=1;for(let b of nd.b)if(!gl.has(b)){done=0;break}
if(done){if(f<0)f=h;let ex=0;for(let i=0;i<N;i++)if(pv[i]>-2&&(i/W|0)===py){ex=1;break}if(ex){x=h;break}}
for(let b of nd.b)for(let d=0;d<4;d++){let s=b-O[d],t=b+O[d];
if(pv[s]<-1||!wkr[t]||(t/W|0)===py||bs.has(t)||!live[t])continue;
let nb=nd.b.slice();nb[nb.indexOf(b)]=t;nb.sort((a,b)=>a-b);
let rp=B(b,wkr,new Set(nb)).findIndex(v=>v+2),k=K(nb,rp);
if(!seen.has(k)){seen.set(k,q.length);q.push({b:nb,r:rp,p:h,s:b*4+d})}}
}
if(f<0)return null;
let R=i=>{
let pu=[],u=i;while(u>=0){let nd=q[u];if(nd.s>=0)pu.push(nd.s);u=nd.p}pu.reverse();
let mv="",pp=po,bs=new Set(start);
for(let s of pu){let b=s>>2,d=s&3,p=P(pp,b-O[d],wkr,bs);if(p===null)return null;mv+=p+"udlr"[d];bs.delete(b);bs.add(b+O[d]);pp=b}
let ex=P(pp,po,wkr,bs),ce=ex!==null;if(ce)mv+=ex;
return{m:mv,n:pu.length,p:ce?po:pp,e:ce}};
return{a:R(f),b:x>=0?R(x):null}}
function L(txt){
let A=txt.split("\n"),H0=A.length,W0=Math.max(...A.map(s=>s.length));
W=W0+2;O=[-W,W,-1,1];
let N=W*(H0+2),wk=new Uint8Array(N),boxes=[],goals=[],pl=0;py=0;
for(let y=0;y<H0;y++)for(let x=0;x<W0;x++){let c=A[y][x]||"#",i=(y+1)*W+x+1;if(c!=="#")wk[i]=1;if(c==="$"||c==="*")boxes.push(i);if(c==="."||c==="*")goals.push(i);if(c==="@"||c==="+"){pl=i;py=y+1}}
let wh=wk.slice();for(let x=0;x<W;x++)wh[py*W+x]=0;
let seen=new Uint8Array(N),I=[];
for(let i=0;i<N;i++){
if(!wk[i]||(i/W|0)===py||seen[i])continue;
let pv=B(i,wh,new Set),cells=[],door=-1;
for(let j=0;j<N;j++)if(pv[j]>-2){seen[j]=1;cells.push(j);if(Math.abs((j/W|0)-py)===1)door=j}
let wkr=new Uint8Array(N);for(let c of cells)wkr[c]=1;wkr.set(wk.subarray(py*W,py*W+W),py*W);
let cs=new Set(cells),b0=boxes.filter(b=>cs.has(b)),gl=new Set(goals.filter(g=>cs.has(g)));
let po=py*W+door%W,r=S(cells,wkr,b0,gl,po);
I.push({r:r,x:b0,g:gl,p:po})}
let bd=I.filter(i=>i.r&&i.r.a&&!i.r.a.e);
if(bd.length===1){let b=bd[0].r.b;if(b&&b.n<=bd[0].r.a.n)bd[0].u=b;else{bd[0].u=bd[0].r.a;bd[0].l=1}}
else for(let i of bd){let b=i.r.b;if(b)i.u=b;else{i.u=i.r.a;i.l=1}}
for(let i of I)if(!i.u)i.u=i.r?i.r.a:null;
I.sort((a,b)=>(a.l?1:0)-(b.l?1:0));
let mv="",pp=pl,bs=new Set(boxes);
for(let inf of I){if(!inf.u)continue;let w=P(pp,inf.p,wk,bs);if(w===null)continue;mv+=w+inf.u.m;for(let b of inf.x)bs.delete(b);for(let g of inf.g)bs.add(g);pp=inf.u.p}
return mv}
for(let k=1;k<6;k++){let i="i00"+k,a="/input/"+i,b="/output/"+i,m=L(fs.readFileSync(a+"/level.txt","utf8"));fs.mkdirSync(b,{recursive:true});fs.writeFileSync(b+"/solution.txt",m)}
