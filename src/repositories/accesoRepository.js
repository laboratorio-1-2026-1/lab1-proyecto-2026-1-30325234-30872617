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

const registrarEntrada = async (id_cliente) => {
    try {
        const query = 'INSERT INTO ControlAcceso (ID_cliente, Fecha_hora_entrada) VALUES ($1, NOW()) RETURNING *';
        const { rows } = await pool.query(query, [id_cliente]);
        return { mensaje: 'Acceso permitido', acceso: rows[0] };
    } catch (error) {
        console.error('Error in accesoRepository.registrarEntrada:', error.message);
        throw new Error('Error al registrar la entrada');
    }
};

const verificarMembresia = async (id_cliente) => {
    try {
        const query = `
            SELECT m.*, p.Fecha + INTERVAL '1 day' * s.Duracion as fecha_vencimiento
            FROM Membresia m
            JOIN Pago p ON m.ID_pago = p.ID_pago
            JOIN Suscripcion s ON p.ID_suscripcion = s.ID_suscripcion
            WHERE m.ID_cliente = $1
            AND p.Fecha + INTERVAL '1 day' * s.Duracion >= NOW()
            ORDER BY p.Fecha DESC
            LIMIT 1
        `;
        const { rows } = await pool.query(query, [id_cliente]);
        return rows[0] ? { ...rows[0], activa: true } : { activa: false };
    } catch (error) {
        console.error('Error in accesoRepository.verificarMembresia:', error.message);
        throw new Error('Error al verificar la membresía');
    }
};

module.exports = { registrarEntrada, verificarMembresia };
