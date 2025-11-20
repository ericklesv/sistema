const bcrypt = require('bcryptjs');
const db = require('./src/db/database');

const adminEmail = 'admin@sistema.com';
const adminPassword = 'admin123';
const adminUsername = 'admin';

const hashedPassword = bcrypt.hashSync(adminPassword, 10);

// Aguardar a conexão do banco de dados
setTimeout(() => {
  db.run(
    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
    [adminUsername, adminEmail, hashedPassword, 'admin'],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          console.log('❌ Admin já existe!');
        } else {
          console.error('❌ Erro:', err.message);
        }
      } else {
        console.log('✅ Admin criado com sucesso!');
        console.log('Email:', adminEmail);
        console.log('Senha:', adminPassword);
        console.log('');
        console.log('⚠️  IMPORTANTE: Mude a senha após o primeiro login!');
      }
      db.close();
      process.exit(0);
    }
  );
}, 1000);
