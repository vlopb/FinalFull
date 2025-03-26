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

const normalizeEstado = (estado) => {
    if (!estado) return 'pendiente';
    
    const estadoLower = estado.toLowerCase().trim();
    
    // Mapa de estados válidos con sus equivalencias
    const estadosValidos = {
        'pendiente': 'pendiente',
        'en_progreso': 'en_progreso',
        'en progreso': 'en_progreso',
        'completado': 'completado',
        'completed': 'completado',
        'in_progress': 'en_progreso',
        'pending': 'pendiente'
    };

    // Si el estado ya está normalizado, lo devolvemos
    if (estadosValidos[estadoLower]) {
        return estadosValidos[estadoLower];
    }

    // Si no está en el mapa, aplicamos la lógica de detección
    if (estadoLower.includes('proceso') || estadoLower.includes('progreso')) {
        return 'en_progreso';
    } else if (estadoLower.includes('complet')) {
        return 'completado';
    }

    return 'pendiente'; // Estado por defecto si no se reconoce
};

router.post('/mantenimientos', async (req, res) => {
    try {
        const { artefacto_id, fecha, descripcion, estado } = req.body;
        const estadoNormalizado = normalizeEstado(estado);
        
        const [result] = await pool.query(
            'INSERT INTO mantenimientos (artefacto_id, fecha, descripcion, estado) VALUES (?, ?, ?, ?)',
            [artefacto_id, fecha, descripcion, estadoNormalizado]
        );
        res.status(201).json({
            id: result.insertId,
            artefacto_id,
            fecha,
            descripcion,
            estado: estadoNormalizado
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put('/mantenimientos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        // Verificamos si existe el mantenimiento
        const [rows] = await pool.query('SELECT * FROM mantenimientos WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Mantenimiento no encontrado' });
        }

        const mantenimiento = rows[0];
        const { artefacto_id, fecha, descripcion, estado } = req.body;
        
        // Solo actualizamos el estado si se proporciona uno nuevo
        const nuevoEstado = estado ? normalizeEstado(estado) : mantenimiento.estado;
        
        console.log('Estado recibido:', estado);
        console.log('Estado normalizado:', nuevoEstado);
        
        // Construimos la consulta de actualización
        const updateData = {
            artefacto_id: artefacto_id || mantenimiento.artefacto_id,
            fecha: fecha || mantenimiento.fecha,
            descripcion: descripcion || mantenimiento.descripcion,
            estado: nuevoEstado
        };

        console.log('Datos de actualización:', updateData);

        // Ejecutamos la actualización con una consulta más específica
        const [result] = await pool.query(
            `UPDATE mantenimientos 
             SET artefacto_id = ?, 
                 fecha = ?, 
                 descripcion = ?, 
                 estado = ?
             WHERE id = ?`,
            [updateData.artefacto_id, updateData.fecha, updateData.descripcion, updateData.estado, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                mensaje: 'No se pudo actualizar el mantenimiento',
                detalles: 'No se encontró el registro o no hubo cambios'
            });
        }

        // Verificamos el estado actual después de la actualización
        const [updatedRows] = await pool.query('SELECT * FROM mantenimientos WHERE id = ?', [id]);
        
        if (updatedRows.length === 0) {
            return res.status(404).json({ 
                mensaje: 'Error al obtener el mantenimiento actualizado',
                detalles: 'El registro no se encuentra después de la actualización'
            });
        }

        res.json({ 
            mensaje: 'Mantenimiento actualizado correctamente',
            mantenimiento: updatedRows[0],
            estadoAnterior: mantenimiento.estado,
            estadoNuevo: updatedRows[0].estado
        });

    } catch (error) {
        console.error('Error en actualización:', error);
        res.status(500).json({ 
            error: error.message,
            detalles: 'Error interno del servidor al actualizar el mantenimiento'
        });
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