const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { verifyToken, authorize } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, authorize([1]), ticketController.getTickets);

module.exports = router;
