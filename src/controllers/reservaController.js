const reservaService = require('../services/reservaService');

const createReserva = async (req, res) => {
    try {
        const { id_cliente, id_sesion } = req.body;
        const reserva = await reservaService.createReserva(id_cliente, id_sesion);
        return res.status(201).json(reserva);
    } catch (error) {
        return res.status(error.status || 500).json({
            error: error.error || 'Internal Server Error',
            codigoInterno: error.codigoInterno || 'ERR_INTERNO',
            mensaje: error.message || 'Error al procesar la solicitud',
            timestamp: new Date().toISOString()
        });
    }
};

const getReservasBySesion = async (req, res) => {
    try {
        const { id_sesion } = req.params;
        const reservas = await reservaService.getReservasBySesion(id_sesion);
        return res.status(200).json(reservas);
    } catch (error) {
        return res.status(error.status || 500).json({
            error: error.status === 400 ? 'Bad Request' : 'Internal Server Error',
            mensaje: error.message || 'Error al procesar la solicitud',
            timestamp: new Date().toISOString()
        });
    }
};

const registrarReservaManual = async (req, res) => {
    try {
        const { id_sesion } = req.params;
        const { id_cliente } = req.body;
        const reserva = await reservaService.createReserva(id_cliente, id_sesion);
        return res.status(201).json(reserva);
    } catch (error) {
        return res.status(error.status || 500).json({
            error: error.error || 'Internal Server Error',
            codigoInterno: error.codigoInterno || 'ERR_INTERNO',
            mensaje: error.message || 'Error al procesar la solicitud',
            timestamp: new Date().toISOString()
        });
    }
};

module.exports = { createReserva, getReservasBySesion, registrarReservaManual };
