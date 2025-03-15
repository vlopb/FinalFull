
## Endpoints API

### Mantenimientos

- `GET /api/mantenimientos` - Obtener todos los mantenimientos
- `GET /api/mantenimientos/:id` - Obtener un mantenimiento específico
- `POST /api/mantenimientos` - Crear nuevo mantenimiento
- `PUT /api/mantenimientos/:id` - Actualizar un mantenimiento
- `DELETE /api/mantenimientos/:id` - Eliminar un mantenimiento

### Materiales Usados

- `GET /api/materiales` - Obtener todos los materiales
- `GET /api/materiales/mantenimiento/:id` - Obtener materiales por mantenimiento
- `POST /api/materiales` - Registrar nuevo material
- `PUT /api/materiales/:id` - Actualizar material
- `DELETE /api/materiales/:id` - Eliminar material

### Fotos

- `GET /api/fotos` - Obtener todas las fotos
- `GET /api/fotos/mantenimiento/:id` - Obtener fotos por mantenimiento
- `POST /api/fotos` - Subir nueva foto
- `PUT /api/fotos/:id` - Actualizar información de foto
- `DELETE /api/fotos/:id` - Eliminar foto

### Testimonios

- `GET /api/testimonios` - Obtener todos los testimonios
- `GET /api/testimonios/mantenimiento/:id` - Obtener testimonios por mantenimiento
- `POST /api/testimonios` - Crear nuevo testimonio
- `PUT /api/testimonios/:id` - Actualizar testimonio
- `DELETE /api/testimonios/:id` - Eliminar testimonio

## Ejemplos de Uso

### Crear un nuevo mantenimiento
```bash
curl -X POST http://localhost:3010/api/mantenimientos \
  -H "Content-Type: application/json" \
  -d '{
    "artefacto_id": 1,
    "fecha": "2024-03-20",
    "hora": "14:30:00",
    "descripcion": "Mantenimiento preventivo",
    "costo": 150.00,
    "tiempo_empleado": 120
  }'
```

### Actualizar un mantenimiento
```bash
curl -X PUT http://localhost:3010/api/mantenimientos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "descripcion": "Mantenimiento correctivo",
    "costo": 200.00
  }'
```

## Scripts Disponibles

- `npm start` - Inicia el servidor en modo producción
- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon

## Base de Datos

El sistema utiliza MySQL con las siguientes tablas principales:
- `mantenimientos`
- `materiales_usados`
- `fotos`
- `testimonios`

## Tecnologías Utilizadas

- Express.js - Framework web
- MySQL2 - Cliente MySQL
- Cors - Middleware para CORS
- Nodemon - Herramienta de desarrollo

## Contribución

1. Fork el proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.
