const pool = require('../config/db');

const findByEmail = async (email) => {
    try {
        // Usamos "AS id_user" para que coincida con tu objeto simulado exactamente [1, 4]
        const query = 'SELECT ID_user, password_hash, email, id_rol, activo FROM usuario WHERE email = $1';
        const result = await pool.query(query, [email]);
        
        // Si encontró al usuario, devolvemos SOLO el primer objeto (índice 0)
        // Esto hace que funcione IGUAL que tu usuarioSimulado
        if (result.rows.length > 0) {
            return result.rows[0]; // Devolvemos solo el primer usuario encontrado
        }
        
        return null; // Si no hay usuario, devolvemos null
    } catch (error) {
        console.error('Error en userRepository:', error.message);
        throw error;
    }
};

const createUser = async (email, password_hash, id_rol) => {
    try {
        const query = `
            INSERT INTO usuario (email, password_hash, id_rol, activo)
            VALUES ($1, $2, $3, TRUE)
            RETURNING id_user, email, id_rol`;
        const result = await pool.query(query, [email, password_hash, id_rol]);
        return result.rows[0];
    } catch (error) {
        console.error('Error en userRepository.createUser:', error.message);
        throw error;
    }
};

module.exports = { findByEmail, createUser };