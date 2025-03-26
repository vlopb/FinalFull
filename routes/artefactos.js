const express = require('express');
const cors = require('cors');
const router = express.Router();
const { pool } = require('../config/db');  // Cambiado de '../db' a '../config/db'

router.get('/artefactos', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM artefactos');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/artefactos/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM artefactos WHERE id = ?', [req.params.id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ mensaje: 'Artefacto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/artefactos', async (req, res) => {
    try {
        const { nombre, descripcion, estado, responsable_id } = req.body;
        const [result] = await pool.query(
            'INSERT INTO artefactos (nombre, descripcion, estado, responsable_id) VALUES (?, ?, ?, ?)',
            [nombre, descripcion, estado, responsable_id]
        );
        res.status(201).json({
            id: result.insertId,
            nombre,
            descripcion,
            estado,
            responsable_id
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/artefactos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const [rows] = await pool.query('SELECT * FROM artefactos WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Artefacto no encontrado' });
        }

        const artefacto = rows[0];
        const { nombre, descripcion, estado, responsable_id } = req.body;
        
        const updateData = {
            nombre: nombre || artefacto.nombre,
            descripcion: descripcion || artefacto.descripcion,
            estado: estado || artefacto.estado,
            responsable_id: responsable_id || artefacto.responsable_id
        };

        const [result] = await pool.query(
            'UPDATE artefactos SET nombre = ?, descripcion = ?, estado = ?, responsable_id = ? WHERE id = ?',
            [updateData.nombre, updateData.descripcion, updateData.estado, updateData.responsable_id, id]
        );

        if (result.affectedRows > 0) {
            res.json({ mensaje: 'Artefacto actualizado correctamente' });
        } else {
            res.status(404).json({ mensaje: 'Artefacto no actualizado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/artefactos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const [result] = await pool.query('DELETE FROM artefactos WHERE id = ?', [id]);
        
        if (result.affectedRows > 0) {
            res.json({ mensaje: 'Artefacto eliminado correctamente' });
        } else {
            res.status(404).json({ mensaje: 'Artefacto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;