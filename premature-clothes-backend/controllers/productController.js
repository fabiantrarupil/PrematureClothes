const { pool } = require('../db'); // Asegúrate de usar la desestructuración si así exportas en db.js

const handleServerError = (res, error, msg) => {
    console.error(`❌ ${msg}:`, error.message);
    res.status(500).json({ error: msg });
};

const getProductos = async (req, res) => {
    try {
        // Traemos los productos activos
        const { rows } = await pool.query('SELECT * FROM productos WHERE activo = true ORDER BY id DESC');
        res.json(rows);
    } catch (e) { handleServerError(res, e, "Error al obtener productos"); }
};

const getProductoById = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
        rows.length ? res.json(rows[0]) : res.status(404).json({ message: "Producto no encontrado" });
    } catch (e) { handleServerError(res, e, "Error al obtener el producto"); }
};

const crearProducto = async (req, res) => {
    // 🔍 Ajustamos para incluir 'descripcion' e 'imagen_url'
    const { 
        vendedor_id, categoria_id, titulo, descripcion, 
        precio, stock, imagen_url, talla_rango, estado_prenda 
    } = req.body;

    try {
        const query = `
            INSERT INTO productos 
            (vendedor_id, categoria_id, titulo, descripcion, precio, stock, imagen_url, talla_rango, estado_prenda, activo) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true) 
            RETURNING *`;
            
        const valores = [vendedor_id, categoria_id, titulo, descripcion, precio, stock, imagen_url, talla_rango, estado_prenda];
        const { rows } = await pool.query(query, valores);
        
        res.status(201).json({ ok: true, producto: rows[0] });
    } catch (e) { handleServerError(res, e, "Error al crear producto"); }
};

const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;
        // Soft Delete: En lugar de borrar, desactivamos para mantener historial (Práctica QA)
        const result = await pool.query('UPDATE productos SET activo = false WHERE id = $1', [id]);
        result.rowCount ? res.json({ message: "Producto desactivado con éxito" }) : res.status(404).json({ message: "No encontrado" });
    } catch (e) { handleServerError(res, e, "Error al eliminar producto"); }
};

module.exports = { getProductos, getProductoById, crearProducto, deleteProducto };