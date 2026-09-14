# MD Browser - Implementation Plan

Creación de una aplicación web para navegar y visualizar archivos Markdown locales.

## User Review Required

> [!IMPORTANT]
> Dado que no especificaste una tecnología, propongo utilizar **Next.js**. Next.js es ideal porque nos permite tener el backend (lectura de archivos con Node.js) y el frontend (React) en un mismo proyecto de forma nativa. 
> Además, utilizaré **Vanilla CSS** (sin Tailwind) para crear un diseño muy premium, moderno y fluido ("Rich Aesthetics").
> Si estás de acuerdo, aprobá este plan y comenzaré a generar el código. Si preferís usar Vite + Express por separado o alguna otra tecnología, dejame un comentario.

## Proposed Changes

### 1. Inicialización y Configuración
- Se ejecutará el comando para crear el proyecto en el directorio actual: `npx -y create-next-app@latest ./ --use-npm --js --eslint --app --src-dir --no-tailwind --import-alias "@/*"`.
- Se limpiarán los estilos por defecto y se preparará el archivo global de CSS (`src/app/globals.css`) con variables para el diseño (paleta oscura, glassmorphism, tipografía moderna).

### 2. Backend (Next.js API Routes)
- **Ruta `src/app/api/files/route.js`:** Endpoint que leerá recursivamente el directorio del proyecto (ignorando carpetas como `node_modules` o `.next`). Devolverá la estructura de carpetas y los archivos `.md`, incluyendo su fecha de creación para poder ordenarlos.
- **Ruta `src/app/api/file/route.js`:** Endpoint que recibirá una ruta de archivo `.md` y devolverá su contenido en texto plano.

### 3. Frontend - Componentes y Layout
- **Layout Principal (`src/app/page.js`):** Contendrá la estructura de 3 paneles (izquierdo para árbol, derecho para contenido, inferior para navegación).
- **Componente `FileTree` (Panel Izquierdo):** Renderizará las carpetas y archivos `.md`. Permitirá colapsar/expandir carpetas y seleccionar un archivo.
- **Componente `MarkdownViewer` (Panel Derecho):** Utilizará la librería `react-markdown` para convertir el texto Markdown a HTML estilizado de manera premium.
- **Componente `Navigation` (Panel Inferior):** Lógica para navegar al "Siguiente" o "Anterior" archivo dentro de la misma carpeta, ordenados por fecha de creación.

### 4. Estilos y Estética (CSS Vainilla)
- Aplicaré estilos modernos con transiciones suaves, tipografía elegante y un "Dark Mode" de primer nivel, asegurando que la interfaz se sienta responsiva e interactiva.

## Verification Plan

### Manual Verification
- Ejecutar el servidor de desarrollo (`npm run dev`).
- Abrir la aplicación en el navegador y verificar:
  1. El árbol de carpetas refleja los archivos `.md` reales.
  2. El contenido Markdown se renderiza correctamente al seleccionar un archivo.
  3. Los controles de navegación (Anterior/Siguiente) funcionan de acuerdo a la fecha de creación dentro de cada carpeta.
