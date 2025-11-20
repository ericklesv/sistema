require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function createAdmin() {
  try {
    console.log('\n🔐 Criar Usuário Admin\n');

    const username = await question('Nome de usuário: ');
    const email = await question('Email: ');
    const whatsapp = await question('WhatsApp (opcional): ');
    const password = await question('Senha: ');

    if (!username || !email || !password) {
      console.log('❌ Nome, email e senha são obrigatórios!');
      process.exit(1);
    }

    // Verificar se já existe
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username }
        ]
      }
    });

    if (existing) {
      console.log('❌ Já existe um usuário com esse email ou nome de usuário!');
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        username,
        email,
        whatsapp: whatsapp || null,
        password: hashedPassword,
        role: 'admin'
      }
    });

    console.log('\n✅ Admin criado com sucesso!');
    console.log('📧 Email:', admin.email);
    console.log('👤 Usuário:', admin.username);
    console.log('\n⚠️  Guarde essas credenciais em um lugar seguro!\n');

  } catch (error) {
    console.error('❌ Erro ao criar admin:', error.message);
  } finally {
    await prisma.$disconnect();
    rl.close();
    process.exit(0);
  }
}

createAdmin();
