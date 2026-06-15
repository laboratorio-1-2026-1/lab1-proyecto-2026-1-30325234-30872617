const express = require('express');
const router = express.Router();
const sesionController = require('../controllers/sesionController');
const { verifyToken, authorize } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /sesiones:
 *   post:
 *     summary: Crear una nueva sesión (Solo Admin)
 *     tags: [Sesiones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['id_disciplina', 'id_entrenador', 'hora_inicio', 'hora_fin', 'cupos']
 *             properties:
 *               id_disciplina:
 *                 type: integer
 *               id_entrenador:
 *                 type: integer
 *               hora_inicio:
 *                 type: string
 *               hora_fin:
 *                 type: string
 *               cupos:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Sesión creada
 */
router.post('/', verifyToken, authorize([1]), sesionController.createSesion);

/**
 * @swagger
 * /sesiones:
 *   get:
 *     summary: Listar sesiones (Admin y Entrenador)
 *     tags: [Sesiones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar sesiones por fecha (YYYY-MM-DD)
 *       - in: query
 *         name: disciplina
 *         schema:
 *           type: string
 *         description: Filtrar sesiones por nombre de disciplina
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
 *         description: Lista de sesiones
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paginated'
 */
router.get('/', verifyToken, authorize([1,2]), sesionController.getSesiones);

/**
 * @swagger
 * /sesiones/{id_sesion}/reservas:
 *   get:
 *     summary: Obtener reservas de una sesión (Admin y Entrenador)
 *     tags: [Sesiones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_sesion
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
 *         description: Reservas listadas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paginated'
 */
router.get('/:id_sesion/reservas', verifyToken, authorize([1,2]), sesionController.getSesionesReservas);

/**
 * @swagger
 * /sesiones/{id_sesion}:
 *   delete:
 *     summary: Eliminar una sesión (Solo Admin)
 *     tags: [Sesiones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_sesion
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sesión eliminada exitosamente
 *       404:
 *         description: Sesión no encontrada
 */
router.delete('/:id_sesion', verifyToken, authorize([1]), sesionController.deleteSesion);


module.exports = router;
