const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'tu_usuario',
    password: 'tu_contraseña',
    database: 'tu_base_de_datos'
});

const testConnection = async () => {
    try {
        await pool.getConnection();
        console.log('Conexión a la base de datos establecida');
        return true;
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        return false;
    }
};

module.exports = { pool, testConnection };
