# Proyecto Diplomado FullStack

Este repositorio contiene los ejercicios y proyectos desarrollados durante el Diplomado de FullStack. El proyecto principal es una API REST para la gestión de una biblioteca y un sistema de mantenimiento.

## Estructura del Proyecto

### API REST de Biblioteca
La API de biblioteca gestiona los siguientes recursos:

- 📚 **Libros** (`biblioteca_libros.sql`)
  - Gestión de inventario de libros
  - Información detallada de cada libro
  - Control de disponibilidad

- 👥 **Usuarios** (`biblioteca_usuarios.sql`)
  - Registro de usuarios
  - Gestión de préstamos
  - Control de multas

- 📖 **Préstamos** (`biblioteca_prestamos.sql`)
  - Sistema de préstamos
  - Fechas de devolución
  - Estado del préstamo

- ✍️ **Autores** (`biblioteca_autores.sql`)
  - Información de autores
  - Relación con libros

### Sistema de Mantenimiento
Sistema para gestionar el mantenimiento de artefactos (`querydb.sql`):

- 🔧 **Artefactos**
  - Registro de equipos
  - Ubicación y propietarios
  - Historial de mantenimiento

- 🛠️ **Mantenimientos**
  - Registro de servicios
  - Control de costos
  - Tiempo empleado

- 📸 **Fotos**
  - Documentación visual
  - Estados antes/después

## Tecnologías Utilizadas

- Node.js
- Express.js
- MySQL
- REST API

## Configuración del Proyecto

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

3. Iniciar el servidor:
```bash
npm run dev
```

## Endpoints Principales

### Biblioteca
- GET /libros - Listar todos los libros
- POST /libros - Crear nuevo libro
- GET /usuarios - Listar usuarios
- POST /prestamos - Registrar préstamo

### Mantenimiento
- GET /artefactos - Listar artefactos
- POST /mantenimientos - Registrar mantenimiento
- GET /fotos - Ver fotos de mantenimientos

## Contribución

Este es un proyecto educativo desarrollado como parte del Diplomado FullStack. Las contribuciones son bienvenidas mediante pull requests.

## Autor

[Tu Nombre]

## Licencia

Este proyecto es parte del Diplomado FullStack y está destinado únicamente para fines educativos. 