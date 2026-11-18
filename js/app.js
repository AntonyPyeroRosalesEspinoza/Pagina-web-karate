(function(){
const D=DATOS, $=s=>document.querySelector(s);
const MESES=["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
const esc=t=>String(t??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const sol=n=>"S/ "+n;
const wa=txt=>`https://wa.me/${D.contacto.whatsapp}?text=${encodeURIComponent(txt)}`;

// textos generales
document.title=`${D.club.nombre} – Inscripciones, torneos y contacto`;
$("#brandName").textContent=D.club.nombre;
$("#heroCiudad").textContent=D.club.ciudad;
$("#heroLema").textContent=D.club.lema;
$("#foot").textContent=`© ${new Date().getFullYear()} ${D.club.nombre} · ${D.club.ciudad}`;
$("#waFloat").href=wa("Hola, quiero información sobre las clases de karate.");

// precios
$("#matricula").textContent=sol(D.inscripcion.matricula);
$("#planes").innerHTML=D.planes.map(p=>`
  <article class="card rv ${p.destacado?"hot":""}">
    <h3>${esc(p.nombre)}</h3><div class="age">${esc(p.edad)} · ${esc(p.clases)}</div>
    <div class="price">${sol(p.mensual)} <small>/ mes</small></div>
    <ul>${p.extras.map(e=>`<li>${esc(e)}</li>`).join("")}</ul>
  </article>`).join("");
$("#notaPrecios").innerHTML=`${esc(D.inscripcion.nota)}<br><b>Uniforme:</b> karategi ${sol(D.uniforme.karategi)} · cinturón ${sol(D.uniforme.cinturon)}. ${esc(D.uniforme.nota)}`;

// torneos
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

// galería
const COL=[["#b3122a","#4a0a14"],["#1f2937","#0b0f17"],["#c2410c","#431407"],["#7c2d12","#1c0a05"],["#9f1239","#2a0613"],["#0f766e","#042f2c"]];
const ICON=["🥋","🥇","🏆","🥊","🧘","🎌","🔥","🥈"];
const grid=$("#grid");
grid.innerHTML=D.galeria.map((g,i)=>{
  const c=COL[i%COL.length];
  return g.src?`<button class="ph rv" data-i="${i}"><img loading="lazy" src="${esc(g.src)}" alt="${esc(g.titulo)}"><span>${esc(g.titulo)}</span></button>`
  :`<button class="ph fake rv" data-i="${i}" style="background:linear-gradient(135deg,${c[0]},${c[1]})">${ICON[i%ICON.length]}<span>${esc(g.titulo)}</span></button>`}).join("");
const lb=$("#lb"),body=$("#lbBody");
grid.addEventListener("click",e=>{const b=e.target.closest(".ph");if(!b)return;const g=D.galeria[b.dataset.i];
  body.innerHTML=g.src?`<img src="${esc(g.src)}" alt="${esc(g.titulo)}">`:`<div class="big" style="${b.getAttribute("style")}">${b.childNodes[0].textContent}</div>`;
  $("#lbCap").textContent=g.titulo;lb.hidden=false;});
const close=()=>lb.hidden=true;
$("#lbClose").onclick=close;lb.onclick=e=>{if(e.target===lb)close()};
document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});

// contacto
const c=D.contacto;
$("#info").innerHTML=`
 <li>📍 <span>${esc(c.direccion)}</span></li>
 <li>🕔 <span>${esc(c.horario)}</span></li>
 <li>📞 <a href="tel:${esc(c.telefono.replace(/\s/g,""))}">${esc(c.telefono)}</a></li>
 <li>✉️ <a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>`;
$("#social").innerHTML=[["Facebook",c.facebook],["Instagram",c.instagram],["TikTok",c.tiktok]].filter(x=>x[1]).map(x=>`<a href="${esc(x[1])}" target="_blank" rel="noopener">${x[0]}</a>`).join("");
const {lat,lon}=c.mapa,d=.006;
$("#mapa").src=`https://www.openstreetmap.org/export/embed.html?bbox=${lon-d},${lat-d},${lon+d},${lat+d}&layer=mapnik&marker=${lat},${lon}`;
$("#form").addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.target);
  window.open(wa(`Hola, soy ${f.get("nombre")}. Consulta de inscripción para un alumno de ${f.get("edad")} años. ${f.get("mensaje")||""}`),"_blank","noopener");});

// menú móvil
const menu=$("#menu"),bg=$("#burger");
bg.onclick=()=>{const o=menu.classList.toggle("open");bg.setAttribute("aria-expanded",o)};
menu.addEventListener("click",e=>{if(e.target.tagName==="A"){menu.classList.remove("open");bg.setAttribute("aria-expanded",false)}});

// animación al hacer scroll
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}}),{threshold:.1});
document.querySelectorAll(".rv").forEach(el=>io.observe(el));
})();
