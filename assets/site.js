'use strict';
const categories = ['Weddings', 'Seasonal', 'Home Décor', 'Gifts', 'Custom Creations', 'Boutique Displays'];
const el = (tag, text, className) => { const n = document.createElement(tag); if(text) n.textContent = text; if(className) n.className = className; return n; };
const safeUrl = (value) => { try { const u = new URL(value); return u.protocol === 'https:' ? u.href : ''; } catch { return ''; } };
const safePhoto = value => { if (!value) return ''; if(safeUrl(value)) return safeUrl(value); return /^assets\/[a-zA-Z0-9_./-]+$/.test(value) && !value.includes('..') ? value : ''; };
const link = (text, href, cls) => { const a = el('a', text, cls); a.href = href; return a; };
document.querySelector('[data-year]').textContent = new Date().getFullYear();
const menu = document.querySelector('.menu-toggle'); menu.addEventListener('click', () => menu.setAttribute('aria-expanded', String(menu.getAttribute('aria-expanded') !== 'true')));
document.addEventListener('keydown', e => {if(e.key === 'Escape') {menu.setAttribute('aria-expanded','false'); menu.focus();}});
async function init() {
 const res = await fetch('assets/content.json', {cache: 'no-cache'}); if(!res.ok) throw new Error('Content could not be loaded'); const data = await res.json();
 const business = data.business;
 for(const host of document.querySelectorAll('[data-products]')) {
  const products = data.products.filter(p => p.available || location.pathname.endsWith('/shop.html'));
  if(!products.length) host.append(el('p','New arrangements are coming soon. Please check back.'));
  for(const p of products) {
   const card = el('article',null,'product'); card.id = p.id; const figure = el('figure'); const photos = p.photos.filter(x => safePhoto(x.src));
   if(photos.length) { const img = el('img'); img.src=safePhoto(photos[0].src); img.alt=photos[0].alt || p.name; img.loading='lazy'; figure.append(img); if(photos.length>1) {const thumbs=el('div',null,'thumbnails'); photos.forEach((photo,i)=>{const b=el('button');b.type='button';b.setAttribute('aria-label',`View photo ${i+1} of ${p.name}`);const thumb=el('img');thumb.src=safePhoto(photo.src);thumb.alt='';b.append(thumb);b.addEventListener('click',()=>{img.src=safePhoto(photo.src);img.alt=photo.alt||p.name;});thumbs.append(b);});figure.append(thumbs);} }
   else {const box=el('div',null,'placeholder');box.append(el('span','Autumn Harvest'),el('small','Actual product photos coming soon. No product photo is shown.'));figure.append(box);}
   const details=el('div');details.append(el('span',p.available?'One available':'Sold out','badge'),el('h3',p.name),el('p',new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(p.price),'price'),el('p',p.dimensions,'muted'),el('p',p.description),el('p','$14.95 flat-rate U.S. shipping per order, charged by Square. For appointment-based local pickup, contact me before ordering.','muted'));
   if(p.available && safeUrl(p.squareUrl)) details.append(link('Buy Now · Secure Square Checkout',safeUrl(p.squareUrl),'button'));
   else details.append(el('span',p.available?'Square Payment Link coming soon':'Sold Out','disabled'));
   details.append(link('Ask about this arrangement','contact.html','text-link')); card.append(figure,details);host.append(card);
  }
 }
 for(const host of document.querySelectorAll('[data-events]')) {
  if(!data.events.length) host.append(el('p','New dates are coming soon. Check back for upcoming shows and boutiques.'));
  data.events.forEach(event=>{const article=el('article',null,'event');article.append(el('h3',event.name),el('p',`${event.date} · ${event.hours}`),el('p',event.location));if(safeUrl(event.url))article.append(link('Event details →',safeUrl(event.url)));host.append(article);});
 }
 function renderGallery(category) {
  const host=document.querySelector('[data-gallery]'); if(!host) return; host.replaceChildren();
  const items=data.gallery.filter(p=>category==='All'||p.category===category);
  if(items.length) items.forEach(item=>{const f=el('figure'); if(safePhoto(item.src)){const img=el('img');img.src=safePhoto(item.src);img.alt=item.alt||item.title;img.loading='lazy';f.append(img);}f.append(el('figcaption',item.title));host.append(f);});
  else (category==='All'?categories:[category]).forEach(c=>{const f=el('figure');const box=el('div',null,'placeholder');box.append(el('span',c),el('small','Portfolio photography coming soon'));f.append(box);host.append(f);});
 }
 const filters=document.querySelector('.filters');if(filters){const initial=new URLSearchParams(location.search).get('category');const chosen=categories.includes(initial)?initial:'All';['All',...categories].forEach(c=>{const b=el('button',c);b.type='button';b.setAttribute('aria-pressed',String(c===chosen));b.addEventListener('click',()=>{filters.querySelectorAll('button').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));renderGallery(c);});filters.append(b);});renderGallery(chosen);}
 for(const host of document.querySelectorAll('[data-social], [data-contact]')) {const box=el('div',null,'social');for(const [key,name] of [['instagram','Instagram'],['facebook','Facebook']]) { box.append(safeUrl(business[key])?link(name+' →',safeUrl(business[key])):el('span',name+' · coming soon')); }host.append(box);if(host.hasAttribute('data-contact'))host.append(business.email?link(business.email,'mailto:'+business.email):el('p','Business email · coming soon','muted'));}
 for(const form of document.querySelectorAll('[data-inquiry]')) {
  const endpoint=safeUrl(business.formEndpoint);const email=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(business.email)?business.email:'';
  if(endpoint||email)form.querySelector('.form-notice').textContent=endpoint?'Your inquiry will be sent through our hosted form service. No payment is collected.':'Prepare your inquiry to open your email app. Review and send it there; this website does not send it automatically.';
  form.querySelector('button[type=submit]').textContent=endpoint?'Send Inquiry':'Prepare Email Inquiry';
  form.addEventListener('submit',async e=>{e.preventDefault();const result=form.querySelector('.form-result');if(!endpoint&&!email){result.textContent='Your inquiry has not been sent. Business contact details are coming soon. Please check back.';return;}const fields=new FormData(form);if(email&&!endpoint){const body=Array.from(fields,([k,v])=>`${k}: ${v}`).join('\n');location.href=`mailto:${email}?subject=${encodeURIComponent('A Pretty Little Life inquiry')}&body=${encodeURIComponent(body)}`;result.textContent='Your email app was requested. Please review and send your inquiry there.';return;} const button=form.querySelector('button[type=submit]');button.disabled=true;result.textContent='Sending…';try{const response=await fetch(endpoint,{method:'POST',body:fields,headers:{Accept:'application/json'}});if(!response.ok)throw new Error();result.textContent='Thank you. Your inquiry has been submitted.';form.reset();}catch{result.textContent='Your inquiry could not be sent. Please try again or use the business email.';}finally{button.disabled=false;}});
 }
 if(safeUrl(business.siteUrl)) {const base=business.siteUrl.endsWith('/')?business.siteUrl:business.siteUrl+'/';const url=new URL(location.pathname.split('/').pop()||'index.html',base).href;const canonical=el('link');canonical.rel='canonical';canonical.href=url;if(!document.querySelector('link[rel=canonical]'))document.head.append(canonical);for(const [property,content] of [['og:url',url],['og:image',new URL('assets/flowers.svg',base).href]]){const m=el('meta');m.setAttribute('property',property);m.content=content;document.head.append(m);}const schema=el('script');schema.type='application/ld+json';schema.textContent=JSON.stringify({'@context':'https://schema.org','@type':'Organization',name:'A Pretty Little Life',url:base,description:'Handcrafted wood-flower arrangements',sameAs:[business.instagram,business.facebook].filter(safeUrl)});document.head.append(schema);}
}
init().catch(()=>{for(const host of document.querySelectorAll('[data-products],[data-events],[data-gallery]')) host.append(el('p','Content could not be loaded. Please refresh or try again later.'));});
