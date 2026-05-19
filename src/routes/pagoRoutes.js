const express = require('express');
const router = express.Router();
const { createPago, getPagoById } = require('../controllers/pagoController');
const { verifyToken, authorize } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, authorize([1]), createPago);
router.get('/:id_pago', verifyToken, authorize([1]), getPagoById);

module.exports = router;
