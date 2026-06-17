const pool = require('../config/db');

/**
 * Obtiene todas las disciplinas del catálogo base [1].
 */
const findAll = async () => {
    try {
        // Usamos los nombres exactos del MER: ID_disciplina, Nombre, Descripcion [3]
        const query = 'SELECT id_disciplina, nombre, descripcion FROM disciplina ORDER BY id_disciplina';
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error en disciplinaRepository.findAll:', error.message);
        throw error;
    }
};

const findById = async (id_disciplina) => {
    try {
        const query = 'SELECT id_disciplina, nombre, descripcion FROM disciplina WHERE id_disciplina = $1';
        const result = await pool.query(query, [id_disciplina]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error en disciplinaRepository.findById:', error.message);
        throw error;
    }
};

const deleteDisciplina = async (id_disciplina) => {
    try {
        const query = 'DELETE FROM disciplina WHERE id_disciplina = $1 RETURNING *';
        const result = await pool.query(query, [id_disciplina]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error en disciplinaRepository.deleteDisciplina:', error.message);
        throw error;
    }
};

const createDisciplina = async (nombre, descripcion) => {
    try {
        const query = `
            INSERT INTO disciplina (nombre, descripcion)
            VALUES ($1, $2)
            RETURNING id_disciplina, nombre, descripcion`;
        const result = await pool.query(query, [nombre, descripcion]);
        return result.rows[0];
    } catch (error) {
        console.error('Error en disciplinaRepository.createDisciplina:', error.message);
        throw error;
    }
};

module.exports = { findAll, findById, createDisciplina, deleteDisciplina };