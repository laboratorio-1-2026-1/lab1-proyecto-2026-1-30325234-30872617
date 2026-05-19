const express = require('express');
const router = express.Router();
const maquinaController = require('../controllers/maquinaController');
const { verifyToken, authorize } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /maquinas:
 *   get:
 *     summary: Obtener el listado de máquinas
 *     tags: [Máquinas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de máquinas obtenida con éxito
 *       403:
 *         description: Permiso insuficiente
 */
router.get('/', verifyToken, authorize([1]), maquinaController.getMaquinas);
/**
 * @swagger
 * /maquinas/{id_maquina}/tickets:
 *   post:
 *     summary: Crear ticket de mantenimiento para una máquina
 *     tags: [Máquinas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_maquina
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Ticket creado
 */
router.post('/:id_maquina/tickets', verifyToken, authorize([1]), maquinaController.createTicket);
/**
 * @swagger
 * /maquinas/{id_maquina}/estado:
 *   patch:
 *     summary: Actualizar estado de una máquina
 *     tags: [Máquinas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_maquina
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estado actualizado
 */
router.patch('/:id_maquina/estado', verifyToken, authorize([1]), maquinaController.updateEstado);

module.exports = router;