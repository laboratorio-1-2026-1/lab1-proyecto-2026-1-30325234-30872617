const pagoService = require('../services/pagoService');

const createPago = async (req, res) => {
    try {
        const { id_cliente, id_suscripcion, monto } = req.body;
        const pago = await pagoService.createPago(id_cliente, id_suscripcion, monto);
        return res.status(201).json(pago);
    } catch (error) {
        return res.status(error.status || 500).json({
            error: error.error || 'Internal Server Error',
            codigoInterno: error.codigoInterno || 'ERR_INTERNO',
            mensaje: error.message || 'Error al procesar la solicitud',
            timestamp: new Date().toISOString()
        });
    }
};

const getPagoById = async (req, res) => {
    try {
        const { id_pago } = req.params;
        const pago = await pagoService.getPagoById(id_pago);
        return res.status(200).json(pago);
    } catch (error) {
        return res.status(error.status || 500).json({
            error: error.status === 404 ? 'Not Found' : 'Internal Server Error',
            mensaje: error.message || 'Error al procesar la solicitud',
            timestamp: new Date().toISOString()
        });
    }
};

module.exports = { createPago, getPagoById };
