const { pool } = require('../db');

const toggleFavorito = async (req, res) => {
    try {
        const { id_producto } = req.body;
        const id_usuario = req.usuario.id; // Esto vendrá del middleware de autenticación

        // Verificamos si ya existe
        const existe = await pool.query(
            "SELECT * FROM favoritos WHERE id_usuario = $1 AND id_producto = $2",
            [id_usuario, id_producto]
        );

        if (existe.rows.length > 0) {
            // Si existe, lo quitamos
            await pool.query(
                "DELETE FROM favoritos WHERE id_usuario = $1 AND id_producto = $2",
                [id_usuario, id_producto]
            );
            return res.json({ msg: "Favorito eliminado" });
        } else {
            // Si no existe, lo agregamos
            await pool.query(
                "INSERT INTO favoritos (id_usuario, id_producto) VALUES ($1, $2)",
                [id_usuario, id_producto]
            );
            return res.json({ msg: "Favorito agregado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor al procesar favorito" });
    }
};

module.exports = { toggleFavorito };