const prisma = require('../db/prisma');

// Obter todos os itens do estoque pronto
exports.getAllStock = async (req, res) => {
  try {
    const stock = await prisma.readyStock.findMany({
      include: {
        miniatura: true
      },
      orderBy: { addedDate: 'desc' }
    });
    res.json(stock);
  } catch (err) {
    console.error('Erro ao buscar estoque pronto:', err);
    res.status(500).json({ error: 'Erro ao buscar estoque pronto' });
  }
};

// Adicionar item ao estoque pronto
exports.addStockItem = async (req, res) => {
  const { miniaturaBaseId, name, brand, quantity, cost, profitMargin, notes } = req.body;

  console.log('📦 Adicionando item ao ReadyStock:', { miniaturaBaseId, name, brand, quantity, cost, profitMargin, notes });

  if (!name) {
    return res.status(400).json({ error: 'Nome é obrigatório' });
  }

  try {
    const item = await prisma.readyStock.create({
      data: {
        miniaturaBaseId: miniaturaBaseId ? parseInt(miniaturaBaseId) : null,
        name,
        brand: brand || null,
        quantity: parseInt(quantity) || 1,
        cost: parseFloat(cost) || 0,
        profitMargin: parseFloat(profitMargin) || 0,
        notes: notes || null
      },
      include: {
        miniatura: true
      }
    });

    console.log('✅ Item adicionado com sucesso:', item);
    res.status(201).json(item);
  } catch (err) {
    console.error('❌ Erro ao adicionar item:', err);
    res.status(500).json({ error: 'Erro ao adicionar item' });
  }
};

// Atualizar item do estoque pronto
exports.updateStockItem = async (req, res) => {
  const { id } = req.params;
  const { miniaturaBaseId, name, brand, quantity, cost, profitMargin, notes } = req.body;

  try {
    const updateData = {};
    if (miniaturaBaseId !== undefined) updateData.miniaturaBaseId = miniaturaBaseId ? parseInt(miniaturaBaseId) : null;
    if (name !== undefined) updateData.name = name;
    if (brand !== undefined) updateData.brand = brand;
    if (quantity !== undefined) updateData.quantity = parseInt(quantity);
    if (cost !== undefined) updateData.cost = parseFloat(cost);
    if (profitMargin !== undefined) updateData.profitMargin = parseFloat(profitMargin);
    if (notes !== undefined) updateData.notes = notes;

    const item = await prisma.readyStock.update({
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

// Deletar item do estoque pronto
exports.deleteStockItem = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.readyStock.delete({
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

// Enviar miniatura diretamente para garagem de um cliente
exports.sendToClientGarage = async (req, res) => {
  const { readyStockId, userId } = req.body;

  console.log('📤 Enviando para garagem:', { readyStockId, userId });

  if (!readyStockId || !userId) {
    return res.status(400).json({ error: 'readyStockId e userId são obrigatórios' });
  }

  try {
    // Buscar o item do estoque pronto
    const stockItem = await prisma.readyStock.findUnique({
      where: { id: parseInt(readyStockId) },
      include: { miniatura: true }
    });

    console.log('📦 Item encontrado:', stockItem);

    if (!stockItem) {
      return res.status(404).json({ error: 'Item não encontrado no estoque pronto' });
    }

    // Obter a foto da miniatura base
    const photoUrl = stockItem.miniatura?.photoUrl || null;
    
    console.log('🖼️ Photo URL:', photoUrl);

    // Calcular o preço final com a margem de lucro
    const finalPrice = stockItem.cost * (1 + stockItem.profitMargin / 100);

    // Criar a miniatura na garagem do cliente
    const garage = await prisma.garage.create({
      data: {
        userId: parseInt(userId),
        name: stockItem.name,
        description: stockItem.notes || `Miniatura: ${stockItem.brand || 'N/A'}`,
        photoUrl: photoUrl,
        totalValue: finalPrice,
        paidValue: finalPrice,
        deliveryDate: new Date(),
        status: 'completed'
      }
    });

    console.log('✅ Criado na garagem:', garage);

    // Deletar do estoque pronto
    await prisma.readyStock.delete({
      where: { id: parseInt(readyStockId) }
    });

    console.log('🗑️ Deletado do estoque pronto');

    res.json({
      message: 'Miniatura enviada para garagem do cliente com sucesso',
      garage
    });
  } catch (err) {
    console.error('❌ Erro ao enviar para garagem:', err);
    console.error('📋 Detalhes do erro:', err.message);
    res.status(500).json({ error: 'Erro ao enviar para garagem: ' + err.message });
  }
};
