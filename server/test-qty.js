const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const miniaturas = await prisma.miniaturaBase.findMany({
    select: {
      id: true,
      code: true,
      name: true,
      availableQuantity: true
    }
  });
  
  console.log('=== MINIATURAS NO BANCO ===');
  miniaturas.forEach(m => {
    console.log(`${m.code} - ${m.name}: Quantidade = ${m.availableQuantity}`);
  });
  
  await prisma.$disconnect();
}

test();
