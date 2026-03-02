const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * 1. OBTENER PEDIDOS DEL USUARIO LOGUEADO
 * GET /api/pedidos/mis-pedidos
 */
router.get('/mis-pedidos', authMiddleware, async (req, res) => {
    try {
        const usuario_id = req.user.id; 

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

        // Validación QA: Evitar datos nulos o negativos
        if (!total || total <= 0) {
            return res.status(400).json({ error: "El total del pedido no es válido" });
        }

        /**
         * NOTA DE INGENIERÍA: 
         * Solo insertamos en columnas esenciales para evitar conflictos 
         * con columnas eliminadas o no utilizadas (metodo_pago, etc).
         */
        const query = `
            INSERT INTO pedidos (usuario_id, total, estado, fecha) 
            VALUES ($1, $2, $3, NOW()) 
            RETURNING id, TO_CHAR(fecha, 'DD/MM/YYYY') as fecha_formateada
        `;

        const values = [usuario_id, total, 'pendiente'];

        const { rows } = await pool.query(query, values);

        return res.status(201).json({
            success: true,
            message: "¡Pedido registrado con éxito! 👶👕",
            id: rows[0].id,
            fecha: rows[0].fecha_formateada
        });

    } catch (error) {
        console.error("❌ ERROR CRÍTICO EN CHECKOUT:", error.message);
        return res.status(500).json({ 
            error: "Error interno al procesar la compra",
            detalle: error.message 
        });
    }
});

/**
 * 3. OBTENER TODOS LOS PEDIDOS (ADMIN)
 */
router.get('/admin', authMiddleware, async (req, res) => {
    try {
        if (req.user.rol !== 'administrador') {
            return res.status(403).json({ error: "Acceso denegado. Se requiere rol de administrador." });
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
        console.error("❌ ERROR EN REPORTES ADMIN:", error.message);
        res.status(500).json({ error: "Error al cargar el reporte de gestión" });
    }
});

module.exports = router;