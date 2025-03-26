require('dotenv').config();
const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;

// Configurar Cloudinary con las credenciales
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Endpoint para generar la firma de Cloudinary
router.post('/get-signature', (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Crear el string para firmar con los parámetros necesarios
    const params = {
      timestamp: timestamp,
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      folder: "mantenimientos"
    };

    // Ordenar los parámetros alfabéticamente
    const ordered = Object.keys(params)
      .sort()
      .reduce((obj, key) => {
        obj[key] = params[key];
        return obj;
      }, {});

    // Generar la firma
    const signature = cloudinary.utils.api_sign_request(ordered, process.env.CLOUDINARY_API_SECRET);

    // Enviar respuesta con todos los datos necesarios
    res.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    });
  } catch (error) {
    console.error('Error al generar la firma:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para procesar la URL de la imagen después de la subida
router.post('/process-upload', async (req, res) => {
  try {
    const { 
      secure_url,
      public_id,
      mantenimiento_id,
      tipo,
      descripcion = `Foto subida el ${new Date().toLocaleDateString()}`
    } = req.body;

    // Validar los campos requeridos
    if (!secure_url || !public_id) {
      return res.status(400).json({ 
        error: 'Se requieren secure_url y public_id' 
      });
    }

    // Crear el objeto con los datos para la base de datos
    const fotoData = {
      url_foto: secure_url,
      public_id: public_id,
      mantenimiento_id: mantenimiento_id || null,
      tipo: tipo || 'ANTES',
      descripcion: descripcion
    };

    // Aquí puedes agregar la lógica para guardar en la base de datos
    // Por ahora solo devolvemos los datos procesados
    res.json({
      message: 'Imagen procesada correctamente',
      data: fotoData
    });

  } catch (error) {
    console.error('Error al procesar la imagen:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener información de una imagen
router.get('/image-info/:public_id', async (req, res) => {
  try {
    const { public_id } = req.params;
    const result = await cloudinary.api.resource(public_id);
    res.json(result);
  } catch (error) {
    console.error('Error al obtener información de la imagen:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
