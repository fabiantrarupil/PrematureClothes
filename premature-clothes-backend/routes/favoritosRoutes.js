const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const authMiddleware = require('../middlewares/authMiddleware');

// 🎯 Manejo de favoritos (Toggle: Agrega o Elimina)
router.post('/', authMiddleware, async (req, res) => {
    // 1. Extraemos los datos (Coincide con lo que envía el Frontend)
    const { producto_id } = req.body;
    const usuario_id = req.user?.id; // ID del usuario autenticado

    // QA Check: Validación de entrada
    if (!usuario_id || !producto_id) {
        return res.status(400).json({ error: "Faltan datos: usuario_id o producto_id" });
    }

    try {
        // 2. Verificamos existencia usando los nombres de columna de TU base de datos
        const consultaExistencia = "SELECT * FROM favoritos WHERE usuario_id = $1 AND producto_id = $2";
        const existe = await pool.query(consultaExistencia, [usuario_id, producto_id]);

        if (existe.rows.length > 0) {
            // 3. Si ya existe, DELETE (Usando producto_id)
            await pool.query(
                "DELETE FROM favoritos WHERE usuario_id = $1 AND producto_id = $2",
                [usuario_id, producto_id]
            );
            return res.status(200).json({ message: "Eliminado de favoritos", action: "removed" });
        } else {
            // 4. Si no existe, INSERT (Usando producto_id)
            // IMPORTANTE: Aquí tenías 'id_producto' y la variable 'id_producto' no estaba definida.
            await pool.query(
                "INSERT INTO favoritos (usuario_id, producto_id) VALUES ($1, $2)",
                [usuario_id, producto_id]
            );
            return res.status(201).json({ message: "Agregado a favoritos", action: "added" });
        }
    } catch (error) {
        // Log detallado para el desarrollador
        console.error("❌ ERROR ESPECÍFICO DE DB:", error.message);
        res.status(500).json({ 
            error: "Error interno en la base de datos", 
            detalle: error.message 
        });
    }
});

module.exports = router;