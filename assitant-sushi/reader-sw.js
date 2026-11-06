'use strict';
const BUNDLE='mito-validation-bundle-80345d32ca296';
const SHELL='mito-validation-portal-r1';
const ROOT=new URL('./',self.location.href);
const APP=new URL('application/',ROOT).pathname;
self.addEventListener('install',event=>event.waitUntil(caches.open(SHELL).then(cache=>cache.addAll([new URL('index.html',ROOT).href])).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==ROOT.origin)return;
 if(url.pathname.startsWith(APP)){
  event.respondWith(caches.open(BUNDLE).then(cache=>cache.match(event.request,{ignoreSearch:true})).then(response=>response||new Response('<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dossier MITO à charger</title><body style="background:#09100d;color:#eff4ef;font:18px system-ui;padding:30px"><h1>Charger le dossier MITO sur cet appareil</h1><p>Les photographies et recettes sont conservées localement dans chaque navigateur. Ce navigateur ne dispose pas encore du dossier demandé.</p><p><a style="color:#b6d9a7" href="'+ROOT.pathname+'">Retour au portail de validation</a></p></body></html>',{status:503,headers:{'Content-Type':'text/html; charset=utf-8'}})));
 }else if(url.pathname===ROOT.pathname||url.pathname===new URL('index.html',ROOT).pathname){
  event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(SHELL).then(cache=>cache.put(new URL('index.html',ROOT).href,copy));}return response;}).catch(()=>caches.open(SHELL).then(cache=>cache.match(new URL('index.html',ROOT).href))));
 }
});
