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
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Página (1-based)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Elementos por página
 *     responses:
 *       200:
 *         description: Lista de máquinas obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paginated'
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['descripcion']
 *             properties:
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ticket creado
 */
router.post('/:id_maquina/tickets', verifyToken, authorize([1]), maquinaController.createTicket);

/**
 * @swagger
 * /maquinas/{id_maquina}/tickets:
 *   get:
 *     summary: Obtener el historial de tickets de mantenimiento de una máquina
 *     tags: [Máquinas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_maquina
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Página (1-based)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Elementos por página
 *     responses:
 *       200:
 *         description: Tickets de mantenimiento de la máquina
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paginated'
 *       404:
 *         description: Máquina no encontrada
 */
router.get('/:id_maquina/tickets', verifyToken, authorize([1]), maquinaController.getTicketsByMaquina);

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