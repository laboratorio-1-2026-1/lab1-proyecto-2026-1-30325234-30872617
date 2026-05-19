const clienteRepository = require('../repositories/clienteRepository');
const membresiaRepository = require('../repositories/membresiaRepository');
const sesionRepository = require('../repositories/sesionRepository');

const createReserva = async (req, res) => {
    try {
        const { id_sesion, fecha, id_client } = req.body;
        let clientId = null;

        if (req.user.role === 3) {
            const cliente = await clienteRepository.findClientByUserId(req.user.id);
            if (!cliente) {
                return res.status(404).json({
                    error: 'Not Found',
                    codigoInterno: 'ERR_CLIENTE_NO_ENCONTRADO',
                    mensaje: 'No se encontró el cliente asociado al token',
                    timestamp: new Date().toISOString()
                });
            }
            clientId = cliente.id_client;
        } else {
            if (!id_client) {
                return res.status(400).json({
                    error: 'Bad Request',
                    mensaje: 'Se requiere id_client para crear la reserva',
                    timestamp: new Date().toISOString()
                });
            }
            const cliente = await clienteRepository.findClientById(id_client);
            if (!cliente) {
                return res.status(404).json({
                    error: 'Not Found',
                    codigoInterno: 'ERR_CLIENTE_NO_ENCONTRADO',
                    mensaje: 'No se encontró el cliente especificado',
                    timestamp: new Date().toISOString()
                });
            }
            clientId = cliente.id_client;
        }

        if (!id_sesion) {
            return res.status(400).json({
                error: 'Bad Request',
                mensaje: 'Se requiere id_sesion para la reserva',
                timestamp: new Date().toISOString()
            });
        }

        const sesion = await sesionRepository.findSesionById(id_sesion);
        if (!sesion) {
            return res.status(404).json({
                error: 'Not Found',
                codigoInterno: 'ERR_SESION_NO_ENCONTRADA',
                mensaje: 'La sesión especificada no existe',
                timestamp: new Date().toISOString()
            });
        }

        const reservaFecha = fecha || new Date().toISOString().split('T')[0];
        const reservaExistente = await sesionRepository.findReservaByClientSessionDate(clientId, id_sesion, reservaFecha);
        if (reservaExistente) {
            return res.status(409).json({
                error: 'Conflict',
                codigoInterno: 'ERR_RESERVA_DUPLICADA',
                mensaje: 'Ya existe una reserva para este cliente y sesión en la misma fecha',
                timestamp: new Date().toISOString()
            });
        }

        const solapamiento = await sesionRepository.findClientReservationOverlap(clientId, reservaFecha, sesion.hora_inicio, sesion.hora_fin);
        if (solapamiento) {
            return res.status(409).json({
                error: 'Conflict',
                codigoInterno: 'ERR_SOLAPAMIENTO_RESERVA',
                mensaje: 'El cliente tiene otra reserva solapada para la misma fecha',
                timestamp: new Date().toISOString()
            });
        }

        const totalReservas = await sesionRepository.countReservasBySessionDate(id_sesion, reservaFecha);
        if (totalReservas >= sesion.cupos) {
            return res.status(409).json({
                error: 'Conflict',
                codigoInterno: 'ERR_CUPOS_COMPLETOS',
                mensaje: 'No hay cupos disponibles para esta sesión',
                timestamp: new Date().toISOString()
            });
        }

        const membresia = await membresiaRepository.findActiveMembershipWithPayment(clientId);
        if (!membresia || Number(membresia.pagos_count) <= 0) {
            return res.status(409).json({
                error: 'Conflict',
                codigoInterno: 'ERR_MEMBRESIA_INACTIVA',
                mensaje: 'El cliente no tiene membresía activa con pagos vigentes',
                timestamp: new Date().toISOString()
            });
        }

        const reservaCreada = await sesionRepository.createReserva(clientId, id_sesion, reservaFecha);
        return res.status(201).json(reservaCreada);
    } catch (error) {
        console.error('Error en reservaController.createReserva:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al crear la reserva',
            timestamp: new Date().toISOString()
        });
    }
};

module.exports = { createReserva };