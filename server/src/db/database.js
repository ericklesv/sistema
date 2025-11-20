const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../sistema.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao SQLite');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Tabela de usuários
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'client',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de miniaturas de pré-venda
    db.run(`
      CREATE TABLE IF NOT EXISTS pre_sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        addedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        deliveryDate DATETIME,
        status TEXT DEFAULT 'pending',
        totalValue DECIMAL(10, 2) DEFAULT 0,
        paidValue DECIMAL(10, 2) DEFAULT 0,
        FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Tabela de miniaturas de garagem
    db.run(`
      CREATE TABLE IF NOT EXISTS garage (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        addedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        deliveryDate DATETIME,
        status TEXT DEFAULT 'pending',
        totalValue DECIMAL(10, 2) DEFAULT 0,
        paidValue DECIMAL(10, 2) DEFAULT 0,
        FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
  });
}

module.exports = db;
