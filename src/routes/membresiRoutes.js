const express = require('express');
const router = express.Router({ mergeParams: true });
const { getMembresias, createMembresia } = require('../controllers/membresiController');
const { verifyToken, authorize } = require('../middlewares/authMiddleware');

router.get('/', getMembresias);
router.post('/', verifyToken, authorize([1]), createMembresia);

module.exports = router;
