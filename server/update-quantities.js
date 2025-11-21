const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateQuantities() {
  try {
    console.log('Atualizando quantidades disponíveis...\n');

    // Atualizar todas as miniaturas para ter quantidade 0
    const result = await prisma.miniaturaBase.updateMany({
      data: {
        availableQuantity: 0
      }
    });

    console.log(`✓ ${result.count} miniaturas atualizadas`);
    console.log('\nAgora você pode editar as quantidades pelo painel admin!');

  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateQuantities();
