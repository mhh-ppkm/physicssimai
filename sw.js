/* PhysicsSimAI+ service worker: auto-update + offline.
   Online: always fetches the newest files from GitHub Pages (network first).
   Offline: serves the last saved copy. No version bump is needed for updates. */
const CACHE='physicssimai-plus';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./maskable-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
const timeout=(p,ms)=>new Promise((res,rej)=>{const t=setTimeout(()=>rej(new Error('timeout')),ms);p.then(v=>{clearTimeout(t);res(v);},er=>{clearTimeout(t);rej(er);});});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){e.respondWith(caches.open(CACHE).then(async c=>{const hit=await c.match(r);const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res;}).catch(()=>hit);return hit||net;}));return;}
 if(u.origin!==location.origin)return;
 const key=r.mode==='navigate'?'./index.html':r;
 e.respondWith(timeout(fetch(r,{cache:'no-cache'}),6000).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(key,cp));}return res;}).catch(()=>caches.match(key).then(h=>h||caches.match('./index.html'))));});
