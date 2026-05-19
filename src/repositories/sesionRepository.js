const pool = require('../config/db');

const findDisciplinaById = async (id_disciplina) => {
    try {
        const query = 'SELECT id_disciplina, nombre, descripcion FROM disciplina WHERE id_disciplina = $1';
        const result = await pool.query(query, [id_disciplina]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error en sesionRepository.findDisciplinaById:', error.message);
        throw error;
    }
};

const findEntrenadorById = async (id_entrenador) => {
    try {
        const query = 'SELECT id_entrenador, id_user, nombre, apellido FROM entrenadores WHERE id_entrenador = $1';
        const result = await pool.query(query, [id_entrenador]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error en sesionRepository.findEntrenadorById:', error.message);
        throw error;
    }
};

const findSesionById = async (id_sesion) => {
    try {
        const query = 'SELECT id_sesion, id_disciplina, id_entrenador, hora_inicio, hora_fin, cupos FROM sesiones WHERE id_sesion = $1';
        const result = await pool.query(query, [id_sesion]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error en sesionRepository.findSesionById:', error.message);
        throw error;
    }
};

const findOverlappingSessionForEntrenador = async (id_entrenador, hora_inicio, hora_fin) => {
    try {
        const query = `
            SELECT 1
            FROM sesiones
            WHERE id_entrenador = $1
              AND NOT ($3 <= hora_inicio OR $2 >= hora_fin)
            LIMIT 1`;
        const result = await pool.query(query, [id_entrenador, hora_inicio, hora_fin]);
        return result.rows.length > 0;
    } catch (error) {
        console.error('Error en sesionRepository.findOverlappingSessionForEntrenador:', error.message);
        throw error;
    }
};

const createSesion = async (id_disciplina, id_entrenador, hora_inicio, hora_fin, cupos) => {
    try {
        const query = `
            INSERT INTO sesiones (id_disciplina, id_entrenador, hora_inicio, hora_fin, cupos)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`;
        const result = await pool.query(query, [id_disciplina, id_entrenador, hora_inicio, hora_fin, cupos]);
        return result.rows[0];
    } catch (error) {
        console.error('Error en sesionRepository.createSesion:', error.message);
        throw error;
    }
};

const listSesiones = async () => {
    try {
        const query = `
            SELECT
                s.id_sesion,
                d.nombre AS disciplina,
                CONCAT(e.nombre, ' ', e.apellido) AS entrenador,
                s.hora_inicio,
                s.hora_fin,
                s.cupos
            FROM sesiones s
            JOIN disciplina d ON d.id_disciplina = s.id_disciplina
            JOIN entrenadores e ON e.id_entrenador = s.id_entrenador
            ORDER BY s.id_sesion`;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error en sesionRepository.listSesiones:', error.message);
        throw error;
    }
};

const listSesionesWithFilters = async (fecha, disciplina) => {
    try {
        let query = `
            SELECT
                s.id_sesion,
                d.nombre AS disciplina,
                d.id_disciplina,
                CONCAT(e.nombre, ' ', e.apellido) AS entrenador,
                s.hora_inicio,
                s.hora_fin,
                s.cupos
            FROM sesiones s
            JOIN disciplina d ON d.id_disciplina = s.id_disciplina
            JOIN entrenadores e ON e.id_entrenador = s.id_entrenador
            WHERE 1=1`;
        const params = [];
        let paramCount = 1;
        
        if (fecha) {
            query += ` AND s.id_sesion IN (
                SELECT DISTINCT r.id_sesion FROM reservas r WHERE r.fecha = $${paramCount}
            )`;
            params.push(fecha);
            paramCount++;
        }
        
        if (disciplina) {
            query += ` AND d.nombre = $${paramCount}`;
            params.push(disciplina);
            paramCount++;
        }
        
        query += ` ORDER BY s.id_sesion`;
        const result = await pool.query(query, params);
        return result.rows;
    } catch (error) {
        console.error('Error en sesionRepository.listSesionesWithFilters:', error.message);
        throw error;
    }
};

const getSessionReservations = async (id_sesion) => {
    try {
        const query = `
            SELECT
                r.id_reserva,
                r.id_client,
                c.nombre,
                c.apellido,
                r.fecha
            FROM reservas r
            JOIN clientes c ON c.id_client = r.id_client
            WHERE r.id_sesion = $1
            ORDER BY r.fecha, r.id_reserva`;
        const result = await pool.query(query, [id_sesion]);
        return result.rows;
    } catch (error) {
        console.error('Error en sesionRepository.getSessionReservations:', error.message);
        throw error;
    }
};

const countReservasBySessionDate = async (id_sesion, fecha) => {
    try {
        const query = 'SELECT COUNT(*) AS total FROM reservas WHERE id_sesion = $1 AND fecha = $2';
        const result = await pool.query(query, [id_sesion, fecha]);
        return parseInt(result.rows[0].total, 10);
    } catch (error) {
        console.error('Error en sesionRepository.countReservasBySessionDate:', error.message);
        throw error;
    }
};

const findReservaByClientSessionDate = async (id_client, id_sesion, fecha) => {
    try {
        const query = 'SELECT id_reserva FROM reservas WHERE id_client = $1 AND id_sesion = $2 AND fecha = $3 LIMIT 1';
        const result = await pool.query(query, [id_client, id_sesion, fecha]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error en sesionRepository.findReservaByClientSessionDate:', error.message);
        throw error;
    }
};

const findClientReservationOverlap = async (id_client, fecha, hora_inicio, hora_fin) => {
    try {
        const query = `
            SELECT 1
            FROM reservas r
            JOIN sesiones s ON s.id_sesion = r.id_sesion
            WHERE r.id_client = $1
              AND r.fecha = $2
              AND NOT ($4 <= s.hora_inicio OR $3 >= s.hora_fin)
            LIMIT 1`;
        const result = await pool.query(query, [id_client, fecha, hora_inicio, hora_fin]);
        return result.rows.length > 0;
    } catch (error) {
        console.error('Error en sesionRepository.findClientReservationOverlap:', error.message);
        throw error;
    }
};

const createReserva = async (id_client, id_sesion, fecha) => {
    try {
        const query = `
            INSERT INTO reservas (id_client, id_sesion, fecha)
            VALUES ($1, $2, $3)
            RETURNING *`;
        const result = await pool.query(query, [id_client, id_sesion, fecha]);
        return result.rows[0];
    } catch (error) {
        console.error('Error en sesionRepository.createReserva:', error.message);
        throw error;
    }
};

const deleteSesion = async (id_sesion) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('DELETE FROM reservas WHERE id_sesion = $1', [id_sesion]);
        const result = await client.query('DELETE FROM sesiones WHERE id_sesion = $1 RETURNING *', [id_sesion]);
        await client.query('COMMIT');
        return result.rows[0] || null;
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en sesionRepository.deleteSesion:', error.message);
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    findDisciplinaById,
    findEntrenadorById,
    findSesionById,
    findOverlappingSessionForEntrenador,
    createSesion,
    listSesiones,
    listSesionesWithFilters,
    getSessionReservations,
    countReservasBySessionDate,
    findReservaByClientSessionDate,
    findClientReservationOverlap,
    createReserva,
    deleteSesion
};
