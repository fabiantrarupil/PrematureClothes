const { Pool } = require('pg');
require('dotenv').config();

// En Render usamos la variable DATABASE_URL que es más robusta
// En local, si no existe, usará tus variables individuales
const isProduction = process.env.NODE_ENV === 'production' || process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL , // Render te da esta URL completa
  // Si no hay connectionString, usa los parámetros individuales (para tu local)
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  // 🎯 CRÍTICO PARA RENDER: SSL es obligatorio para conexiones seguras
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  allowExitOnIdle: true 
});

// Verificador de conexión (QA Mindset)
pool.on('connect', () => {
  console.log('✅ Base de Datos conectada exitosamente');
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en el pool de la DB:', err.message);
});

module.exports = { pool };