/* Funciones compartidas por index.html y tienda.html */
window.KT=(function(){
const D=DATOS, $=s=>document.querySelector(s);
const esc=t=>String(t??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const sol=n=>"S/ "+n;
const wa=txt=>`https://wa.me/${D.contacto.whatsapp}?text=${encodeURIComponent(txt)}`;
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const toast=m=>{const t=$("#toast");if(!t)return;t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),1800)};

// nombre del club, pie y WhatsApp flotante
document.querySelectorAll(".club-name").forEach(e=>e.textContent=D.club.nombre);
const foot=$("#foot");if(foot)foot.textContent=`© ${new Date().getFullYear()} ${D.club.nombre} · ${D.club.ciudad}`;
const wf=$("#waFloat");if(wf)wf.href=wa("Hola, quiero información sobre la academia de karate.");

// menú móvil
const menu=$("#menu"),bg=$("#burger");
if(menu&&bg){bg.onclick=()=>{const o=menu.classList.toggle("open");bg.setAttribute("aria-expanded",o)};
  menu.addEventListener("click",e=>{if(e.target.tagName==="A"){menu.classList.remove("open");bg.setAttribute("aria-expanded",false)}})}

// animación al aparecer
function reveal(){
  if(!("IntersectionObserver" in window)){document.querySelectorAll(".rv").forEach(el=>el.classList.add("in"));return}
  const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}}),{threshold:.1});
  document.querySelectorAll(".rv:not(.in)").forEach(el=>io.observe(el));
}
return {D,$,esc,sol,wa,store,toast,reveal};
})();
