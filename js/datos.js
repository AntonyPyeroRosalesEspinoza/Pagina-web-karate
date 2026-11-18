/* =========================================================
   DATOS EDITABLES DE LA PÁGINA  (no necesitas saber programar)
   Cambia los textos entre comillas y guarda. Todo lo demás
   (precios, torneos, galería, contacto) se actualiza solo.
   ========================================================= */
const DATOS = {
  club: {
    nombre: "Karate Dojo Tarma",          // <- pon el nombre real de tu academia
    lema: "Disciplina, respeto y espíritu de superación",
    ciudad: "Tarma, Junín – Perú"
  },

  contacto: {
    whatsapp: "51900000000",               // <- tu número con 51 delante, sin + ni espacios
    telefono: "+51 900 000 000",
    email: "contacto@karatetarma.pe",
    direccion: "Jr. Lima 123, Tarma (referencia del local)",
    horario: "Lun – Vie · 5:00 pm – 8:00 pm  |  Sáb · 9:00 am – 12:00 pm",
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
    // Mapa: cambia las coordenadas por las de tu local (clic derecho en Google Maps > copiar coordenadas)
    mapa: { lat: -11.4189, lon: -75.6903 }
  },

  /* ---------- PRECIOS (en soles) ---------- */
  inscripcion: {
    matricula: 30,                         // pago único de inscripción
    nota: "La matrícula incluye ficha de registro y seguro básico. El uniforme (karategi) se compra aparte."
  },
  planes: [
    { nombre: "Niños",       edad: "5 – 11 años",  mensual: 50, clases: "2 clases por semana", extras: ["Grupo por edades", "Enfoque en juego y disciplina", "Exámenes de cinturón"], destacado: false },
    { nombre: "Juvenil",     edad: "12 – 17 años", mensual: 60, clases: "3 clases por semana", extras: ["Preparación para torneos", "Kata y kumite", "Exámenes de cinturón"], destacado: true },
    { nombre: "Adultos",     edad: "18+ años",     mensual: 70, clases: "3 clases por semana", extras: ["Defensa personal", "Condición física", "Exámenes de cinturón"], destacado: false },
    { nombre: "Familiar",    edad: "2 o más hermanos", mensual: 90, clases: "Según edad", extras: ["Descuento por familia", "Un solo pago mensual", "Horarios flexibles"], destacado: false }
  ],
  uniforme: { karategi: 60, cinturon: 10, nota: "Precios referenciales del uniforme." },

  /* ---------- PRÓXIMOS TORNEOS ----------
     fecha en formato AÑO-MES-DÍA. Los que ya pasaron se mueven solos a "Resultados". */
  torneos: [
    { fecha: "2026-12-14", nombre: "Copa Tarma de Karate", lugar: "Coliseo Municipal de Tarma", categoria: "Infantil, juvenil y adulto", detalle: "Inscripciones abiertas hasta una semana antes." },
    { fecha: "2027-02-20", nombre: "Torneo Regional Junín", lugar: "Huancayo", categoria: "Kata y kumite", detalle: "Salida en grupo desde Tarma." },
    { fecha: "2027-04-17", nombre: "Campeonato Nacional Escolar", lugar: "Lima", categoria: "Escolar", detalle: "Por confirmar." }
  ],
  resultados: [
    { fecha: "2026-09-13", nombre: "Open Valle del Mantaro", resultado: "3 oros · 5 platas · 4 bronces" }
  ],

  /* ---------- GALERÍA ----------
     1) Copia tus fotos a la carpeta  img/galeria/
     2) Escribe su nombre aquí, ej:  { src: "img/galeria/foto1.jpg", titulo: "Entrenamiento" }
     Si src está vacío se muestra una imagen de ejemplo. */
  galeria: [
    { src: "", titulo: "Entrenamiento en el dojo" },
    { src: "", titulo: "Examen de cinturón" },
    { src: "", titulo: "Torneo – podio" },
    { src: "", titulo: "Clase de niños" },
    { src: "", titulo: "Kata en equipo" },
    { src: "", titulo: "Kumite" },
    { src: "", titulo: "Campamento" },
    { src: "", titulo: "Entrega de medallas" }
  ]
};
