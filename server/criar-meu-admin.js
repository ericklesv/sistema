require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = 'ericklesvn@gmail.com';
    const password = 'montagem95';
    const username = 'erickles';

    console.log('🔐 Criando usuário admin...\n');

    // Verificar se já existe
    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      console.log('⚠️  Usuário já existe! Atualizando senha...');
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          role: 'admin'
        }
      });
      
      console.log('✅ Senha atualizada com sucesso!');
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role: 'admin'
        }
      });

      console.log('✅ Admin criado com sucesso!');
    }

    console.log('\n📧 Email:', email);
    console.log('🔑 Senha:', password);
    console.log('👤 Usuário:', username);
    console.log('\n✅ Pronto para usar!\n');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
