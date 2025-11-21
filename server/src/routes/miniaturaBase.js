const express = require('express');
const router = express.Router();
const miniaturaBaseController = require('../controllers/miniaturaBaseController');
const { authenticateToken } = require('../middleware/auth');

// Middleware para verificar se é admin
const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  next();
};

// Rotas públicas (qualquer usuário autenticado pode ver)
router.get('/miniaturas-base', miniaturaBaseController.getAllMiniaturasBase);
router.get('/miniaturas-base/codigo/:code', miniaturaBaseController.getMiniaturaBaseByCode);
router.get('/miniaturas-base/:id/clients', authenticateToken, isAdmin, miniaturaBaseController.getClientsWithMiniatura);
router.get('/miniaturas-base/:id', miniaturaBaseController.getMiniaturaBaseById);

// Rotas de admin
router.post('/miniaturas-base', authenticateToken, isAdmin, miniaturaBaseController.createMiniaturaBase);
router.put('/miniaturas-base/:id', authenticateToken, isAdmin, miniaturaBaseController.updateMiniaturaBase);
router.put('/miniaturas-base/:id/status', authenticateToken, isAdmin, miniaturaBaseController.updatePreOrderStatus);
router.delete('/miniaturas-base/:id', authenticateToken, isAdmin, miniaturaBaseController.deleteMiniaturaBase);

module.exports = router;
