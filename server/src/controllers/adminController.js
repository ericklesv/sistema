const bcrypt = require('bcryptjs');
const prisma = require('../db/prisma');

// Obter todos os usuários (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, email: true, whatsapp: true, role: true, createdAt: true }
    });
    res.json(users);
  } catch (err) {
    console.error('Erro ao buscar usuários:', err);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

// Criar novo cliente (admin)
exports.createClient = async (req, res) => {
  const { username, email, whatsapp, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        whatsapp: whatsapp || null,
        password: hashedPassword,
        role: 'client'
      }
    });

    res.status(201).json({ id: user.id, message: 'Cliente criado com sucesso' });
  } catch (err) {
    console.error('Erro ao criar cliente:', err);
    if (err.code === 'P2002') {
      const field = err.meta?.target?.[0] || 'campo';
      return res.status(400).json({ error: `${field} já existe` });
    }
    res.status(500).json({ error: 'Erro ao criar cliente' });
  }
};

// Obter pré-vendas de um usuário (admin)
exports.getUserPreSales = async (req, res) => {
  const { userId } = req.params;

  try {
    const preSales = await prisma.preSale.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { addedDate: 'desc' }
    });
    res.json(preSales);
  } catch (err) {
    console.error('Erro ao buscar pré-vendas:', err);
    res.status(500).json({ error: 'Erro ao buscar pré-vendas' });
  }
};

// Adicionar pré-venda para um cliente (admin)
exports.addPreSaleToUser = async (req, res) => {
  const { userId } = req.params;
  const { name, description, deliveryDate, totalValue, paidValue, photoUrl } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Nome da miniatura é obrigatório' });
  }

  try {
    const preSale = await prisma.preSale.create({
      data: {
        userId: parseInt(userId),
        name,
        description: description || null,
        photoUrl: photoUrl || null,
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

// Atualizar pré-venda (admin)
exports.updatePreSale = async (req, res) => {
  const { id } = req.params;
  const { name, description, deliveryDate, status, situation, totalValue, paidValue } = req.body;

  try {
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (deliveryDate !== undefined) updateData.deliveryDate = deliveryDate ? new Date(deliveryDate) : null;
    if (status !== undefined) updateData.status = status;
    if (situation !== undefined) updateData.situation = situation;
    if (totalValue !== undefined) updateData.totalValue = parseFloat(totalValue);
    if (paidValue !== undefined) updateData.paidValue = parseFloat(paidValue);

    const preSale = await prisma.preSale.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json({ id: preSale.id, message: 'Pré-venda atualizada' });
  } catch (err) {
    console.error('Erro ao atualizar:', err);
    res.status(500).json({ error: 'Erro ao atualizar' });
  }
};

// Deletar pré-venda (admin)
exports.deletePreSaleAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.preSale.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Pré-venda deletada' });
  } catch (err) {
    console.error('Erro ao deletar:', err);
    res.status(500).json({ error: 'Erro ao deletar' });
  }
};

// Obter garagem de um usuário (admin)
exports.getUserGarage = async (req, res) => {
  const { userId } = req.params;

  try {
    const garage = await prisma.garage.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { addedDate: 'desc' }
    });
    res.json(garage);
  } catch (err) {
    console.error('Erro ao buscar garagem:', err);
    res.status(500).json({ error: 'Erro ao buscar garagem' });
  }
};

// Adicionar miniatura de garagem para um cliente (admin)
exports.addGarageToUser = async (req, res) => {
  const { userId } = req.params;
  const { name, description, deliveryDate, totalValue, paidValue, photoUrl } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Nome da miniatura é obrigatório' });
  }

  try {
    const garage = await prisma.garage.create({
      data: {
        userId: parseInt(userId),
        name,
        description: description || null,
        photoUrl: photoUrl || null,
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

// Atualizar miniatura de garagem (admin)
exports.updateGarage = async (req, res) => {
  const { id } = req.params;
  const { name, description, deliveryDate, status, totalValue, paidValue } = req.body;

  try {
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (deliveryDate !== undefined) updateData.deliveryDate = deliveryDate ? new Date(deliveryDate) : null;
    if (status !== undefined) updateData.status = status;
    if (totalValue !== undefined) updateData.totalValue = parseFloat(totalValue);
    if (paidValue !== undefined) updateData.paidValue = parseFloat(paidValue);

    const garage = await prisma.garage.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json({ id: garage.id, message: 'Miniatura atualizada' });
  } catch (err) {
    console.error('Erro ao atualizar:', err);
    res.status(500).json({ error: 'Erro ao atualizar' });
  }
};

// Deletar miniatura de garagem (admin)
exports.deleteGarageAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.garage.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Miniatura deletada' });
  } catch (err) {
    console.error('Erro ao deletar:', err);
    res.status(500).json({ error: 'Erro ao deletar' });
  }
};

// Transferir pré-venda para garagem (admin)
exports.transferPreSaleToGarage = async (req, res) => {
  const { preSaleId } = req.params;

  try {
    // Buscar a pré-venda
    const preSale = await prisma.preSale.findUnique({
      where: { id: parseInt(preSaleId) },
      include: { user: true }
    });

    if (!preSale) {
      return res.status(404).json({ error: 'Pré-venda não encontrada' });
    }

    // Criar na garagem com os mesmos dados
    const garage = await prisma.garage.create({
      data: {
        userId: preSale.userId,
        name: preSale.name,
        description: preSale.description,
        photoUrl: preSale.photoUrl,
        deliveryDate: preSale.deliveryDate || new Date(),
        status: 'delivered',
        totalValue: preSale.totalValue,
        paidValue: preSale.paidValue
      }
    });

    // Deletar a pré-venda
    await prisma.preSale.delete({
      where: { id: parseInt(preSaleId) }
    });

    res.json({ 
      message: 'Miniatura transferida para garagem com sucesso',
      garage 
    });
  } catch (err) {
    console.error('Erro ao transferir:', err);
    res.status(500).json({ error: 'Erro ao transferir miniatura' });
  }
};
