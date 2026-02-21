const { Pool } = require('pg');
require('dotenv').config();

// Configuramos la conexión usando las variables de tu archivo .env
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  allowExitOnIdle: true // Muy útil para que no se quede pegado el proceso
});

module.exports = { pool };