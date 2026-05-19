const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || undefined,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'smartgym_db',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

const findById = async (id) => {
    try {
        const query = 'SELECT * FROM Clientes WHERE ID_client = $1';
        const { rows } = await pool.query(query, [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error in clienteRepository.findById:', error.message);
        throw new Error('Error al consultar el cliente');
    }
};

const findByUserId = async (id_user) => {
    try {
        const query = 'SELECT * FROM Clientes WHERE ID_user = $1';
        const { rows } = await pool.query(query, [id_user]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error in clienteRepository.findByUserId:', error.message);
        throw new Error('Error al consultar el cliente');
    }
};

const findByDocumento = async (documento) => {
    try {
        const query = 'SELECT c.* FROM Clientes c JOIN Usuario u ON c.ID_user = u.ID_user WHERE u.Cedula = $1';
        const { rows } = await pool.query(query, [documento]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error in clienteRepository.findByDocumento:', error.message);
        throw new Error('Error al consultar el cliente');
    }
};

module.exports = { findById, findByUserId, findByDocumento };
