const pagoRepository = require('../repositories/pagoRepository');

const createPago = async (id_cliente, id_suscripcion, monto) => {
    if (!id_cliente || !id_suscripcion || !monto) {
        throw { status: 400, message: 'Cliente, suscripción y monto son requeridos' };
    }

    const pago = await pagoRepository.create(id_cliente, id_suscripcion, monto);
    return pago;
};

const getPagoById = async (id_pago) => {
    const pago = await pagoRepository.findById(id_pago);
    if (!pago) {
        throw { status: 404, message: 'Pago no encontrado' };
    }
    return pago;
};

module.exports = { createPago, getPagoById };
