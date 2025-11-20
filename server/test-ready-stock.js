const axios = require('axios');

async function test() {
  try {
    // 1. Fazer login
    console.log('🔐 Fazendo login...');
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@sistema.com',
      password: 'admin123'
    });

    const token = loginRes.data.token;
    console.log('✅ Token obtido:', token.substring(0, 20) + '...');

    // 2. Adicionar item ao ReadyStock
    console.log('\n📦 Adicionando item ao ReadyStock...');
    const addRes = await axios.post(
      'http://localhost:5000/api/admin/ready-stock',
      {
        name: 'Ferrari Test',
        brand: 'Bburago',
        quantity: 1,
        price: 150,
        notes: 'Teste'
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log('✅ Item adicionado:', addRes.data);

    // 3. Listar itens
    console.log('\n📋 Listando itens...');
    const listRes = await axios.get(
      'http://localhost:5000/api/admin/ready-stock',
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log('✅ Total de itens:', listRes.data.length);
    console.log('Itens:', listRes.data);

  } catch (err) {
    console.error('❌ Erro:', err.response?.data || err.message);
  }
}

test();
