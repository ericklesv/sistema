const db = require('../db/database');

// Obter todos os usuários (admin)
exports.getAllUsers = (req, res) => {
  db.all('SELECT id, username, email, role, createdAt FROM users', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
    res.json(rows);
  });
};

// Obter todas as pré-vendas de um usuário (admin)
exports.getUserPreSales = (req, res) => {
  const { userId } = req.params;

  db.all(
    'SELECT * FROM pre_sales WHERE userId = ? ORDER BY addedDate DESC',
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar dados' });
      }
      res.json(rows);
    }
  );
};

// Adicionar pré-venda para um cliente (admin)
exports.addPreSaleToUser = (req, res) => {
  const { userId } = req.params;
  const { name, description, deliveryDate, totalValue, paidValue } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Nome da miniatura é obrigatório' });
  }

  db.run(
    'INSERT INTO pre_sales (userId, name, description, deliveryDate, totalValue, paidValue) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, name, description, deliveryDate || null, parseFloat(totalValue) || 0, parseFloat(paidValue) || 0],
    function (err) {
      if (err) {
        console.error('Erro ao inserir pré-venda:', err);
        return res.status(500).json({ error: 'Erro ao adicionar pré-venda: ' + err.message });
      }
      res.status(201).json({ id: this.lastID, message: 'Pré-venda adicionada' });
    }
  );
};

// Atualizar pré-venda (admin)
exports.updatePreSale = (req, res) => {
  const { id } = req.params;
  const { name, description, deliveryDate, status } = req.body;

  db.run(
    'UPDATE pre_sales SET name = ?, description = ?, deliveryDate = ?, status = ? WHERE id = ?',
    [name, description, deliveryDate, status, id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao atualizar' });
      }
      res.json({ message: 'Pré-venda atualizada' });
    }
  );
};

// Deletar pré-venda (admin)
exports.deletePreSaleAdmin = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM pre_sales WHERE id = ?', [id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao deletar' });
    }
    res.json({ message: 'Pré-venda deletada' });
  });
};

// Obter todas as miniaturas de garagem de um usuário (admin)
exports.getUserGarage = (req, res) => {
  const { userId } = req.params;

  db.all(
    'SELECT * FROM garage WHERE userId = ? ORDER BY addedDate DESC',
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar dados' });
      }
      res.json(rows);
    }
  );
};

// Adicionar miniatura de garagem para um cliente (admin)
exports.addGarageToUser = (req, res) => {
  const { userId } = req.params;
  const { name, description, deliveryDate, totalValue, paidValue } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Nome da miniatura é obrigatório' });
  }

  db.run(
    'INSERT INTO garage (userId, name, description, deliveryDate, totalValue, paidValue) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, name, description, deliveryDate || null, parseFloat(totalValue) || 0, parseFloat(paidValue) || 0],
    function (err) {
      if (err) {
        console.error('Erro ao inserir garagem:', err);
        return res.status(500).json({ error: 'Erro ao adicionar miniatura: ' + err.message });
      }
      res.status(201).json({ id: this.lastID, message: 'Miniatura adicionada' });
    }
  );
};

// Atualizar miniatura de garagem (admin)
exports.updateGarage = (req, res) => {
  const { id } = req.params;
  const { name, description, deliveryDate, status } = req.body;

  db.run(
    'UPDATE garage SET name = ?, description = ?, deliveryDate = ?, status = ? WHERE id = ?',
    [name, description, deliveryDate, status, id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao atualizar' });
      }
      res.json({ message: 'Miniatura atualizada' });
    }
  );
};

// Deletar miniatura de garagem (admin)
exports.deleteGarageAdmin = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM garage WHERE id = ?', [id], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao deletar' });
    }
    res.json({ message: 'Miniatura deletada' });
  });
};

// Criar novo cliente (admin)
exports.createClient = (req, res) => {
  const bcrypt = require('bcryptjs');
  const { username, email, password } = req.body;

  console.log('📝 Criando cliente: ', { username, email, password: password ? '***' : 'vazio' });

  if (!username || !email || !password) {
    console.log('❌ Campos faltando');
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
    [username, email, hashedPassword, 'client'],
    function (err) {
      if (err) {
        console.error('❌ Erro SQL:', err.message);
        if (err.message.includes('UNIQUE constraint failed')) {
          if (err.message.includes('email')) {
            return res.status(400).json({ error: 'Email já existe' });
          }
          if (err.message.includes('username')) {
            return res.status(400).json({ error: 'Username já existe' });
          }
        }
        return res.status(500).json({ error: 'Erro ao criar cliente: ' + err.message });
      }
      console.log('✅ Cliente criado com ID:', this.lastID);
      res.status(201).json({ id: this.lastID, message: 'Cliente criado com sucesso' });
    }
  );
};
