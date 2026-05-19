const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { verifyToken, authorize } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Obtener historial de tickets de mantenimiento
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historial de tickets
 */
router.get('/', verifyToken, authorize([1]), ticketController.getTickets);

module.exports = router;
