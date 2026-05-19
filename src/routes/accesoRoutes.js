const express = require('express');
const router = express.Router();
const accesoController = require('../controllers/accesoController');

router.post('/entrada', accesoController.registrarEntrada);

module.exports = router;
