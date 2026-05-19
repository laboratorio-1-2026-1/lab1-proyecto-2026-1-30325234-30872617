const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const { verifyToken, authorize } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Obtener listado de todos los clientes (Solo Admin)
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de clientes
 *       403:
 *         description: Permiso insuficiente
 */
router.get('/', verifyToken, authorize([1]), clienteController.getClientes);

/**
 * @swagger
 * /clientes/{id_cliente}/evaluaciones:
 *   post:
 *     summary: Registrar evaluación biométrica (Entrenador)
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_cliente
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Evaluación registrada
 */
router.post('/:id_cliente/evaluaciones', verifyToken, authorize([2]), clienteController.createEvaluacion);

/**
 * @swagger
 * /clientes/{id_cliente}/evaluaciones:
 *   get:
 *     summary: Obtener evaluaciones de un cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historial de evaluaciones
 */
router.get('/:id_cliente/evaluaciones', verifyToken, authorize([1,2]), clienteController.getEvaluaciones);

/**
 * @swagger
 * /clientes/{id_cliente}/membresias:
 *   get:
 *     summary: Obtener membresías de un cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Membresías listadas
 */
router.get('/:id_cliente/membresias', verifyToken, authorize([1,2,3]), clienteController.getMembresias);

module.exports = router;
