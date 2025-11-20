const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function check() {
  try {
    // Verificar ReadyStock
    console.log('📦 READY STOCK:');
    const readyStock = await prisma.readyStock.findMany({
      include: { miniatura: true }
    });
    
    readyStock.forEach(item => {
      console.log(`\nID: ${item.id}`);
      console.log(`Nome: ${item.name}`);
      console.log(`MiniaturaBaseId: ${item.miniaturaBaseId}`);
      console.log(`Miniatura: ${item.miniatura ? 'SIM' : 'NÃO'}`);
      if (item.miniatura) {
        console.log(`  - Nome: ${item.miniatura.name}`);
        console.log(`  - PhotoUrl: ${item.miniatura.photoUrl || 'SEM FOTO'}`);
      }
    });

    // Verificar Garagem
    console.log('\n\n🏠 GARAGEM:');
    const garage = await prisma.garage.findMany({
      orderBy: { addedDate: 'desc' },
      take: 5
    });
    
    garage.forEach(item => {
      console.log(`\nID: ${item.id}`);
      console.log(`Nome: ${item.name}`);
      console.log(`PhotoUrl: ${item.photoUrl || 'SEM FOTO'}`);
    });

  } catch (err) {
    console.error('Erro:', err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
