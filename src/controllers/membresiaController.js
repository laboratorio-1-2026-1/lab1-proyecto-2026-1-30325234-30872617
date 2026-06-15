const membresiaRepository = require('../repositories/membresiaRepository');
const clienteRepository = require('../repositories/clienteRepository');
const { getPaginationParams, paginate } = require('../utils/pagination');

const getSuscripciones = async (req, res) => {
    try {
        const { page, limit } = getPaginationParams(req.query);
        const suscripciones = await membresiaRepository.listSuscripciones();
        return res.status(200).json(paginate(suscripciones, page, limit));
    } catch (error) {
        console.error('Error en membresiaController.getSuscripciones:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al obtener las suscripciones',
            timestamp: new Date().toISOString()
        });
    }
};

const createSuscripcion = async (req, res) => {
    try {
        const { nombre, costo, duracion } = req.body;

        if (!nombre || costo == null || duracion == null) {
            return res.status(400).json({
                error: 'Bad Request',
                mensaje: 'Se requieren nombre, costo y duracion para crear la suscripción',
                timestamp: new Date().toISOString()
            });
        }

        if (costo < 0 || duracion <= 0) {
            return res.status(400).json({
                error: 'Bad Request',
                mensaje: 'El costo debe ser mayor o igual a cero y la duración debe ser mayor a cero',
                timestamp: new Date().toISOString()
            });
        }

        const suscripcion = await membresiaRepository.createSuscripcion(nombre, costo, duracion);
        return res.status(201).json(suscripcion);
    } catch (error) {
        console.error('Error en membresiaController.createSuscripcion:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al crear la suscripción',
            timestamp: new Date().toISOString()
        });
    }
};

const createPago = async (req, res) => {
    try {
        const { id_membresia, monto, metodo_pago } = req.body;

        if (!id_membresia || monto == null || !metodo_pago) {
            return res.status(400).json({
                error: 'Bad Request',
                mensaje: 'Faltan datos requeridos para registrar el pago',
                timestamp: new Date().toISOString()
            });
        }

        if (monto <= 0) {
            return res.status(400).json({
                error: 'Bad Request',
                mensaje: 'El monto del pago debe ser mayor a cero',
                timestamp: new Date().toISOString()
            });
        }

        const membresia = await membresiaRepository.findMembresiaById(id_membresia);
        if (!membresia) {
            return res.status(404).json({
                error: 'Not Found',
                codigoInterno: 'ERR_MEMBRESIA_NO_ENCONTRADA',
                mensaje: 'No se encontró la membresía especificada',
                timestamp: new Date().toISOString()
            });
        }

        const pago = await membresiaRepository.createPago(id_membresia, monto, metodo_pago);
        return res.status(201).json(pago);
    } catch (error) {
        console.error('Error en membresiaController.createPago:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al registrar el pago',
            timestamp: new Date().toISOString()
        });
    }
};

const getPagoById = async (req, res) => {
    try {
        const { id_pago } = req.params;
        const pago = await membresiaRepository.findPagoById(id_pago);
        if (!pago) {
            return res.status(404).json({
                error: 'Not Found',
                codigoInterno: 'ERR_PAGO_NO_ENCONTRADO',
                mensaje: 'No se encontró el pago especificado',
                timestamp: new Date().toISOString()
            });
        }
        return res.status(200).json(pago);
    } catch (error) {
        console.error('Error en membresiaController.getPagoById:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al obtener el pago',
            timestamp: new Date().toISOString()
        });
    }
};

const getMembresiasByCliente = async (req, res) => {
    try {
        const { id_cliente } = req.params;
        const cliente = await clienteRepository.findClientById(id_cliente);
        if (!cliente) {
            return res.status(404).json({
                error: 'Not Found',
                codigoInterno: 'ERR_CLIENTE_NO_ENCONTRADO',
                mensaje: 'No se encontró el cliente especificado',
                timestamp: new Date().toISOString()
            });
        }

        if (req.user.role === 3 && req.user.id !== cliente.id_user) {
            return res.status(403).json({
                error: 'Forbidden',
                codigoInterno: 'ERR_PERMISO_INSUFICIENTE',
                mensaje: 'No puedes consultar las membresías de otro cliente',
                timestamp: new Date().toISOString()
            });
        }

        const membresias = await membresiaRepository.listMembresiasByClient(id_cliente);
        return res.status(200).json(membresias);
    } catch (error) {
        console.error('Error en membresiaController.getMembresiasByCliente:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al obtener las membresías del cliente',
            timestamp: new Date().toISOString()
        });
    }
};

const deactivateExpired = async (req, res) => {
    try {
        const updated = await membresiaRepository.deactivateExpiredMemberships();
        return res.status(200).json({
            message: 'Membresías expiradas inactivadas',
            count: updated.length,
            updated
        });
    } catch (error) {
        console.error('Error en membresiaController.deactivateExpired:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al inactivar membresías vencidas',
            timestamp: new Date().toISOString()
        });
    }
};

const listClientsNoActive = async (req, res) => {
    try {
        const { page, limit } = getPaginationParams(req.query);
        const clients = await membresiaRepository.listClientsWithoutActiveMembership();
        return res.status(200).json(paginate(clients, page, limit));
    } catch (error) {
        console.error('Error en membresiaController.listClientsNoActive:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al listar clientes sin membresía activa',
            timestamp: new Date().toISOString()
        });
    }
};

module.exports = {
    getSuscripciones,
    createSuscripcion,
    createPago,
    getPagoById,
    getMembresiasByCliente,
    deactivateExpired,
    listClientsNoActive
};