const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listAdmins() {
  try {
    const admins = await prisma.user.findMany({
      where: { role: 'admin' }
    });

    console.log('\n=== USUÁRIOS ADMIN ===\n');
    
    if (admins.length === 0) {
      console.log('❌ Nenhum admin encontrado no banco de dados\n');
    } else {
      admins.forEach(admin => {
        console.log('📧 Email:', admin.email);
        console.log('👤 Username:', admin.username);
        console.log('📱 WhatsApp:', admin.whatsapp || 'Não informado');
        console.log('📅 Criado em:', new Date(admin.createdAt).toLocaleDateString('pt-BR'));
        console.log('---');
      });
      console.log(`\nTotal: ${admins.length} admin(s)\n`);
    }
  } catch (error) {
    console.error('Erro ao buscar admins:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listAdmins();
