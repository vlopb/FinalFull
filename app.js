const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Importar rutas
const mantenimientosRoutes = require('./routes/mantenimientos');
const materialesRoutes = require('./routes/materiales_usados');
const fotosRoutes = require('./routes/fotos');
const testimoniosRoutes = require('./routes/testimonios');

// Usar las rutas
app.use('/api', mantenimientosRoutes);
app.use('/api', materialesRoutes);
app.use('/api', fotosRoutes);
app.use('/api', testimoniosRoutes);

// Puerto de la aplicación
const PORT = process.env.PORT || 3010;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 