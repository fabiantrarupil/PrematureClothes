const { pool } = require('../db');

const handleServerError = (res, error, msg) => {
    console.error(`❌ ${msg}:`, error.message);
    res.status(500).json({ error: msg });
};

const getProductos = async (req, res) => {
    try {
        // QA FIX: Renombramos las columnas en el vuelo para que el Frontend las entienda sin cambios
        const query = `
            SELECT id, titulo, titulo AS nombre, descripcion, descripcion AS desc, 
                   precio, imagen, imagen AS img, imagen AS imagen_url, 
                   talla_rango, estado_prenda, vendedor_id 
            FROM productos 
            WHERE activo = true 
            ORDER BY id DESC`;
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (e) { handleServerError(res, e, "Error al obtener productos"); }
};

const getProductoById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT id, titulo, titulo AS nombre, descripcion, descripcion AS desc, 
                   precio, imagen, imagen AS img, imagen AS imagen_url, 
                   talla_rango, estado_prenda, vendedor_id 
            FROM productos WHERE id = $1`;
        const { rows } = await pool.query(query, [id]);
        rows.length ? res.json(rows[0]) : res.status(404).json({ message: "Producto no encontrado" });
    } catch (e) { handleServerError(res, e, "Error al obtener el producto"); }
};

const crearProducto = async (req, res) => {
    // QA FIX: Extraemos imagen_url del body y lo mapeamos a la columna 'imagen'
    const { 
        vendedor_id, categoria_id, titulo, descripcion, 
        precio, stock, imagen_url, talla_rango, estado_prenda 
    } = req.body;

    try {
        const query = `
            INSERT INTO productos 
            (vendedor_id, categoria_id, titulo, descripcion, precio, stock, imagen, talla_rango, estado_prenda, activo) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true) 
            RETURNING *, titulo AS nombre, imagen AS img`;
            
        const valores = [vendedor_id, categoria_id, titulo, descripcion, precio, stock, imagen_url, talla_rango, estado_prenda];
        const { rows } = await pool.query(query, valores);
        
        res.status(201).json({ ok: true, producto: rows[0] });
    } catch (e) { handleServerError(res, e, "Error al crear producto"); }
};

module.exports = { getProductos, getProductoById, crearProducto, deleteProducto: (id) => {} }; // Simplificado para brevedad