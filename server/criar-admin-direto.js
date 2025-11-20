const bcrypt = require('bcryptjs');
const { Client } = require('pg');

const connectionString = 'postgresql://evsminis_user:0oo4NMIOfXG9q2Cv5RHRr9SCDPmKog0I@dpg-d4fo7i49c44c73btobe0-a.oregon-postgres.render.com/evsminis';

async function createAdmin() {
  const client = new Client({ 
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    await client.connect();
    console.log('🔗 Conectado ao PostgreSQL\n');

    const email = 'ericklesvn@gmail.com';
    const password = 'montagem95';
    const username = 'erickles';
    
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tentar inserir
    const query = `
      INSERT INTO users (username, email, password, role, "createdAt")
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (email) 
      DO UPDATE SET password = $3, role = $4
      RETURNING id, username, email, role
    `;

    const result = await client.query(query, [username, email, hashedPassword, 'admin']);
    
    console.log('✅ Admin criado/atualizado com sucesso!\n');
    console.log('📧 Email:', email);
    console.log('🔑 Senha:', password);
    console.log('👤 Usuário:', username);
    console.log('🎯 Role:', result.rows[0].role);
    console.log('\n✅ Pode fazer login agora!\n');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

createAdmin();
