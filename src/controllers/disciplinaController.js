const disciplinaRepository = require('../repositories/disciplinaRepository');
const { getPaginationParams, paginate } = require('../utils/pagination');

const getDisciplinas = async (req, res) => {
    try {
        const { page, limit } = getPaginationParams(req.query);
        const disciplinas = await disciplinaRepository.findAll();
        // Respondemos con 200 OK según el estándar [5]
        res.status(200).json(paginate(disciplinas, page, limit));
    } catch (error) {
        res.status(500).json({ 
            error: "Internal Server Error", 
            mensaje: "Error al obtener el catálogo de disciplinas",
            timestamp: new Date().toISOString()
        });
    }
};

const createDisciplina = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre) {
            return res.status(400).json({
                error: 'Bad Request',
                mensaje: 'Se requiere nombre para crear la disciplina',
                timestamp: new Date().toISOString()
            });
        }

        const disciplina = await disciplinaRepository.createDisciplina(nombre, descripcion || null);
        return res.status(201).json(disciplina);
    } catch (error) {
        console.error('Error en disciplinaController.createDisciplina:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al crear la disciplina',
            timestamp: new Date().toISOString()
        });
    }
};

const deleteDisciplina = async (req, res) => {
    try {
        const { id_disciplina } = req.params;

        const disciplina = await disciplinaRepository.findById(id_disciplina);
        if (!disciplina) {
            return res.status(404).json({
                error: 'Not Found',
                codigoInterno: 'ERR_DISCIPLINA_NO_ENCONTRADA',
                mensaje: 'No se encontró la disciplina especificada',
                timestamp: new Date().toISOString()
            });
        }

        await disciplinaRepository.deleteDisciplina(id_disciplina);
        return res.status(200).json({
            message: 'Disciplina eliminada exitosamente',
            id_disciplina: parseInt(id_disciplina),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            error: "Internal Server Error", 
            mensaje: "Error al eliminar la disciplina",
            timestamp: new Date().toISOString()
        });
    }
};

module.exports = { getDisciplinas, createDisciplina, deleteDisciplina };