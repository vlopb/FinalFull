const express = require('express');
const app = express.Router();
const connection = require('./config/database').pool;

app.use(express.json());

app.get('/users', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM usuarios');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const [rows] = await connection.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const [result] = await connection.query('INSERT INTO usuarios (nombre, email) VALUES (?, ?)', [name, email]);
    res.status(201).json({ id: result.insertId, name, email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const [rows] = await connection.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = rows[0];
    const { name, email } = req.body;
    const nameReal = name || user.nombre;
    const emailReal = email || user.email;
    
    const [result] = await connection.query('UPDATE usuarios SET nombre = ?, email = ? WHERE id_usuario = ?', [nameReal, emailReal, id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Usuario actualizado correctamente' });
    } else {
      res.status(404).json({ message: 'Usuario no actualizado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const [result] = await connection.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Usuario eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app; 