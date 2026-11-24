/* Panel del sensei: alumnos, vencimientos y avisos por WhatsApp.
   - Los datos se guardan SOLO en este dispositivo, CIFRADOS con AES-256-GCM.
   - La llave se deriva de tu contraseña (PBKDF2-SHA256, 310 000 iteraciones).
   - Sin la contraseña, lo guardado es ilegible. Nada se envía a internet. */
(function(){
const D=DATOS, $=s=>document.querySelector(s);
const K_VAULT="kt_boveda_v1", LEGACY=["kt_alumnos_v1","kt_config_v1"];
const esc=t=>String(t??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const sol=n=>"S/ "+(+n||0);
const enc=new TextEncoder(), dec=new TextDecoder();

// ---------- almacenamiento ----------
let storageOk=true;
try{localStorage.setItem("kt_t","1");localStorage.removeItem("kt_t")}catch(e){storageOk=false}
const raw={get(k){try{const v=localStorage.getItem(k);return v?JSON.parse(v):null}catch(e){return null}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){$("#storeWarn").hidden=false;return false}},
  del(k){try{localStorage.removeItem(k)}catch(e){}}};

// ---------- criptografía ----------
const cryptoOk=!!(window.crypto&&crypto.subtle);
const b64=buf=>{const u=new Uint8Array(buf);let s="";for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s)};
const unb64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const ITER=310000;
async function derivar(pass,salt,iter=ITER){
  const base=await crypto.subtle.importKey("raw",enc.encode(pass),"PBKDF2",false,["deriveKey"]);
  return crypto.subtle.deriveKey({name:"PBKDF2",salt,iterations:iter,hash:"SHA-256"},base,{name:"AES-GCM",length:256},false,["encrypt","decrypt"]);
}
async function cifrar(obj,llave,salt){
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const data=await crypto.subtle.encrypt({name:"AES-GCM",iv},llave,enc.encode(JSON.stringify(obj)));
  return {app:"karate-tarma-panel",v:1,kdf:"PBKDF2-SHA256",iter:ITER,salt:b64(salt),iv:b64(iv),data:b64(data)};
}
async function descifrar(boveda,pass){ // lanza error si la contraseña es incorrecta
  const salt=unb64(boveda.salt),llave=await derivar(pass,salt,boveda.iter||ITER);
  const pt=await crypto.subtle.decrypt({name:"AES-GCM",iv:unb64(boveda.iv)},llave,unb64(boveda.data));
  return {obj:JSON.parse(dec.decode(pt)),llave,salt};
}
const esBoveda=v=>v&&typeof v==="object"&&typeof v.salt==="string"&&typeof v.iv==="string"&&typeof v.data==="string";

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
const flarga=s=>`${DSEM[parse(s).getDay()]} ${fcorta(s)}`;
const fmsg=s=>{const d=parse(s);return `${d.getDate()} de ${MES[d.getMonth()]}`};
const cuando=n=>n===0?"hoy":n===1?"mañana":n>1?`en ${n} días`:n===-1?"ayer":`hace ${-n} días`;

// ---------- estado en memoria (solo mientras está desbloqueado) ----------
const MSG={
  porVencer:"Hola {contacto} 👋, le saludamos de {club} 🥋.\nLe recordamos que la mensualidad de *{alumno}* (S/ {monto}) vence *{cuando}*, el {fecha}.\nPuede pagar en el dojo o por Yape al {yape}.\n¡Gracias! Nos vemos {dias_clase} 💪",
  vencido:"Hola {contacto} 👋, le saludamos de {club} 🥋.\nLa mensualidad de *{alumno}* (S/ {monto}) venció {cuando} ({fecha}).\nLe agradeceremos regularizar el pago para seguir entrenando. Puede pagar en el dojo o por Yape al {yape}.\n¡Gracias!"
};
const CFG0={dias:3,monto:D.clases.precio,msgPorVencer:MSG.porVencer,msgVencido:MSG.vencido,ultimoBackup:null,bloqueoMin:5};
let alumnos=[], cfg={...CFG0}, llave=null, salt=null;
let cola=Promise.resolve();
function guardar(){ // cifra y guarda; las llamadas se encadenan para no pisarse
  if(!llave)return cola;
  const snap={alumnos,cfg};
  cola=cola.then(async()=>{raw.set(K_VAULT,await cifrar(snap,llave,salt))}).catch(e=>{console.error(e);toast("⚠️ No se pudo guardar")});
  return cola;
}
const saveAl=guardar, saveCfg=guardar;

// ---------- reglas del negocio ----------
function estado(a){if(a.activo===false)return "inactivo";const n=diff(a.vence);return n<0?"vencido":n<=cfg.dias?"porvencer":"aldia"}
const ETQ={aldia:"Al día",porvencer:"Por vencer",vencido:"Vencido",inactivo:"Inactivo"};
function numero(t){let n=String(t||"").replace(/\D/g,"");if(n.length===9&&n[0]==="9")n="51"+n;return n}
const fmtTel=t=>{const n=String(t||"").replace(/\D/g,"");return n.length===9?n.replace(/(\d{3})(\d{3})(\d{3})/,"$1 $2 $3"):t};
function mensaje(a){
  const n=diff(a.vence),tpl=n<0?cfg.msgVencido:cfg.msgPorVencer;
  const dias=D.clases.dias.map(d=>d.toLowerCase()),diasTxt=dias.length>1?dias.slice(0,-1).join(", ")+" y "+dias.at(-1):dias[0];
  const v={contacto:a.apoderado||a.nombre.split(" ")[0],alumno:a.nombre,monto:a.monto,fecha:fmsg(a.vence),cuando:cuando(n),club:D.club.nombre,yape:D.contacto.yape,dias_clase:diasTxt};
  return tpl.replace(/\{(\w+)\}/g,(m,k)=>k in v?v[k]:m);
}

// ---------- utilidades UI ----------
const toast=m=>{const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),2400)};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
function descargar(nombre,contenido,tipo){const b=new Blob([contenido],{type:tipo});const u=URL.createObjectURL(b);
  const a=document.createElement("a");a.href=u;a.download=nombre;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000)}

// ---------- render ----------
let filtro="todos";
$("#clubName").textContent=D.club.nombre;
if(!storageOk)$("#storeWarn").hidden=false;

function render(){
  if(!llave){$("#kpis").innerHTML="";$("#lista").innerHTML="";$("#fchips").innerHTML="";return}
  const q=$("#q").value.trim().toLowerCase();
  const cnt={todos:0,porvencer:0,vencido:0,aldia:0,inactivo:0};
  alumnos.forEach(a=>{const e=estado(a);cnt[e]++;if(e!=="inactivo")cnt.todos++});
  const mesAct=hoy().slice(0,7);
  const cobrado=alumnos.reduce((s,a)=>s+(a.pagos||[]).filter(p=>String(p.fecha).slice(0,7)===mesAct).reduce((x,p)=>x+(+p.monto||0),0),0);
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
    return `<article class="al st-${e}" data-id="${esc(a.id)}">
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

// ---------- eventos de la lista ----------
$("#q").addEventListener("input",render);
document.addEventListener("click",e=>{const b=e.target.closest("[data-f]");if(!b||!llave)return;filtro=b.dataset.f;render()});
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

// ---------- formulario de alumno ----------
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
  fC.elements.dias.value=cfg.dias;fC.elements.monto.value=cfg.monto;fC.elements.bloqueoMin.value=cfg.bloqueoMin;
  fC.elements.msgPorVencer.value=cfg.msgPorVencer;fC.elements.msgVencido.value=cfg.msgVencido;fC.elements.nuevaPass.value="";
  $("#lastBk").textContent=cfg.ultimoBackup?`Última copia: ${fcorta(iso(new Date(cfg.ultimoBackup)))}`:"Aún no has descargado ninguna copia.";
  dlgC.showModal();
}
$("#btnCfg").onclick=abrirCfg;
$("#btnMsgReset").onclick=()=>{fC.elements.msgPorVencer.value=MSG.porVencer;fC.elements.msgVencido.value=MSG.vencido};
fC.addEventListener("submit",async e=>{
  if(e.submitter&&e.submitter.value!=="ok")return;
  cfg.dias=Math.max(0,+fC.elements.dias.value||0);cfg.monto=+fC.elements.monto.value||0;
  cfg.bloqueoMin=Math.min(60,Math.max(1,+fC.elements.bloqueoMin.value||5));
  cfg.msgPorVencer=fC.elements.msgPorVencer.value||MSG.porVencer;cfg.msgVencido=fC.elements.msgVencido.value||MSG.vencido;
  const np=fC.elements.nuevaPass.value;
  if(np){ // cambiar contraseña: nueva sal y nueva llave
    salt=crypto.getRandomValues(new Uint8Array(16));llave=await derivar(np,salt);
    await guardar();toast("🔐 Contraseña cambiada. Descarga una copia nueva.");
  }else{saveCfg()}
  render();
});

// ---------- copias de seguridad (cifradas) ----------
async function exportar(){
  cfg.ultimoBackup=new Date().toISOString();
  await guardar();
  const boveda=raw.get(K_VAULT);
  descargar(`alumnos-karate-${hoy()}-cifrado.json`,JSON.stringify(boveda),"application/json");
  render();toast("💾 Copia cifrada descargada. Guárdala en tu Drive.");
}
$("#btnExport").onclick=exportar;$("#btnBackupNow").onclick=exportar;

let pendiente=null;
const dlgR=$("#dlgRestore");
$("#fileImport").addEventListener("change",async e=>{
  const f=e.target.files[0];e.target.value="";if(!f)return;
  let d;try{d=JSON.parse(await f.text())}catch(err){alert("Ese archivo no es una copia del panel.");return}
  if(!esBoveda(d)){alert("Ese archivo no es una copia cifrada del panel.");return}
  pendiente=d;$("#restInfo").textContent=`Archivo: ${f.name}. Esto reemplazará los ${alumnos.length} alumno(s) actuales.`;
  $("#restPass").value="";$("#restErr").textContent="";dlgR.showModal();setTimeout(()=>$("#restPass").focus(),50);
});
$("#restGo").onclick=async()=>{
  const btn=$("#restGo");btn.disabled=true;$("#restErr").textContent="Verificando…";
  try{const {obj}=await descifrar(pendiente,$("#restPass").value);
    if(!Array.isArray(obj.alumnos))throw new Error("formato");
    alumnos=obj.alumnos.filter(a=>a&&typeof a.nombre==="string"&&a.vence).map(a=>({...a,id:a.id||uid(),pagos:Array.isArray(a.pagos)?a.pagos:[]}));
    cfg={...CFG0,...cfg,...(obj.cfg||{})};
    await guardar(); // se vuelve a cifrar con TU contraseña actual
    pendiente=null;dlgR.close();dlgC.close();render();toast(`✓ ${alumnos.length} alumno(s) restaurados`);
  }catch(err){$("#restErr").textContent="Contraseña incorrecta o archivo dañado."}
  finally{btn.disabled=false}
};
$("#btnCsv").onclick=()=>{
  if(!confirm("El archivo de Excel NO va cifrado: cualquiera que lo abra verá los datos.\nÚsalo solo en tu computadora y no lo compartas. ¿Continuar?"))return;
  const cab=["Nombre","Apoderado","WhatsApp","Edad","Grupo","Cinturón","Inscripción","Vence","Estado","Mensualidad","Último pago","Notas"];
  const q=v=>{let s=String(v??"");if(/^[=+\-@]/.test(s))s="'"+s;return `"${s.replace(/"/g,'""')}"`}; // evita fórmulas maliciosas en Excel
  const filas=alumnos.map(a=>{const up=(a.pagos||[]).at(-1);return [a.nombre,a.apoderado,a.whatsapp,a.edad,a.grupo,a.cinturon,a.inicio&&fcorta(a.inicio),fcorta(a.vence),ETQ[estado(a)],a.monto,up?fcorta(up.fecha):"",a.notas].map(q).join(";")});
  descargar(`alumnos-karate-${hoy()}.csv`,"﻿"+[cab.map(q).join(";"),...filas].join("\r\n"),"text/csv;charset=utf-8");
};
$("#btnWipe").onclick=()=>{
  if(!confirm("¿Borrar TODOS los alumnos y ajustes de este dispositivo? Esto no se puede deshacer."))return;
  if(prompt("Escribe BORRAR para confirmar")!=="BORRAR")return;
  raw.del(K_VAULT);LEGACY.forEach(raw.del);llave=null;alumnos=[];cfg={...CFG0};location.reload();
};

// ---------- bloqueo / desbloqueo ----------
const lock=$("#lock"),lf=$("#lockForm"),p1=$("#lockPin"),p2=$("#lockPin2"),err=$("#lockErr"),lbtn=$("#lockBtn");
let modo="entrar",fallos=0,esperaHasta=0;
function mostrarLock(m){
  modo=m;document.body.classList.add("locked");lock.hidden=false;
  document.querySelectorAll("dialog[open]").forEach(d=>d.close());
  p1.value="";p2.value="";err.textContent="";
  if(m==="crear"){
    $("#lockTitle").textContent="Crea tu contraseña";
    $("#lockMsg").textContent="Tus datos se guardarán cifrados en este dispositivo. Mínimo 8 caracteres. Si la olvidas, solo podrás recuperar los datos desde una copia.";
    p2.hidden=false;p2.required=true;p1.autocomplete="new-password";lbtn.textContent="Crear y entrar";
  }else{
    $("#lockTitle").textContent="Panel del sensei";$("#lockMsg").textContent="🔒 Datos cifrados. Ingresa tu contraseña.";
    p2.hidden=true;p2.required=false;p1.autocomplete="current-password";lbtn.textContent="Entrar";
  }
  setTimeout(()=>p1.focus(),50);
}
function bloquear(){
  llave=null;salt=null;alumnos=[];cfg={...CFG0};$("#q").value="";render();
  mostrarLock(raw.get(K_VAULT)?"entrar":"crear");
}
function abrir(){document.body.classList.remove("locked");lock.hidden=true;ultimo=Date.now();render()}
lf.addEventListener("submit",async e=>{
  e.preventDefault();if(!cryptoOk)return;
  if(Date.now()<esperaHasta){err.textContent=`Espera ${Math.ceil((esperaHasta-Date.now())/1000)} s antes de reintentar.`;return}
  lbtn.disabled=true;err.textContent="Verificando…";
  try{
    if(modo==="crear"){
      if(p1.value.length<8){err.textContent="Usa al menos 8 caracteres.";return}
      if(p1.value!==p2.value){err.textContent="Las contraseñas no coinciden.";return}
      salt=crypto.getRandomValues(new Uint8Array(16));llave=await derivar(p1.value,salt);
      // migrar datos sin cifrar de la versión anterior, si existen
      const viejos=raw.get(LEGACY[0]),vcfg=raw.get(LEGACY[1]);
      alumnos=Array.isArray(viejos)?viejos:[];
      if(vcfg){const {pinHash,...r}=vcfg;cfg={...CFG0,...r}}
      await guardar();LEGACY.forEach(raw.del);
      abrir();toast(alumnos.length?`🔐 ${alumnos.length} alumno(s) protegidos con tu contraseña`:"🔐 Panel protegido con tu contraseña");
    }else{
      const {obj,llave:k,salt:s}=await descifrar(raw.get(K_VAULT),p1.value);
      llave=k;salt=s;alumnos=Array.isArray(obj.alumnos)?obj.alumnos:[];cfg={...CFG0,...(obj.cfg||{})};fallos=0;
      abrir();
    }
  }catch(ex){
    fallos++;const s=fallos>=3?Math.min(60,2**(fallos-2)*5):0;
    if(s)esperaHasta=Date.now()+s*1000;
    err.textContent="Contraseña incorrecta"+(s?` · espera ${s} s`:"");p1.select();
  }finally{lbtn.disabled=false}
});
$("#btnLock").onclick=bloquear;

// bloqueo automático por inactividad
let ultimo=Date.now();
["pointerdown","keydown","scroll","touchstart"].forEach(ev=>addEventListener(ev,()=>{ultimo=Date.now()},{passive:true}));
const revisar=()=>{if(llave&&Date.now()-ultimo>cfg.bloqueoMin*60000)bloquear()};
setInterval(()=>{revisar();if(llave)render()},15000);
document.addEventListener("visibilitychange",()=>{if(document.hidden)return;revisar()});

// ---------- inicio ----------
if(!cryptoOk){
  lock.hidden=false;document.body.classList.add("locked");
  $("#lockTitle").textContent="Navegador no compatible";
  $("#lockMsg").textContent="Abre el panel desde la dirección https:// con Chrome, Safari, Edge o Firefox actualizados.";
  p1.hidden=true;lbtn.hidden=true;
}else{
  bloquear();
}
})();
