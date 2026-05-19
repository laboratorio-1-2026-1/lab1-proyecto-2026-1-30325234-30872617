const express = require('express');
const router = express.Router();
const sesionController = require('../controllers/sesionController');
const { verifyToken, authorize } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, authorize([1]), sesionController.createSesion);
router.get('/', verifyToken, authorize([1,2]), sesionController.getSesiones);
router.get('/:id_sesion/reservas', verifyToken, authorize([1,2]), sesionController.getSesionesReservas);
router.post('/:id_sesion/reservas', verifyToken, authorize([1]), sesionController.createSesionReserva);

module.exports = router;
