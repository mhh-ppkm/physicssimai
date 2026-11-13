/* PhysicsSimAI+ service worker: works fully offline after the first visit */
const VERSION='physicssimai-plus-v2';
const SHELL=['./','./index.html','./manifest.webmanifest','./apple-touch-icon.png','./icon-192.png','./icon-512.png','./maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 // Google Fonts: keep a copy so the exam fonts still load offline
 if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){e.respondWith(caches.open(VERSION).then(async c=>{const hit=await c.match(r);const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res;}).catch(()=>hit);return hit||net;}));return;}
 if(u.origin!==location.origin)return;
 // page: network first (gets updates), cache fallback when offline
 if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{caches.open(VERSION).then(c=>c.put('./index.html',res.clone()));return res;}).catch(()=>caches.match('./index.html')));return;}
 e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp));}return res;})));});
