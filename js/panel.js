/* Panel del sensei: alumnos, vencimientos y avisos por WhatsApp.
   Los datos se guardan SOLO en el navegador de este dispositivo (localStorage).
   Nada se sube a internet ni al repositorio. */
(function(){
const D=DATOS, $=s=>document.querySelector(s);
const K_AL="kt_alumnos_v1", K_CFG="kt_config_v1", K_UNLOCK="kt_unlock";
const esc=t=>String(t??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const sol=n=>"S/ "+(+n||0);

// ---------- almacenamiento seguro ----------
let storageOk=true;
const store={
  get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){storageOk=false;return d}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){storageOk=false;$("#storeWarn").hidden=false}}
};
try{localStorage.setItem("kt_t","1");localStorage.removeItem("kt_t")}catch(e){storageOk=false}

// ---------- fechas ----------
const pad=n=>String(n).padStart(2,"0");
const iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const parse=s=>{const [y,m,d]=String(s).split("-").map(Number);return new Date(y,(m||1)-1,d||1)};
const hoy=()=>iso(new Date());
function addMonths(s,n){const d=parse(s),day=d.getDate();d.setDate(1);d.setMonth(d.getMonth()+n);
  const last=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();d.setDate(Math.min(day,last));return iso(d)}
const diff=s=>Math.round((parse(s)-parse(hoy()))/864e5);
const DSEM=["dom","lun","mar","mié","jue","vie","sáb"], MES=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const fcorta=s=>{const d=parse(s);return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`};
const flarga=s=>{const d=parse(s);return `${DSEM[d.getDay()]} ${fcorta(s)}`};
const fmsg=s=>{const d=parse(s);return `${d.getDate()} de ${MES[d.getMonth()]}`};
const cuando=n=>n===0?"hoy":n===1?"mañana":n>1?`en ${n} días`:n===-1?"ayer":`hace ${-n} días`;

// ---------- configuración ----------
const MSG={
  porVencer:"Hola {contacto} 👋, le saludamos de {club} 🥋.\nLe recordamos que la mensualidad de *{alumno}* (S/ {monto}) vence *{cuando}*, el {fecha}.\nPuede pagar en el dojo o por Yape al {yape}.\n¡Gracias! Nos vemos {dias_clase} 💪",
  vencido:"Hola {contacto} 👋, le saludamos de {club} 🥋.\nLa mensualidad de *{alumno}* (S/ {monto}) venció {cuando} ({fecha}).\nLe agradeceremos regularizar el pago para seguir entrenando. Puede pagar en el dojo o por Yape al {yape}.\n¡Gracias!"
};
const CFG0={dias:3,monto:D.clases.precio,msgPorVencer:MSG.porVencer,msgVencido:MSG.vencido,pinHash:"",ultimoBackup:null};
let cfg={...CFG0,...store.get(K_CFG,{})};
let alumnos=store.get(K_AL,[]);
if(!Array.isArray(alumnos))alumnos=[];
const saveAl=()=>store.set(K_AL,alumnos);
const saveCfg=()=>store.set(K_CFG,cfg);

// ---------- estado de cada alumno ----------
function estado(a){if(a.activo===false)return "inactivo";const n=diff(a.vence);return n<0?"vencido":n<=cfg.dias?"porvencer":"aldia"}
const ETQ={aldia:"Al día",porvencer:"Por vencer",vencido:"Vencido",inactivo:"Inactivo"};

// ---------- WhatsApp ----------
function numero(t){let n=String(t||"").replace(/\D/g,"");if(n.length===9&&n[0]==="9")n="51"+n;return n}
const fmtTel=t=>{const n=String(t||"").replace(/\D/g,"");return n.length===9?n.replace(/(\d{3})(\d{3})(\d{3})/,"$1 $2 $3"):t};
function mensaje(a){
  const n=diff(a.vence),tpl=n<0?cfg.msgVencido:cfg.msgPorVencer;
  const dias=D.clases.dias.map(d=>d.toLowerCase()); const diasTxt=dias.length>1?dias.slice(0,-1).join(", ")+" y "+dias.at(-1):dias[0];
  const v={contacto:a.apoderado||a.nombre.split(" ")[0],alumno:a.nombre,monto:a.monto,fecha:fmsg(a.vence),cuando:cuando(n),club:D.club.nombre,yape:D.contacto.yape,dias_clase:diasTxt};
  return tpl.replace(/\{(\w+)\}/g,(m,k)=>k in v?v[k]:m);
}

// ---------- utilidades UI ----------
const toast=m=>{const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),2200)};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
function descargar(nombre,contenido,tipo){const b=new Blob([contenido],{type:tipo});const u=URL.createObjectURL(b);
  const a=document.createElement("a");a.href=u;a.download=nombre;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000)}

// ---------- render ----------
let filtro="todos";
$("#clubName").textContent=D.club.nombre;
if(!storageOk)$("#storeWarn").hidden=false;

function render(){
  const q=$("#q").value.trim().toLowerCase();
  const cnt={todos:0,porvencer:0,vencido:0,aldia:0,inactivo:0};
  alumnos.forEach(a=>{const e=estado(a);cnt[e]++;if(e!=="inactivo")cnt.todos++});
  const mesAct=hoy().slice(0,7);
  const cobrado=alumnos.reduce((s,a)=>s+(a.pagos||[]).filter(p=>p.fecha.slice(0,7)===mesAct).reduce((x,p)=>x+(+p.monto||0),0),0);
  $("#kpis").innerHTML=`
    <button class="kpi" data-f="todos"><b>${cnt.todos}</b><span>Alumnos activos</span></button>
    <button class="kpi k-warn" data-f="porvencer"><b>${cnt.porvencer}</b><span>Por vencer (≤ ${cfg.dias} días)</span></button>
    <button class="kpi k-bad" data-f="vencido"><b>${cnt.vencido}</b><span>Vencidos</span></button>
    <div class="kpi k-ok"><b>${sol(cobrado)}</b><span>Cobrado en ${MES[new Date().getMonth()]}</span></div>`;
  const F=[["todos","Activos"],["porvencer","Por vencer"],["vencido","Vencidos"],["aldia","Al día"],["inactivo","Inactivos"]];
  $("#fchips").innerHTML=F.map(([k,t])=>`<button class="chip${filtro===k?" on":""}" data-f="${k}">${t}<i>${cnt[k]}</i></button>`).join("");

  const orden={vencido:0,porvencer:1,aldia:2,inactivo:3};
  const lista=alumnos.filter(a=>{const e=estado(a);
      if(filtro==="todos"?e==="inactivo":e!==filtro)return false;
      return !q||[a.nombre,a.apoderado,a.whatsapp,a.grupo].join(" ").toLowerCase().includes(q)})
    .sort((a,b)=>orden[estado(a)]-orden[estado(b)]||a.vence.localeCompare(b.vence)||a.nombre.localeCompare(b.nombre));

  $("#lista").innerHTML=lista.length?lista.map(a=>{const e=estado(a),n=diff(a.vence);
    const meta=[a.whatsapp?`📱 ${esc(fmtTel(a.whatsapp))}`:"",a.apoderado?`👤 ${esc(a.apoderado)}`:"",`💵 ${sol(a.monto)}`].filter(Boolean).join("</span><span>");
    const sub=[a.grupo,a.cinturon&&("Cinturón "+a.cinturon.toLowerCase()),a.edad&&(a.edad+" años")].filter(Boolean).map(esc).join(" · ");
    return `<article class="al st-${e}" data-id="${a.id}">
      <div class="al-top"><div><h3>${esc(a.nombre)}</h3><small>${sub||"&nbsp;"}</small></div><span class="pill p-${e}">${ETQ[e]}</span></div>
      <div class="al-due"><b>Vence: ${flarga(a.vence)}</b>${e!=="inactivo"?`<span>${cuando(n)}</span>`:""}</div>
      <div class="al-meta"><span>${meta}</span></div>
      ${a.avisado?`<div class="al-aviso">✓ Avisado el ${fcorta(a.avisado)}</div>`:""}
      ${a.notas?`<small>📝 ${esc(a.notas)}</small>`:""}
      <div class="al-act">
        <button class="b-wa" data-act="wa">💬 Avisar</button>
        <button class="b-pay" data-act="pago">✓ Pagó</button>
        <button class="b-ic" data-act="edit" aria-label="Editar">✏️</button>
        <button class="b-ic" data-act="del" aria-label="Eliminar">🗑️</button>
      </div></article>`}).join("")
   :`<div class="empty-st">${alumnos.length?"<b>Nadie en esta lista</b>Prueba con otro filtro o búsqueda.":"<b>Aún no hay alumnos</b>Toca «+ Nuevo alumno» para registrar el primero."}</div>`;

  const dias=cfg.ultimoBackup?Math.floor((Date.now()-new Date(cfg.ultimoBackup))/864e5):null;
  $("#backupWarn").hidden=!(storageOk&&alumnos.length&&(dias===null||dias>=7));
}

// ---------- eventos lista ----------
$("#q").addEventListener("input",render);
document.addEventListener("click",e=>{const b=e.target.closest("[data-f]");if(!b)return;filtro=b.dataset.f;render()});
$("#lista").addEventListener("click",e=>{
  const b=e.target.closest("[data-act]");if(!b)return;
  const a=alumnos.find(x=>x.id===b.closest(".al").dataset.id);if(!a)return;
  const act=b.dataset.act;
  if(act==="wa"){
    const n=numero(a.whatsapp);if(!n){toast("Este alumno no tiene número de WhatsApp");return}
    window.open(`https://wa.me/${n}?text=${encodeURIComponent(mensaje(a))}`,"_blank","noopener");
    a.avisado=hoy();saveAl();render();
  }
  if(act==="pago"){
    const nuevo=addMonths(a.vence,1);
    if(!confirm(`¿Registrar pago de ${sol(a.monto)} de ${a.nombre}?\n\nPeriodo pagado: desde ${fcorta(a.vence)}\nNuevo vencimiento: ${fcorta(nuevo)}`))return;
    (a.pagos=a.pagos||[]).push({fecha:hoy(),monto:+a.monto||0,periodo:a.vence});
    a.vence=nuevo;a.avisado=null;saveAl();render();toast(`✓ Pago registrado · vence ${fcorta(nuevo)}`);
  }
  if(act==="edit")abrirForm(a);
  if(act==="del"){if(confirm(`¿Eliminar a ${a.nombre}? Se borrará su historial de pagos.\n\n(Si solo se retiró, mejor edítalo y desmarca «activo».)`)){alumnos=alumnos.filter(x=>x!==a);saveAl();render();toast("Alumno eliminado")}}
});

// ---------- formulario alumno ----------
const dlgA=$("#dlgAlumno"),fA=$("#fAlumno");
const CINT=["Blanco","Amarillo","Naranja","Verde","Azul","Morado","Marrón","Negro"];
$("#selGrupo").innerHTML=`<option value="">—</option>`+D.clases.horarios.map(h=>`<option>${esc(h.grupo)}</option>`).join("");
$("#selCinturon").innerHTML=CINT.map(c=>`<option>${c}</option>`).join("");
let editando=null,venceTocado=false;
function abrirForm(a){
  editando=a||null;venceTocado=!!a;
  $("#fTitulo").textContent=a?"Editar alumno":"Nuevo alumno";
  const v=a||{nombre:"",apoderado:"",whatsapp:"",edad:"",grupo:"",cinturon:"Blanco",monto:cfg.monto,inicio:hoy(),vence:addMonths(hoy(),1),notas:"",activo:true};
  ["nombre","apoderado","whatsapp","edad","grupo","cinturon","monto","inicio","vence","notas"].forEach(k=>fA.elements[k].value=v[k]??"");
  fA.elements.activo.checked=v.activo!==false;
  const pg=(a&&a.pagos)||[];
  $("#fPagos").innerHTML=pg.length?`<b>Historial de pagos</b><ul>${pg.slice().reverse().slice(0,12).map(p=>`<li><span>${fcorta(p.fecha)}</span><span>${sol(p.monto)}</span></li>`).join("")}</ul>`:"";
  dlgA.showModal();
}
$("#btnNuevo").onclick=()=>abrirForm();
fA.elements.vence.addEventListener("input",()=>venceTocado=true);
fA.elements.inicio.addEventListener("change",()=>{if(!venceTocado&&fA.elements.inicio.value)fA.elements.vence.value=addMonths(fA.elements.inicio.value,1)});
fA.addEventListener("submit",e=>{
  if(e.submitter&&e.submitter.value!=="ok")return;
  const el=fA.elements,d={nombre:el.nombre.value.trim(),apoderado:el.apoderado.value.trim(),whatsapp:el.whatsapp.value.trim(),edad:el.edad.value,
    grupo:el.grupo.value,cinturon:el.cinturon.value,monto:+el.monto.value||0,inicio:el.inicio.value,vence:el.vence.value,notas:el.notas.value.trim(),activo:el.activo.checked};
  if(!d.nombre||!d.vence){e.preventDefault();return}
  if(editando)Object.assign(editando,d);else alumnos.push({id:uid(),...d,pagos:[],avisado:null,creado:hoy()});
  saveAl();render();toast(editando?"✓ Cambios guardados":"✓ Alumno registrado");
});
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>b.closest("dialog").close());

// ---------- ajustes ----------
const dlgC=$("#dlgCfg"),fC=$("#fCfg");
function abrirCfg(){
  fC.elements.dias.value=cfg.dias;fC.elements.monto.value=cfg.monto;
  fC.elements.msgPorVencer.value=cfg.msgPorVencer;fC.elements.msgVencido.value=cfg.msgVencido;
  fC.elements.pin.value="";fC.elements.pin.placeholder=cfg.pinHash?"PIN activo · escribe uno nuevo o «0» para quitarlo":"Sin PIN";
  $("#lastBk").textContent=cfg.ultimoBackup?`Última copia: ${fcorta(iso(new Date(cfg.ultimoBackup)))}`:"Aún no has descargado ninguna copia.";
  dlgC.showModal();
}
$("#btnCfg").onclick=abrirCfg;
$("#btnMsgReset").onclick=()=>{fC.elements.msgPorVencer.value=MSG.porVencer;fC.elements.msgVencido.value=MSG.vencido};
fC.addEventListener("submit",async e=>{
  if(e.submitter&&e.submitter.value!=="ok")return;
  cfg.dias=Math.max(0,+fC.elements.dias.value||0);cfg.monto=+fC.elements.monto.value||0;
  cfg.msgPorVencer=fC.elements.msgPorVencer.value||MSG.porVencer;cfg.msgVencido=fC.elements.msgVencido.value||MSG.vencido;
  const pin=fC.elements.pin.value.trim();
  if(pin==="0"){cfg.pinHash="";toast("PIN desactivado")}
  else if(pin){cfg.pinHash=await hash(pin);sessionSet(true);toast("✓ PIN guardado")}
  saveCfg();render();
});

// ---------- copias de seguridad ----------
function exportar(){
  const data={app:"karate-tarma-panel",version:1,exportado:new Date().toISOString(),config:{...cfg,pinHash:undefined},alumnos};
  descargar(`alumnos-karate-${hoy()}.json`,JSON.stringify(data,null,2),"application/json");
  cfg.ultimoBackup=new Date().toISOString();saveCfg();render();toast("💾 Copia descargada. Guárdala en Drive o envíatela por WhatsApp.");
}
$("#btnExport").onclick=exportar;$("#btnBackupNow").onclick=exportar;
$("#fileImport").addEventListener("change",async e=>{
  const f=e.target.files[0];e.target.value="";if(!f)return;
  try{const d=JSON.parse(await f.text());const lista=Array.isArray(d)?d:d.alumnos;
    if(!Array.isArray(lista)||lista.some(a=>!a||typeof a.nombre!=="string"||!a.vence))throw 0;
    if(!confirm(`La copia tiene ${lista.length} alumno(s). Esto REEMPLAZARÁ los ${alumnos.length} que hay ahora. ¿Continuar?`))return;
    alumnos=lista.map(a=>({...a,id:a.id||uid(),pagos:Array.isArray(a.pagos)?a.pagos:[]}));
    if(d.config){const {pinHash,...rest}=d.config;cfg={...cfg,...rest}}
    saveAl();saveCfg();render();dlgC.close();toast(`✓ ${alumnos.length} alumno(s) restaurados`);
  }catch(err){alert("Ese archivo no es una copia válida del panel.")}
});
$("#btnCsv").onclick=()=>{
  const cab=["Nombre","Apoderado","WhatsApp","Edad","Grupo","Cinturón","Inscripción","Vence","Estado","Mensualidad","Último pago","Notas"];
  const q=v=>`"${String(v??"").replace(/"/g,'""')}"`;
  const filas=alumnos.map(a=>{const up=(a.pagos||[]).at(-1);return [a.nombre,a.apoderado,a.whatsapp,a.edad,a.grupo,a.cinturon,a.inicio&&fcorta(a.inicio),fcorta(a.vence),ETQ[estado(a)],a.monto,up?fcorta(up.fecha):"",a.notas].map(q).join(";")});
  descargar(`alumnos-karate-${hoy()}.csv`,"﻿"+[cab.map(q).join(";"),...filas].join("\r\n"),"text/csv;charset=utf-8");
};
$("#btnWipe").onclick=()=>{
  if(!confirm("¿Borrar TODOS los alumnos y ajustes de este dispositivo? Esto no se puede deshacer."))return;
  if(prompt("Escribe BORRAR para confirmar")!=="BORRAR")return;
  alumnos=[];cfg={...CFG0};saveAl();saveCfg();dlgC.close();render();toast("Datos borrados");
};

// ---------- PIN ----------
async function hash(t){
  try{const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode("kt:"+t));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
  catch(e){let h=0;for(const c of "kt:"+t)h=(h*31+c.charCodeAt(0))|0;return "s"+h}
}
const sessionGet=()=>{try{return sessionStorage.getItem(K_UNLOCK)==="1"}catch(e){return false}};
const sessionSet=v=>{try{v?sessionStorage.setItem(K_UNLOCK,"1"):sessionStorage.removeItem(K_UNLOCK)}catch(e){}};
if(cfg.pinHash&&!sessionGet()){$("#lock").hidden=false;setTimeout(()=>$("#lockPin").focus(),50)}
$("#lockForm").addEventListener("submit",async e=>{e.preventDefault();
  if(await hash($("#lockPin").value)===cfg.pinHash){sessionSet(true);$("#lock").hidden=true;$("#lockPin").value=""}
  else{$("#lockErr").textContent="PIN incorrecto";$("#lockPin").select()}
});

render();
// refrescar estados si el panel queda abierto de un día para otro
setInterval(render,60*60*1000);
})();
