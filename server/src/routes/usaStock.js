const express = require('express');
const router = express.Router();
const usaStockController = require('../controllers/usaStockController');
const { authenticateToken } = require('../middleware/auth');

// Middleware para verificar se é admin
const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  next();
};

// Rotas de estoque USA
router.get('/usa-stock', authenticateToken, isAdmin, usaStockController.getAllStock);
router.post('/usa-stock', authenticateToken, isAdmin, usaStockController.addStockItem);
router.put('/usa-stock/:id', authenticateToken, isAdmin, usaStockController.updateStockItem);
router.delete('/usa-stock/:id', authenticateToken, isAdmin, usaStockController.deleteStockItem);

module.exports = router;
