const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');


router.get('/testimonios', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM testimonios');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/testimonios/mantenimiento/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM testimonios WHERE mantenimiento_id = ?', [req.params.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/testimonios', async (req, res) => {
    try {
        const { mantenimiento_id, autor, comentario } = req.body;
        const [result] = await pool.query(
            'INSERT INTO testimonios (mantenimiento_id, autor, comentario) VALUES (?, ?, ?)',
            [mantenimiento_id, autor, comentario]
        );
        res.status(201).json({
            id: result.insertId,
            mantenimiento_id,
            autor,
            comentario,
            fecha: new Date()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put('/testimonios/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const [rows] = await pool.query('SELECT * FROM testimonios WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Testimonio no encontrado' });
        }

        const testimonio = rows[0];
        const { mantenimiento_id, autor, comentario } = req.body;
        
        const updateData = {
            mantenimiento_id: mantenimiento_id || testimonio.mantenimiento_id,
            autor: autor || testimonio.autor,
            comentario: comentario || testimonio.comentario
        };

        const [result] = await pool.query(
            'UPDATE testimonios SET mantenimiento_id = ?, autor = ?, comentario = ? WHERE id = ?',
            [updateData.mantenimiento_id, updateData.autor, updateData.comentario, id]
        );

        if (result.affectedRows > 0) {
            res.json({ mensaje: 'Testimonio actualizado correctamente' });
        } else {
            res.status(404).json({ mensaje: 'Testimonio no actualizado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete('/testimonios/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const [result] = await pool.query('DELETE FROM testimonios WHERE id = ?', [id]);
        
        if (result.affectedRows > 0) {
            res.json({ mensaje: 'Testimonio eliminado correctamente' });
        } else {
            res.status(404).json({ mensaje: 'Testimonio no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 