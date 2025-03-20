const express = require('express');
const router = express.Router();
const cors = require('cors');
const { pool } = require('../config/db');

// Obtener todos los usuarios
router.get('/usuarios', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener un usuario específico
router.get('/usuarios/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [req.params.id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear nuevo usuario
router.post('/usuarios', async (req, res) => {
    try {
        const { nombre, email, contrasena, telefono, direccion, rol } = req.body;
        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre, email, contrasena, telefono, direccion, rol) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, email, contrasena, telefono, direccion, rol]
        );
        res.status(201).json({
            id: result.insertId,
            nombre,
            email,
            telefono,
            direccion,
            rol
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar usuario
router.put('/usuarios/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const usuario = rows[0];
        const { nombre, email, contrasena, telefono, direccion, rol } = req.body;
        
        const updateData = {
            nombre: nombre || usuario.nombre,
            email: email || usuario.email,
            contrasena: contrasena || usuario.contrasena,
            telefono: telefono || usuario.telefono,
            direccion: direccion || usuario.direccion,
            rol: rol || usuario.rol
        };

        const [result] = await pool.query(
            'UPDATE usuarios SET nombre = ?, email = ?, contrasena = ?, telefono = ?, direccion = ?, rol = ? WHERE id = ?',
            [updateData.nombre, updateData.email, updateData.contrasena, updateData.telefono, updateData.direccion, updateData.rol, id]
        );

        if (result.affectedRows > 0) {
            res.json({ mensaje: 'Usuario actualizado correctamente' });
        } else {
            res.status(404).json({ mensaje: 'Usuario no actualizado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar usuario
router.delete('/usuarios/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
        
        if (result.affectedRows > 0) {
            res.json({ mensaje: 'Usuario eliminado correctamente' });
        } else {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 