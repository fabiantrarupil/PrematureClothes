const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * 1. OBTENER PEDIDOS DEL USUARIO LOGUEADO
 * GET /api/pedidos/mis-pedidos
 * Esta ruta alimenta tu vista 'MisPedidos.jsx'
 */
router.get('/mis-pedidos', authMiddleware, async (req, res) => {
    try {
        const usuario_id = req.user.id; // Extraído del token por el middleware

        const query = `
            SELECT id, 
                   TO_CHAR(fecha, 'DD/MM/YYYY') as fecha, 
                   total, 
                   estado 
            FROM pedidos 
            WHERE usuario_id = $1 
            ORDER BY fecha DESC
        `;
        
        const { rows } = await pool.query(query, [usuario_id]);
        res.json(rows);
    } catch (error) {
        console.error("❌ ERROR AL OBTENER MIS PEDIDOS:", error.message);
        res.status(500).json({ error: "Error al cargar tu historial de pedidos" });
    }
});

/**
 * 2. CREAR UN NUEVO PEDIDO (CHECKOUT)
 * POST /api/pedidos/checkout
 */
router.post('/checkout', authMiddleware, async (req, res) => {
    try {
        const { total } = req.body;
        const usuario_id = req.user.id;

        if (!total || total <= 0) {
            return res.status(400).json({ error: "El total del pedido no es válido" });
        }

        const query = `
            INSERT INTO pedidos (usuario_id, total, estado, fecha) 
            VALUES ($1, $2, 'Enviado', NOW()) 
            RETURNING id, TO_CHAR(fecha, 'DD/MM/YYYY') as fecha_formateada
        `;

        const { rows } = await pool.query(query, [usuario_id, total]);

        return res.status(201).json({
            success: true,
            message: "Pedido registrado con éxito",
            id: rows[0].id,
            fecha: rows[0].fecha_formateada
        });

    } catch (error) {
        console.error("❌ ERROR EN CHECKOUT:", error.message);
        return res.status(500).json({ error: "Error al procesar el pedido en la base de datos" });
    }
});

/**
 * 3. OBTENER TODOS LOS PEDIDOS (SOLO ADMIN)
 * GET /api/pedidos/admin
 */
router.get('/admin', authMiddleware, async (req, res) => {
    try {
        // 🛡️ Seguridad QA: Verificación de Rol
        if (req.user.rol !== 'administrador') {
            return res.status(403).json({ error: "Acceso denegado. Se requieren permisos de administrador." });
        }

        const query = `
            SELECT p.id, 
                   TO_CHAR(p.fecha, 'DD/MM/YYYY HH24:MI') as fecha, 
                   u.nombre AS cliente, 
                   p.total, 
                   p.estado 
            FROM pedidos p
            JOIN usuarios u ON p.usuario_id = u.id
            ORDER BY p.fecha DESC
        `;
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error("❌ ERROR AL OBTENER REPORTES:", error.message);
        res.status(500).json({ error: "Error al cargar el reporte de pedidos" });
    }
});

module.exports = router;