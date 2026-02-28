const express = require('express');
const router = express.Router();
const { 
    registrarUsuario, 
    loginUsuario, 
    actualizarPerfil, 
    obtenerUsuarios, 
    actualizarRol 
} = require('../controllers/usuarioController');

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);
router.put('/perfil/:id', actualizarPerfil);

// Estas son las que te faltaban:
router.get('/', obtenerUsuarios); // Esto habilita GET /api/usuarios
router.put('/:id/rol', actualizarRol); // Esto habilita PUT /api/usuarios/:id/rol

module.exports = router;