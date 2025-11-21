const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function resetPassword() {
  try {
    const email = 'ericklesvn@gmail.com';
    const newPassword = '123456';
    
    console.log('\n🔄 Resetando senha...\n');
    
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    
    const user = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });
    
    console.log('✅ Senha resetada com sucesso!\n');
    console.log('📧 Email:', email);
    console.log('🔑 Nova senha:', newPassword);
    console.log('\nUse essas credenciais para fazer login.\n');
    
  } catch (error) {
    console.error('❌ Erro ao resetar senha:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();
