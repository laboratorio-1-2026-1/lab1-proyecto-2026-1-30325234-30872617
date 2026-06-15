const pool = require('../config/db');
const mantenimientoRepository = require('../repositories/mantenimientoRepository');
const { getPaginationParams, paginate } = require('../utils/pagination');

const getMaquinas = async (req, res) => {
    try {
        const { page, limit } = getPaginationParams(req.query);
        const result = await pool.query('SELECT * FROM maquinas ORDER BY id_maquina');
        res.status(200).json(paginate(result.rows, page, limit));
    } catch (error) {
        console.error('Error en maquinaController.getMaquinas:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al obtener el listado de máquinas',
            timestamp: new Date().toISOString()
        });
    }
};

const createTicket = async (req, res) => {
    try {
        const { id_maquina } = req.params;
        const { descripcion } = req.body;

        if (!descripcion) {
            return res.status(400).json({
                error: 'Bad Request',
                mensaje: 'Se requiere descripción para el ticket de mantenimiento',
                timestamp: new Date().toISOString()
            });
        }

        const maquina = await mantenimientoRepository.findMaquinaById(id_maquina);
        if (!maquina) {
            return res.status(404).json({
                error: 'Not Found',
                codigoInterno: 'ERR_MAQUINA_NO_ENCONTRADA',
                mensaje: 'No se encontró la máquina especificada',
                timestamp: new Date().toISOString()
            });
        }

        const ticket = await mantenimientoRepository.createTicket(id_maquina, descripcion);
        await mantenimientoRepository.updateMachineEstado(id_maquina, 'En Mantenimiento');

        return res.status(201).json(ticket);
    } catch (error) {
        console.error('Error en maquinaController.createTicket:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al crear el ticket de mantenimiento',
            timestamp: new Date().toISOString()
        });
    }
};

const getTicketsByMaquina = async (req, res) => {
    try {
        const { id_maquina } = req.params;
        const { page, limit } = getPaginationParams(req.query);
        const maquina = await mantenimientoRepository.findMaquinaById(id_maquina);
        if (!maquina) {
            return res.status(404).json({
                error: 'Not Found',
                codigoInterno: 'ERR_MAQUINA_NO_ENCONTRADA',
                mensaje: 'No se encontró la máquina especificada',
                timestamp: new Date().toISOString()
            });
        }

        const tickets = await mantenimientoRepository.getTicketsByMaquina(id_maquina);
        return res.status(200).json(paginate(tickets, page, limit));
    } catch (error) {
        console.error('Error en maquinaController.getTicketsByMaquina:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al obtener el historial de tickets para la máquina',
            timestamp: new Date().toISOString()
        });
    }
};

const updateEstado = async (req, res) => {
    try {
        const { id_maquina } = req.params;
        const { estado } = req.body;
        const estadosValidos = ['Operativa', 'En Mantenimiento', 'Fuera de Servicio'];

        if (!estado || !estadosValidos.includes(estado)) {
            return res.status(400).json({
                error: 'Bad Request',
                mensaje: 'El estado de la máquina debe ser Operativa, En Mantenimiento o Fuera de Servicio',
                timestamp: new Date().toISOString()
            });
        }

        const maquina = await mantenimientoRepository.findMaquinaById(id_maquina);
        if (!maquina) {
            return res.status(404).json({
                error: 'Not Found',
                codigoInterno: 'ERR_MAQUINA_NO_ENCONTRADA',
                mensaje: 'No se encontró la máquina especificada',
                timestamp: new Date().toISOString()
            });
        }

        const actualizada = await mantenimientoRepository.updateMachineEstado(id_maquina, estado);
        return res.status(200).json(actualizada);
    } catch (error) {
        console.error('Error en maquinaController.updateEstado:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al actualizar el estado de la máquina',
            timestamp: new Date().toISOString()
        });
    }
};

module.exports = { getMaquinas, createTicket, getTicketsByMaquina, updateEstado };