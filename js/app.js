(function(){
const D=DATOS, $=s=>document.querySelector(s);
const MESES=["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
const esc=t=>String(t??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const sol=n=>"S/ "+n;
const wa=txt=>`https://wa.me/${D.contacto.whatsapp}?text=${encodeURIComponent(txt)}`;
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

// ---------- textos generales ----------
const C=D.clases, diasCorto=C.dias.map(d=>d.slice(0,3)).join(" · ");
document.title=`${D.club.nombre} – Clases y tienda de karate`;
$("#brandName").textContent=D.club.nombre;
$("#heroCiudad").textContent=D.club.ciudad;
$("#heroLema").textContent=D.club.lema;
$("#ctaPrecio").textContent=`Clases ${sol(C.precio)} al mes`;
$("#statPrecio").textContent=sol(C.precio);
$("#statDias").textContent=diasCorto;
$("#splitClases").textContent=`${C.dias.join(", ").replace(/, ([^,]*)$/," y $1")} · ${sol(C.precio)} al mes`;
$("#foot").textContent=`© ${new Date().getFullYear()} ${D.club.nombre} · ${D.club.ciudad}`;
$("#waFloat").href=wa("Hola, quiero información sobre las clases de karate.");

// ---------- clases ----------
$("#precioClase").textContent=C.precio;
$("#dias").innerHTML=C.dias.map(d=>`<div class="day"><small>${esc(d.slice(0,3))}</small>${esc(d)}</div>`).join("");
$("#incluye").innerHTML=C.incluye.map(i=>`<li>${esc(i)}</li>`).join("")+(C.matricula>0?`<li>Matrícula única: ${sol(C.matricula)}</li>`:"");
$("#horarios").innerHTML=C.horarios.map(h=>`<div class="hour"><div><b>${esc(h.grupo)}</b><small>${esc(h.edad)}</small></div><span>${esc(h.hora)}</span></div>`).join("");
$("#notaClases").textContent=C.nota;
$("#payYape").textContent=`📱 Yape / Plin: ${D.contacto.yape}`;
$("#btnInscribir").href=wa(`Hola, quiero inscribirme a las clases de karate (${diasCorto}, ${sol(C.precio)} al mes). ¿Qué necesito?`);

// ---------- tienda ----------
const ICON={
 gi:`<svg viewBox="0 0 100 100"><path d="M31 14 50 27 69 14 92 30 83 52 74 47V90H26V47l-9 5L8 30Z" fill="#fafafa"/><path d="M50 27 37 62M50 27l13 35" stroke="#cfcfd6" stroke-width="3" fill="none"/><rect x="26" y="58" width="48" height="8" fill="#141418"/><path d="M47 66 42 84h6l3-16zM53 66l5 18h-6l-3-16z" fill="#141418"/></svg>`,
 belt:`<svg viewBox="0 0 100 100" style="color:var(--c)"><rect x="6" y="40" width="88" height="14" rx="3" fill="currentColor" stroke="rgba(0,0,0,.25)" stroke-width="1.5"/><path d="M45 55 34 88h11l7-31zM55 55l11 33H55l-7-31z" fill="currentColor" stroke="rgba(0,0,0,.25)" stroke-width="1.5"/><rect x="41" y="35" width="18" height="24" rx="4" fill="currentColor" stroke="rgba(0,0,0,.35)" stroke-width="2"/></svg>`,
 glove:`<svg viewBox="0 0 100 100" style="color:var(--c)"><path d="M32 30q0-18 20-18 22 0 22 20v30q0 10-10 10H38q-8 0-8-10z" fill="currentColor"/><path d="M31 52q-15-1-13-12 4-9 13-3" fill="currentColor"/><path d="M40 26h26M40 36h26" stroke="rgba(255,255,255,.35)" stroke-width="3"/><rect x="34" y="72" width="38" height="17" rx="4" fill="#fafafa"/></svg>`,
 shin:`<svg viewBox="0 0 100 100" style="color:var(--c)"><path d="M38 8h24q5 0 5 6v48l17 12q5 7-2 12H40q-7 0-7-8V14q0-6 5-6z" fill="currentColor"/><path d="M41 22h19M41 34h19M41 46h19" stroke="rgba(255,255,255,.4)" stroke-width="3"/></svg>`,
 chest:`<svg viewBox="0 0 100 100" style="color:var(--c)"><path d="M23 16h17q10 12 20 0h17l4 24q0 40-31 48Q19 80 19 40z" fill="currentColor"/><path d="M50 30v48M30 45h40" stroke="rgba(0,0,0,.18)" stroke-width="3"/></svg>`,
 mouth:`<svg viewBox="0 0 100 100" style="color:var(--c)"><path d="M16 38q34 70 68 0l-11-3Q50 78 27 35z" fill="currentColor" stroke="rgba(0,0,0,.2)" stroke-width="2"/></svg>`
};
const HEX={Rojo:"#dc2626",Azul:"#2563eb",Blanco:"#f5f5f5",Amarillo:"#facc15",Naranja:"#f97316",Verde:"#16a34a",Morado:"#7c3aed",Marrón:"#7c3f12",Negro:"#18181b"};
const DEF_COLOR={glove:"#dc2626",shin:"#2563eb",chest:"#f5f5f5",mouth:"#60a5fa",belt:"#facc15"};
const T=D.tienda, P=T.productos;
const sel={}; // id -> {v: índice variante, c: color}
P.forEach(p=>sel[p.id]={v:0,c:p.colores?p.colores[0]:null});
const colorDe=p=>{const s=sel[p.id];if(s.c)return HEX[s.c]||"#888";if(p.opcion==="Color")return HEX[p.variantes[s.v][0]]||"#888";return DEF_COLOR[p.icono]||"#fafafa"};
const desde=p=>Math.min(...p.variantes.map(v=>v[1]));

const CATS={Todo:()=>true,Uniformes:p=>p.icono==="gi",Cinturones:p=>p.icono==="belt",Protección:p=>!["gi","belt"].includes(p.icono)};
let cat="Todo";
$("#filtros").innerHTML=Object.keys(CATS).map(c=>`<button class="chip${c===cat?" on":""}" data-c="${c}">${c}</button>`).join("");
$("#filtros").addEventListener("click",e=>{const b=e.target.closest(".chip");if(!b)return;cat=b.dataset.c;
  document.querySelectorAll(".chip").forEach(x=>x.classList.toggle("on",x===b));renderProductos()});

function cardProd(p){
  const s=sel[p.id],[vn,vp]=p.variantes[s.v];
  const img=p.img?`<img src="${esc(p.img)}" alt="${esc(p.nombre)}" loading="lazy">`:ICON[p.icono]||ICON.gi;
  const unico=p.variantes.length===1;
  return `<article class="prod" data-id="${p.id}">
   <div class="prod-img" style="--c:${colorDe(p)}">${p.badge?`<span class="badge">${esc(p.badge)}</span>`:""}${img}</div>
   <div class="prod-body">
    <h3>${esc(p.nombre)}</h3><p>${esc(p.desc)}</p>
    <div class="prod-price">${sol(vp)}${p.variantes.length>1&&desde(p)<vp?` <small>· desde ${sol(desde(p))}</small>`:""}</div>
    ${unico?"":`<div class="opt-l">${esc(p.opcion)}: ${esc(vn)}</div>
    <div class="opts">${p.variantes.map((v,i)=>`<button class="opt${i===s.v?" on":""}" data-v="${i}" aria-label="${esc(p.opcion)} ${esc(v[0])}">${p.opcion==="Color"?`<span class="dot" style="background:${HEX[v[0]]||"#888"}"></span>`:""}${esc(v[0])}</button>`).join("")}</div>`}
    ${p.colores?`<div class="opt-l">Color: ${esc(s.c)}</div><div class="opts">${p.colores.map(c=>`<button class="opt${c===s.c?" on":""}" data-col="${esc(c)}"><span class="dot" style="background:${HEX[c]||"#888"}"></span>${esc(c)}</button>`).join("")}</div>`:""}
    <button class="btn btn-sm btn-block add">Agregar al pedido</button>
   </div></article>`;
}
function renderProductos(){$("#productos").innerHTML=P.filter(CATS[cat]).map(cardProd).join("")}
renderProductos();
$("#productos").addEventListener("click",e=>{
  const card=e.target.closest(".prod");if(!card)return;const p=P.find(x=>x.id===card.dataset.id);
  const o=e.target.closest(".opt");
  if(o){if(o.dataset.v!==undefined)sel[p.id].v=+o.dataset.v;if(o.dataset.col)sel[p.id].c=o.dataset.col;card.outerHTML=cardProd(p);return}
  if(e.target.closest(".add")){const s=sel[p.id],[vn,vp]=p.variantes[s.v];addCart({id:p.id,nombre:p.nombre,opcion:p.variantes.length>1?`${p.opcion} ${vn}`:"",color:s.c,precio:vp});}
});
$("#guia").innerHTML=T.guiaTallas.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join("")}</tr>`).join("");
$("#notaTienda").textContent=T.nota;

// ---------- carrito ----------
let cart=store.get("kt_carrito",[]);
const key=i=>[i.id,i.opcion,i.color].join("|");
const toast=m=>{const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),1800)};
function addCart(it){const f=cart.find(x=>key(x)===key(it));f?f.cant++:cart.push({...it,cant:1});saveCart();
  toast(`✓ ${it.nombre}${it.opcion?" ("+it.opcion+")":""} agregado`);const b=$("#cartBtn");b.classList.remove("bump");void b.offsetWidth;b.classList.add("bump")}
function saveCart(){cart=cart.filter(x=>x.cant>0);store.set("kt_carrito",cart);renderCart()}
const desc=i=>[i.opcion,i.color].filter(Boolean).join(" · ");
function renderCart(){
  const n=cart.reduce((a,x)=>a+x.cant,0),tot=cart.reduce((a,x)=>a+x.cant*x.precio,0);
  $("#cartBtn").hidden=n===0;$("#cartCount").textContent=n;$("#cartTotal").textContent=sol(tot);
  $("#cartList").innerHTML=n?cart.map((x,i)=>`<div class="ci"><div><b>${esc(x.nombre)}</b><br><small>${esc(desc(x))||"&nbsp;"}</small></div>
   <p class="sub">${sol(x.cant*x.precio)}</p><div class="qty"><button data-i="${i}" data-d="-1" aria-label="Quitar uno">−</button>${x.cant}<button data-i="${i}" data-d="1" aria-label="Agregar uno">+</button></div><small style="text-align:right">${sol(x.precio)} c/u</small></div>`).join("")
   :`<p class="empty-cart">Tu pedido está vacío 🥋</p>`;
  $("#cartSend").disabled=n===0;
}
renderCart();
const drawer=$("#drawer"),bgd=$("#drawerBg");
const openD=o=>{drawer.classList.toggle("open",o);drawer.setAttribute("aria-hidden",!o);bgd.hidden=!o};
$("#cartBtn").onclick=()=>openD(true);$("#drawerClose").onclick=bgd.onclick=()=>openD(false);
$("#cartList").addEventListener("click",e=>{const b=e.target.closest("button[data-i]");if(!b)return;cart[b.dataset.i].cant+=+b.dataset.d;saveCart()});
$("#cartClear").onclick=()=>{cart=[];saveCart();openD(false)};
$("#cartSend").onclick=()=>{
  const lineas=cart.map(x=>`• ${x.cant} x ${x.nombre}${desc(x)?" ("+desc(x)+")":""} — ${sol(x.cant*x.precio)}`).join("\n");
  const tot=cart.reduce((a,x)=>a+x.cant*x.precio,0);
  window.open(wa(`Hola ${D.club.nombre} 👋, quiero hacer este pedido:\n\n${lineas}\n\n*Total: ${sol(tot)}*\n\n¿Tienen stock? Gracias.`),"_blank","noopener");
};

// ---------- torneos ----------
const hoy=new Date(); hoy.setHours(0,0,0,0);
const f=s=>{const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)};
const prox=D.torneos.filter(t=>f(t.fecha)>=hoy).sort((a,b)=>f(a.fecha)-f(b.fecha));
$("#listaTorneos").innerHTML=prox.length?prox.map(t=>{const d=f(t.fecha);return `
  <article class="t rv"><div class="date"><b>${d.getDate()}</b><span>${MESES[d.getMonth()]} ${d.getFullYear()}</span></div>
  <div><h3>${esc(t.nombre)}</h3><p>📍 ${esc(t.lugar)}</p><span class="tag">${esc(t.categoria)}</span>
  <p style="margin-top:.4rem">${esc(t.detalle)}</p></div></article>`}).join(""):
  `<div class="empty">Pronto publicaremos los próximos torneos. ¡Síguenos en redes!</div>`;
const pas=[...D.resultados,...D.torneos.filter(t=>f(t.fecha)<hoy).map(t=>({fecha:t.fecha,nombre:t.nombre,resultado:"Finalizado"}))].sort((a,b)=>f(b.fecha)-f(a.fecha));
$("#listaResultados").innerHTML=pas.length?pas.map(r=>`<div class="r"><span>${esc(r.nombre)} · ${f(r.fecha).toLocaleDateString("es-PE")}</span><b>${esc(r.resultado)}</b></div>`).join(""):`<div class="empty">Aún no hay resultados.</div>`;

// ---------- galería ----------
const COL=[["#b3122a","#4a0a14"],["#1f2937","#0b0f17"],["#c2410c","#431407"],["#7c2d12","#1c0a05"],["#9f1239","#2a0613"],["#0f766e","#042f2c"]];
const ICO=["🥋","🥇","🏆","🥊","🧘","🎌","🔥","🥈"];
const grid=$("#grid");
grid.innerHTML=D.galeria.map((g,i)=>{
  const c=COL[i%COL.length];
  return g.src?`<button class="ph rv" data-i="${i}"><img loading="lazy" src="${esc(g.src)}" alt="${esc(g.titulo)}"><span>${esc(g.titulo)}</span></button>`
  :`<button class="ph fake rv" data-i="${i}" style="background:linear-gradient(135deg,${c[0]},${c[1]})">${ICO[i%ICO.length]}<span>${esc(g.titulo)}</span></button>`}).join("");
const lb=$("#lb"),body=$("#lbBody");
grid.addEventListener("click",e=>{const b=e.target.closest(".ph");if(!b)return;const g=D.galeria[b.dataset.i];
  body.innerHTML=g.src?`<img src="${esc(g.src)}" alt="${esc(g.titulo)}">`:`<div class="big" style="${b.getAttribute("style")}">${b.childNodes[0].textContent}</div>`;
  $("#lbCap").textContent=g.titulo;lb.hidden=false;});
const close=()=>lb.hidden=true;
$("#lbClose").onclick=close;lb.onclick=e=>{if(e.target===lb)close()};
document.addEventListener("keydown",e=>{if(e.key==="Escape"){close();openD(false)}});

// ---------- contacto ----------
const c=D.contacto;
$("#info").innerHTML=`
 <li>📍 <span>${esc(c.direccion)}</span></li>
 <li>🕔 <span>${esc(C.dias.join(", "))}<br>${C.horarios.map(h=>esc(h.grupo+": "+h.hora)).join("<br>")}</span></li>
 <li>📞 <a href="tel:${esc(c.telefono.replace(/\s/g,""))}">${esc(c.telefono)}</a></li>
 <li>✉️ <a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>`;
$("#social").innerHTML=[["Facebook",c.facebook],["Instagram",c.instagram],["TikTok",c.tiktok]].filter(x=>x[1]).map(x=>`<a href="${esc(x[1])}" target="_blank" rel="noopener">${x[0]}</a>`).join("");
const {lat,lon}=c.mapa,d=.006;
$("#mapa").src=`https://www.openstreetmap.org/export/embed.html?bbox=${lon-d},${lat-d},${lon+d},${lat+d}&layer=mapnik&marker=${lat},${lon}`;
$("#form").addEventListener("submit",e=>{e.preventDefault();const fd=new FormData(e.target);
  window.open(wa(`Hola, soy ${fd.get("nombre")}. Consulta de inscripción para un alumno de ${fd.get("edad")} años. ${fd.get("mensaje")||""}`),"_blank","noopener");});

// ---------- menú móvil ----------
const menu=$("#menu"),bg=$("#burger");
bg.onclick=()=>{const o=menu.classList.toggle("open");bg.setAttribute("aria-expanded",o)};
menu.addEventListener("click",e=>{if(e.target.tagName==="A"){menu.classList.remove("open");bg.setAttribute("aria-expanded",false)}});

// ---------- animación al hacer scroll ----------
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}}),{threshold:.1});
document.querySelectorAll(".rv").forEach(el=>io.observe(el));
})();
