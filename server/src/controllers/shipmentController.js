const prisma = require('../db/prisma');

// Obter todos os envios
exports.getAllShipments = async (req, res) => {
  try {
    const shipments = await prisma.shipment.findMany({
      include: {
        items: {
          include: {
            miniatura: true
          }
        }
      },
      orderBy: { shippingDate: 'desc' }
    });

    // Calcular totais para cada envio
    const shipmentsWithTotals = shipments.map(shipment => ({
      ...shipment,
      totalItems: shipment.items.reduce((sum, item) => sum + item.quantity, 0),
      totalWeight: shipment.items.reduce((sum, item) => sum + (item.weight || 0), 0),
      totalStockValue: shipment.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      totalCost: shipment.shippingCost + shipment.taxCost
    }));

    res.json(shipmentsWithTotals);
  } catch (err) {
    console.error('Erro ao buscar envios:', err);
    res.status(500).json({ error: 'Erro ao buscar envios' });
  }
};

// Criar novo envio
exports.createShipment = async (req, res) => {
  const { shippingDate, shippingCost, taxCost } = req.body;

  if (!shippingDate) {
    return res.status(400).json({ error: 'Data de envio é obrigatória' });
  }

  try {
    const shipment = await prisma.shipment.create({
      data: {
        shippingDate: new Date(shippingDate),
        shippingCost: parseFloat(shippingCost) || 0,
        taxCost: parseFloat(taxCost) || 0
      },
      include: {
        items: {
          include: {
            miniatura: true
          }
        }
      }
    });

    res.status(201).json(shipment);
  } catch (err) {
    console.error('Erro ao criar envio:', err);
    res.status(500).json({ error: 'Erro ao criar envio' });
  }
};

// Atualizar envio
exports.updateShipment = async (req, res) => {
  const { id } = req.params;
  const { shippingDate, shippingCost, taxCost } = req.body;

  try {
    const updateData = {};
    if (shippingDate !== undefined) updateData.shippingDate = new Date(shippingDate);
    if (shippingCost !== undefined) updateData.shippingCost = parseFloat(shippingCost);
    if (taxCost !== undefined) updateData.taxCost = parseFloat(taxCost);

    const shipment = await prisma.shipment.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        items: {
          include: {
            miniatura: true
          }
        }
      }
    });

    res.json(shipment);
  } catch (err) {
    console.error('Erro ao atualizar envio:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Envio não encontrado' });
    }
    res.status(500).json({ error: 'Erro ao atualizar envio' });
  }
};

// Deletar envio
exports.deleteShipment = async (req, res) => {
  const { id } = req.params;

  try {
    // Primeiro, remover os itens deste envio
    await prisma.uSAStock.updateMany({
      where: { shipmentId: parseInt(id) },
      data: { shipmentId: null }
    });

    // Depois deletar o envio
    await prisma.shipment.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Envio deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar envio:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Envio não encontrado' });
    }
    res.status(500).json({ error: 'Erro ao deletar envio' });
  }
};

// Adicionar item a um envio
exports.addItemToShipment = async (req, res) => {
  const { id } = req.params;
  const { stockItemId } = req.body;

  if (!stockItemId) {
    return res.status(400).json({ error: 'ID do item é obrigatório' });
  }

  try {
    const item = await prisma.uSAStock.update({
      where: { id: parseInt(stockItemId) },
      data: { shipmentId: parseInt(id) },
      include: {
        miniatura: true
      }
    });

    res.json(item);
  } catch (err) {
    console.error('Erro ao adicionar item ao envio:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Item ou envio não encontrado' });
    }
    res.status(500).json({ error: 'Erro ao adicionar item ao envio' });
  }
};

// Remover item de um envio
exports.removeItemFromShipment = async (req, res) => {
  const { id, itemId } = req.params;

  try {
    const item = await prisma.uSAStock.update({
      where: { id: parseInt(itemId) },
      data: { shipmentId: null },
      include: {
        miniatura: true
      }
    });

    res.json(item);
  } catch (err) {
    console.error('Erro ao remover item do envio:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Item não encontrado' });
    }
    res.status(500).json({ error: 'Erro ao remover item do envio' });
  }
};
