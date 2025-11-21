const jwt = require('jsonwebtoken');

const prisma = require('../db/prisma');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }

    // Garante que role esteja presente (tokens antigos podem não ter role)
    if (!payload.role) {
      try {
        const userDb = await prisma.user.findUnique({ where: { id: payload.id } });
        if (!userDb) {
          return res.status(401).json({ error: 'Usuário não encontrado' });
        }
        payload.role = userDb.role;
      } catch (dbErr) {
        return res.status(500).json({ error: 'Erro ao validar usuário' });
      }
    }

    req.user = payload;
    next();
  });
};

module.exports = { authenticateToken };
