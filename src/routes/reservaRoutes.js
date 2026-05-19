const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const { verifyToken, authorize } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Crear reserva (Cliente o Admin)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Reserva creada
 */
router.post('/', verifyToken, authorize([1,3]), reservaController.createReserva);

module.exports = router;
