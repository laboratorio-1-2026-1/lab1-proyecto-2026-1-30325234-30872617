const accesoRepository = require('../repositories/accesoRepository');
const clienteRepository = require('../repositories/clienteRepository');

const registrarEntrada = async (documentoIdentidad) => {
    if (!documentoIdentidad) {
        throw { status: 400, message: 'Documento de identidad requerido' };
    }

    const cliente = await clienteRepository.findByDocumento(documentoIdentidad);
    if (!cliente) {
        throw { status: 404, message: 'Cliente no encontrado' };
    }

    const membresia = await accesoRepository.verificarMembresia(cliente.ID_cliente);
    if (!membresia || !membresia.activa) {
        throw {
            status: 409,
            error: 'Conflict',
            codigoInterno: 'ERR_ACCESO_MEMBRESIA_VENCIDA',
            message: 'Estimado usuario, usted se encuentra con un estado de membresía vencida'
        };
    }

    const acceso = await accesoRepository.registrarEntrada(cliente.ID_cliente);
    return acceso;
};

module.exports = { registrarEntrada };
