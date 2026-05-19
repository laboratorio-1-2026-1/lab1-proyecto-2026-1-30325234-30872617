const mantenimientoRepository = require('../repositories/mantenimientoRepository');

const getTickets = async (req, res) => {
    try {
        const tickets = await mantenimientoRepository.listTicketsHistory();
        return res.status(200).json(tickets);
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