const express = require('express');
const router = express.Router();
const disciplinaController = require('../controllers/disciplinaController');
const { verifyToken, authorize } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /disciplinas:
 *   get:
 *     summary: Obtener catálogo de disciplinas
 *     tags: [Disciplinas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Página (1-based)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Elementos por página
 *     responses:
 *       200:
 *         description: Catálogo de disciplinas obtenido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paginated'
 *       403:
 *         description: Permiso insuficiente
 */
// GET /api/v1/disciplinas
// Protegido: Admin, Entrenador o Cliente pueden consultar
router.get('/', verifyToken, authorize([1, 2, 3]), disciplinaController.getDisciplinas);

module.exports = router;