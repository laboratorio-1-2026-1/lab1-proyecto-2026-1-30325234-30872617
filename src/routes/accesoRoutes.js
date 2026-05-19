const express = require('express');
const router = express.Router();
const accesoController = require('../controllers/accesoController');
const { verifyToken, authorize } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /accesos/entrada:
 *   post:
 *     summary: Registrar y validar el ingreso del cliente por cédula
 *     tags: [Control de Acceso]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documentoIdentidad:
 *                 type: string
 *                 example: "V-12345678"
 *     responses:
 *       201:
 *         description: Acceso permitido y registrado en bitácora
 *       403:
 *         description: No tiene permisos (Solo Admin)
 *       409:
 *         description: Acceso denegado por membresía vencida o impaga
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/entrada', verifyToken, authorize([1,3]), accesoController.registrarEntrada);

module.exports = router;
