'use strict';
const D=window.MITO_V10_DATA,labels=D.labels;
const $=id=>document.getElementById(id);
const trDict={'Crevettes':'Shrimp','Goberge':'Imitation crab','Caviar':'Roe','Concombre':'Cucumber','Riz à sushi':'Sushi rice','Feuille d’algues':'Nori sheet','Mayo épicée':'Spicy mayonnaise','Poivron':'Bell pepper','Carottes râpées':'Shredded carrots','Radis mariné':'Pickled radish','Saumon épicé':'Spicy salmon','Avocat':'Avocado','Tempura':'Tempura','Omelette':'Omelet','Sésame':'Sesame','Saumon fumé':'Smoked salmon','Graines Sésame':'Sesame seeds','Poivron rouge':'Red bell pepper','Thon':'Tuna','Fromage Philadelphia':'Philadelphia cheese','Épices coréennes':'Korean spices','Feuille soya rose':'Pink soy wrapper','Feuille de riz':'Rice paper','Crevettes épicées':'Spicy shrimp','Mayo':'Mayonnaise'};
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/œ/g,'oe');
const params=new URLSearchParams(location.search);
let lang=params.get('lang')==='en'?'en':'fr',query='',page='home',resultPage=0,unitIndex=0,ingPage=0,code=params.get('code')||'48021',focusIndex=0;
let checked={};let recent=[];try{recent=JSON.parse(localStorage.getItem('mito-v10-recent')||'[]');}catch(e){}
if(!labels.some(p=>p.code===code))code='48021';
if(params.has('code'))page='product';
const product=()=>labels.find(p=>p.code===code)||labels[0];
const units=()=>product().guideUnits||[];
const tl=(a,b)=>lang==='fr'?a:b;
function imgForSub(u,p){const id=u.linkedProductId;
 if(id){const match=D.extras.find(z=>z.id===id)||D.labels.find(z=>z.linkId===id);if(match)return match.image;}
 const title=norm(u.title);
 if(title.includes('nigiri')&&title.includes('crevette'))return 'images/nigiri_31_nigiri-crevette.png';
 if(title.includes('nigiri')&&title.includes('saumon'))return 'images/nigiri_30_nigiri-saumon.png';
 return p.image}
function categoryMatch(p){return [p.name,p.code,p.category].map(norm).join(' ').includes(norm(query))}
function matches(){return labels.filter(categoryMatch).sort((a,b)=>{const s=p=>!query?recent.includes(p.code)?100-recent.indexOf(p.code):0:p.code===query?200:p.code.startsWith(query)?150:norm(p.name).startsWith(norm(query))?100:0;return s(b)-s(a)})}
function languageChange(v){lang=v;const url=new URL(location.href);url.searchParams.set('lang',v);history.replaceState(null,'',url);render()}
function changePage(v){page=v;focusIndex=0;render()}
function remember(c){recent=[c,...recent.filter(z=>z!==c)].slice(0,8);try{localStorage.setItem('mito-v10-recent',JSON.stringify(recent))}catch(e){}}
function pick(codeValue){code=codeValue;unitIndex=0;ingPage=0;remember(code);changePage('product')}
function back(){if(page==='ingredient'){changePage('units')}else if(page==='units'){changePage('product')}else if(page==='product'){changePage('home')}else{if(query){query='';resultPage=0;render()}}}
function getCheckedSet(){const k=code+'-'+unitIndex;return checked[k]||(checked[k]=new Set())}
function updateBase(){document.documentElement.lang=lang;document.getElementById('brandSuffix').textContent=tl('Production','Production');$('langfr').classList.toggle('on',lang==='fr');$('langen').classList.toggle('on',lang==='en');$('langfr').setAttribute('aria-pressed',lang==='fr');$('langen').setAttribute('aria-pressed',lang==='en');$('help').textContent=tl('↑↓ Naviguer · ✓ Choisir · ← Retour','↑↓ Navigate · ✓ Select · ← Back')}
function render(){updateBase();let html='',c='';const p=product();
 if(page==='home'){
  const rows=matches();const max=Math.max(1,Math.ceil(rows.length/3));resultPage=Math.min(max-1,Math.max(0,resultPage));const subset=rows.slice(resultPage*3,resultPage*3+3);
  c=tl('Recherche','Search')+' · '+rows.length;
  html=`<div class="kicker">${tl('CODE ET ÉTIQUETTE · PRÉPARATION','CODE & LABEL · PRODUCTION')}</div><div class="title">${tl('Quel produit ?','Which product?')}</div><div class="muted">${tl('Écris un code ou une partie du titre','Enter a code or part of the name')}</div><div class="search"><input id="search" type="text" inputmode="text" aria-label="${tl('Rechercher un produit','Search a product')}" autocomplete="off" placeholder="48021 · saumon · tsu…" value="${esc(query)}"></div><div class="resultlist">${subset.map(z=>`<button class="result" data-pick="${z.code}"><img src="${esc(z.image)}" alt=""><div><div class="nm">${esc(z.name)}</div><div class="cd">${z.code}</div></div></button>`).join('')||`<div class="empty">${tl('Aucun résultat. Essaie un autre mot.','No result. Try another term.')}</div>`}</div><div class="pager"><span class="micro">${rows.length} ${tl('codes','codes')} · ${resultPage+1}/${max}</span><div class="paginate"><button data-prev ${resultPage===0?'disabled':''} aria-label="Previous page">‹</button><button data-next ${resultPage>=max-1?'disabled':''} aria-label="Next page">›</button></div></div>`;
 }
 if(page==='product'){
  c=tl('Étiquette','Label')+' · '+p.code;
  html=`<div class="kicker">${tl('PHOTO + CODE · ÉTIQUETAGE','PHOTO + CODE · LABEL')}</div><div class="hero"><img class="photo" src="${esc(p.image)}" alt="${esc(p.name)}"><div class="heroName"><div class="micro">${tl('CODE PRODUIT','PRODUCT CODE')}</div><div class="bigCode">${p.code}</div><div class="productName">${esc(p.name)}</div><div class="photoSrc">${p.photoSource==='PDF MITO/IGA 2022'?tl('Photo menu MITO/IGA','MITO/IGA menu photo'):tl('Photo de formation','Training photo')}</div></div></div><div class="btns"><button class="btn primary" data-act="prepare"><span class="ico">▤</span><span>${tl('Préparer','Prepare')}<small>${units().length?`${units().length} ${tl('sous-produits','components')}`:tl('Recette non fournie','Recipe unavailable')}</small></span></button><button class="btn" data-act="search"><span class="ico">⌕</span><span>${tl('Autre produit','Another product')}<small>${tl('Rechercher un titre ou un code','Search by name or code')}</small></span></button></div><div class="footNote">${tl('Même fiche pour l’étiquette et la production.','Same card for labeling and production.')}</div>`;
 }
 if(page==='units'){
  c=p.code+' · '+tl('Sous-produits','Components');
  const ar=units();html=`<div class="kicker">${tl('GUIDE DE PRODUCTION','PRODUCTION GUIDE')} · ${p.code}</div><div class="title">${esc(p.name)}</div><div class="muted">${tl('Choisis un sous-produit :','Choose a component:')}</div>`;
  if(ar.length)html+=`<div class="resultlist" style="margin-top:14px">${ar.map((u,i)=>`<button class="component" data-unit="${i}"><img src="${esc(imgForSub(u,p))}" alt=""><div><div class="name">${esc(u.title)}</div><small>${esc(u.quantity||'')} ${tl('morceaux','pieces')} · ${u.ingredientsDetail?.length?tl('Recette de formation','Training recipe'):tl('Ingrédients à compléter','Ingredients missing')}</small></div></button>`).join('')}</div>`;
  else html+=`<div class="sourceWarn">${tl('Ce produit possède une photo et un code, mais aucune recette confirmée sur tes fiches de formation.','This product has a photo and code but no confirmed recipe on your training sheets.')}</div>`;
  html+=`<div class="backrow"><button data-back>← ${tl('Étiquette','Label')}</button></div>`;
 }
 if(page==='ingredient'){
  const u=units()[unitIndex],ings=u?.ingredientsDetail||[], done=getCheckedSet();const count=Math.max(1,Math.ceil(ings.length/3));ingPage=Math.min(ingPage,count-1);c=p.code+' · '+(unitIndex+1)+'/'+units().length;
  html=`<div class="sectionTop"><span class="kicker">${esc(u.title)} · ${esc(u.quantity||'')} ${tl('mcx','pcs')}</span><span class="progress">${done.size}/${ings.length} ✓</span></div><div class="title">${tl('Ingrédients','Ingredients')}</div><div class="muted">${tl('Quantités de la fiche du rouleau','Quantities from the roll training sheet')}</div>`;
  if(ings.length){html+=`<div class="ingredients">${ings.slice(ingPage*3,ingPage*3+3).map((x,j)=>{const idx=ingPage*3+j;return `<button class="ingredient ${done.has(idx)?'checked':''}" data-check="${idx}"><img src="${esc(D.ingredientImages[x.name]||D.ingredientImages['Riz à sushi'])}" alt=""><span class="text"><span class="name">${esc(lang==='en'?(trDict[x.name]||x.name):x.name)}</span><span class="qty">${esc(x.quantity||'—')}</span>${lang==='en'?`<small>${esc(x.name)}</small>`:''}</span><span class="mark">${done.has(idx)?'✓':'○'}</span></button>`}).join('')}</div><div class="pager"><span class="micro">${tl('Ingrédients','Ingredients')} ${ingPage+1}/${count}</span><div class="paginate"><button data-prev ${ingPage===0?'disabled':''}>‹</button><button data-next ${ingPage===count-1?'disabled':''}>›</button></div></div>`;
  }else{html+=`<div class="sourceWarn">${tl('La fiche de formation ne précise pas la recette de ce sous-produit. Aucun ingrédient inventé.','No recipe is provided for this component in the training sheets. No ingredients have been invented.')}</div>`}
  html+=`<div class="footNote">${tl('Ne pas multiplier les grammes par morceau.','Do not multiply grams by the number of pieces.')}</div><div class="backrow"><button data-back>← ${tl('Sous-produits','Components')}</button></div>`;
 }
 $('body').innerHTML=html;$('crumb').textContent=c;
 $('body').querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>pick(b.dataset.pick));
 $('body').querySelectorAll('[data-unit]').forEach(b=>b.onclick=()=>{unitIndex=Number(b.dataset.unit);ingPage=0;changePage('ingredient')});
 $('body').querySelectorAll('[data-check]').forEach(b=>b.onclick=()=>{const i=+b.dataset.check;const s=getCheckedSet();s.has(i)?s.delete(i):s.add(i);render();let focused=$('body').querySelector(`[data-check="${i}"]`);focused?.focus()});
 $('body').querySelectorAll('[data-back]').forEach(b=>b.onclick=()=>back());
 $('body').querySelectorAll('[data-prev]').forEach(b=>b.onclick=()=>{if(page==='home')resultPage--;else ingPage--;render()});
 $('body').querySelectorAll('[data-next]').forEach(b=>b.onclick=()=>{if(page==='home')resultPage++;else ingPage++;render()});
 $('body').querySelectorAll('[data-act="prepare"]').forEach(b=>b.onclick=()=>changePage('units'));
 $('body').querySelectorAll('[data-act="search"]').forEach(b=>b.onclick=()=>changePage('home'));
 const input=$('search'); if(input){input.oninput=e=>{query=e.target.value;resultPage=0;const caret=e.target.selectionStart;render();const fresh=$('search');fresh.focus();fresh.setSelectionRange(caret,caret)};}
}
for(const l of document.querySelectorAll('[data-lang]'))l.onclick=()=>languageChange(l.dataset.lang);
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'||e.key==='Backspace'&&document.activeElement?.tagName!=='INPUT'){e.preventDefault();back();return}
 if(document.activeElement?.tagName==='INPUT'){
  if(e.key==='ArrowDown'){e.preventDefault();const first=$('body').querySelector('[data-pick]');first?.focus()}
  return;
 }
 if(e.key==='ArrowLeft'){e.preventDefault();back();return}
 if(e.key==='ArrowRight'){const n=$('body').querySelector('[data-next]:not(:disabled)');if(n){e.preventDefault();n.click()}return}
 if(e.key==='ArrowDown'||e.key==='ArrowUp'){
  e.preventDefault();const f=Array.from($('body').querySelectorAll('button:not(:disabled),input'));if(!f.length)return;
  let i=f.indexOf(document.activeElement); i=i<0?(e.key==='ArrowUp'?f.length-1:0):(i+(e.key==='ArrowUp'?-1:1)+f.length)%f.length;f[i].focus();return;
 }
 if(e.key==='Enter'&&document.activeElement?.tagName==='BUTTON'){e.preventDefault();document.activeElement.click()}
});
render();
