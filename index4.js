// app.js
const express = require('express');
const mysql = require('mysql2')
const app = express();
const port = 3010;
const http = require('http');
const {Server} = require('socket.io');
const userRoutes = require('./routes/users');
const {testConnection} = require('./config/db');
const chatSocket = require('./socket/chat');

const server = http.createServer(app); // servidor HTTP
const io = new Server(server, {
  cors: { origin: '*' } // permite cualquier origen
});

app.use(express.json());
chatSocket(io);

// Rutas
app.use('/', userRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Hola Mundo');
});

// Obtener todos los artefactos
app.get('/artefactos', (req, res) => {
  const query = 'SELECT * FROM artefactos';
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Obtener un artefacto por ID
app.get('/artefactos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM artefactos WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Artefacto no encontrado' });
    }
    res.json(results[0]);
  });
});

// Crear un nuevo artefacto
app.post('/artefactos', (req, res) => {
  const { nombre, descripcion, propietario, ubicacion } = req.body;
  
  const query = `
    INSERT INTO artefactos (nombre, descripcion, propietario, ubicacion)
    VALUES (?, ?, ?, ?)
  `;
  const values = [nombre, descripcion, propietario, ubicacion];

  connection.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Devolver el artefacto recién creado
    const newArtefacto = {
      id: result.insertId,
      nombre,
      descripcion,
      propietario,
      ubicacion,
      fecha_registro: new Date() // Ojo: MySQL asigna la fecha automáticamente
    };
    res.status(201).json(newArtefacto);
  });
});

// Actualizar un artefacto por ID
app.put('/artefactos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, propietario, ubicacion } = req.body;
  
  const query = `
    UPDATE artefactos
    SET nombre = ?, descripcion = ?, propietario = ?, ubicacion = ?
    WHERE id = ?
  `;
  const values = [nombre, descripcion, propietario, ubicacion, id];

  connection.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Artefacto no encontrado' });
    }
    res.json({ message: 'Artefacto actualizado exitosamente' });
  });
});

// Eliminar un artefacto por ID
app.delete('/artefactos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM artefactos WHERE id = ?';
  connection.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Artefacto no encontrado' });
    }
    res.json({ message: 'Artefacto eliminado exitosamente' });
  });
});


// Obtener todos los mantenimientos
app.get('/mantenimientos', (req, res) => {
  const query = 'SELECT * FROM mantenimientos';
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Obtener un mantenimiento por ID
app.get('/mantenimientos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM mantenimientos WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Mantenimiento no encontrado' });
    }
    res.json(results[0]);
  });
});

// Crear un mantenimiento
app.post('/mantenimientos', (req, res) => {
  const { artefacto_id, fecha, hora, descripcion, costo, tiempo_empleado } = req.body;
  const query = `
    INSERT INTO mantenimientos (artefacto_id, fecha, hora, descripcion, costo, tiempo_empleado)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [artefacto_id, fecha, hora, descripcion, costo, tiempo_empleado];

  connection.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const newMantenimiento = {
      id: result.insertId,
      artefacto_id,
      fecha,
      hora,
      descripcion,
      costo,
      tiempo_empleado
    };
    res.status(201).json(newMantenimiento);
  });
});

// Actualizar un mantenimiento por ID
app.put('/mantenimientos/:id', (req, res) => {
  const { id } = req.params;
  const { artefacto_id, fecha, hora, descripcion, costo, tiempo_empleado } = req.body;
  
  const query = `
    UPDATE mantenimientos
    SET artefacto_id = ?, fecha = ?, hora = ?, descripcion = ?, costo = ?, tiempo_empleado = ?
    WHERE id = ?
  `;
  const values = [artefacto_id, fecha, hora, descripcion, costo, tiempo_empleado, id];

  connection.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Mantenimiento no encontrado' });
    }
    res.json({ message: 'Mantenimiento actualizado exitosamente' });
  });
});

// Eliminar un mantenimiento por ID
app.delete('/mantenimientos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM mantenimientos WHERE id = ?';
  connection.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Mantenimiento no encontrado' });
    }
    res.json({ message: 'Mantenimiento eliminado exitosamente' });
  });
});


// Obtener todos los materiales
app.get('/materiales', (req, res) => {
  const query = 'SELECT * FROM materiales_usados';
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Obtener un material por ID
app.get('/materiales/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM materiales_usados WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Material no encontrado' });
    }
    res.json(results[0]);
  });
});

// Crear un material
app.post('/materiales', (req, res) => {
  const { mantenimiento_id, nombre_material, cantidad, costo } = req.body;
  const query = `
    INSERT INTO materiales_usados (mantenimiento_id, nombre_material, cantidad, costo)
    VALUES (?, ?, ?, ?)
  `;
  const values = [mantenimiento_id, nombre_material, cantidad, costo];

  connection.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const newMaterial = {
      id: result.insertId,
      mantenimiento_id,
      nombre_material,
      cantidad,
      costo
    };
    res.status(201).json(newMaterial);
  });
});

// Actualizar un material por ID
app.put('/materiales/:id', (req, res) => {
  const { id } = req.params;
  const { mantenimiento_id, nombre_material, cantidad, costo } = req.body;
  const query = `
    UPDATE materiales_usados
    SET mantenimiento_id = ?, nombre_material = ?, cantidad = ?, costo = ?
    WHERE id = ?
  `;
  const values = [mantenimiento_id, nombre_material, cantidad, costo, id];

  connection.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Material no encontrado' });
    }
    res.json({ message: 'Material actualizado exitosamente' });
  });
});

// Eliminar un material por ID
app.delete('/materiales/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM materiales_usados WHERE id = ?';
  connection.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Material no encontrado' });
    }
    res.json({ message: 'Material eliminado exitosamente' });
  });
});


// Obtener todas las fotos
app.get('/fotos', (req, res) => {
  const query = 'SELECT * FROM fotos';
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Obtener una foto por ID
app.get('/fotos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM fotos WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Foto no encontrada' });
    }
    res.json(results[0]);
  });
});

// Crear una foto
app.post('/fotos', (req, res) => {
  const { mantenimiento_id, url_foto, descripcion, tipo } = req.body;
  const query = `
    INSERT INTO fotos (mantenimiento_id, url_foto, descripcion, tipo)
    VALUES (?, ?, ?, ?)
  `;
  const values = [mantenimiento_id, url_foto, descripcion, tipo];

  connection.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const newFoto = {
      id: result.insertId,
      mantenimiento_id,
      url_foto,
      descripcion,
      tipo
    };
    res.status(201).json(newFoto);
  });
});

// Actualizar una foto por ID
app.put('/fotos/:id', (req, res) => {
  const { id } = req.params;
  const { mantenimiento_id, url_foto, descripcion, tipo } = req.body;
  const query = `
    UPDATE fotos
    SET mantenimiento_id = ?, url_foto = ?, descripcion = ?, tipo = ?
    WHERE id = ?
  `;
  const values = [mantenimiento_id, url_foto, descripcion, tipo, id];

  connection.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Foto no encontrada' });
    }
    res.json({ message: 'Foto actualizada exitosamente' });
  });
});

// Eliminar una foto por ID
app.delete('/fotos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM fotos WHERE id = ?';
  connection.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Foto no encontrada' });
    }
    res.json({ message: 'Foto eliminada exitosamente' });
  });
});

/* 
  ===============================================================
    RUTAS PARA 'TESTIMONIOS'
  ===============================================================
*/

// Obtener todos los testimonios
app.get('/testimonios', (req, res) => {
  const query = 'SELECT * FROM testimonios';
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Obtener un testimonio por ID
app.get('/testimonios/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM testimonios WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Testimonio no encontrado' });
    }
    res.json(results[0]);
  });
});

// Crear un testimonio
app.post('/testimonios', (req, res) => {
  const { mantenimiento_id, autor, comentario } = req.body;
  const query = `
    INSERT INTO testimonios (mantenimiento_id, autor, comentario)
    VALUES (?, ?, ?)
  `;
  const values = [mantenimiento_id, autor, comentario];

  connection.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const newTestimonio = {
      id: result.insertId,
      mantenimiento_id,
      autor,
      comentario,
      fecha: new Date() // MySQL asigna la fecha automáticamente, pero aquí la mostramos
    };
    res.status(201).json(newTestimonio);
  });
});

// Actualizar un testimonio por ID
app.put('/testimonios/:id', (req, res) => {
  const { id } = req.params;
  const { mantenimiento_id, autor, comentario } = req.body;
  const query = `
    UPDATE testimonios
    SET mantenimiento_id = ?, autor = ?, comentario = ?
    WHERE id = ?
  `;
  const values = [mantenimiento_id, autor, comentario, id];

  connection.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Testimonio no encontrado' });
    }
    res.json({ message: 'Testimonio actualizado exitosamente' });
  });
});

// Eliminar un testimonio por ID
app.delete('/testimonios/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM testimonios WHERE id = ?';
  connection.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Testimonio no encontrado' });
    }
    res.json({ message: 'Testimonio eliminado exitosamente' });
  });
});

// Iniciar servidor
testConnection().then((connected) => {
  if(connected) {
    server.listen(port, () => {
      console.log(`Servidor iniciado en el puerto ${port}`);
    });
  } else {
    console.error('Error al conectar a la base de datos');
  }
});
