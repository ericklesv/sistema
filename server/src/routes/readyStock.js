const express = require('express');
const router = express.Router();
const readyStockController = require('../controllers/readyStockController');
const { authenticateToken } = require('../middleware/auth');

// Middleware para verificar se é admin
const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  next();
};

// Rotas de estoque pronto para entrega
// Rotas específicas (com caminhos exatos) DEVEM vir antes das rotas parametrizadas
router.get('/ready-stock', authenticateToken, isAdmin, readyStockController.getAllStock);
router.post('/ready-stock/send-to-garage', authenticateToken, isAdmin, readyStockController.sendToClientGarage);
router.post('/ready-stock', authenticateToken, isAdmin, readyStockController.addStockItem);
router.put('/ready-stock/:id', authenticateToken, isAdmin, readyStockController.updateStockItem);
router.delete('/ready-stock/:id', authenticateToken, isAdmin, readyStockController.deleteStockItem);

module.exports = router;
