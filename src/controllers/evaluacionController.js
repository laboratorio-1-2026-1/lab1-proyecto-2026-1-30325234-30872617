const evaluacionService = require('../services/evaluacionService');

const getEvaluaciones = async (req, res) => {
    try {
        const { id_cliente } = req.params;
        const evaluaciones = await evaluacionService.getEvaluacionesByCliente(id_cliente);
        return res.status(200).json(evaluaciones);
    } catch (error) {
        return res.status(error.status || 500).json({
            error: error.status === 400 ? 'Bad Request' : 'Internal Server Error',
            mensaje: error.message || 'Error al procesar la solicitud',
            timestamp: new Date().toISOString()
        });
    }
};

const createEvaluacion = async (req, res) => {
    try {
        const { id_cliente } = req.params;
        const evaluacion = await evaluacionService.createEvaluacion(id_cliente, req.body);
        return res.status(201).json(evaluacion);
    } catch (error) {
        return res.status(error.status || 500).json({
            error: error.status === 400 ? 'Bad Request' : 'Internal Server Error',
            mensaje: error.message || 'Error al procesar la solicitud',
            timestamp: new Date().toISOString()
        });
    }
};

module.exports = { getEvaluaciones, createEvaluacion };
