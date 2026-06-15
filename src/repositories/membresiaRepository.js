const pool = require('../config/db');

const listSuscripciones = async () => {
    try {
        const query = 'SELECT id_suscripcion, nombre, costo, duracion FROM suscripcion ORDER BY id_suscripcion';
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error en membresiaRepository.listSuscripciones:', error.message);
        throw error;
    }
};

const findSuscripcionById = async (id_suscripcion) => {
    try {
        const query = 'SELECT id_suscripcion, nombre, costo, duracion FROM suscripcion WHERE id_suscripcion = $1';
        const result = await pool.query(query, [id_suscripcion]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error en membresiaRepository.findSuscripcionById:', error.message);
        throw error;
    }
};

const createSuscripcion = async (nombre, costo, duracion) => {
    try {
        const query = `
            INSERT INTO suscripcion (nombre, costo, duracion)
            VALUES ($1, $2, $3)
            RETURNING *`;
        const result = await pool.query(query, [nombre, costo, duracion]);
        return result.rows[0];
    } catch (error) {
        console.error('Error en membresiaRepository.createSuscripcion:', error.message);
        throw error;
    }
};

const findMembresiaById = async (id_membresia) => {
    try {
        const query = 'SELECT id_mebresia, id_client, id_suscripcion, fecha_inicio, fecha_fin, estado FROM membresias WHERE id_mebresia = $1';
        const result = await pool.query(query, [id_membresia]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error en membresiaRepository.findMembresiaById:', error.message);
        throw error;
    }
};

const createPago = async (id_membresia, monto, metodo_pago) => {
    try {
        const query = `
            INSERT INTO pagos (id_membresia, monto, fecha, metodo_pago)
            VALUES ($1, $2, CURRENT_DATE, $3)
            RETURNING *`;
        const result = await pool.query(query, [id_membresia, monto, metodo_pago]);
        return result.rows[0];
    } catch (error) {
        console.error('Error en membresiaRepository.createPago:', error.message);
        throw error;
    }
};

const findPagoById = async (id_pago) => {
    try {
        const query = `
            SELECT
                p.id_pago,
                p.monto,
                p.fecha,
                p.metodo_pago,
                m.id_mebresia,
                m.id_client,
                c.nombre AS cliente_nombre,
                c.apellido AS cliente_apellido,
                s.nombre AS plan,
                m.fecha_inicio,
                m.fecha_fin,
                m.estado AS estado_membresia
            FROM pagos p
            JOIN membresias m ON m.id_mebresia = p.id_membresia
            JOIN clientes c ON c.id_client = m.id_client
            JOIN suscripcion s ON s.id_suscripcion = m.id_suscripcion
            WHERE p.id_pago = $1`;
        const result = await pool.query(query, [id_pago]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error en membresiaRepository.findPagoById:', error.message);
        throw error;
    }
};

const listMembresiasByClient = async (id_client) => {
    try {
        const query = `
            SELECT
                m.id_mebresia,
                s.nombre AS tipo_plan,
                m.estado,
                m.fecha_inicio,
                m.fecha_fin
            FROM membresias m
            JOIN suscripcion s ON s.id_suscripcion = m.id_suscripcion
            WHERE m.id_client = $1
            ORDER BY m.fecha_fin DESC`;
        const result = await pool.query(query, [id_client]);
        return result.rows;
    } catch (error) {
        console.error('Error en membresiaRepository.listMembresiasByClient:', error.message);
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
        console.error('Error en membresiaRepository.findActiveMembershipWithPayment:', error.message);
        throw error;
    }
};

const createMembresia = async (id_client, id_suscripcion, fecha_inicio, fecha_fin, estado) => {
    try {
        const query = `
            INSERT INTO membresias (id_client, id_suscripcion, fecha_inicio, fecha_fin, estado)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`;
        const result = await pool.query(query, [id_client, id_suscripcion, fecha_inicio, fecha_fin, estado]);
        return result.rows[0];
    } catch (error) {
        console.error('Error en membresiaRepository.createMembresia:', error.message);
        throw error;
    }
};

const deactivateExpiredMemberships = async () => {
    try {
        const query = `
            UPDATE membresias
            SET estado = 'Inactiva'
            WHERE estado = 'Activa'
              AND fecha_fin < CURRENT_DATE
            RETURNING *`;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error en membresiaRepository.deactivateExpiredMemberships:', error.message);
        throw error;
    }
};

const listClientsWithoutActiveMembership = async () => {
    try {
        const query = `
            SELECT c.id_client, c.id_user, c.nombre, c.apellido, c.telefono
            FROM clientes c
            WHERE NOT EXISTS (
                SELECT 1 FROM membresias m
                WHERE m.id_client = c.id_client
                  AND m.estado = 'Activa'
                  AND m.fecha_inicio <= CURRENT_DATE
                  AND m.fecha_fin >= CURRENT_DATE
            )
            ORDER BY c.id_client`;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error en membresiaRepository.listClientsWithoutActiveMembership:', error.message);
        throw error;
    }
};

const deleteMembresia = async (id_membresia) => {
    try {
        const query = 'DELETE FROM membresias WHERE id_mebresia = $1 RETURNING *';
        const result = await pool.query(query, [id_membresia]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error en membresiaRepository.deleteMembresia:', error.message);
        throw error;
    }
};

const updateMembresiaEstado = async (id_membresia, estado) => {
    try {
        const query = `
            UPDATE membresias
            SET estado = $2
            WHERE id_mebresia = $1
            RETURNING *`;
        const result = await pool.query(query, [id_membresia, estado]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error en membresiaRepository.updateMembresiaEstado:', error.message);
        throw error;
    }
};

module.exports = {
    listSuscripciones,
    findMembresiaById,
    createPago,
    findPagoById,
    listMembresiasByClient,
    findActiveMembershipWithPayment,
    createMembresia,
    deactivateExpiredMemberships,
    listClientsWithoutActiveMembership,
    deleteMembresia,
    updateMembresiaEstado
};
