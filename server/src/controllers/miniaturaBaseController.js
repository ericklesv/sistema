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
  const { name, brand, photoUrl, isPreOrder, releaseDate } = req.body;

  try {
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (brand !== undefined) updateData.brand = brand;
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl;
    if (isPreOrder !== undefined) updateData.isPreOrder = isPreOrder;
    if (releaseDate !== undefined) updateData.releaseDate = releaseDate ? new Date(releaseDate) : null;

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
  const { isPreOrder, releaseDate, availableQuantity } = req.body;

  try {
    const updateData = {
      isPreOrder: isPreOrder === true,
      releaseDate: releaseDate ? new Date(releaseDate) : null
    };
    
    if (availableQuantity !== undefined) {
      updateData.availableQuantity = parseInt(availableQuantity) || 0;
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
