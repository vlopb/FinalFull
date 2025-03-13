const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Daiana01.',
    database: 'mantenimiento_db',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testConnection(){
    try{
        const connection = await pool.getConnection();
        console.log('Conexión exitosa a la base de datos');
        connection.release();
        return true;
    }catch(err){
        console.error('Error al conectar a la base de datos:', err);
        return false;
    }
}
;

module.exports = {pool: pool.promise(), testConnection};
