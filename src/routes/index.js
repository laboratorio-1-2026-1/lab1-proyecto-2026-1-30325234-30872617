const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const maquinaRoutes = require('./maquinaRoutes');
const disciplinaRoutes = require('./disciplinaRoutes');
const accesoRoutes = require('./accesoRoutes');
const sesionRoutes = require('./sesionRoutes');
const reservaRoutes = require('./reservaRoutes');
const clienteRoutes = require('./clienteRoutes');
const membresiaRoutes = require('./membresiaRoutes');
const ticketRoutes = require('./ticketRoutes');
const tiendaRoutes = require('./tiendaRoutes');

router.use('/auth', authRoutes);
router.use('/maquinas', maquinaRoutes);
router.use('/disciplinas', disciplinaRoutes);
router.use('/accesos', accesoRoutes);
router.use('/sesiones', sesionRoutes);
router.use('/reservas', reservaRoutes);
router.use('/clientes', clienteRoutes);
router.use('/', membresiaRoutes);
router.use('/tickets', ticketRoutes);
router.use('/', tiendaRoutes);

module.exports = router;