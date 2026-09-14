# MD Browser - Walkthrough

¡La aplicación **MD Browser** está lista y corriendo! 🎉

He implementado todo lo necesario según los requerimientos usando **Next.js** y **Vanilla CSS**.

## Cambios realizados

### 1. Inicialización y Backend
- Se creó el proyecto en la carpeta `md-browser`.
- Se configuró el endpoint `GET /api/files` que explora la carpeta superior (donde se encuentran `requerimientos.txt` y `todo.md`) y devuelve la estructura jerárquica de carpetas y archivos markdown, ordenados por fecha de creación.
- Se configuró el endpoint `GET /api/file` para devolver el contenido de los archivos `.md`.

### 2. Frontend y Layout
- **Panel Izquierdo:** Un árbol de archivos recursivo (`FileTree`) que te permite navegar por las carpetas y ver solo los archivos markdown. Muestra íconos de carpetas y archivos, y tiene estados activo/inactivo con animaciones sutiles.
- **Panel Derecho:** Renderiza el contenido Markdown con estilos limpios utilizando la librería `react-markdown`. Soporta headers, bloques de código, listas, etc.
- **Panel Inferior:** Incluye botones de **Anterior** y **Siguiente**, implementando la lógica para saltar entre los archivos que pertenecen a la misma carpeta (respetando el orden por fecha de creación de los mismos).

### 3. Estética Premium
- Se eliminó el CSS por defecto y se creó un nuevo `globals.css` desde cero.
- **Paleta de colores oscura (Dark Mode)** con tonos profundos (ej. `#0F1115`) e interactivos (acentos morados/indigo `#6366F1`).
- Componentes responsivos, uso de Flexbox, y una **barra de scroll customizada**.
- Efectos y micro-animaciones en botones, elementos de lista (`hover`), y *loaders* (spinners) al cambiar de documento.

## Cómo probarlo
1. Ingresá a **[http://localhost:3000](http://localhost:3000)** en tu navegador (Chrome).
2. Deberías ver en el panel izquierdo la carpeta con los archivos markdown.
3. Hacé clic en `todo.md` u otro archivo que crees para ver cómo se formatea en el panel derecho.
4. Usá los botones inferiores para ir al anterior/siguiente.

> [!TIP]
> Si en algún momento necesitas detener el servidor, decímelo o terminalo desde tu consola. Si agregás nuevos archivos `.md` en la carpeta `Test`, solo tenés que refrescar la página.
