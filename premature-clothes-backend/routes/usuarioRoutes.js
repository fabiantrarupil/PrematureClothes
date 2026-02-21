const express = require('express');
const router = express.Router();
const { registrarUsuario, loginUsuario, actualizarPerfil } = require('../controllers/usuarioController');

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario); // Asegúrate de tener esta función en tu controlador
router.put('/:id', actualizarPerfil);

module.exports = router;