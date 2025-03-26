const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

// Maldito cors
app.use(cors());
app.use(express.json());

// Importar rutas
const mantenimientosRoutes = require('./routes/mantenimientos');
const materialesRoutes = require('./routes/materiales_usados');
const fotosRoutes = require('./routes/fotos');
const testimoniosRoutes = require('./routes/testimonios');
const usuariosRoutes = require('./routes/usuarios');
const generalRoutes = require('./routes/general');
const artefactosRoutes = require('./routes/artefactos');
const cloudinaryRoutes = require('./routes/cloudinary');

// Usar las rutas
app.use('/api', mantenimientosRoutes);
app.use('/api', materialesRoutes);
app.use('/api', fotosRoutes);
app.use('/api', testimoniosRoutes);
app.use('/api', usuariosRoutes);
app.use('/api', generalRoutes);
app.use('/api', artefactosRoutes);
app.use('/api', cloudinaryRoutes);

// Puerto de la aplicación
const PORT = process.env.PORT || 3010;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 