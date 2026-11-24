/* =========================================================
   DATOS EDITABLES DE LA PÁGINA  (no necesitas saber programar)
   Cambia los textos entre comillas y guarda. Todo lo demás
   (clases, tienda, torneos, galería, contacto) se actualiza solo.
   ⚠ El repositorio es PÚBLICO: no pongas aquí datos de alumnos.
   ========================================================= */
const DATOS = {
  club: {
    nombre: "Karate Dojo Tarma",          // <- nombre real de tu academia
    lema: "Disciplina, respeto y espíritu de superación",
    ciudad: "Tarma, Junín – Perú"
  },

  contacto: {
    whatsapp: "51900000000",               // <- tu número con 51 delante, sin + ni espacios
    telefono: "+51 900 000 000",
    yape: "900 000 000",                   // <- número de Yape/Plin para pagos
    email: "contacto@karatetarma.pe",
    direccion: "Jr. Lima 123, Tarma (referencia del local)",
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
    mapa: { lat: -11.4189, lon: -75.6903 } // coordenadas del local
  },

  /* ---------- CLASES ---------- */
  clases: {
    precio: 80,                            // mensualidad en soles
    matricula: 0,                          // 0 = no se muestra
    dias: ["Lunes", "Miércoles", "Viernes"],
    horarios: [
      { grupo: "Niños",   edad: "5 – 11 años",  hora: "4:00 – 5:00 pm" },
      { grupo: "Juvenil", edad: "12 – 17 años", hora: "5:00 – 6:00 pm" },
      { grupo: "Adultos", edad: "18+ años",     hora: "6:00 – 7:30 pm" }
    ],
    incluye: [
      "12 clases al mes (3 por semana)",
      "Kata, kumite y defensa personal",
      "Exámenes de cinturón",
      "Preparación para torneos",
      "Grupo según edad y nivel"
    ],
    nota: "El pago es mensual y se renueva cada mes desde tu fecha de inscripción."
  },

  /* ---------- TIENDA ----------
     variantes: [ "talla o color", precio ]
     colores: opcional, el cliente elige uno.
     icono: gi | belt | glove | shin | chest | mouth
     img: opcional, ej. "img/tienda/karategi.jpg" (reemplaza al dibujo) */
  tienda: {
    nota: "Precios referenciales. Confirma stock y talla por WhatsApp antes de pagar.",
    productos: [
      { id: "karategi", nombre: "Karategi de entrenamiento", icono: "gi", badge: "Más vendido",
        desc: "Blanco, resistente y cómodo. Incluye cinturón blanco.",
        opcion: "Talla",
        variantes: [["000",55],["00",60],["0",65],["1",70],["2",75],["3",80],["4",85],["5",90],["6",95]] },
      { id: "karategi-comp", nombre: "Karategi de competencia", icono: "gi", badge: "Kumite / Kata",
        desc: "Tela más liviana, corte de competencia.",
        opcion: "Talla",
        variantes: [["1",150],["2",160],["3",170],["4",180],["5",190],["6",200]] },
      { id: "guantines", nombre: "Guantines de karate", icono: "glove",
        desc: "Tipo WKF, acolchados para kumite.",
        opcion: "Talla", colores: ["Rojo","Azul"],
        variantes: [["XS",65],["S",70],["M",75],["L",75],["XL",80]] },
      { id: "cinturon", nombre: "Cinturón de grado", icono: "belt",
        desc: "Para tu próximo examen. Todos los colores.",
        opcion: "Color",
        variantes: [["Blanco",15],["Amarillo",15],["Naranja",15],["Verde",15],["Azul",15],["Morado",15],["Marrón",18],["Negro",35]] },
      { id: "espinilleras", nombre: "Espinilleras con empeine", icono: "shin",
        desc: "Protegen canilla y pie. Uso en torneos.",
        opcion: "Talla", colores: ["Rojo","Azul"],
        variantes: [["XS",80],["S",85],["M",90],["L",95],["XL",100]] },
      { id: "peto", nombre: "Protector de pecho (peto)", icono: "chest",
        desc: "Obligatorio en kumite infantil y juvenil.",
        opcion: "Talla",
        variantes: [["Niño",110],["Juvenil",120],["Adulto",130]] },
      { id: "bucal", nombre: "Protector bucal", icono: "mouth",
        desc: "Moldeable con agua caliente. Con estuche.",
        opcion: "Talla",
        variantes: [["Niño",12],["Adulto",15]] }
    ],
    guiaTallas: [
      ["000","90 – 100 cm","2 – 3 años"],
      ["00","100 – 110 cm","3 – 4 años"],
      ["0","110 – 130 cm","5 – 7 años"],
      ["1","130 – 140 cm","8 – 9 años"],
      ["2","140 – 150 cm","10 – 11 años"],
      ["3","150 – 160 cm","12 – 13 años"],
      ["4","160 – 170 cm","Juvenil / adulto"],
      ["5","170 – 180 cm","Adulto"],
      ["6","180 – 190 cm","Adulto"]
    ]
  },

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
     2) Escribe su ruta aquí, ej:  { src: "img/galeria/foto1.jpg", titulo: "Entrenamiento" } */
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
