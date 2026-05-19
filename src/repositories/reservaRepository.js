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

const validarReserva = async (id_cliente, id_sesion) => {
    try {
        const sesion = await pool.query('SELECT * FROM Sesion WHERE ID_sesion = $1', [id_sesion]);
        if (sesion.rows.length === 0) {
            throw new Error('Sesión no encontrada');
        }

        const sesionData = sesion.rows[0];
        const cuposUsados = await pool.query('SELECT COUNT(*) FROM Reserva WHERE ID_sesion = $1', [id_sesion]);
        const sinCupos = parseInt(cuposUsados.rows[0].count) >= sesionData.Cupos;

        const solapamiento = await pool.query(
            `SELECT r.* FROM Reserva r
             JOIN Sesion s ON r.ID_sesion = s.ID_sesion
             WHERE r.ID_cliente = $1
             AND s.Hora_inicio < $3
             AND s.Hora_fin > $2`,
            [id_cliente, sesionData.Hora_inicio, sesionData.Hora_fin]
        );

        return {
            solapamiento: solapamiento.rows.length > 0,
            sinCupos: sinCupos
        };
    } catch (error) {
        console.error('Error in reservaRepository.validarReserva:', error.message);
        throw new Error('Error al validar la reserva');
    }
};

const create = async (id_cliente, id_sesion) => {
    try {
        const query = 'INSERT INTO Reserva (ID_cliente, ID_sesion, Fecha_reserva) VALUES ($1, $2, NOW()) RETURNING *';
        const { rows } = await pool.query(query, [id_cliente, id_sesion]);
        return rows[0];
    } catch (error) {
        console.error('Error in reservaRepository.create:', error.message);
        throw new Error('Error al crear la reserva');
    }
};

const findBySesionId = async (id_sesion) => {
    try {
        const query = 'SELECT * FROM Reserva WHERE ID_sesion = $1 ORDER BY Fecha_reserva DESC';
        const { rows } = await pool.query(query, [id_sesion]);
        return rows;
    } catch (error) {
        console.error('Error in reservaRepository.findBySesionId:', error.message);
        throw new Error('Error al consultar las reservas');
    }
};

module.exports = { validarReserva, create, findBySesionId };
