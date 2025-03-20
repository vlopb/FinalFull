const express = require('express');
const cors = require('cors');
const router = express.Router();
const { pool } = require('../config/db');

router.get('/fotos', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM fotos');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/fotos/mantenimiento/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM fotos WHERE mantenimiento_id = ?', [req.params.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/fotos', async (req, res) => {
    try {
        const { mantenimiento_id, url_foto, descripcion, tipo } = req.body;
        const [result] = await pool.query(
            'INSERT INTO fotos (mantenimiento_id, url_foto, descripcion, tipo) VALUES (?, ?, ?, ?)',
            [mantenimiento_id, url_foto, descripcion, tipo]
        );
        res.status(201).json({
            id: result.insertId,
            mantenimiento_id,
            url_foto,
            descripcion,
            tipo
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put('/fotos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const [rows] = await pool.query('SELECT * FROM fotos WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Foto no encontrada' });
        }

        const foto = rows[0];
        const { mantenimiento_id, url_foto, descripcion, tipo } = req.body;
        
        const updateData = {
            mantenimiento_id: mantenimiento_id || foto.mantenimiento_id,
            url_foto: url_foto || foto.url_foto,
            descripcion: descripcion || foto.descripcion,
            tipo: tipo || foto.tipo
        };

        const [result] = await pool.query(
            'UPDATE fotos SET mantenimiento_id = ?, url_foto = ?, descripcion = ?, tipo = ? WHERE id = ?',
            [updateData.mantenimiento_id, updateData.url_foto, updateData.descripcion, updateData.tipo, id]
        );

        if (result.affectedRows > 0) {
            res.json({ mensaje: 'Foto actualizada correctamente' });
        } else {
            res.status(404).json({ mensaje: 'Foto no actualizada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete('/fotos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const [result] = await pool.query('DELETE FROM fotos WHERE id = ?', [id]);
        
        if (result.affectedRows > 0) {
            res.json({ mensaje: 'Foto eliminada correctamente' });
        } else {
            res.status(404).json({ mensaje: 'Foto no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 