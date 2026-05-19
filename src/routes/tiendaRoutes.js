const express = require('express');
const router = express.Router();
const tiendaController = require('../controllers/tiendaController');
const { verifyToken, authorize } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Obtener catálogo de productos
 *     tags: [Tienda]
 *     responses:
 *       200:
 *         description: Catálogo de productos
 */
router.get('/productos', tiendaController.getProductos);

/**
 * @swagger
 * /productos:
 *   post:
 *     summary: Crear nuevo producto (Solo Admin)
 *     tags: [Tienda]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - precio
 *               - stock
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               stock:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Producto creado
 *       400:
 *         description: Datos inválidos
 */
router.post('/productos', verifyToken, authorize([1]), tiendaController.createProducto);

/**
 * @swagger
 * /productos/{id_producto}/stock:
 *   patch:
 *     summary: Actualizar stock de un producto (Solo Admin)
 *     tags: [Tienda]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_producto
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
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Stock actualizado
 */
router.patch('/productos/:id_producto/stock', verifyToken, authorize([1]), tiendaController.updateProductoStock);

/**
 * @swagger
 * /ventas:
 *   post:
 *     summary: Registrar venta (Cliente o Admin)
 *     tags: [Tienda]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['items']
 *             properties:
 *               id_client:
 *                 type: integer
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: ['id_producto', 'cantidad']
 *                   properties:
 *                     id_producto:
 *                       type: integer
 *                     cantidad:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Venta registrada
 */
router.post('/ventas', verifyToken, authorize([1,3]), tiendaController.createVenta);

/**
 * @swagger
 * /ventas:
 *   get:
 *     summary: Obtener historial de ventas (Admin)
 *     tags: [Tienda]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historial de ventas
 */
router.get('/ventas', verifyToken, authorize([1]), tiendaController.getVentas);

module.exports = router;
