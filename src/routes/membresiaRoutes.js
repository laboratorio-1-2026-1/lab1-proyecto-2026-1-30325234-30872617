const express = require('express');
const router = express.Router();
const membresiaController = require('../controllers/membresiaController');
const { verifyToken, authorize } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /suscripciones:
 *   get:
 *     summary: Obtener catálogo público de suscripciones
 *     tags: [Membresías]
 *     responses:
 *       200:
 *         description: Catálogo de suscripciones
 */
router.get('/suscripciones', membresiaController.getSuscripciones);

/**
 * @swagger
 * /pagos:
 *   post:
 *     summary: Registrar un pago (Solo Admin)
 *     tags: [Membresías]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['id_membresia', 'monto', 'metodo_pago']
 *             properties:
 *               id_membresia:
 *                 type: integer
 *               monto:
 *                 type: number
 *               metodo_pago:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pago registrado
 */
router.post('/pagos', verifyToken, authorize([1]), membresiaController.createPago);

/**
 * @swagger
 * /pagos/{id_pago}:
 *   get:
 *     summary: Consultar detalle de un pago (Solo Admin)
 *     tags: [Membresías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_pago
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle del pago
 */
router.get('/pagos/:id_pago', verifyToken, authorize([1]), membresiaController.getPagoById);

module.exports = router;
