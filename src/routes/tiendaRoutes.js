const express = require('express');
const router = express.Router();
const tiendaController = require('../controllers/tiendaController');
const { verifyToken, authorize } = require('../middlewares/authMiddleware');

router.get('/productos', tiendaController.getProductos);
router.patch('/productos/:id_producto/stock', verifyToken, authorize([1]), tiendaController.updateProductoStock);
router.post('/ventas', verifyToken, authorize([1,3]), tiendaController.createVenta);
router.get('/ventas', verifyToken, authorize([1]), tiendaController.getVentas);

module.exports = router;
