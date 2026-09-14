# MD Browser - Task List

- [x] **1. Inicialización y Configuración**
  - [x] Crear el proyecto Next.js en el directorio actual.
  - [x] Instalar la librería `react-markdown`.
  - [x] Limpiar archivos por defecto y configurar estilos base en `globals.css`.

- [x] **2. Backend (Next.js API Routes)**
  - [x] Crear API route `/api/files` para listar los archivos `.md` recursivamente, ordenados por fecha de creación.
  - [x] Crear API route `/api/file` para devolver el contenido de un archivo `.md`.

- [x] **3. Frontend - Componentes y Layout**
  - [x] Crear Layout general (3 paneles).
  - [x] Crear componente `FileTree` (Panel Izquierdo).
  - [x] Crear componente `MarkdownViewer` (Panel Derecho).
  - [x] Crear componente `Navigation` (Panel Inferior).
  - [x] Integrar todo en `page.js` y conectar los estados.

- [x] **4. Estilos y Estética**
  - [x] Aplicar diseño moderno y oscuro (Vanilla CSS).
  - [x] Agregar animaciones y transiciones de estado (hover, loading, scrollbars).

- [x] **5. Verificación**
  - [x] Ejecutar el servidor de desarrollo y probar navegación.
  - [x] Actualizar `walkthrough.md`.
