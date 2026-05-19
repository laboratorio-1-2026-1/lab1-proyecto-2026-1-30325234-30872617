const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const login = async (email, password) => {
    // 1. Buscamos al usuario en la base de datos a través del repositorio
    // NOTA: Asegúrate de que solo haya UN 'const user' aquí.
    const user = await userRepository.findByEmail(email);

    // 2. Si el repositorio no devuelve nada, el usuario no existe
    if (!user) {
        throw { 
            status: 401, 
            mensaje: "Credenciales inválidas o usuario inactivo" 
        };
    }

    // 3. Verificamos la contraseña usando bcrypt (Requerimiento 3.2 de seguridad)
    // Usamos 'user.password_hash' porque es el nombre que viene de la DB [4, 5]
    const isMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!isMatch) {
        throw { 
            status: 401, 
            mensaje: "Credenciales inválidas o usuario inactivo" 
        };
    }

    // 4. Generación del Token JWT para el Sistema de Identidad [6, 7]
    const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';
    const token = jwt.sign(
        { id: user.id_user, email: user.email, role: user.id_rol },
        JWT_SECRET,
        { expiresIn: '8h' }
    );

    // Retornamos los datos necesarios para el controlador
    return {
        accessToken: token,
        user: {
            id: user.id_user,
            email: user.email,
            role: user.id_rol
        }
    };
};

module.exports = { login };