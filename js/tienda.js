/* Página de tienda: productos y carrito con pedido por WhatsApp */
(function(){
const {D,$,esc,sol,wa,store,toast,reveal}=KT;
document.title=`Tienda – ${D.club.nombre}`;
// ---------- tienda ----------
const ICON={
 gi:`<svg viewBox="0 0 100 100"><path d="M31 14 50 27 69 14 92 30 83 52 74 47V90H26V47l-9 5L8 30Z" fill="#f5f1e6"/><path d="M50 27 37 62M50 27l13 35" stroke="#cfc8b6" stroke-width="3" fill="none"/><rect x="26" y="58" width="48" height="8" fill="#d4af37"/><path d="M47 66 42 84h6l3-16zM53 66l5 18h-6l-3-16z" fill="#d4af37"/></svg>`,
 belt:`<svg viewBox="0 0 100 100" style="color:var(--c)"><rect x="6" y="40" width="88" height="14" rx="3" fill="currentColor" stroke="rgba(0,0,0,.25)" stroke-width="1.5"/><path d="M45 55 34 88h11l7-31zM55 55l11 33H55l-7-31z" fill="currentColor" stroke="rgba(0,0,0,.25)" stroke-width="1.5"/><rect x="41" y="35" width="18" height="24" rx="4" fill="currentColor" stroke="rgba(0,0,0,.35)" stroke-width="2"/></svg>`,
 glove:`<svg viewBox="0 0 100 100" style="color:var(--c)"><path d="M32 30q0-18 20-18 22 0 22 20v30q0 10-10 10H38q-8 0-8-10z" fill="currentColor"/><path d="M31 52q-15-1-13-12 4-9 13-3" fill="currentColor"/><path d="M40 26h26M40 36h26" stroke="rgba(255,255,255,.35)" stroke-width="3"/><rect x="34" y="72" width="38" height="17" rx="4" fill="#fafafa"/></svg>`,
 shin:`<svg viewBox="0 0 100 100" style="color:var(--c)"><path d="M38 8h24q5 0 5 6v48l17 12q5 7-2 12H40q-7 0-7-8V14q0-6 5-6z" fill="currentColor"/><path d="M41 22h19M41 34h19M41 46h19" stroke="rgba(255,255,255,.4)" stroke-width="3"/></svg>`,
 chest:`<svg viewBox="0 0 100 100" style="color:var(--c)"><path d="M23 16h17q10 12 20 0h17l4 24q0 40-31 48Q19 80 19 40z" fill="currentColor"/><path d="M50 30v48M30 45h40" stroke="rgba(0,0,0,.18)" stroke-width="3"/></svg>`,
 mouth:`<svg viewBox="0 0 100 100" style="color:var(--c)"><path d="M16 38q34 70 68 0l-11-3Q50 78 27 35z" fill="currentColor" stroke="rgba(0,0,0,.2)" stroke-width="2"/></svg>`
};
const HEX={Rojo:"#dc2626",Azul:"#2563eb",Blanco:"#f5f5f5",Amarillo:"#facc15",Naranja:"#f97316",Verde:"#16a34a",Morado:"#7c3aed",Marrón:"#7c3f12",Negro:"#18181b"};
const DEF_COLOR={glove:"#dc2626",shin:"#2563eb",chest:"#f5f1e6",mouth:"#d4af37",belt:"#d4af37"};
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

document.addEventListener("keydown",e=>{if(e.key==="Escape")openD(false)});
reveal();
})();
