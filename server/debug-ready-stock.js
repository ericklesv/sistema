const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function test() {
  try {
    console.log('📊 Verificando ReadyStock table...\n');

    // Contar itens
    const count = await prisma.readyStock.count();
    console.log(`✅ Total de itens no ReadyStock: ${count}`);

    // Listar todos
    const items = await prisma.readyStock.findMany();
    console.log('📦 Itens:', items);

    // Tentar adicionar um item de teste
    console.log('\n➕ Adicionando item de teste...');
    const newItem = await prisma.readyStock.create({
      data: {
        name: 'Test Item',
        brand: 'TestBrand',
        quantity: 1,
        price: 100,
        notes: 'Debug test'
      }
    });

    console.log('✅ Item criado:', newItem);

    // Verificar novamente
    const count2 = await prisma.readyStock.count();
    console.log(`\n✅ Total de itens após adicionar: ${count2}`);

  } catch (err) {
    console.error('❌ Erro:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
