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
 *         description: Catálogo de productos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paginated'
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
 *     summary: Registrar venta (Solo Admin)
 *     tags: [Tienda]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['id_client', 'items']
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
router.post('/ventas', verifyToken, authorize([1]), tiendaController.createVenta);

/**
 * @swagger
 * /ventas:
 *   get:
 *     summary: Obtener historial de ventas (Admin)
 *     tags: [Tienda]
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
 *         description: Historial de ventas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paginated'
 */
router.get('/ventas', verifyToken, authorize([1]), tiendaController.getVentas);

/**
 * @swagger
 * /productos/{id_producto}:
 *   delete:
 *     summary: Eliminar un producto (Solo Admin)
 *     tags: [Tienda]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_producto
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto eliminado
 */
router.delete('/productos/:id_producto', verifyToken, authorize([1]), tiendaController.deleteProducto);

module.exports = router;
