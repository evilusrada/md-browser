# Procedimiento de Construcción: MD Browser

Este documento detalla el paso a paso de cómo fue concebida y desarrollada la aplicación MD Browser, desde los requerimientos iniciales hasta su publicación en GitHub.

## 1. Análisis de Requerimientos y Planificación
Todo comenzó leyendo el archivo `requerimientos.txt`, el cual solicitaba:
- Una aplicación web para visualizar archivos `.md` de manera jerárquica.
- Ordenamiento por fecha de creación dentro de las carpetas.
- Interfaz con panel izquierdo (árbol de navegación), derecho (visualizador) e inferior (botones anterior/siguiente).

Con esta información, se elaboró un `todo.md` y un plan de implementación decidiendo utilizar **Next.js** como framework principal. Next.js fue elegido porque permite manejar tanto el frontend (React) como el backend (API para leer el disco) en un solo proyecto de forma nativa.

## 2. Inicialización del Proyecto
- Se ejecutó el comando de inicialización de Next.js (`npx create-next-app`) en la carpeta `md-browser`.
- Se limpiaron los archivos por defecto (`page.module.css`, estilos base en `layout.js`).
- Se instaló la dependencia clave para el renderizado: `npm install react-markdown`.

## 3. Desarrollo del Backend (API Routes)
Para leer los archivos locales de la computadora, aprovechamos la capacidad de servidor de Next.js:
- **Lógica de exploración:** Se creó la función `walkDir` en `src/lib/fs-utils.js`. Esta función usa el módulo `fs` de Node.js para buscar recursivamente carpetas y archivos `.md`, ignorando carpetas de sistema (como `node_modules` y `.git`), y ordenando los resultados por su fecha de creación (`birthtimeMs`).
- **Endpoint `/api/files`:** Devuelve el árbol completo de directorios en formato JSON.
- **Endpoint `/api/file`:** Recibe la ruta de un archivo específico y devuelve su contenido de texto.
- **Variables de Entorno:** Se implementó el soporte para un archivo `.env` (`MD_ROOT_DIR`) para que el usuario pueda cambiar dinámicamente la carpeta que se está escaneando sin modificar el código.

## 4. Desarrollo del Frontend (Interfaz de Usuario)
Toda la lógica visual se concentró en `src/app/page.js`:
- **Estado (State):** Se utilizaron *Hooks* (`useState`, `useEffect`) para cargar el árbol de archivos al iniciar la aplicación y gestionar qué archivo estaba seleccionado.
- **FileTree (Panel Izquierdo):** Un componente recursivo que se llama a sí mismo para dibujar la estructura de carpetas (expandibles/colapsables).
- **Visor Markdown (Panel Derecho):** Utiliza `<ReactMarkdown>` para transformar el texto plano en HTML.
- **Navegación (Panel Inferior):** Se creó una lógica reactiva (`useMemo`) que localiza el archivo actualmente seleccionado dentro de su carpeta padre, e identifica cuál es el archivo anterior y el siguiente (basado en el orden temporal).

## 5. Diseño y Estética (CSS Vainilla)
Se solicitó un diseño "Premium" y "Rich Aesthetics". Para ello se configuró el archivo `globals.css`:
- **Dark Mode:** Se usó una paleta de colores oscura y profunda (`#0F1115`, `#161920`) con acentos en índigo (`#6366F1`).
- **Micro-animaciones:** Transiciones suaves en botones (`transform: translateY(-1px)`), cambios de color al hacer `hover` en los archivos, y barras de scroll personalizadas.
- **Estilos de Markdown:** Se agregaron reglas CSS específicas (`.markdown-body`) para que las tablas, los bloques de código y las citas se vean legibles y modernos.

## 6. Pruebas Automáticas (Testing)
Para garantizar la calidad del código, se implementó un entorno de pruebas:
- Se instaló **Jest** y React Testing Library.
- Se configuró `jest.config.mjs` adaptado a Next.js.
- Se escribió el test `__tests__/fs-utils.test.js`, el cual crea archivos temporales falsos en disco con fechas adulteradas para verificar que la función `walkDir` ignore extensiones no válidas (`.txt`) y ordene estrictamente por antigüedad.

## 7. Versionado y Publicación
- Todo el código se fue versionando localmente con Git.
- Finalmente, se documentaron los artefactos en la carpeta `docs/`.
- Se creó el repositorio remoto en GitHub de forma manual y se subió el código mediante `git push`.
