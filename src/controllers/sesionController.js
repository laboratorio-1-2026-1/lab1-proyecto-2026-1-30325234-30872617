const sesionRepository = require('../repositories/sesionRepository');
const clienteRepository = require('../repositories/clienteRepository');
const membresiaRepository = require('../repositories/membresiaRepository');
const { getPaginationParams, paginate } = require('../utils/pagination');

const createSesion = async (req, res) => {
    try {
        const { id_disciplina, id_entrenador, hora_inicio, hora_fin, cupos } = req.body;

        if (!id_disciplina || !id_entrenador || !hora_inicio || !hora_fin || cupos == null) {
            return res.status(400).json({
                error: 'Bad Request',
                mensaje: 'Faltan datos requeridos para crear la sesión',
                timestamp: new Date().toISOString()
            });
        }

        if (hora_inicio >= hora_fin) {
            return res.status(400).json({
                error: 'Bad Request',
                mensaje: 'La hora de inicio debe ser anterior a la hora de fin',
                timestamp: new Date().toISOString()
            });
        }

        if (cupos <= 0) {
            return res.status(400).json({
                error: 'Bad Request',
                mensaje: 'El número de cupos debe ser mayor a cero',
                timestamp: new Date().toISOString()
            });
        }

        const disciplina = await sesionRepository.findDisciplinaById(id_disciplina);
        if (!disciplina) {
            return res.status(404).json({
                error: 'Not Found',
                codigoInterno: 'ERR_DISCIPLINA_NO_ENCONTRADA',
                mensaje: 'La disciplina especificada no existe',
                timestamp: new Date().toISOString()
            });
        }

        const entrenador = await sesionRepository.findEntrenadorById(id_entrenador);
        if (!entrenador) {
            return res.status(404).json({
                error: 'Not Found',
                codigoInterno: 'ERR_ENTRENADOR_NO_ENCONTRADO',
                mensaje: 'El entrenador especificado no existe',
                timestamp: new Date().toISOString()
            });
        }

        const hasOverlap = await sesionRepository.findOverlappingSessionForEntrenador(id_entrenador, hora_inicio, hora_fin);
        if (hasOverlap) {
            return res.status(409).json({
                error: 'Conflict',
                codigoInterno: 'ERR_SOLAPAMIENTO_SESION',
                mensaje: 'El entrenador ya tiene una sesión en ese horario',
                timestamp: new Date().toISOString()
            });
        }

        const sesionCreada = await sesionRepository.createSesion(id_disciplina, id_entrenador, hora_inicio, hora_fin, cupos);
        return res.status(201).json(sesionCreada);
    } catch (error) {
        console.error('Error en sesionController.createSesion:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al crear la sesión',
            timestamp: new Date().toISOString()
        });
    }
};

const deleteSesion = async (req, res) => {
    try {
        const { id_sesion } = req.params;
        const sesion = await sesionRepository.findSesionById(id_sesion);

        if (!sesion) {
            return res.status(404).json({
                error: 'Not Found',
                codigoInterno: 'ERR_SESION_NO_ENCONTRADA',
                mensaje: 'No se encontró la sesión especificada',
                timestamp: new Date().toISOString()
            });
        }

        await sesionRepository.deleteSesion(id_sesion);
        return res.status(200).json({
            message: 'Sesión eliminada correctamente',
            id_sesion: Number(id_sesion)
        });
    } catch (error) {
        console.error('Error en sesionController.deleteSesion:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al eliminar la sesión',
            timestamp: new Date().toISOString()
        });
    }
};

const getSesiones = async (req, res) => {
    try {
        const { fecha, disciplina } = req.query;
        const { page, limit } = getPaginationParams(req.query);
        let sesiones;
        
        if (fecha || disciplina) {
            sesiones = await sesionRepository.listSesionesWithFilters(fecha, disciplina);
        } else {
            sesiones = await sesionRepository.listSesiones();
        }
        return res.status(200).json(paginate(sesiones, page, limit));
    } catch (error) {
        console.error('Error en sesionController.getSesiones:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al obtener las sesiones',
            timestamp: new Date().toISOString()
        });
    }
};

const getSesionesReservas = async (req, res) => {
    try {
        const { id_sesion } = req.params;
        const { page, limit } = getPaginationParams(req.query);
        const sesion = await sesionRepository.findSesionById(id_sesion);

        if (!sesion) {
            return res.status(404).json({
                error: 'Not Found',
                codigoInterno: 'ERR_SESION_NO_ENCONTRADA',
                mensaje: 'No se encontró la sesión especificada',
                timestamp: new Date().toISOString()
            });
        }

        const reservas = await sesionRepository.getSessionReservations(id_sesion);
        return res.status(200).json(paginate(reservas, page, limit));
    } catch (error) {
        console.error('Error en sesionController.getSesionesReservas:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al obtener las reservas de la sesión',
            timestamp: new Date().toISOString()
        });
    }
};

module.exports = {
    createSesion,
    getSesiones,
    getSesionesReservas,
    deleteSesion
};