const mysql = require('mysql2');

const connection = mysql.createConnection({
  // 1. El host es solo la dirección del servidor (sin el mysql:// y sin el puerto)
  host: 'gondola.proxy.rlwy.net', 
  
  // 2. El usuario es 'root' (lo dice al principio de tu cadena)
  user: 'root',
  
  // 3. La contraseña es lo que está después de los dos puntos y antes del @
  password: 'mKAefsjATacOBXKVZwDKaGGEedXicEKy',
  
  // 4. El nombre de la base de datos es lo que está al final después de la barra /
  database: 'railway', 
  
  // 5. El puerto es el número que está después de los dos puntos al final
  port: 14829 
});

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a Railway:', err.message);
    return;
  }
  console.log('¡Conectado exitosamente a la base de datos en la nube!');
});

module.exports = connection;