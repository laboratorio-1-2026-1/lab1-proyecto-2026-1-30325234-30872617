const express = require('express');
const router = express.Router();
const { createReserva, getReservasBySesion, registrarReservaManual } = require('../controllers/reservaController');
const { verifyToken, authorize } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, authorize([3, 4]), createReserva);
router.get('/sesiones/:id_sesion', verifyToken, getReservasBySesion);
router.post('/sesiones/:id_sesion', verifyToken, authorize([1]), registrarReservaManual);

module.exports = router;
