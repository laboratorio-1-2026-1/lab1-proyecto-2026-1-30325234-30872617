const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');

const login = async (email, password) => {
    // 1. Lógica de negocio: Buscar usuario en PostgreSQL (vía repositorio)
    const user = await userRepository.findByEmail(email);

    // 2. Validación de estado y existencia según el MER [2, 3]
    if (!user || !user.activo) {
        throw { status: 401, message: 'Credenciales inválidas o usuario inactivo' };
    }

    // 3. Requerimiento No Funcional: Comparación de hashes (Seguridad) [1]
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw { status: 401, message: 'Credenciales inválidas' };
    }

    // 4. Diseño Stateless: El token DEBE incluir el ID_rol para el RBAC [4, 5]
    const payload = {
        userId: user.id_user,
        roleId: user.id_rol // Permite identificar si es Admin, Entrenador, etc. [6, 7]
    };

    const token = jwt.sign(
        payload, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    return {
        token,
        user: { email: user.email, roleId: user.id_rol }
    };
};

module.exports = { login };