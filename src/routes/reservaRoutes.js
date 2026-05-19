const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const { verifyToken, authorize } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, authorize([1,3]), reservaController.createReserva);

module.exports = router;
