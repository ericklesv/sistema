const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

// Middleware para verificar se é admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  next();
};

router.use(isAdmin);

// Usuários
router.get('/users', adminController.getAllUsers);
router.get('/clients', adminController.getAllUsers); // Alias para compatibilidade
router.post('/users/create-client', adminController.createClient);

// Pré-vendas
router.get('/users/:userId/pre-sales', adminController.getUserPreSales);
router.post('/users/:userId/pre-sales', adminController.addPreSaleToUser);
router.put('/pre-sales/:id', adminController.updatePreSale);
router.delete('/pre-sales/:id', adminController.deletePreSaleAdmin);
router.post('/pre-sales/:preSaleId/transfer-to-garage', adminController.transferPreSaleToGarage);

// Garagem
router.get('/users/:userId/garage', adminController.getUserGarage);
router.post('/users/:userId/garage', adminController.addGarageToUser);
router.put('/garage/:id', adminController.updateGarage);
router.delete('/garage/:id', adminController.deleteGarageAdmin);

module.exports = router;
