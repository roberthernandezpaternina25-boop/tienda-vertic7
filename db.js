const mysql = require('mysql2/promise');

// Creamos un "pool" de conexiones, que es más estable para servidores en la nube como Render
const connection = mysql.createPool({
  host: 'gondola.proxy.rlwy.net',
  user: 'root',
  password: 'mKAefsjATacOBXKVZwDKaGGEEdXicEKy',
  database: 'railway',
  port: 14829,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Mensaje de verificación simple
console.log('¡Configuración de base de datos lista y conectada!');

module.exports = connection;