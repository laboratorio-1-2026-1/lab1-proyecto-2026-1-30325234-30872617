const membresiService = require('../services/membresiService');

const getMembresias = async (req, res) => {
    try {
        const { id_cliente } = req.params;
        const membresias = await membresiService.getMembresiasbyCliente(id_cliente);
        return res.status(200).json(membresias);
    } catch (error) {
        return res.status(error.status || 500).json({
            error: error.status === 400 ? 'Bad Request' : 'Internal Server Error',
            mensaje: error.message || 'Error al procesar la solicitud',
            timestamp: new Date().toISOString()
        });
    }
};

const createMembresia = async (req, res) => {
    try {
        const { id_cliente } = req.params;
        const membresia = await membresiService.createMembresia(id_cliente, req.body);
        return res.status(201).json(membresia);
    } catch (error) {
        return res.status(error.status || 500).json({
            error: error.status === 400 ? 'Bad Request' : 'Internal Server Error',
            mensaje: error.message || 'Error al procesar la solicitud',
            timestamp: new Date().toISOString()
        });
    }
};

module.exports = { getMembresias, createMembresia };
