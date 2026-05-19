const membresiRepository = require('../repositories/membresiRepository');

const getMembresiasbyCliente = async (id_cliente) => {
    return await membresiRepository.findByClienteId(id_cliente);
};

const createMembresia = async (id_cliente, data) => {
    if (!id_cliente) {
        throw { status: 400, message: 'El ID del cliente es requerido' };
    }

    const membresia = await membresiRepository.create(id_cliente, data);
    return membresia;
};

module.exports = { getMembresiasbyCliente, createMembresia };
