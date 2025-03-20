const express = require('express');
const router = express.Router();
const cors = require('cors');
const { pool } = require('../config/db');


router.get('/materiales', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM materiales_usados');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/materiales/mantenimiento/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM materiales_usados WHERE mantenimiento_id = ?', [req.params.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/materiales', async (req, res) => {
    try {
        const { mantenimiento_id, nombre_material, cantidad, costo } = req.body;
        const [result] = await pool.query(
            'INSERT INTO materiales_usados (mantenimiento_id, nombre_material, cantidad, costo) VALUES (?, ?, ?, ?)',
            [mantenimiento_id, nombre_material, cantidad, costo]
        );
        res.status(201).json({
            id: result.insertId,
            mantenimiento_id,
            nombre_material,
            cantidad,
            costo
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put('/materiales/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const [rows] = await pool.query('SELECT * FROM materiales_usados WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Material no encontrado' });
        }

        const material = rows[0];
        const { mantenimiento_id, nombre_material, cantidad, costo } = req.body;
        
        const updateData = {
            mantenimiento_id: mantenimiento_id || material.mantenimiento_id,
            nombre_material: nombre_material || material.nombre_material,
            cantidad: cantidad || material.cantidad,
            costo: costo || material.costo
        };

        const [result] = await pool.query(
            'UPDATE materiales_usados SET mantenimiento_id = ?, nombre_material = ?, cantidad = ?, costo = ? WHERE id = ?',
            [updateData.mantenimiento_id, updateData.nombre_material, updateData.cantidad, updateData.costo, id]
        );

        if (result.affectedRows > 0) {
            res.json({ mensaje: 'Material actualizado correctamente' });
        } else {
            res.status(404).json({ mensaje: 'Material no actualizado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete('/materiales/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const [result] = await pool.query('DELETE FROM materiales_usados WHERE id = ?', [id]);
        
        if (result.affectedRows > 0) {
            res.json({ mensaje: 'Material eliminado correctamente' });
        } else {
            res.status(404).json({ mensaje: 'Material no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 