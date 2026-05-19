const pool = require('../config/db');

const findClientById = async (id_client) => {
    try {
        const query = 'SELECT id_client, id_user, nombre, apellido, telefono FROM clientes WHERE id_client = $1';
        const result = await pool.query(query, [id_client]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error en clienteRepository.findClientById:', error.message);
        throw error;
    }
};

const listClientes = async () => {
    try {
        const query = 'SELECT id_client, id_user, nombre, apellido, telefono FROM clientes ORDER BY id_client';
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error en clienteRepository.listClientes:', error.message);
        throw error;
    }
};

const findClientByUserId = async (id_user) => {
    try {
        const query = 'SELECT id_client, id_user, nombre, apellido, telefono FROM clientes WHERE id_user = $1';
        const result = await pool.query(query, [id_user]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error en clienteRepository.findClientByUserId:', error.message);
        throw error;
    }
};

const findEntrenadorByUserId = async (id_user) => {
    try {
        const query = 'SELECT id_entrenador, id_user, nombre, apellido FROM entrenadores WHERE id_user = $1';
        const result = await pool.query(query, [id_user]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error en clienteRepository.findEntrenadorByUserId:', error.message);
        throw error;
    }
};

const findEvaluacionesByClient = async (id_client) => {
    try {
        const query = `
            SELECT
                e.id_biometrica,
                e.id_client,
                e.id_entrenador,
                e.estatura,
                e.fecha,
                e.porcentaje_grasa,
                e.observaciones,
                CONCAT(t.nombre, ' ', t.apellido) AS entrenador
            FROM evabiometricas e
            JOIN entrenadores t ON t.id_entrenador = e.id_entrenador
            WHERE e.id_client = $1
            ORDER BY e.fecha DESC`;
        const result = await pool.query(query, [id_client]);
        return result.rows;
    } catch (error) {
        console.error('Error en clienteRepository.findEvaluacionesByClient:', error.message);
        throw error;
    }
};

const createEvaluacion = async (id_client, id_entrenador, estatura, porcentaje_grasa, observaciones, fecha) => {
    try {
        const query = `
            INSERT INTO evabiometricas (id_client, id_entrenador, estatura, fecha, porcentaje_grasa, observaciones)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`;
        const result = await pool.query(query, [id_client, id_entrenador, estatura, fecha, porcentaje_grasa, observaciones]);
        return result.rows[0];
    } catch (error) {
        console.error('Error en clienteRepository.createEvaluacion:', error.message);
        throw error;
    }
};

const createClient = async ({ email, password_hash, nombre, apellido, telefono }) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const userInsert = `
            INSERT INTO usuario (email, password_hash, id_rol, activo)
            VALUES ($1, $2, $3, TRUE)
            RETURNING id_user`;
        const userResult = await client.query(userInsert, [email, password_hash, 3]);
        const id_user = userResult.rows[0].id_user;

        const clienteInsert = `
            INSERT INTO clientes (id_user, nombre, apellido, telefono)
            VALUES ($1, $2, $3, $4)
            RETURNING id_client, id_user, nombre, apellido, telefono`;
        const clienteResult = await client.query(clienteInsert, [id_user, nombre, apellido, telefono]);

        await client.query('COMMIT');
        return clienteResult.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en clienteRepository.createClient:', error.message);
        throw error;
    } finally {
        client.release();
    }
};

const createEntrenador = async ({ email, password_hash, nombre, apellido, disciplina, salario, horario }) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const userInsert = `
            INSERT INTO usuario (email, password_hash, id_rol, activo)
            VALUES ($1, $2, $3, TRUE)
            RETURNING id_user`;
        const userResult = await client.query(userInsert, [email, password_hash, 2]);
        const id_user = userResult.rows[0].id_user;

        const entrenadorInsert = `
            INSERT INTO entrenadores (id_user, nombre, apellido, disciplina, salario, horario)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id_entrenador, id_user, nombre, apellido, disciplina, salario, horario`;
        const entrenadorResult = await client.query(entrenadorInsert, [id_user, nombre, apellido, disciplina, salario, horario]);

        await client.query('COMMIT');
        return entrenadorResult.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en clienteRepository.createEntrenador:', error.message);
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    findClientById,
    listClientes,
    findClientByUserId,
    findEntrenadorByUserId,
    findEvaluacionesByClient,
    createEvaluacion,
    createClient,
    createEntrenador
};
