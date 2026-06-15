const mantenimientoRepository = require('../repositories/mantenimientoRepository');
const { getPaginationParams, paginate } = require('../utils/pagination');

const getTickets = async (req, res) => {
    try {
        const { page, limit } = getPaginationParams(req.query);
        const tickets = await mantenimientoRepository.listTicketsHistory();
        return res.status(200).json(paginate(tickets, page, limit));
    } catch (error) {
        console.error('Error en ticketController.getTickets:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al obtener el historial de tickets',
            timestamp: new Date().toISOString()
        });
    }
};

module.exports = { getTickets };