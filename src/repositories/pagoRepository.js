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

const create = async (id_cliente, id_suscripcion, monto) => {
    try {
        const query = 'INSERT INTO Pago (ID_cliente, ID_suscripcion, Monto, Fecha) VALUES ($1, $2, $3, NOW()) RETURNING *';
        const { rows } = await pool.query(query, [id_cliente, id_suscripcion, monto]);
        return rows[0];
    } catch (error) {
        console.error('Error in pagoRepository.create:', error.message);
        throw new Error('Error al crear el pago');
    }
};

const findById = async (id_pago) => {
    try {
        const query = 'SELECT * FROM Pago WHERE ID_pago = $1';
        const { rows } = await pool.query(query, [id_pago]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error in pagoRepository.findById:', error.message);
        throw new Error('Error al consultar el pago');
    }
};

module.exports = { create, findById };
