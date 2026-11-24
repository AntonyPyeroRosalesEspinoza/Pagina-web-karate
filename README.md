# Página web de Karate – Tarma

Sitio **estático** (HTML + CSS + JS), responsive para celular y PC. No requiere instalar nada.

- **Demo:** https://antonypyerorosalesespinoza.github.io/Pagina-web-karate/
- **Panel del sensei:** https://antonypyerorosalesespinoza.github.io/Pagina-web-karate/panel.html

## Qué tiene
| Parte | Archivo | Qué hace |
|---|---|---|
| Página pública | `index.html` | Clases (S/ 80 al mes, lunes, miércoles y viernes), tienda con carrito y pedido por WhatsApp, torneos, galería y contacto |
| Panel del sensei | `panel.html` | Registro de alumnos, vencimientos, aviso de pago por WhatsApp, pagos, copias de seguridad y exportación a Excel |

## Cómo editar la página
Todo está en `js/datos.js`: nombre, WhatsApp, Yape, precio y días de clase, horarios, **productos y precios por talla**, torneos y galería.
- **Productos:** cada uno tiene `variantes: [["talla", precio], …]` y, opcionalmente, `colores`.
- **Fotos de productos:** agrega `img: "img/tienda/karategi.jpg"` y se usa la foto en lugar del dibujo.
- **Torneos:** agrega una línea; cuando pasa la fecha, se mueve solo a "Resultados".

## Panel del sensei: cómo funciona
1. Abre `panel.html` en tu celular. Puedes agregarlo a la pantalla de inicio desde el menú del navegador.
2. **+ Nuevo alumno:** nombre, apoderado, WhatsApp y fecha de vencimiento (por defecto, un mes después de la inscripción).
3. El panel ordena a los alumnos en **Vencidos**, **Por vencer** (por defecto, 3 días antes) y **Al día**.
4. **💬 Avisar:** abre WhatsApp con el mensaje ya escrito. Tú lo revisas y lo envías. Queda marcado "Avisado el …".
5. **✓ Pagó:** registra el pago y mueve el vencimiento un mes.
6. **⚙️ Ajustes:** días de aviso, texto de los mensajes, PIN, copia de seguridad y exportación a Excel.

### ⚠️ Importante sobre los datos de alumnos
- Se guardan **solo en el navegador del dispositivo** donde los registras. **No** se suben a GitHub ni a internet.
- Si borras los datos del navegador o cambias de celular, se pierden. **Descarga una copia** cada semana (⚙️ → Descargar copia) y guárdala en Drive o envíatela por WhatsApp. Con "Restaurar copia" la cargas en otro dispositivo.
- El repositorio es público: **nunca** subas el archivo de copia (`alumnos-karate-*.json`) al repositorio. El `.gitignore` ya lo bloquea.
