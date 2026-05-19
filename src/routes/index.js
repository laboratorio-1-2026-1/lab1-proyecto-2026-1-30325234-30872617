const express = require('express');
const router = express.Router();

// Importar los archivos de rutas de cada módulo
const authRoutes = require('./authRoutes');
const maquinaRoutes = require('./maquinaRoutes');
const disciplinaRoutes = require('./disciplinaRoutes');
const sesionRoutes = require('./sesionRoutes');
const suscripcionRoutes = require('./suscripcionRoutes');
const clienteRoutes = require('./clienteRoutes');
const reservaRoutes = require('./reservaRoutes');
const pagoRoutes = require('./pagoRoutes');
const accesoRoutes = require('./accesoRoutes');

// Conectar los módulos a sus prefijos correspondientes
router.use('/auth', authRoutes);
router.use('/maquinas', maquinaRoutes);
router.use('/disciplinas', disciplinaRoutes);
router.use('/sesiones', sesionRoutes);
router.use('/suscripciones', suscripcionRoutes);
router.use('/clientes', clienteRoutes);
router.use('/reservas', reservaRoutes);
router.use('/pagos', pagoRoutes);
router.use('/accesos', accesoRoutes);

module.exports = router;