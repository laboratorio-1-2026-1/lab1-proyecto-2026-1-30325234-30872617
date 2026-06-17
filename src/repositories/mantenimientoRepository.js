const pool = require('../config/db');

const findMaquinaById = async (id_maquina) => {
    try {
        const query = 'SELECT id_maquina, id_categoria, nombre, descripcion, estado FROM maquinas WHERE id_maquina = $1';
        const result = await pool.query(query, [id_maquina]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error en mantenimientoRepository.findMaquinaById:', error.message);
        throw error;
    }
};

const findCategoriaById = async (id_categoria) => {
    try {
        const query = 'SELECT id_categoria, nombre FROM categoriamaquinas WHERE id_categoria = $1';
        const result = await pool.query(query, [id_categoria]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error en mantenimientoRepository.findCategoriaById:', error.message);
        throw error;
    }
};

const createCategoriaMaquina = async (nombre) => {
    try {
        const query = `
            INSERT INTO categoriamaquinas (nombre)
            VALUES ($1)
            RETURNING id_categoria, nombre`;
        const result = await pool.query(query, [nombre]);
        return result.rows[0];
    } catch (error) {
        console.error('Error en mantenimientoRepository.createCategoriaMaquina:', error.message);
        throw error;
    }
};

const createMaquina = async ({ id_categoria, nombre, descripcion }) => {
    try {
        const query = `
            INSERT INTO maquinas (id_categoria, nombre, descripcion, estado)
            VALUES ($1, $2, $3, 'Operativa')
            RETURNING id_maquina, id_categoria, nombre, descripcion, estado`;
        const result = await pool.query(query, [id_categoria, nombre, descripcion]);
        return result.rows[0];
    } catch (error) {
        console.error('Error en mantenimientoRepository.createMaquina:', error.message);
        throw error;
    }
};

const updateMaquina = async (id_maquina, { id_categoria, nombre, descripcion }) => {
    try {
        const query = `
            UPDATE maquinas
            SET id_categoria = COALESCE($2, id_categoria),
                nombre = COALESCE($3, nombre),
                descripcion = COALESCE($4, descripcion)
            WHERE id_maquina = $1
            RETURNING id_maquina, id_categoria, nombre, descripcion, estado`;
        const result = await pool.query(query, [id_maquina, id_categoria, nombre, descripcion]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error en mantenimientoRepository.updateMaquina:', error.message);
        throw error;
    }
};

const createTicket = async (id_maquina, descripcion) => {
    try {
        const query = `
            INSERT INTO ticketsmantenimiento (id_maquina, fecha_falla, descripcion, estado)
            VALUES ($1, CURRENT_DATE, $2, 'Pendiente')
            RETURNING *`;
        const result = await pool.query(query, [id_maquina, descripcion]);
        return result.rows[0];
    } catch (error) {
        console.error('Error en mantenimientoRepository.createTicket:', error.message);
        throw error;
    }
};

const updateMachineEstado = async (id_maquina, estado) => {
    try {
        const query = `
            UPDATE maquinas
            SET estado = $1
            WHERE id_maquina = $2
            RETURNING *`;
        const result = await pool.query(query, [estado, id_maquina]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error en mantenimientoRepository.updateMachineEstado:', error.message);
        throw error;
    }
};

const listTicketsHistory = async () => {
    try {
        const query = `
            SELECT
                t.id_ticket,
                t.id_maquina,
                m.nombre AS maquina,
                t.fecha_falla AS fecha,
                t.estado,
                t.descripcion AS observaciones,
                t.fecha_resolucion,
                t.costo_reparacion
            FROM ticketsmantenimiento t
            JOIN maquinas m ON m.id_maquina = t.id_maquina
            ORDER BY t.fecha_falla DESC`;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error en mantenimientoRepository.listTicketsHistory:', error.message);
        throw error;
    }
};

const getTicketsByMaquina = async (id_maquina) => {
    try {
        const query = `
            SELECT
                t.id_ticket,
                t.id_maquina,
                m.nombre AS maquina,
                t.fecha_falla AS fecha,
                t.estado,
                t.descripcion AS observaciones,
                t.fecha_resolucion,
                t.costo_reparacion
            FROM ticketsmantenimiento t
            JOIN maquinas m ON m.id_maquina = t.id_maquina
            WHERE t.id_maquina = $1
            ORDER BY t.fecha_falla DESC`;
        const result = await pool.query(query, [id_maquina]);
        return result.rows;
    } catch (error) {
        console.error('Error en mantenimientoRepository.getTicketsByMaquina:', error.message);
        throw error;
    }
};

module.exports = {
    findMaquinaById,
    findCategoriaById,
    createCategoriaMaquina,
    createMaquina,
    updateMaquina,
    createTicket,
    updateMachineEstado,
    listTicketsHistory,
    getTicketsByMaquina
};
