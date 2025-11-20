const prisma = require('../db/prisma');

// Obter todos os itens do estoque
exports.getAllStock = async (req, res) => {
  try {
    const stock = await prisma.uSAStock.findMany({
      include: {
        miniatura: true
      },
      orderBy: { addedDate: 'desc' }
    });
    res.json(stock);
  } catch (err) {
    console.error('Erro ao buscar estoque:', err);
    res.status(500).json({ error: 'Erro ao buscar estoque' });
  }
};

// Adicionar item ao estoque
exports.addStockItem = async (req, res) => {
  const { miniaturaBaseId, name, brand, quantity, price, weight, notes } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Nome é obrigatório' });
  }

  try {
    const item = await prisma.uSAStock.create({
      data: {
        miniaturaBaseId: miniaturaBaseId ? parseInt(miniaturaBaseId) : null,
        name,
        brand: brand || null,
        quantity: parseInt(quantity) || 1,
        price: parseFloat(price) || 0,
        weight: weight ? parseFloat(weight) : null,
        notes: notes || null
      },
      include: {
        miniatura: true
      }
    });

    res.status(201).json(item);
  } catch (err) {
    console.error('Erro ao adicionar item:', err);
    res.status(500).json({ error: 'Erro ao adicionar item' });
  }
};

// Atualizar item do estoque
exports.updateStockItem = async (req, res) => {
  const { id } = req.params;
  const { miniaturaBaseId, name, brand, quantity, price, weight, notes } = req.body;

  try {
    const updateData = {};
    if (miniaturaBaseId !== undefined) updateData.miniaturaBaseId = miniaturaBaseId ? parseInt(miniaturaBaseId) : null;
    if (name !== undefined) updateData.name = name;
    if (brand !== undefined) updateData.brand = brand;
    if (quantity !== undefined) updateData.quantity = parseInt(quantity);
    if (price !== undefined) updateData.price = parseFloat(price);
    if (weight !== undefined) updateData.weight = weight ? parseFloat(weight) : null;
    if (notes !== undefined) updateData.notes = notes;

    const item = await prisma.uSAStock.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        miniatura: true
      }
    });

    res.json(item);
  } catch (err) {
    console.error('Erro ao atualizar item:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Item não encontrado' });
    }
    res.status(500).json({ error: 'Erro ao atualizar item' });
  }
};

// Deletar item do estoque
exports.deleteStockItem = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.uSAStock.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Item deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar item:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Item não encontrado' });
    }
    res.status(500).json({ error: 'Erro ao deletar item' });
  }
};
