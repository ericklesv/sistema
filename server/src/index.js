require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const miniaturaRoutes = require('./routes/miniatura');
const miniaturaBaseRoutes = require('./routes/miniaturaBase');
const adminRoutes = require('./routes/admin');
const usaStockRoutes = require('./routes/usaStock');
const readyStockRoutes = require('./routes/readyStock');
const shipmentRoutes = require('./routes/shipment');

const prisma = require('./db/prisma');
const pkg = require('../package.json');
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/miniaturas', miniaturaRoutes);
app.use('/api', miniaturaBaseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', usaStockRoutes);
app.use('/api/admin', readyStockRoutes);
app.use('/api/admin', shipmentRoutes);

// Rota de health detalhada
app.get('/api/health', async (req, res) => {
  try {
    const miniaturasCount = await prisma.miniaturaBase.count();
    const preSalesCount = await prisma.preSale.count();
    const garageCount = await prisma.garage.count();
    res.json({
      status: 'ok',
      version: pkg.version,
      commit: process.env.RENDER_GIT_COMMIT || process.env.GIT_COMMIT || null,
      time: new Date().toISOString(),
      database: 'PostgreSQL',
      counts: {
        miniaturasBase: miniaturasCount,
        preSales: preSalesCount,
        garage: garageCount
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log('Database:', process.env.DATABASE_URL ? 'PostgreSQL (Production)' : 'Local');
});
