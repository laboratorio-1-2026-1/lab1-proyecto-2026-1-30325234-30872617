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
 *             required: ['id_client', 'id_sesion']
 *             properties:
 *               id_client:
 *                 type: integer
 *               id_sesion:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Reserva creada
 */
router.post('/', verifyToken, authorize([1,3]), reservaController.createReserva);


/**
 * @swagger
 * /reservas/{id_reserva}:
 *   delete:
 *     summary: Eliminar una reserva (Solo Admin)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_reserva
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reserva eliminada
 */
router.delete('/:id_reserva', verifyToken, authorize([1]), reservaController.deleteReserva);

/**
 * @swagger
 * /reservas/{id_reserva}:
 *   patch:
 *     summary: Modificar el estado de una reserva (Cliente dueño o Admin)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_reserva
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['estado']
 *             properties:
 *               estado:
 *                 type: string
 *                 description: "Activa o Inactiva"
 *     responses:
 *       200:
 *         description: Reserva actualizada
 */
router.patch('/:id_reserva', verifyToken, authorize([1,3]), reservaController.updateReserva);

module.exports = router;
