// 1. Importaciones
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { pool } = require('./db'); // Importante: desestructurar si db.js exporta { pool }

// Importación de Rutas
const productRoutes = require('./routes/productRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const favoritosRoutes = require('./routes/favoritosRoutes');
const pedidosRoutes = require('./routes/pedidosRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 2. Middlewares (Orden Crítico)
app.use(cors()); // Solo una vez es suficiente
app.use(express.json()); // Necesario para que req.body no sea undefined

// 3. Rutas
// Ruta de prueba (Smoke Test)
app.get('/', (req, res) => {
    res.send('Servidor de PrematureClothes funcionando correctamente 🚀');
});
app.get('/api/test-usuarios', (req, res) => {
    res.json({ msg: "Si ves esto, el prefijo /api funciona" });
});

// Montaje de rutas con prefijos claros (API REST)
app.use('/api/productos', productRoutes);
app.use('/api/usuarios', usuarioRoutes); // <-- CAMBIA ESTO (Antes era solo /usuarios)
app.use('/api/favoritos', favoritosRoutes);
app.use('/api/pedidos', pedidosRoutes);

// 4. Manejo de errores global (Mindset QA: Anticipación)
// Si llegamos aquí, es porque ninguna ruta coincidió
app.use((req, res) => {
    res.status(404).json({ ok: false, msg: "La ruta solicitada no existe" });
});

// 5. Levantamiento del servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor encendido en http://localhost:${PORT}`);
    console.log(`Rutas disponibles: /usuarios/register y /usuarios/login`);
});