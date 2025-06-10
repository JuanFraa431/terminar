# NoteAPP

NoteAPP es una aplicación web para gestionar notas personales, permitiendo crear, editar, eliminar, archivar y organizar notas mediante etiquetas. Está desarrollada con un stack moderno: React en el frontend y Node.js/Express con MikroORM y MySQL en el backend.

## Características principales

- Crear, editar y eliminar notas.
- Archivar y desarchivar notas.
- Asignar múltiples etiquetas a cada nota.
- Filtrar notas por estado (activas/archivadas) y por etiqueta.
- Interfaz moderna y responsiva.

## Requisitos previos

- Node.js (v18 o superior recomendado)
- npm

## Instalación y ejecución

El proyecto está dividido en dos carpetas: `Back` (backend) y `Front` (frontend). Para facilitar la ejecución, se provee un script `run.bat` que instala dependencias y levanta ambos servidores automáticamente.

### Ejecución rápida

1. **Clona el repositorio** y navega a la carpeta principal del proyecto.
2. **Ejecuta el script**:

   En Windows:
   ```bat
   run.bat
   ```

   Esto instalará las dependencias de ambos proyectos (si es necesario) y levantará el backend en el puerto 3000 y el frontend en el puerto 8080.

3. **Abre tu navegador** y accede a [http://localhost:8080](http://localhost:8080) para usar la aplicación.

### Ejecución manual

Si prefieres ejecutar cada parte por separado:

#### Backend

```bash
cd Back
npm install
npm run startBack
```

El backend estará disponible en `http://localhost:3000`.

#### Frontend

```bash
cd Front
npm install
npm run startFront
```

El frontend estará disponible en `http://localhost:8080`.

## Estructura del proyecto

```
terminar/
│
├── Back/      # Backend (Node.js, Express, MikroORM, MySQL)
├── Front/     # Frontend (React, TypeScript)
├── run.bat    # Script para instalar dependencias y ejecutar ambos servidores
└── README.md  # Este archivo
```

## Notas técnicas

- El backend utiliza una base de datos MySQL (configurada en `Back/src/db/mikro-orm.config.ts`).
- El frontend se comunica con el backend a través de la ruta `/api`.
- El filtro de etiquetas permite buscar y seleccionar etiquetas para visualizar solo las notas asociadas.

## Licencia

Este proyecto es de uso personal.

---
