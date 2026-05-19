const express = require('express');
const router = express.Router();
const { registrarEntrada } = require('../controllers/accesoController');
const { verifyToken, authorize } = require('../middlewares/authMiddleware');

router.post('/entrada', verifyToken, authorize([1]), registrarEntrada);

module.exports = router;
