const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('📝 Criando usuários...');

    // Criar admin
    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@sistema.com',
        password: bcrypt.hashSync('admin123', 10),
        role: 'admin'
      }
    });
    console.log('✅ Usuário criado: admin');

    // Criar clientes
    const cliente1 = await prisma.user.create({
      data: {
        username: 'cliente1',
        email: 'cliente1@exemplo.com',
        password: bcrypt.hashSync('senha123', 10),
        role: 'client'
      }
    });
    console.log('✅ Usuário criado: cliente1');

    const cliente2 = await prisma.user.create({
      data: {
        username: 'cliente2',
        email: 'cliente2@exemplo.com',
        password: bcrypt.hashSync('senha123', 10),
        role: 'client'
      }
    });
    console.log('✅ Usuário criado: cliente2');

    console.log('\n📋 Adicionando dados de exemplo...');

    // Pré-vendas para cliente1
    await prisma.preSale.create({
      data: {
        userId: cliente1.id,
        name: 'Ferrari F40',
        description: 'Escala 1:18 - Vermelha',
        deliveryDate: new Date('2024-12-25'),
        totalValue: 250.00,
        paidValue: 100.00
      }
    });
    console.log('✅ Pré-venda adicionada: Ferrari F40');

    await prisma.preSale.create({
      data: {
        userId: cliente1.id,
        name: 'Lamborghini Countach',
        description: 'Escala 1:24 - Amarela',
        deliveryDate: new Date('2025-01-10'),
        totalValue: 180.00,
        paidValue: 50.00
      }
    });
    console.log('✅ Pré-venda adicionada: Lamborghini Countach');

    // Garagem para cliente1
    await prisma.garage.create({
      data: {
        userId: cliente1.id,
        name: 'Mustang 1969',
        description: 'Escala 1:18 - Azul',
        deliveryDate: new Date('2024-11-25'),
        totalValue: 320.00,
        paidValue: 320.00
      }
    });
    console.log('✅ Miniatura adicionada: Mustang 1969');

    // Garagem para cliente2
    await prisma.garage.create({
      data: {
        userId: cliente2.id,
        name: 'BMW M3',
        description: 'Escala 1:24 - Preto',
        deliveryDate: new Date('2024-11-30'),
        totalValue: 150.00,
        paidValue: 150.00
      }
    });
    console.log('✅ Miniatura adicionada: BMW M3');

    await prisma.garage.create({
      data: {
        userId: cliente2.id,
        name: 'Corvette C3',
        description: 'Escala 1:18 - Vermelho',
        deliveryDate: new Date('2025-01-15'),
        totalValue: 280.00,
        paidValue: 80.00
      }
    });
    console.log('✅ Miniatura adicionada: Corvette C3');

    // Pré-venda para cliente2
    await prisma.preSale.create({
      data: {
        userId: cliente2.id,
        name: 'Porsche 911',
        description: 'Escala 1:18 - Prata',
        deliveryDate: new Date('2025-02-20'),
        totalValue: 350.00,
        paidValue: 0.00
      }
    });
    console.log('✅ Pré-venda adicionada: Porsche 911');

    console.log('\n═══════════════════════════════════════════');
    console.log('✅ Dados de exemplo adicionados com sucesso!');
    console.log('═══════════════════════════════════════════\n');

    console.log('Credenciais para teste:\n');
    console.log('👨‍💼 Admin:');
    console.log('   Email: admin@sistema.com');
    console.log('   Senha: admin123\n');

    console.log('👤 Cliente 1:');
    console.log('   Email: cliente1@exemplo.com');
    console.log('   Senha: senha123\n');

    console.log('👤 Cliente 2:');
    console.log('   Email: cliente2@exemplo.com');
    console.log('   Senha: senha123\n');
  } catch (error) {
    console.error('Erro ao adicionar dados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
