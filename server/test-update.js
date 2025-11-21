const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testUpdate() {
  console.log('=== TESTE DE ATUALIZAÇÃO ===\n');
  
  // Pegar a primeira miniatura
  const miniatura = await prisma.miniaturaBase.findFirst();
  console.log('ANTES da atualização:');
  console.log(`ID: ${miniatura.id}`);
  console.log(`Nome: ${miniatura.name}`);
  console.log(`Quantidade: ${miniatura.availableQuantity}\n`);
  
  // Tentar atualizar
  const updated = await prisma.miniaturaBase.update({
    where: { id: miniatura.id },
    data: { availableQuantity: 99 }
  });
  
  console.log('DEPOIS da atualização:');
  console.log(`ID: ${updated.id}`);
  console.log(`Nome: ${updated.name}`);
  console.log(`Quantidade: ${updated.availableQuantity}\n`);
  
  // Buscar novamente para confirmar
  const reloaded = await prisma.miniaturaBase.findUnique({
    where: { id: miniatura.id }
  });
  
  console.log('CONFIRMAÇÃO (busca novamente):');
  console.log(`Quantidade: ${reloaded.availableQuantity}`);
  
  await prisma.$disconnect();
}

testUpdate().catch(console.error);
