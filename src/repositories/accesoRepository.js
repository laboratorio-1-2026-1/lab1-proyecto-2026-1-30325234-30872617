const pool = require('../config/db');

const findClientByIdClient = async (cedula) => {
    try {
        const query = 'SELECT id_client, id_user, nombre, apellido FROM clientes WHERE id_client = $1';
        const result = await pool.query(query, [cedula]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error en accesoRepository.findClientByIdClient:', error.message);
        throw error;
    }
};

const findActiveMembershipWithPayment = async (id_client) => {
    try {
        const query = `
            SELECT
                m.id_mebresia,
                m.id_client,
                m.estado,
                m.fecha_inicio,
                m.fecha_fin,
                COUNT(p.id_pago) AS pagos_count
            FROM membresias m
            LEFT JOIN pagos p
                ON p.id_membresia = m.id_mebresia
                AND p.fecha BETWEEN m.fecha_inicio AND m.fecha_fin
            WHERE m.id_client = $1
                AND m.estado = 'Activa'
                AND m.fecha_inicio <= CURRENT_DATE
                AND m.fecha_fin >= CURRENT_DATE
            GROUP BY m.id_mebresia, m.id_client, m.estado, m.fecha_inicio, m.fecha_fin
            ORDER BY m.fecha_fin DESC
            LIMIT 1`;

        const result = await pool.query(query, [id_client]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error en accesoRepository.findActiveMembershipWithPayment:', error.message);
        throw error;
    }
};

const insertControlBitacora = async (id_client, acceso, motivo_rechazo) => {
    try {
        const query = `
            INSERT INTO controlbitacora (id_client, hora_entrada, fecha, acceso, motivo_rechazo)
            VALUES ($1, CURRENT_TIME, CURRENT_DATE, $2, $3)
            RETURNING *`;

        const result = await pool.query(query, [id_client, acceso, motivo_rechazo]);
        return result.rows[0];
    } catch (error) {
        console.error('Error en accesoRepository.insertControlBitacora:', error.message);
        throw error;
    }
};

module.exports = {
    findClientByIdClient,
    findActiveMembershipWithPayment,
    insertControlBitacora
};
