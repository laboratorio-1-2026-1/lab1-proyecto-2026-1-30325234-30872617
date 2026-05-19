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
 * /clientes:
 *   post:
 *     summary: Crear un cliente (Solo Admin)
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['email', 'password', 'nombre', 'apellido']
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               telefono:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente creado
 */
router.post('/', verifyToken, authorize([1]), clienteController.createCliente);

/**
 * @swagger
 * /clientes/entrenadores:
 *   post:
 *     summary: Crear un entrenador (Solo Admin)
 *     tags: [Entrenadores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['email', 'password', 'nombre', 'apellido']
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               disciplina:
 *                 type: string
 *               salario:
 *                 type: number
 *               horario:
 *                 type: string
 *     responses:
 *       201:
 *         description: Entrenador creado
 */
router.post('/entrenadores', verifyToken, authorize([1]), clienteController.createEntrenador);

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['estatura', 'porcentaje_grasa']
 *             properties:
 *               estatura:
 *                 type: number
 *               porcentaje_grasa:
 *                 type: number
 *               observaciones:
 *                 type: string
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
 *     parameters:
 *       - in: path
 *         name: id_cliente
 *         required: true
 *         schema:
 *           type: integer
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
 *     parameters:
 *       - in: path
 *         name: id_cliente
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Membresías listadas
 */
router.get('/:id_cliente/membresias', verifyToken, authorize([1,2,3]), clienteController.getMembresias);

/**
 * @swagger
 * /clientes/{id_cliente}/membresias:
 *   post:
 *     summary: Crear membresía para cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_cliente
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['id_suscripcion', 'fecha_inicio', 'fecha_fin']
 *             properties:
 *               id_suscripcion:
 *                 type: integer
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *               fecha_fin:
 *                 type: string
 *                 format: date
 *               estado:
 *                 type: string
 *                 enum: [Activa, Inactiva]
 *     responses:
 *       201:
 *         description: Membresía creada exitosamente
 */
router.post('/:id_cliente/membresias', verifyToken, authorize([1]), clienteController.createMembresia);

module.exports = router;
