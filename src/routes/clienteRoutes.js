const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const { verifyToken, authorize } = require('../middlewares/authMiddleware');

router.post('/:id_cliente/evaluaciones', verifyToken, authorize([2]), clienteController.createEvaluacion);
router.get('/:id_cliente/evaluaciones', verifyToken, authorize([1,2]), clienteController.getEvaluaciones);
router.get('/:id_cliente/membresias', verifyToken, authorize([1,2,3]), clienteController.getMembresias);

module.exports = router;
