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
 *         description: Catálogo de suscripciones
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paginated'
 */
router.get('/suscripciones', membresiaController.getSuscripciones);

/**
 * @swagger
 * /suscripciones:
 *   post:
 *     summary: Crear una suscripción (Solo Admin)
 *     tags: [Membresías]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['nombre', 'costo', 'duracion']
 *             properties:
 *               nombre:
 *                 type: string
 *               costo:
 *                 type: number
 *               duracion:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Suscripción creada
 */
router.post('/suscripciones', verifyToken, authorize([1]), membresiaController.createSuscripcion);

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

/**
 * @swagger
 * /membresias/deactivate-expired:
 *   post:
 *     summary: Inactivar membresías expiradas (Solo Admin)
 *     tags: [Membresías]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Membresías inactivadas
 */
router.post('/membresias/deactivate-expired', verifyToken, authorize([1]), membresiaController.deactivateExpired);

/**
 * @swagger
 * /membresias/clients/no-activos:
 *   get:
 *     summary: Listar clientes sin membresía activa (Solo Admin)
 *     tags: [Membresías]
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
 *         description: Lista de clientes sin membresía activa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paginated'
 */
router.get('/membresias/clients/no-activos', verifyToken, authorize([1]), membresiaController.listClientsNoActive);

module.exports = router;
