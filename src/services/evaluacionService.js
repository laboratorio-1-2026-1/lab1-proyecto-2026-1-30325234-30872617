const evaluacionRepository = require('../repositories/evaluacionRepository');

const getEvaluacionesByCliente = async (id_cliente) => {
    return await evaluacionRepository.findByClienteId(id_cliente);
};

const createEvaluacion = async (id_cliente, data) => {
    if (!id_cliente) {
        throw { status: 400, message: 'El ID del cliente es requerido' };
    }

    const evaluacion = await evaluacionRepository.create(id_cliente, data);
    return evaluacion;
};

module.exports = { getEvaluacionesByCliente, createEvaluacion };
