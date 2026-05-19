const reservaRepository = require('../repositories/reservaRepository');

const createReserva = async (id_cliente, id_sesion) => {
    if (!id_cliente || !id_sesion) {
        throw { status: 400, message: 'ID del cliente y sesión son requeridos' };
    }

    const validacion = await reservaRepository.validarReserva(id_cliente, id_sesion);

    if (validacion.solapamiento) {
        throw {
            status: 409,
            error: 'Conflict',
            codigoInterno: 'ERR_RESERVA_SOLAPAMIENTO',
            message: 'Ya posee una clase reservada a la misma hora'
        };
    }

    if (validacion.sinCupos) {
        throw {
            status: 409,
            error: 'Conflict',
            codigoInterno: 'ERR_RESERVA_CAPACIDAD_MAXIMA',
            message: 'No se encuentran cupos disponibles para esta sesión'
        };
    }

    const reserva = await reservaRepository.create(id_cliente, id_sesion);
    return reserva;
};

const getReservasBySesion = async (id_sesion) => {
    return await reservaRepository.findBySesionId(id_sesion);
};

module.exports = { createReserva, getReservasBySesion };
