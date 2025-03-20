const express = require('express');
const router = express.Router();
const cors = require('cors');
const { pool } = require('../config/db');


router.get('/mantenimientos', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM mantenimientos');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/mantenimientos/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM mantenimientos WHERE id = ?', [req.params.id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ mensaje: 'Mantenimiento no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/mantenimientos', async (req, res) => {
    try {
        const { artefacto_id, fecha, hora, descripcion, costo, tiempo_empleado } = req.body;
        const [result] = await pool.query(
            'INSERT INTO mantenimientos (artefacto_id, fecha, hora, descripcion, costo, tiempo_empleado) VALUES (?, ?, ?, ?, ?, ?)',
            [artefacto_id, fecha, hora, descripcion, costo, tiempo_empleado]
        );
        res.status(201).json({
            id: result.insertId,
            artefacto_id,
            fecha,
            hora,
            descripcion,
            costo,
            tiempo_empleado
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put('/mantenimientos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        // Primero verificamos si existe el mantenimiento
        const [rows] = await pool.query('SELECT * FROM mantenimientos WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Mantenimiento no encontrado' });
        }

        const mantenimiento = rows[0];
        const { artefacto_id, fecha, hora, descripcion, costo, tiempo_empleado } = req.body;
        
        // Usamos los valores existentes si no se proporcionan nuevos
        const updateData = {
            artefacto_id: artefacto_id || mantenimiento.artefacto_id,
            fecha: fecha || mantenimiento.fecha,
            hora: hora || mantenimiento.hora,
            descripcion: descripcion || mantenimiento.descripcion,
            costo: costo || mantenimiento.costo,
            tiempo_empleado: tiempo_empleado || mantenimiento.tiempo_empleado
        };

        const [result] = await pool.query(
            'UPDATE mantenimientos SET artefacto_id = ?, fecha = ?, hora = ?, descripcion = ?, costo = ?, tiempo_empleado = ? WHERE id = ?',
            [updateData.artefacto_id, updateData.fecha, updateData.hora, updateData.descripcion, updateData.costo, updateData.tiempo_empleado, id]
        );

        if (result.affectedRows > 0) {
            res.json({ mensaje: 'Mantenimiento actualizado correctamente' });
        } else {
            res.status(404).json({ mensaje: 'Mantenimiento no actualizado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete('/mantenimientos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const [result] = await pool.query('DELETE FROM mantenimientos WHERE id = ?', [id]);
        
        if (result.affectedRows > 0) {
            res.json({ mensaje: 'Mantenimiento eliminado correctamente' });
        } else {
            res.status(404).json({ mensaje: 'Mantenimiento no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 