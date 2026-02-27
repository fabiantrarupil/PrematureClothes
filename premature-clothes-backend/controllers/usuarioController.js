const { pool } = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // 👈 IMPORTANTE: Añade esta línea

// 1. REGISTRO
const registrarUsuario = async (req, res) => {
    try {
        const { nombre_completo, email, password, direccion_envio, rol } = req.body;

        // Validación básica preventiva (Mindset QA)
        if (!email || !password || !nombre_completo) {
            return res.status(400).json({ ok: false, msg: "Faltan campos obligatorios" });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);

        // 🎯 FIX: Añadimos "::rol_usuario" para forzar el tipo de dato correcto
        const consulta = `
            INSERT INTO usuarios (nombre_completo, email, password, direccion_envio, rol, activo) 
            VALUES ($1, $2, $3, $4, $5::rol_usuario, true) 
            RETURNING id, nombre_completo, email, rol`;

        const valores = [nombre_completo, email, passwordEncriptada, direccion_envio, rol || 'comprador'];

        const { rows } = await pool.query(consulta, valores);

        res.status(201).json({ ok: true, usuario: rows[0] });
    } catch (error) {
        console.error("❌ ERROR EN REGISTRO:", error.message);
        // Enviamos el mensaje real para que en el Frontend sepas qué falló
        res.status(500).json({ ok: false, msg: error.message });
    }
};

// 2. LOGIN (CONSOLIDADO CON TOKEN)
const loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        const consulta = "SELECT * FROM usuarios WHERE email = $1";
        const { rows } = await pool.query(consulta, [email]);

        if (rows.length === 0) {
            return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
        }

        const usuario = rows[0];
        const passwordValida = await bcrypt.compare(password, usuario.password);

        if (!passwordValida) {
            return res.status(401).json({ ok: false, msg: "Contraseña incorrecta" });
        }

        // 🔑 GENERACIÓN DEL TOKEN
        // Usamos una clave secreta (en producción usa variables de entorno)
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            "CLAVE_SECRETA_ULTRA_SEGURA",
            { expiresIn: '24h' }
        );

        delete usuario.password;

        // 🚀 RESPUESTA CONSOLIDADA: Enviamos el usuario Y el token
        res.status(200).json({
            ok: true,
            usuario,
            token // 👈 Esto es lo que le faltaba a tu frontend
        });

    } catch (error) {
        console.error("Error en login:", error.message);
        res.status(500).json({ ok: false, msg: "Error en el servidor" });
    }
};

const actualizarPerfil = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_completo, email, direccion_envio } = req.body;
        const consulta = `
            UPDATE usuarios 
            SET nombre_completo = $1, email = $2, direccion_envio = $3 
            WHERE id = $4 
            RETURNING id, nombre_completo, email, direccion_envio, rol`;
        const { rows } = await pool.query(consulta, [nombre_completo, email, direccion_envio, id]);
        if (rows.length === 0) return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
        res.json({ ok: true, usuario: rows[0], msg: "Perfil actualizado en DB" });
    } catch (error) {
        res.status(500).json({ ok: false, msg: "Error al actualizar" });
    }
};

module.exports = { registrarUsuario, loginUsuario, actualizarPerfil };