const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    // 1. Obtenemos el token del header (Authorization)
    const header = req.header("Authorization");
    
    if (!header) {
        return res.status(401).json({ error: "No hay token, autorización denegada" });
    }

    // El token viene como "Bearer xxxxx", así que lo separamos
    const token = header.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Formato de token inválido" });
    }

    try {
        // 2. Verificamos el token con la misma clave que usamos en el Login
        // QA FIX: Asegúrate que esta clave sea IGUAL a la del usuarioController.js
        const cifrado = jwt.verify(token, "CLAVE_SECRETA_ULTRA_SEGURA");
        
        // 3. Guardamos los datos del usuario en el request para que Favoritos pueda usarlos
        req.user = cifrado; 
        
        next(); // Continuamos a la siguiente función
    } catch (error) {
        res.status(401).json({ error: "Token no es válido" });
    }
};

module.exports = verificarToken;