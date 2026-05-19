const express = require('express');
const router = express.Router();
const maquinaController = require('../controllers/maquinaController');
const { verifyToken, authorize } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, authorize([1]), maquinaController.getMaquinas);
router.post('/:id_maquina/tickets', verifyToken, authorize([1]), maquinaController.createTicket);
router.patch('/:id_maquina/estado', verifyToken, authorize([1]), maquinaController.updateEstado);

module.exports = router;