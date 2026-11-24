# Página web de Karate – Tarma

Sitio **estático** (HTML + CSS + JS), responsive para celular y PC. No requiere instalar nada.

- **Demo:** https://antonypyerorosalesespinoza.github.io/Pagina-web-karate/
- **Panel del sensei:** https://antonypyerorosalesespinoza.github.io/Pagina-web-karate/panel.html

## Qué tiene
| Parte | Archivo | Qué hace |
|---|---|---|
| Inicio y matrícula | `index.html` | Portada con dos entradas (Matrícula / Tienda), plan de S/ 80 al mes (lunes, miércoles y viernes), ficha de matrícula por WhatsApp, torneos, galería y contacto |
| Tienda | `tienda.html` | Productos por talla y color, carrito y pedido por WhatsApp |
| Panel del sensei | `panel.html` | Alumnos **cifrados con contraseña**, vencimientos, aviso de pago por WhatsApp, pagos, copias cifradas y exportación a Excel |

## Cómo editar la página
Guía paso a paso: **[COMO-EDITAR.md](COMO-EDITAR.md)**.

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
6. **⚙️ Ajustes:** días de aviso, texto de los mensajes, minutos para el bloqueo automático, cambio de contraseña, copia de seguridad y exportación a Excel.
7. **🔒** bloquea el panel al instante.

### Seguridad
- La primera vez pide **crear una contraseña** (mínimo 8 caracteres). Los datos se guardan **cifrados (AES-256)**; sin la contraseña son ilegibles, incluso desde las herramientas del navegador.
- Se bloquea solo tras unos minutos sin usar (5 por defecto). Tras varios intentos fallidos, obliga a esperar.
- Las **copias de seguridad también van cifradas**. Para restaurarlas se pide la contraseña con la que se hicieron.
- El **Excel (CSV) no va cifrado**: úsalo solo en tu computadora.
- **Si olvidas la contraseña no hay forma de recuperar los datos**, salvo desde una copia cuya contraseña recuerdes.
- Las páginas tienen una política de seguridad (CSP) que impide cargar scripts de otros sitios.

### ⚠️ Importante sobre los datos de alumnos
- Se guardan **cifrados, solo en el navegador del dispositivo** donde los registras. **No** se suben a GitHub ni a internet.
- Si borras los datos del navegador o cambias de celular, se pierden. **Descarga una copia** cada semana (⚙️ → Copia cifrada) y guárdala en Drive o envíatela por WhatsApp. Con "Restaurar copia" la cargas en otro dispositivo.
- El repositorio es público: **nunca** subas el archivo de copia (`alumnos-karate-*.json`) al repositorio. El `.gitignore` ya lo bloquea.
