const clienteRepository = require('../repositories/clienteRepository');
const membresiaRepository = require('../repositories/membresiaRepository');

const getClientes = async (req, res) => {
    try {
        const clientes = await clienteRepository.listClientes();
        return res.status(200).json(clientes);
    } catch (error) {
        console.error('Error en clienteController.getClientes:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al obtener la lista de clientes',
            timestamp: new Date().toISOString()
        });
    }
};

const createEvaluacion = async (req, res) => {
    try {
        const { id_cliente } = req.params;
        const { estatura, porcentaje_grasa, observaciones } = req.body;

        if (estatura == null || porcentaje_grasa == null) {
            return res.status(400).json({
                error: 'Bad Request',
                mensaje: 'Se requieren estatura y porcentaje_grasa para registrar la evaluación',
                timestamp: new Date().toISOString()
            });
        }

        const cliente = await clienteRepository.findClientById(id_cliente);
        if (!cliente) {
            return res.status(404).json({
                error: 'Not Found',
                codigoInterno: 'ERR_CLIENTE_NO_ENCONTRADO',
                mensaje: 'No se encontró el cliente especificado',
                timestamp: new Date().toISOString()
            });
        }

        const entrenador = await clienteRepository.findEntrenadorByUserId(req.user.id);
        if (!entrenador) {
            return res.status(404).json({
                error: 'Not Found',
                codigoInterno: 'ERR_ENTRENADOR_NO_ENCONTRADO',
                mensaje: 'No se encontró el entrenador autenticado',
                timestamp: new Date().toISOString()
            });
        }

        const fecha = new Date().toISOString().split('T')[0];
        const evaluacion = await clienteRepository.createEvaluacion(
            id_cliente,
            entrenador.id_entrenador,
            estatura,
            porcentaje_grasa,
            observaciones || null,
            fecha
        );

        return res.status(201).json(evaluacion);
    } catch (error) {
        console.error('Error en clienteController.createEvaluacion:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al registrar la evaluación',
            timestamp: new Date().toISOString()
        });
    }
};

const getEvaluaciones = async (req, res) => {
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

        const evaluaciones = await clienteRepository.findEvaluacionesByClient(id_cliente);
        return res.status(200).json(evaluaciones);
    } catch (error) {
        console.error('Error en clienteController.getEvaluaciones:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al obtener las evaluaciones',
            timestamp: new Date().toISOString()
        });
    }
};

const getMembresias = async (req, res) => {
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
                mensaje: 'No puedes acceder a las membresías de otro cliente',
                timestamp: new Date().toISOString()
            });
        }

        const membresias = await membresiaRepository.listMembresiasByClient(id_cliente);
        return res.status(200).json(membresias);
    } catch (error) {
        console.error('Error en clienteController.getMembresias:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al obtener las membresías del cliente',
            timestamp: new Date().toISOString()
        });
    }
};

module.exports = {
    getClientes,
    createEvaluacion,
    getEvaluaciones,
    getMembresias
};