const express = require('express');
const router = express.Router();
// 1. Importamos todas las funciones del controlador
const { 
    getProductos, 
    getProductoById, 
    crearProducto, 
    deleteProducto 
} = require('../controllers/productController');

// 2. Definición de rutas (API REST)

// GET /productos -> Obtener todos los productos activos
router.get('/', getProductos);

// GET /productos/:id -> Obtener un producto específico para la vista de detalle
router.get('/:id', getProductoById);

// POST /productos -> Crear un nuevo producto (para vendedores)
router.post('/', crearProducto);

// DELETE /productos/:id -> Desactivar un producto (Soft delete)
router.delete('/:id', deleteProducto);

module.exports = router;