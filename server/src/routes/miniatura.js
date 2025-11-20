const express = require('express');
const router = express.Router();
const miniaturaController = require('../controllers/miniaturaController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/pre-sales', miniaturaController.getPreSales);
router.post('/pre-sales', miniaturaController.addPreSale);
router.delete('/pre-sales/:id', miniaturaController.deletePreSale);

router.get('/garage', miniaturaController.getGarage);
router.post('/garage', miniaturaController.addGarage);
router.delete('/garage/:id', miniaturaController.deleteGarage);

module.exports = router;
