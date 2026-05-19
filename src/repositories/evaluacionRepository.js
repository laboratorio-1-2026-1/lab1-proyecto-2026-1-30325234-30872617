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
        const query = 'SELECT * FROM Evaluacion WHERE ID_cliente = $1 ORDER BY Fecha DESC';
        const { rows } = await pool.query(query, [id_cliente]);
        return rows;
    } catch (error) {
        console.error('Error in evaluacionRepository.findByClienteId:', error.message);
        throw new Error('Error al consultar las evaluaciones');
    }
};

const create = async (id_cliente, data) => {
    try {
        const { fecha, peso, altura, imc } = data;
        const query = 'INSERT INTO Evaluacion (ID_cliente, Fecha, Peso, Altura, IMC) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const { rows } = await pool.query(query, [id_cliente, fecha || new Date(), peso, altura, imc]);
        return rows[0];
    } catch (error) {
        console.error('Error in evaluacionRepository.create:', error.message);
        throw new Error('Error al crear la evaluación');
    }
};

module.exports = { findByClienteId, create };
