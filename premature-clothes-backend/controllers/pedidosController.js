const { pool } = require('../db');

const crearPedido = async (req, res) => {
    try {
        // El id viene del token (gracias al middleware de auth)
        const usuario_id = req.user.id; 
        const { total, productos } = req.body;

        // 1. Insertar el pedido principal
        const queryPedido = `
            INSERT INTO pedidos (usuario_id, total, estado, fecha) 
            VALUES ($1, $2, 'Pendiente', NOW()) 
            RETURNING id`;
        
        const { rows } = await pool.query(queryPedido, [usuario_id, total]);
        const pedidoId = rows[0].id;

        // 2. (Opcional pero recomendado) Insertar el detalle de productos
        // Si tienes una tabla 'pedidos_detalle', aquí harías el loop de los productos

        res.status(201).json({ ok: true, message: "Pedido registrado", pedidoId });
    } catch (error) {
        console.error("Error en checkout:", error.message);
        res.status(500).json({ error: "Error al procesar la compra" });
    }
};

const getMisPedidos = async (req, res) => {
    try {
        const usuario_id = req.user.id;
        const query = `
            SELECT id, total, estado, TO_CHAR(fecha, 'DD/MM/YYYY') as fecha 
            FROM pedidos 
            WHERE usuario_id = $1 
            ORDER BY fecha DESC`;
        
        const { rows } = await pool.query(query, [usuario_id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener historial" });
    }
};

module.exports = { crearPedido, getMisPedidos };