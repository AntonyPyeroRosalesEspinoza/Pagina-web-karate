# Página web de Karate – Tarma

Sitio **estático** (HTML + CSS + JS), responsive para celular y PC. No requiere instalar nada.

## Cómo editar
Todo el contenido está en `js/datos.js`: nombre del club, precios, torneos, contacto, redes y galería.
- **Torneos:** agrega una línea en `torneos`; cuando pasa la fecha, se mueve sola a "Resultados".
- **Fotos:** copia las imágenes a `img/galeria/` y escribe su ruta en `galeria`.
- **WhatsApp:** cambia `whatsapp` (con 51 delante) y el formulario enviará los mensajes a ese número.

## Ver en local
Abre `index.html` en el navegador.

## Publicar en la nube (privado)
Mantén el repositorio **privado**. GitHub Pages en repos privados requiere plan de pago (Pro/Team);
alternativas gratuitas con repo privado: Cloudflare Pages o Netlify (conectan el repo y publican la carpeta raíz, sin build).
