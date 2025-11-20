const prisma = require('../db/prisma');

// Obter todas as pré-vendas do usuário
exports.getPreSales = async (req, res) => {
  const userId = req.user.id;

  try {
    const preSales = await prisma.preSale.findMany({
      where: { userId },
      orderBy: { addedDate: 'desc' }
    });
    res.json(preSales);
  } catch (err) {
    console.error('Erro ao buscar pré-vendas:', err);
    res.status(500).json({ error: 'Erro ao buscar pré-vendas' });
  }
};

// Adicionar pré-venda
exports.addPreSale = async (req, res) => {
  const { name, description, deliveryDate, totalValue, paidValue } = req.body;
  const userId = req.user.id;

  if (!name) {
    return res.status(400).json({ error: 'Nome da miniatura obrigatório' });
  }

  try {
    const preSale = await prisma.preSale.create({
      data: {
        userId,
        name,
        description: description || null,
        deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
        totalValue: parseFloat(totalValue) || 0,
        paidValue: parseFloat(paidValue) || 0
      }
    });

    res.status(201).json({ id: preSale.id, message: 'Pré-venda adicionada' });
  } catch (err) {
    console.error('Erro ao adicionar pré-venda:', err);
    res.status(500).json({ error: 'Erro ao adicionar pré-venda' });
  }
};

// Deletar pré-venda
exports.deletePreSale = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    await prisma.preSale.deleteMany({
      where: {
        id: parseInt(id),
        userId
      }
    });
    res.json({ message: 'Pré-venda deletada' });
  } catch (err) {
    console.error('Erro ao deletar:', err);
    res.status(500).json({ error: 'Erro ao deletar' });
  }
};

// Obter todas as miniaturas de garagem
exports.getGarage = async (req, res) => {
  const userId = req.user.id;

  try {
    const garage = await prisma.garage.findMany({
      where: { userId },
      orderBy: { addedDate: 'desc' }
    });
    res.json(garage);
  } catch (err) {
    console.error('Erro ao buscar garagem:', err);
    res.status(500).json({ error: 'Erro ao buscar garagem' });
  }
};

// Adicionar miniatura de garagem
exports.addGarage = async (req, res) => {
  const { name, description, deliveryDate, totalValue, paidValue } = req.body;
  const userId = req.user.id;

  if (!name) {
    return res.status(400).json({ error: 'Nome da miniatura obrigatório' });
  }

  try {
    const garage = await prisma.garage.create({
      data: {
        userId,
        name,
        description: description || null,
        deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
        totalValue: parseFloat(totalValue) || 0,
        paidValue: parseFloat(paidValue) || 0
      }
    });

    res.status(201).json({ id: garage.id, message: 'Miniatura adicionada' });
  } catch (err) {
    console.error('Erro ao adicionar miniatura:', err);
    res.status(500).json({ error: 'Erro ao adicionar miniatura' });
  }
};

// Deletar miniatura de garagem
exports.deleteGarage = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    await prisma.garage.deleteMany({
      where: {
        id: parseInt(id),
        userId
      }
    });
    res.json({ message: 'Miniatura deletada' });
  } catch (err) {
    console.error('Erro ao deletar:', err);
    res.status(500).json({ error: 'Erro ao deletar' });
  }
};
