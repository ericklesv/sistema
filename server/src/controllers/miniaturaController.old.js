const db = require('../db/database');

// Obter todas as pré-vendas do usuário
exports.getPreSales = (req, res) => {
  const userId = req.user.id;

  db.all(
    'SELECT * FROM pre_sales WHERE userId = ? ORDER BY addedDate DESC',
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar pré-vendas' });
      }
      res.json(rows);
    }
  );
};

// Adicionar pré-venda
exports.addPreSale = (req, res) => {
  const { name, description, deliveryDate, totalValue, paidValue } = req.body;
  const userId = req.user.id;

  if (!name) {
    return res.status(400).json({ error: 'Nome da miniatura obrigatório' });
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

// Deletar pré-venda
exports.deletePreSale = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.run(
    'DELETE FROM pre_sales WHERE id = ? AND userId = ?',
    [id, userId],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao deletar pré-venda' });
      }
      res.json({ message: 'Pré-venda deletada' });
    }
  );
};

// Obter todas as miniaturas de garagem
exports.getGarage = (req, res) => {
  const userId = req.user.id;

  db.all(
    'SELECT * FROM garage WHERE userId = ? ORDER BY addedDate DESC',
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar garagem' });
      }
      res.json(rows);
    }
  );
};

// Adicionar miniatura de garagem
exports.addGarage = (req, res) => {
  const { name, description, deliveryDate, totalValue, paidValue } = req.body;
  const userId = req.user.id;

  if (!name) {
    return res.status(400).json({ error: 'Nome da miniatura obrigatório' });
  }

  db.run(
    'INSERT INTO garage (userId, name, description, deliveryDate, totalValue, paidValue) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, name, description, deliveryDate || null, parseFloat(totalValue) || 0, parseFloat(paidValue) || 0],
    function (err) {
      if (err) {
        console.error('Erro ao inserir garagem:', err);
        return res.status(500).json({ error: 'Erro ao adicionar miniatura: ' + err.message });
      }
      res.status(201).json({ id: this.lastID, message: 'Miniatura adicionada à garagem' });
    }
  );
};

// Deletar miniatura de garagem
exports.deleteGarage = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.run(
    'DELETE FROM garage WHERE id = ? AND userId = ?',
    [id, userId],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao deletar miniatura' });
      }
      res.json({ message: 'Miniatura deletada' });
    }
  );
};
