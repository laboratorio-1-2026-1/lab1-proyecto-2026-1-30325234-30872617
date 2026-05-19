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

const findByClienteId = async (id_cliente) => {
    try {
        const query = 'SELECT * FROM Membresia WHERE ID_cliente = $1 ORDER BY Fecha_inicio DESC';
        const { rows } = await pool.query(query, [id_cliente]);
        return rows;
    } catch (error) {
        console.error('Error in membresiRepository.findByClienteId:', error.message);
        throw new Error('Error al consultar las membresías');
    }
};

const create = async (id_cliente, data) => {
    try {
        const { id_suscripcion, fecha_inicio, fecha_fin } = data;
        const query = 'INSERT INTO Membresia (ID_cliente, ID_suscripcion, Fecha_inicio, Fecha_fin) VALUES ($1, $2, $3, $4) RETURNING *';
        const { rows } = await pool.query(query, [id_cliente, id_suscripcion, fecha_inicio || new Date(), fecha_fin]);
        return rows[0];
    } catch (error) {
        console.error('Error in membresiRepository.create:', error.message);
        throw new Error('Error al crear la membresía');
    }
};

module.exports = { findByClienteId, create };
