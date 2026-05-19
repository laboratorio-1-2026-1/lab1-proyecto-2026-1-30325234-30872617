const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer <TOKEN>

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized', mensaje: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized', mensaje: 'Token inválido o expirado' });
    }
};

const authorize = (rolesPermitidos = []) => {
    return (req, res, next) => {
        // Validación estricta según el Requerimiento 5 [1]
        if (!rolesPermitidos.includes(req.user.role)) {
            return res.status(403).json({
                error: "Forbidden",
                codigoInterno: "ERR_PERMISO_INSUFICIENTE",
                mensaje: "No tienes permisos para realizar esta acción con tu rol actual",
                timestamp: new Date().toISOString()
            });
        }
        next();
    };
};

module.exports = { verifyToken, authorize };

