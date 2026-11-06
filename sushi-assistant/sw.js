'use strict';
const BUNDLE='mito-sushi-assistant-v15-valid-0ca144da';
const SHELL='mito-sushi-assistant-gh-pages-r1';
const ROOT=new URL('./',self.location.href);
const APP=new URL('app/',ROOT).pathname;
self.addEventListener('install',e=>e.waitUntil(caches.open(SHELL).then(c=>c.add(new URL('index.html',ROOT))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
 const req=e.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==ROOT.origin)return;
 if(url.pathname.startsWith(APP)){
  e.respondWith(caches.open(BUNDLE).then(c=>c.match(req,{ignoreSearch:true})).then(r=>r||new Response('<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Charger Sushi Assistant</title><body style="background:#080e0a;color:#eaf3e4;font:18px system-ui;padding:24px"><h1>Application non chargée sur cet appareil</h1><p>Retourne à la page de validation GitHub pour importer le ZIP V15 dans ce navigateur.</p><a style="color:#bcebab" href="'+ROOT.pathname+'">Charger Sushi Assistant</a></body></html>',{status:503,headers:{'Content-Type':'text/html; charset=utf-8'}})));
 }
});
