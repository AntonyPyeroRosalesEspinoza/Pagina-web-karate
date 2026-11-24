# Cómo cambiar precios, horarios y productos

Todo lo que se ve en la página está en **un solo archivo: `js/datos.js`**. No hace falta saber programar.

## Desde el celular o la PC (en GitHub)
1. Entra a tu repositorio en github.com → abre la carpeta **`js`** → toca **`datos.js`**.
2. Toca el **lápiz ✏️** (Edit this file). En el celular, activa "Sitio de escritorio" si no lo ves.
3. Cambia **solo lo que está entre comillas o los números**. Ejemplos:

| Quiero cambiar… | Busca esta línea | Ejemplo |
|---|---|---|
| Mensualidad | `precio: 80,` | `precio: 90,` |
| Días de clase | `dias: ["Lunes", "Miércoles", "Viernes"],` | `dias: ["Martes", "Jueves"],` |
| Horario de un grupo | `hora: "4:00 – 5:00 pm"` | `hora: "3:30 – 4:30 pm"` |
| Precio de un karategi | `["2",75]` (talla 2 a S/ 75) | `["2",80]` |
| WhatsApp | `whatsapp: "51900000000",` | `whatsapp: "51987654321",` |
| Yape | `yape: "900 000 000",` | `yape: "987 654 321",` |

4. Baja y toca **Commit changes** → otra vez **Commit changes**.
5. Espera **1 o 2 minutos** y recarga la página. Si no cambia, recarga sin caché.

## Agregar un producto nuevo
Copia un producto completo dentro de `productos: [ … ]`, pégalo debajo y cambia los datos:
```js
{ id: "bolso", nombre: "Bolso deportivo", icono: "gi",
  desc: "Para llevar tu karategi.",
  opcion: "Talla",
  variantes: [["Único",45]] },
```
- `id`: una palabra sin espacios y que no se repita.
- `variantes`: `["talla o color", precio]`. Si hay una sola, la tienda no muestra las tallas.
- `colores: ["Rojo","Azul"]` es opcional.
- Para usar una **foto**, sube la imagen a `img/tienda/` y añade `img: "img/tienda/bolso.jpg",`.

## Cuidado con
- No borres comas `,`, comillas `"` ni corchetes `[ ]`. Si la página queda en blanco, es por eso. En GitHub puedes ver el cambio anterior en **History** y volver a copiarlo.
- **Nunca** pongas datos de alumnos en este archivo: el repositorio es público.

## El panel del sensei (alumnos)
- Se abre en `.../panel.html`. Ahí los cambios se hacen **en la misma pantalla** (⚙️ Ajustes), no en GitHub.
- La mensualidad que usa el panel para alumnos nuevos se cambia en **⚙️ → Mensualidad por defecto**. A los alumnos ya registrados se les cambia con ✏️.
