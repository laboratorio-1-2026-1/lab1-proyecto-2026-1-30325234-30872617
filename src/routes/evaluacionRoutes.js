const express = require('express');
const router = express.Router({ mergeParams: true });
const { getEvaluaciones, createEvaluacion } = require('../controllers/evaluacionController');
const { verifyToken, authorize } = require('../middlewares/authMiddleware');

router.get('/', getEvaluaciones);
router.post('/', verifyToken, authorize([1]), createEvaluacion);

module.exports = router;
