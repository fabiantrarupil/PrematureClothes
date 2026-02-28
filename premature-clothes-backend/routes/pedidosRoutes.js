const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const authMiddleware = require('../middlewares/authMiddleware');

// 1. Obtener todos los pedidos (Consolidado para Reportes y Gestión)
// QA FIX: Cambiamos '/' para que coincida con el fetch del Frontend
router.get('/', authMiddleware, async (req, res) => {
    try {
        // 🛡️ Seguridad QA: Solo 'administrador' puede ver reportes globales
        if (req.user.rol !== 'administrador') {
            return res.status(403).json({ error: "Acceso denegado. Se requieren permisos de administrador." });
        }

        const query = `
            SELECT p.id, p.fecha, u.nombre_completo AS cliente, p.total, p.estado 
            FROM pedidos p
            JOIN usuarios u ON p.usuario_id = u.id
            ORDER BY p.fecha DESC
        `;
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error("❌ ERROR AL OBTENER PEDIDOS:", error.message);
        res.status(500).json({ error: "Error al cargar pedidos" });
    }
});

// 2. Crear un nuevo pedido (Checkout)
router.post('/checkout', authMiddleware, async (req, res) => {
    try {
        const { total } = req.body;
        const usuario_id = req.user.id;

        const query = `
            INSERT INTO pedidos (usuario_id, total, estado) 
            VALUES ($1, $2, 'pendiente') 
            RETURNING id, fecha
        `;

        const { rows } = await pool.query(query, [usuario_id, total]);

        return res.status(201).json({
            success: true,
            id: rows[0].id,
            fecha: rows[0].fecha
        });

    } catch (error) {
        console.error("❌ ERROR EN CHECKOUT:", error.message);
        return res.status(500).json({ error: "Error al procesar pedido" });
    }
});

module.exports = router;