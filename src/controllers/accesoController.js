const accesoRepository = require('../repositories/accesoRepository');

const registrarEntrada = async (req, res) => {
    try {
        const { cedula } = req.body;

        if (!cedula) {
            return res.status(400).json({
                error: 'Bad Request',
                mensaje: 'Se requiere el número de cédula para registrar el acceso',
                timestamp: new Date().toISOString()
            });
        }

        const cliente = await accesoRepository.findClientByIdClient(cedula);

        if (!cliente) {
            return res.status(404).json({
                error: 'Not Found',
                codigoInterno: 'ERR_CLIENTE_NO_ENCONTRADO',
                mensaje: 'No se encontró un cliente asociado a la cédula proporcionada',
                timestamp: new Date().toISOString()
            });
        }

        const membresia = await accesoRepository.findActiveMembershipWithPayment(cliente.id_client);

        if (!membresia) {
            await accesoRepository.insertControlBitacora(cliente.id_client, false, 'Membresía vencida o inactiva');
            return res.status(409).json({
                error: 'Conflict',
                codigoInterno: 'ERR_MEMBRESIA_VENCIDA',
                mensaje: 'El cliente no tiene una membresía activa',
                timestamp: new Date().toISOString()
            });
        }

        if (Number(membresia.pagos_count) <= 0) {
            await accesoRepository.insertControlBitacora(cliente.id_client, false, 'Pagos faltantes');
            return res.status(409).json({
                error: 'Conflict',
                codigoInterno: 'ERR_PAGO_INSUFICIENTE',
                mensaje: 'La membresía del cliente no cuenta con pagos vigentes',
                timestamp: new Date().toISOString()
            });
        }

        await accesoRepository.insertControlBitacora(cliente.id_client, true, null);

        return res.status(200).json({
            message: 'Acceso autorizado',
            cliente: {
                id_client: cliente.id_client,
                nombre: cliente.nombre,
                apellido: cliente.apellido
            },
            fecha: new Date().toISOString().split('T')[0]
        });
    } catch (error) {
        console.error('Error en accesoController.registrarEntrada:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al registrar el acceso',
            timestamp: new Date().toISOString()
        });
    }
};

module.exports = { registrarEntrada };