require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const miniaturaRoutes = require('./routes/miniatura');
const miniaturaBaseRoutes = require('./routes/miniaturaBase');
const adminRoutes = require('./routes/admin');
const usaStockRoutes = require('./routes/usaStock');
const shipmentRoutes = require('./routes/shipment');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/miniaturas', miniaturaRoutes);
app.use('/api', miniaturaBaseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', usaStockRoutes);
app.use('/api/admin', shipmentRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ message: 'Servidor está funcionando!' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log('Conectado ao SQLite');
});
