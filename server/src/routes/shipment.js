const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const authMiddleware = require('../middleware/auth');

// Todas as rotas requerem autenticação de admin
router.use(authMiddleware.authenticateToken, (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  next();
});

// Obter todos os envios
router.get('/shipments', shipmentController.getAllShipments);

// Criar novo envio
router.post('/shipments', shipmentController.createShipment);

// Atualizar envio
router.put('/shipments/:id', shipmentController.updateShipment);

// Deletar envio
router.delete('/shipments/:id', shipmentController.deleteShipment);

// Adicionar item a um envio
router.post('/shipments/:id/items', shipmentController.addItemToShipment);

// Remover item de um envio
router.delete('/shipments/:id/items/:itemId', shipmentController.removeItemFromShipment);

module.exports = router;
