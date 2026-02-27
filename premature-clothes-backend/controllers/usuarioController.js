const { pool } = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTRO DE USUARIO
const registrarUsuario = async (req, res) => {
    try {
        const { nombre_completo, email, password, direccion_envio, rol } = req.body;

        // Validación de campos obligatorios (QA Mindset)
        if (!nombre_completo || !email || !password) {
            return res.status(400).json({ ok: false, msg: "Nombre, email y contraseña son requeridos" });
        }

        // Encriptación de contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);

        // Inserción con casting explícito para el ENUM 'rol_usuario'
        const consulta = `
            INSERT INTO usuarios (nombre_completo, email, password, direccion_envio, rol, activo) 
            VALUES ($1, $2, $3, $4, $5::rol_usuario, true) 
            RETURNING id, nombre_completo, email, rol, direccion_envio`;

        const valores = [
            nombre_completo, 
            email, 
            passwordEncriptada, 
            direccion_envio || null, 
            rol || 'comprador'
        ];

        const { rows } = await pool.query(consulta, valores);

        res.status(201).json({ 
            ok: true, 
            usuario: rows[0],
            msg: "Usuario registrado con éxito" 
        });

    } catch (error) {
        console.error("❌ ERROR EN REGISTRO:", error.message);
        // Si el error es por email duplicado (Unique Constraint)
        if (error.code === '23505') {
            return res.status(400).json({ ok: false, msg: "El correo electrónico ya está registrado" });
        }
        res.status(500).json({ ok: false, msg: "Error interno del servidor al registrar" });
    }
};

// 2. LOGIN DE USUARIO (Generación de Token)
const loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ ok: false, msg: "Email y contraseña requeridos" });
        }

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

        // Generación del JWT
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol },
            process.env.JWT_SECRET || "CLAVE_SECRETA_ULTRA_SEGURA",
            { expiresIn: '24h' }
        );

        // Limpiamos la password antes de enviar la respuesta
        delete usuario.password;

        res.status(200).json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.error("❌ ERROR EN LOGIN:", error.message);
        res.status(500).json({ ok: false, msg: "Error interno del servidor en login" });
    }
};

// 3. ACTUALIZAR PERFIL
const actualizarPerfil = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_completo, email, direccion_envio } = req.body;

        const consulta = `
            UPDATE usuarios 
            SET nombre_completo = $1, email = $2, direccion_envio = $3, updated_at = CURRENT_TIMESTAMP
            WHERE id = $4 
            RETURNING id, nombre_completo, email, direccion_envio, rol`;

        const { rows } = await pool.query(consulta, [nombre_completo, email, direccion_envio, id]);

        if (rows.length === 0) {
            return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
        }

        res.json({ 
            ok: true, 
            usuario: rows[0], 
            msg: "Perfil actualizado correctamente" 
        });

    } catch (error) {
        console.error("❌ ERROR AL ACTUALIZAR:", error.message);
        res.status(500).json({ ok: false, msg: "Error al actualizar el perfil" });
    }
};

module.exports = { registrarUsuario, loginUsuario, actualizarPerfil };