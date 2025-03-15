const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Daiana01.',
    database: 'mantenimiento_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log('Base de datos conectada correctamente');
        connection.release();
    })
    .catch(err => {
        console.error('Error al conectar con la base de datos:', err);
    });

module.exports = {
    pool
};
