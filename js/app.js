/* Página de inicio: matrícula, torneos, galería y contacto */
(function(){
const {D,$,esc,sol,wa,reveal}=KT;
const MESES=["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
const C=D.clases, diasCorto=C.dias.map(d=>d.slice(0,3)).join(" · ");
const diasLargo=C.dias.length>1?C.dias.slice(0,-1).join(", ")+" y "+C.dias.at(-1):C.dias[0];

document.title=`${D.club.nombre} – Matrícula y clases de karate`;
$("#heroCiudad").textContent=D.club.ciudad;
$("#heroLema").textContent=D.club.lema;
$("#doorDias").textContent=diasLargo;
$("#doorPrecio").textContent=sol(C.precio);

// ---------- matrícula ----------
$("#precioClase").textContent=C.precio;
$("#dias").innerHTML=C.dias.map(d=>`<div class="day"><small>${esc(d.slice(0,3))}</small>${esc(d)}</div>`).join("");
$("#incluye").innerHTML=C.incluye.map(i=>`<li>${esc(i)}</li>`).join("")+(C.matricula>0?`<li>Matrícula única: ${sol(C.matricula)}</li>`:"");
$("#horarios").innerHTML=C.horarios.map(h=>`<div class="hour"><div><b>${esc(h.grupo)}</b><small>${esc(h.edad)}</small></div><span>${esc(h.hora)}</span></div>`).join("");
$("#notaClases").textContent=C.nota;
$("#payYape").textContent=`📱 Yape / Plin: ${D.contacto.yape}`;
$("#fichaGrupo").innerHTML=C.horarios.map(h=>`<option>${esc(h.grupo)} (${esc(h.edad)})</option>`).join("");
$("#ficha").addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.target),g=k=>String(f.get(k)||"").trim();
  const msg=[`Hola ${D.club.nombre} 👋, quiero matricular a:`,"",
    `• Alumno: ${g("alumno")}`,`• Edad: ${g("edad")} años`,g("apoderado")?`• Apoderado: ${g("apoderado")}`:null,
    `• Celular: ${g("celular")}`,`• Grupo: ${g("grupo")}`,`• Experiencia: ${g("exp")}`,g("comentario")?`• Comentario: ${g("comentario")}`:null,
    "",`Clases ${diasCorto} · ${sol(C.precio)} al mes.`].filter(x=>x!==null).join("\n");
  window.open(wa(msg),"_blank","noopener");});

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
const COL=[["#3a2f12","#0d0d0e"],["#1c1c1f","#0a0a0b"],["#4a3a10","#141210"],["#2a2416","#0b0b0c"]];
const ICO=["🥋","🥇","🏆","🥊","🧘","🎌","🔥","🥈"];
const grid=$("#grid");
grid.innerHTML=D.galeria.map((g,i)=>{const c=COL[i%COL.length];
  return g.src?`<button class="ph rv" data-i="${i}"><img loading="lazy" src="${esc(g.src)}" alt="${esc(g.titulo)}"><span>${esc(g.titulo)}</span></button>`
  :`<button class="ph fake rv" data-i="${i}" style="background:linear-gradient(135deg,${c[0]},${c[1]})">${ICO[i%ICO.length]}<span>${esc(g.titulo)}</span></button>`}).join("");
const lb=$("#lb"),body=$("#lbBody");
grid.addEventListener("click",e=>{const b=e.target.closest(".ph");if(!b)return;const g=D.galeria[b.dataset.i];
  body.innerHTML=g.src?`<img src="${esc(g.src)}" alt="${esc(g.titulo)}">`:`<div class="big" style="${b.getAttribute("style")}">${b.childNodes[0].textContent}</div>`;
  $("#lbCap").textContent=g.titulo;lb.hidden=false;});
const close=()=>lb.hidden=true;
$("#lbClose").onclick=close;lb.onclick=e=>{if(e.target===lb)close()};
document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});

// ---------- contacto ----------
const c=D.contacto;
$("#info").innerHTML=`
 <li>📍 <span>${esc(c.direccion)}</span></li>
 <li>🕔 <span>${esc(diasLargo)}<br>${C.horarios.map(h=>esc(h.grupo+": "+h.hora)).join("<br>")}</span></li>
 <li>📞 <a href="tel:${esc(c.telefono.replace(/\s/g,""))}">${esc(c.telefono)}</a></li>
 <li>✉️ <a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>`;
$("#social").innerHTML=[["Facebook",c.facebook],["Instagram",c.instagram],["TikTok",c.tiktok]].filter(x=>x[1]).map(x=>`<a href="${esc(x[1])}" target="_blank" rel="noopener">${x[0]}</a>`).join("");
const {lat,lon}=c.mapa,d=.006;
$("#mapa").src=`https://www.openstreetmap.org/export/embed.html?bbox=${lon-d},${lat-d},${lon+d},${lat+d}&layer=mapnik&marker=${lat},${lon}`;

reveal();
})();
