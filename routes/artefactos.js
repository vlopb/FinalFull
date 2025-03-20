const express = require('express');
const cors = require('cors');
const router = express.Router();
const { pool } = require('../config/db');


router.get('/', async (req, res) => {
    try {
        console.log('Intentando obtener artefactos...');
        const [artefactos] = await pool.query(`
            SELECT 
                a.id,
                a.nombre,
                a.descripcion,
                a.estado,
                a.fecha_creacion,
                a.ultimo_mantenimiento,
                u.nombre as responsable
            FROM artefactos a
            LEFT JOIN usuarios u ON a.responsable_id = u.id
            ORDER BY a.fecha_creacion DESC
        `);
        console.log('Artefactos obtenidos:', artefactos);
        res.json(artefactos);
    } catch (error) {
        console.error('Error al obtener artefactos:', error);
        res.status(500).json({ 
            error: 'Error al obtener artefactos',
            details: error.message 
        });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const [artefacto] = await pool.query(`
            SELECT 
                a.id,
                a.nombre,
                a.descripcion,
                a.estado,
                a.fecha_creacion,
                a.ultimo_mantenimiento,
                u.nombre as responsable
            FROM artefactos a
            LEFT JOIN usuarios u ON a.responsable_id = u.id
            WHERE a.id = ?
        `, [req.params.id]);

        if (artefacto.length > 0) {
            res.json(artefacto[0]);
        } else {
            res.status(404).json({ mensaje: 'Artefacto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/', async (req, res) => {
    try {
        console.log('Datos recibidos:', req.body);
        const { nombre, descripcion, estado } = req.body;
        
        if (!nombre || !descripcion || !estado) {
            return res.status(400).json({ 
                error: 'Faltan datos requeridos',
                detalles: 'Se requiere nombre, descripción y estado'
            });
        }

        const [result] = await pool.query(
            'INSERT INTO artefactos (nombre, descripcion, estado) VALUES (?, ?, ?)',
            [nombre, descripcion, estado]
        );
        
        console.log('Artefacto creado:', result);
        
        res.status(201).json({
            id: result.insertId,
            nombre,
            descripcion,
            estado,
            fecha_creacion: new Date()
        });
    } catch (error) {
        console.error('Error al crear artefacto:', error);
        res.status(500).json({ 
            error: 'Error al crear artefacto',
            details: error.message 
        });
    }
});



router.put('/:id', async (req, res) => {
    try {
        const { nombre, descripcion, estado } = req.body;
        const [result] = await pool.query(
            'UPDATE artefactos SET nombre = ?, descripcion = ?, estado = ? WHERE id = ?',
            [nombre, descripcion, estado, req.params.id]
        );

        if (result.affectedRows > 0) {
            res.json({ mensaje: 'Artefacto actualizado correctamente' });
        } else {
            res.status(404).json({ mensaje: 'Artefacto no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar artefacto:', error);
        res.status(500).json({ error: error.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM artefactos WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows > 0) {
            res.json({ mensaje: 'Artefacto eliminado correctamente' });
        } else {
            res.status(404).json({ mensaje: 'Artefacto no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar artefacto:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 