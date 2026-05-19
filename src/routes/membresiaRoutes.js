const express = require('express');
const router = express.Router();
const membresiaController = require('../controllers/membresiaController');
const { verifyToken, authorize } = require('../middlewares/authMiddleware');

router.get('/suscripciones', membresiaController.getSuscripciones);
router.post('/pagos', verifyToken, authorize([1]), membresiaController.createPago);
router.get('/pagos/:id_pago', verifyToken, authorize([1]), membresiaController.getPagoById);

module.exports = router;
