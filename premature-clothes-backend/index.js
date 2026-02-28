const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { pool } = require('./db');

const productRoutes = require('./routes/productRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const favoritosRoutes = require('./routes/favoritosRoutes');
const pedidosRoutes = require('./routes/pedidosRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Smoke Test
app.get('/', (req, res) => {
    res.send('Servidor de PrematureClothes funcionando correctamente 🚀');
});

// Prefijo /api para todas las rutas (Consistencia QA)
app.use('/api/productos', productRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/favoritos', favoritosRoutes);
app.use('/api/pedidos', pedidosRoutes);

// Manejo de rutas inexistentes
app.use((req, res) => {
    res.status(404).json({ ok: false, msg: "La ruta solicitada no existe en PrematureClothes" });
});

app.listen(PORT, () => {
    console.log(`✅ Servidor encendido en puerto ${PORT}`);
    console.log(`📡 Endpoints activos en /api/...`);
});