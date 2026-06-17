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

const createCategoriaMaquina = async (req, res) => {
    try {
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({
                error: 'Bad Request',
                mensaje: 'Se requiere nombre para crear la categoría de máquina',
                timestamp: new Date().toISOString()
            });
        }

        const categoria = await mantenimientoRepository.createCategoriaMaquina(nombre);
        return res.status(201).json(categoria);
    } catch (error) {
        console.error('Error en maquinaController.createCategoriaMaquina:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al crear la categoría de máquina',
            timestamp: new Date().toISOString()
        });
    }
};

const createMaquina = async (req, res) => {
    try {
        const { id_categoria, nombre, descripcion } = req.body;

        if (!id_categoria || !nombre) {
            return res.status(400).json({
                error: 'Bad Request',
                mensaje: 'Se requieren id_categoria y nombre para crear la máquina',
                timestamp: new Date().toISOString()
            });
        }

        const categoria = await mantenimientoRepository.findCategoriaById(id_categoria);
        if (!categoria) {
            return res.status(404).json({
                error: 'Not Found',
                codigoInterno: 'ERR_CATEGORIA_NO_ENCONTRADA',
                mensaje: 'No se encontró la categoría de máquina especificada',
                timestamp: new Date().toISOString()
            });
        }

        const maquina = await mantenimientoRepository.createMaquina({
            id_categoria,
            nombre,
            descripcion: descripcion || null
        });

        return res.status(201).json(maquina);
    } catch (error) {
        console.error('Error en maquinaController.createMaquina:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al crear la máquina',
            timestamp: new Date().toISOString()
        });
    }
};

const updateMaquina = async (req, res) => {
    try {
        const { id_maquina } = req.params;
        const { id_categoria, nombre, descripcion } = req.body;

        if (!id_categoria && !nombre && descripcion == null) {
            return res.status(400).json({
                error: 'Bad Request',
                mensaje: 'Se debe enviar al menos un campo para actualizar',
                timestamp: new Date().toISOString()
            });
        }

        const maquinaExistente = await mantenimientoRepository.findMaquinaById(id_maquina);
        if (!maquinaExistente) {
            return res.status(404).json({
                error: 'Not Found',
                codigoInterno: 'ERR_MAQUINA_NO_ENCONTRADA',
                mensaje: 'No se encontró la máquina especificada',
                timestamp: new Date().toISOString()
            });
        }

        if (id_categoria) {
            const categoria = await mantenimientoRepository.findCategoriaById(id_categoria);
            if (!categoria) {
                return res.status(404).json({
                    error: 'Not Found',
                    codigoInterno: 'ERR_CATEGORIA_NO_ENCONTRADA',
                    mensaje: 'No se encontró la categoría de máquina especificada',
                    timestamp: new Date().toISOString()
                });
            }
        }

        const maquinaActualizada = await mantenimientoRepository.updateMaquina(id_maquina, {
            id_categoria,
            nombre,
            descripcion
        });

        return res.status(200).json(maquinaActualizada);
    } catch (error) {
        console.error('Error en maquinaController.updateMaquina:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al actualizar la máquina',
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

module.exports = { getMaquinas, createCategoriaMaquina, createMaquina, createTicket, getTicketsByMaquina, updateMaquina };