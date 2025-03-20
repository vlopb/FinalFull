const express = require('express');
const router = express.Router();
const cors = require('cors');
const { pool } = require('../config/db');

// Obtener datos generales
router.get('/', async (req, res) => {
    try {
        // Obtener datos de mantenimientos con información de usuarios
        const [mantenimientos] = await pool.query(`
            SELECT 
                m.id,
                u.nombre as usuario,
                m.fecha,
                m.descripcion,
                m.costo
            FROM mantenimientos m
            JOIN usuarios u ON m.usuario_id = u.id
            ORDER BY m.fecha DESC
        `);
        
        res.json(mantenimientos);
    } catch (error) {
        console.error('Error al obtener datos generales:', error);
        res.status(500).json({ 
            error: 'Error al obtener datos generales',
            details: error.message 
        });
    }
});

module.exports = router; 