const authService = require('../services/authService');

const login = async (req, res) => {
    try {
        // El controlador extrae los datos del 'body' de la petición
        const { email, password } = req.body;

        // Delega la lógica pesada al servicio
        const result = await authService.login(email, password);

        // Retorna éxito (200 OK) con la estructura JSON solicitada [10]
        return res.status(200).json({
            message: 'Login exitoso',
            ...result
        });
    } catch (error) {
        // Cumple con la "Estructura de Error Estricta" exigida [11]
        return res.status(error.status || 500).json({
            error: error.status === 401 ? "Unauthorized" : "Internal Server Error",
            mensaje: error.message || 'Error al procesar la solicitud',
            timestamp: new Date().toISOString()
        });
    }
};

module.exports = { login };