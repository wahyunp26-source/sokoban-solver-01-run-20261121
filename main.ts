const fs=require("fs");const DL="udlr";let W,O,py;
function B(s,wk,bs){const pv=new Int32Array(wk.length).fill(-2);pv[s]=-1;const q=[s];for(let h=0;h<q.length;h++){const c=q[h];for(let d=0;d<4;d++){const n=c+O[d];if(wk[n]&&!bs.has(n)&&pv[n]===-2){pv[n]=c*4+d;q.push(n);}}}return pv;}
function P(a,b,wk,bs){if(a===b)return"";const pv=B(a,wk,bs);if(pv[b]===-2)return null;let s="",u=b;while(u!==a){const p=pv[u];s=DL[p%4]+s;u=(p/4)|0;}return s;}
function S(cells,wkr,b0,gl,po,ne){const N=wkr.length,live=new Uint8Array(N);for(const g of gl)live[g]=1;let ch=1;while(ch){ch=0;for(const c of cells){if(live[c])continue;for(let d=0;d<4;d++){if(live[c+O[d]]&&wkr[c-O[d]]){live[c]=1;ch=1;break;}}}}
const key=(bs,r)=>{let k=r;for(const b of bs)k=k*512+b;return k;};
const start=b0.slice().sort((a,b)=>a-b);
const rp0=B(po,wkr,new Set(start)).findIndex(v=>v+2);
const root={b:start,r:rp0,p:null,ps:null};
const seen=new Map([[key(start,rp0),root]]);
const q=[root];let gn=null;
for(let h=0;h<q.length;h++){const nd=q[h],bs=new Set(nd.b);
let done=true;for(const b of nd.b)if(!gl.has(b)){done=false;break;}
if(done){if(!ne){gn=nd;break;}const pv=B(nd.r,wkr,bs);let ex=false;for(let i=0;i<N;i++)if(pv[i]!==-2&&((i/W)|0)===py){ex=true;break;}if(ex){gn=nd;break;}}
const pv=B(nd.r,wkr,bs);
for(const b of nd.b)for(let d=0;d<4;d++){const s=b-O[d],t=b+O[d];if(pv[s]===-2||!wkr[t]||((t/W)|0)===py||bs.has(t)||!live[t])continue;const nb=nd.b.slice();nb[nb.indexOf(b)]=t;nb.sort((a,b)=>a-b);const rp=B(b,wkr,new Set(nb)).findIndex(v=>v+2);const k=key(nb,rp);if(!seen.has(k)){const nn={b:nb,r:rp,p:nd,ps:[b,d]};seen.set(k,nn);q.push(nn);}}}
if(!gn)return null;
const pu=[];let u=gn;while(u.ps){pu.push(u.ps);u=u.p;}pu.reverse();
let mv="",pp=po;const bs=new Set(start);
for(const pd of pu){const b=pd[0],d=pd[1];const p=P(pp,b-O[d],wkr,bs);if(p===null)return null;mv+=p+DL[d];bs.delete(b);bs.add(b+O[d]);pp=b;}
const ex=P(pp,po,wkr,bs);const ce=ex!==null;if(ce)mv+=ex;
return{mv:mv,pu:pu.length,pp:ce?po:pp,ce:ce};}
function L(txt){const R=txt.split("\n").filter(s=>s.length);const H0=R.length,W0=Math.max(...R.map(s=>s.length));W=W0+2;O=[-W,W,-1,1];const H=H0+2,N=W*H,wk=new Uint8Array(N),cc=new Array(N);let boxes=[],pl=0;py=0;
for(let y=0;y<H0;y++)for(let x=0;x<W0;x++){const c=R[y][x]||"#",i=(y+1)*W+(x+1);cc[i]=c;if(c!=="#")wk[i]=1;if(c==="$"||c==="*")boxes.push(i);if(c==="@"||c==="+"){pl=i;py=y+1;}}
const seen=new Uint8Array(N),rooms=[];
for(let i=0;i<N;i++){if(!wk[i]||((i/W)|0)===py||seen[i])continue;const st=[i];seen[i]=1;const cells=[];
while(st.length){const c=st.pop();cells.push(c);for(let d=0;d<4;d++){const n=c+O[d];if(wk[n]&&((n/W)|0)!==py&&!seen[n]){seen[n]=1;st.push(n);}}}
rooms.push(cells);}
const I=[];
for(const cells of rooms){const wkr=new Uint8Array(N);for(const c of cells)wkr[c]=1;for(let x=0;x<W;x++){const i=py*W+x;if(wk[i])wkr[i]=1;}
const b0=[],gl=new Set();for(const c of cells){const ch=cc[c];if(ch==="$"||ch==="*")b0.push(c);if(ch==="."||ch==="*")gl.add(c);}
let door=-1;for(const c of cells)if(Math.abs(((c/W)|0)-py)===1){door=c;break;}
const po=py*W+(door%W);const s0=S(cells,wkr,b0,gl,po,false);
I.push({s0:s0,use:null,last:false,b0:b0,gl:gl,po:po,cells:cells,wkr:wkr});}
const bd=I.filter(i=>i.s0&&!i.s0.ce);
if(bd.length===1){const s1=S(bd[0].cells,bd[0].wkr,bd[0].b0,bd[0].gl,bd[0].po,true);if(s1&&s1.pu<=bd[0].s0.pu)bd[0].use=s1;else{bd[0].use=bd[0].s0;bd[0].last=true;}}
else for(const i of bd){const s1=S(i.cells,i.wkr,i.b0,i.gl,i.po,true);if(s1)i.use=s1;else{i.use=i.s0;i.last=true;}}
for(const i of I)if(!i.use)i.use=i.s0;
I.sort((a,b)=>(a.last?1:0)-(b.last?1:0));
let mv="",pp=pl;const bs=new Set(boxes);
for(const inf of I){if(!inf.use)continue;const w=P(pp,inf.po,wk,bs);if(w===null)continue;mv+=w+inf.use.mv;for(const b of inf.b0)bs.delete(b);for(const g of inf.gl)bs.add(g);pp=inf.use.pp;}
return mv;}
for(let k=1;k<6;k++){const id="i00"+k;const mv=L(fs.readFileSync("/input/"+id+"/level.txt","utf8"));fs.mkdirSync("/output/"+id,{recursive:true});fs.writeFileSync("/output/"+id+"/solution.txt",mv);}
