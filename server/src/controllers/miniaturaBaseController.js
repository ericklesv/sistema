const prisma = require('../db/prisma');

// Gerar código único com formato 0001, 0002, etc
const generateCode = async () => {
  const lastMiniatura = await prisma.miniaturaBase.findMany({
    orderBy: { id: 'desc' },
    take: 1
  });

  const nextNumber = lastMiniatura.length > 0 ? lastMiniatura[0].id + 1 : 1;
  return String(nextNumber).padStart(4, '0');
};

// Obter todas as miniaturas base
exports.getAllMiniaturasBase = async (req, res) => {
  try {
    const miniaturas = await prisma.miniaturaBase.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(miniaturas);
  } catch (err) {
    console.error('Erro ao buscar miniaturas:', err);
    res.status(500).json({ error: 'Erro ao buscar miniaturas' });
  }
};

// Obter miniatura base por ID
exports.getMiniaturaBaseById = async (req, res) => {
  const { id } = req.params;

  try {
    const miniatura = await prisma.miniaturaBase.findUnique({
      where: { id: parseInt(id) }
    });

    if (!miniatura) {
      return res.status(404).json({ error: 'Miniatura não encontrada' });
    }

    res.json(miniatura);
  } catch (err) {
    console.error('Erro ao buscar miniatura:', err);
    res.status(500).json({ error: 'Erro ao buscar miniatura' });
  }
};

// Criar nova miniatura base
exports.createMiniaturaBase = async (req, res) => {
  const { name, brand, photoUrl } = req.body;

  if (!name || !brand) {
    return res.status(400).json({ error: 'Nome e marca são obrigatórios' });
  }

  try {
    const code = await generateCode();

    const miniatura = await prisma.miniaturaBase.create({
      data: {
        code,
        name,
        brand,
        photoUrl: photoUrl || null
      }
    });

    res.status(201).json(miniatura);
  } catch (err) {
    console.error('Erro ao criar miniatura:', err);
    res.status(500).json({ error: 'Erro ao criar miniatura' });
  }
};

// Atualizar miniatura base
exports.updateMiniaturaBase = async (req, res) => {
  const { id } = req.params;
  const { name, brand, photoUrl, isPreOrder, releaseDate, preOrderType } = req.body;

  try {
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (brand !== undefined) updateData.brand = brand;
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl;
    if (isPreOrder !== undefined) updateData.isPreOrder = isPreOrder;
    if (releaseDate !== undefined) updateData.releaseDate = releaseDate ? new Date(releaseDate) : null;
    if (preOrderType !== undefined) updateData.preOrderType = preOrderType;

    const miniatura = await prisma.miniaturaBase.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json(miniatura);
  } catch (err) {
    console.error('Erro ao atualizar miniatura:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Miniatura não encontrada' });
    }
    res.status(500).json({ error: 'Erro ao atualizar miniatura' });
  }
};

// Atualizar status de pré-venda
exports.updatePreOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { isPreOrder, releaseDate, stockQuantity, preOrderType } = req.body;

  try {
    const updateData = {
      isPreOrder: isPreOrder === true,
      releaseDate: releaseDate ? new Date(releaseDate) : null
    };
    
    if (stockQuantity !== undefined) {
      const parsed = parseInt(stockQuantity);
      updateData.stockQuantity = Number.isNaN(parsed) ? 0 : parsed;
    }
    
    if (preOrderType !== undefined) {
      updateData.preOrderType = preOrderType;
    }

    const miniatura = await prisma.miniaturaBase.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json(miniatura);
  } catch (err) {
    console.error('Erro ao atualizar status:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Miniatura não encontrada' });
    }
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
};

// Deletar miniatura base
exports.deleteMiniaturaBase = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.miniaturaBase.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Miniatura deletada com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar miniatura:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Miniatura não encontrada' });
    }
    res.status(500).json({ error: 'Erro ao deletar miniatura' });
  }
};

// Buscar miniatura por código
exports.getMiniaturaBaseByCode = async (req, res) => {
  const { code } = req.params;

  try {
    const miniatura = await prisma.miniaturaBase.findUnique({
      where: { code }
    });

    if (!miniatura) {
      return res.status(404).json({ error: 'Miniatura não encontrada' });
    }

    res.json(miniatura);
  } catch (err) {
    console.error('Erro ao buscar miniatura:', err);
    res.status(500).json({ error: 'Erro ao buscar miniatura' });
  }
};

// Obter clientes que possuem uma miniatura específica
exports.getClientsWithMiniatura = async (req, res) => {
  const { id } = req.params;

  try {
    const miniatura = await prisma.miniaturaBase.findUnique({
      where: { id: parseInt(id) }
    });

    if (!miniatura) {
      return res.status(404).json({ error: 'Miniatura não encontrada' });
    }

    // Buscar em pré-vendas
    const preSalesClients = await prisma.preSale.findMany({
      where: {
        name: miniatura.name
      },
      select: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            whatsapp: true
          }
        }
      },
      distinct: ['userId']
    });

    // Buscar em garagem
    const garageClients = await prisma.garage.findMany({
      where: {
        name: miniatura.name
      },
      select: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            whatsapp: true
          }
        }
      },
      distinct: ['userId']
    });

    // Combinar resultados sem duplicatas
    const clientsMap = new Map();
    
    preSalesClients.forEach(item => {
      const key = item.user.id;
      if (!clientsMap.has(key)) {
        clientsMap.set(key, { ...item.user, type: 'pre-sales' });
      }
    });

    garageClients.forEach(item => {
      const key = item.user.id;
      if (!clientsMap.has(key)) {
        clientsMap.set(key, { ...item.user, type: 'garage' });
      }
    });

    const clients = Array.from(clientsMap.values());
    res.json(clients);
  } catch (err) {
    console.error('Erro ao buscar clientes:', err);
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
};

// Adicionar miniatura do banco para pré-venda ou garagem do cliente
exports.addMiniaturaToClientPreSale = async (req, res) => {
  const { miniaturaId } = req.params;
  const { userId, totalValue, paidValue } = req.body;

  try {
    // Buscar a miniatura
    const miniatura = await prisma.miniaturaBase.findUnique({
      where: { id: parseInt(miniaturaId) }
    });

    if (!miniatura) {
      return res.status(404).json({ error: 'Miniatura não encontrada' });
    }

    // Verificar se há quantidade disponível no estoque
    if ((miniatura.stockQuantity || 0) <= 0) {
      return res.status(400).json({ error: 'Miniatura sem estoque disponível' });
    }

    let result;
    let destination;

    // Se for pré-venda, adiciona em PreSale
    if (miniatura.isPreOrder) {
      result = await prisma.preSale.create({
        data: {
          userId: parseInt(userId),
          name: miniatura.name,
          description: miniatura.brand,
          photoUrl: miniatura.photoUrl,
          deliveryDate: miniatura.releaseDate,
          totalValue: parseFloat(totalValue) || 0,
          paidValue: parseFloat(paidValue) || 0,
          situation: 'Esperando lançamento'
        }
      });
      destination = 'pré-venda';
    } else {
      // Se já foi lançada, adiciona em Garage
      result = await prisma.garage.create({
        data: {
          userId: parseInt(userId),
          name: miniatura.name,
          description: miniatura.brand,
          photoUrl: miniatura.photoUrl,
          deliveryDate: miniatura.releaseDate,
          totalValue: parseFloat(totalValue) || 0,
          paidValue: parseFloat(paidValue) || 0,
          status: 'delivered'
        }
      });
      destination = 'garagem';
    }

    // Decrementar quantidade no estoque
    await prisma.miniaturaBase.update({
      where: { id: parseInt(miniaturaId) },
      data: {
        stockQuantity: miniatura.stockQuantity - 1
      }
    });

    res.json({
      message: `Miniatura adicionada à ${destination} do cliente com sucesso`,
      result,
      destination,
      newStockQuantity: miniatura.stockQuantity - 1
    });
  } catch (err) {
    console.error('Erro ao adicionar miniatura ao cliente:', err);
    res.status(500).json({ error: 'Erro ao adicionar miniatura ao cliente' });
  }
};
