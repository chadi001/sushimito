'use strict';
const DATA=window.MITO_V10_DATA, P=DATA.labels;let lang=new URLSearchParams(location.search).get('lang')==='en'?'en':'fr';let q='',category='Tous',selected=P.find(x=>x.code==='48021')||P[0],tab='production',activeUnit=0;
const $=id=>document.getElementById(id);
function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[œ]/g,'oe')}
const translations={'Entrées':'Appetizers','Bols poke':'Poke bowls','Plateaux':'Platters','Condiments':'Sauces','Combos':'Combos','Futomakis':'Futomaki','Makis spéciaux':'Special rolls','Crevettes':'Shrimp','Riz à sushi':'Sushi rice','Feuille d’algues':'Nori sheet','Goberge':'Imitation crab','Concombre':'Cucumber','Mayo épicée':'Spicy mayo','Caviar':'Roe','Saumon épicé':'Spicy salmon','Avocat':'Avocado','Tempura':'Tempura','Carottes râpées':'Shredded carrot','Radis mariné':'Pickled radish','Poivron':'Bell pepper','Sésame':'Sesame','Saumon fumé':'Smoked salmon','Thon':'Tuna','Feuille de riz':'Rice paper','Omelette':'Omelet'};
function tr(x){return lang==='en'?(translations[x]||x):x}
function t(a,b){return lang==='fr'?a:b}
function esc(s){return String(s??'').replace(/[&<>'"]/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[x]))}
function matches(x){return norm([x.name,x.code,x.category,translations[x.name]||''].join(' ')).includes(norm(q))&& (category==='Tous'||x.category===category||(category==='Autres'&&!['Combos','Entrées','Bols poke','Plateaux'].includes(x.category)))}
function matchesSort(a,b){let x=norm(q),score=p=>!x?0:p.code===q?100:p.code.startsWith(q)?60:norm(p.name).startsWith(x)?45:norm(p.name).includes(x)?25:0;return score(b)-score(a)}
function setLang(v){lang=v; $('fr').classList.toggle('on',v==='fr');$('en').classList.toggle('on',v==='en');$('goLens').href='glasses.html?lang='+v+'&code='+selected.code;render()}
function subImage(unit,p){
 const id=unit.linkedProductId;
 if(id){const obj=DATA.extras.find(x=>x.id===id)||DATA.labels.find(x=>x.linkId===id);if(obj)return obj.image;}
 const title=norm(unit.title);
 if(title.includes('nigiri')&&title.includes('crevette'))return 'images/nigiri_31_nigiri-crevette.png';
 if(title.includes('nigiri')&&title.includes('saumon'))return 'images/nigiri_30_nigiri-saumon.png';
 return p.image;
}
function select(code){selected=P.find(p=>p.code===code)||P[0];activeUnit=0;tab='production';location.hash=selected.code;render()}
function render(){document.documentElement.lang=lang;$('fr').classList.toggle('on',lang==='fr');$('en').classList.toggle('on',lang==='en');$('goLens').href='glasses.html?lang='+lang+'&code='+selected.code;
 $('catTitle').textContent=t('Retrouver un produit','Find a product');$('statsNote').textContent=t('Une seule fiche pour l’étiquette et la fabrication · photos MITO / formation','One card for labeling and production · original MITO / training photos');$('search').placeholder=t('Code ou nom : 48021, saumon, tsu…','Code or name: 48021, salmon, tsu…');$('footer').textContent=t('Brouillon uniquement — le site Netlify actuellement publié reste inchangé.','Preview only — the published Netlify site remains unchanged.');
 for(const btn of document.querySelectorAll('[data-category]'))btn.classList.toggle('on',category===btn.dataset.category);
 let shown=P.filter(matches).sort(matchesSort);$('counter').textContent=t(`${shown.length} codes disponibles · photo pour chaque code`,`${shown.length} codes available · image for each code`);
 $('items').innerHTML=shown.map(p=>`<button class="item ${p.code===selected.code?'sel':''}" data-code="${esc(p.code)}" aria-label="${esc(p.name+' '+p.code)}"><img loading="lazy" src="${esc(p.image)}" alt=""><div><div class="iname">${esc(p.name)}</div><div class="icode">${p.code}</div><small>${esc(tr(p.category))}</small></div></button>`).join('')||`<div class="none">${t('Aucun résultat','No matching product')}</div>`;
 const p=selected;let u=p.guideUnits||[];let allSources=p.photoSource==='PDF MITO/IGA 2022';
 let html=`<div class="topline"><span class="eyebrow">${esc(t('FICHE PRODUIT · ÉTIQUETTE','PRODUCT CARD · LABEL'))}</span><span class="v10">DRAFT V10</span></div><div class="hero"><img src="${esc(p.image)}" alt="${esc(p.name)}"><div class="heroInfo"><div class="codeLabel">${esc(t('CODE PRODUIT','PRODUCT CODE'))}</div><div class="bigCode">${p.code}</div><h1>${esc(p.name)}</h1><div class="source">${allSources?t('Photo : MITO/IGA (PDF 2022)','Photo: MITO/IGA (2022 PDF)'):t('Photo : fiche de formation','Photo: training sheet')}</div></div></div><div class="actions"><button class="act alt" id="copyCode">▣ ${esc(t('Copier le code','Copy code'))}</button><button class="act" id="showLens">◉ ${esc(t('Voir sur lunettes','View on glasses'))}</button></div><div class="divider"></div><div class="topline"><h2 style="margin:0;font-size:19px">${esc(t('Guide de production','Production guide'))}</h2><span class="countGreen">${u.length?u.length+' '+t('sous-produits','components'):t('Non documenté','Not documented')}</span></div>`;
 if(!u.length){html+=`<p class="none">${t('Aucune recette de production confirmée sur les fiches de formation pour ce code. La photo et le code restent accessibles pour l’étiquetage.','No production recipe confirmed on training sheets for this code. The photo and code remain available for labeling.')}</p>`}else{
 html+=`<div class="sub-list">${u.map((v,i)=>`<button class="sub" data-unit="${i}" style="cursor:pointer;text-align:left;color:white;width:100%"><img src="${esc(subImage(v,p))}" alt=""><div><div class="subName">${esc(v.title)}</div><div class="pill">${esc(v.quantity||'')} ${t('morceaux','pieces')} · ${v.ingredientsDetail?.length?t('Recette formation','Training recipe'):t('Ingrédients à compléter','Ingredients missing')}</div></div></button>`).join('')}</div>`;
 const unit=u[activeUnit]||u[0];if(unit){let ingredients=unit.ingredientsDetail||[];html+=`<div class="tabline"><button class="${tab==='production'?'on':''}" id="tabIng">${t('Ingrédients','Ingredients')}</button><button class="${tab==='source'?'on':''}" id="tabSource">${t('Source de formation','Training source')}</button></div>`;
 if(tab==='source'){html+=`<p class="noteSmall">${esc(unit.note||t('Recette non précisée dans la formation.','Recipe not specified in training.'))}</p>`}else if(ingredients.length){html+=`<div class="ingredients">${ingredients.map(x=>`<div class="ing"><img src="${esc(DATA.ingredientImages[x.name]||DATA.ingredientImages['Riz à sushi'])}" alt=""><div><div class="iname">${esc(tr(x.name))}</div><div class="qty">${esc(x.quantity||t('Quantité non précisée','Quantity not specified'))}</div>${lang==='en'?`<div class="noteSmall">${esc(x.name)}</div>`:''}</div></div>`).join('')}</div><p class="noteSmall">${t('Quantités recopiées de la fiche du rouleau ; ne pas multiplier par morceau.','Amounts from the training roll recipe; do not multiply per piece.')}</p>`}else html+=`<div class="none">${t('La fiche de formation ne fournit pas les ingrédients ou les quantités pour ce sous-produit.','The training sheet does not specify ingredients or amounts for this component.')}</div>`}
 }
 html+=`<div class="glassPreview">◉ ${t('Sur les lunettes : recherche → photo + code → sous-produit → ingrédients en images, trois à la fois.','On glasses: search → photo + code → component → pictured ingredients, three at a time.')}</div>`;
 $('detail').innerHTML=html;
 $('items').querySelectorAll('[data-code]').forEach(b=>b.onclick=()=>select(b.dataset.code));
 $('detail').querySelector('#copyCode').onclick=()=>{navigator.clipboard?.writeText(selected.code);$('detail').querySelector('#copyCode').textContent=t('✓ Code copié','✓ Code copied')};
 $('detail').querySelector('#showLens').onclick=()=>window.open('glasses.html?lang='+lang+'&code='+selected.code,'_blank');
 $('detail').querySelectorAll('[data-unit]').forEach(b=>b.onclick=()=>{activeUnit=+b.dataset.unit;tab='production';render()});
 $('tabIng')?.addEventListener('click',()=>{tab='production';render()});$('tabSource')?.addEventListener('click',()=>{tab='source';render()});
}
$('search').addEventListener('input',e=>{q=e.target.value;render()});document.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.category;render()}));
const urlCode=new URLSearchParams(location.search).get('code')||location.hash.slice(1);if(P.some(x=>x.code===urlCode))selected=P.find(x=>x.code===urlCode);
setLang(lang);
