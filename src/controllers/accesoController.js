const accesoService = require('../services/accesoService');

const registrarEntrada = async (req, res) => {
    try {
        const { documentoIdentidad } = req.body;
        const acceso = await accesoService.registrarEntrada(documentoIdentidad);
        return res.status(200).json(acceso);
    } catch (error) {
        return res.status(error.status || 500).json({
            error: error.error || 'Internal Server Error',
            codigoInterno: error.codigoInterno || 'ERR_INTERNO',
            mensaje: error.message || 'Error al procesar la solicitud',
            timestamp: new Date().toISOString()
        });
    }
};

module.exports = { registrarEntrada };
