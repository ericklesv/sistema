# 🏎️ EVS MINIS - Sistema de Gerenciamento de Miniaturas

Um sistema web completo para gerenciamento de coleção de miniaturas (Hot Wheels, Matchbox, etc.) com rastreamento de pré-vendas, garagem pessoal, estoque nos EUA e controle de envios internacionais.

![Status](https://img.shields.io/badge/status-ativo-brightgreen)
![Versão](https://img.shields.io/badge/versão-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🎯 Funcionalidades Principais

### 👤 Autenticação e Controle de Acesso
- ✅ Login e registro de usuários
- ✅ Dois tipos de papel: Cliente e Admin
- ✅ JWT com tokens de 24 horas
- ✅ Senhas criptografadas com bcryptjs

### 📦 Gerenciamento de Coleção
- ✅ **Pré-Vendas**: Miniaturas em encomenda com data de entrega
- ✅ **Garagem**: Miniaturas já adquiridas
- ✅ Campos financeiros: Valor total, valor pago, saldo devedor
- ✅ Situação de miniatura com 4 opções diferentes
- ✅ Upload de fotos com fallback de emoji
- ✅ Busca e filtros inteligentes

### 🗂️ Banco de Miniaturas
- ✅ Catálogo centralizado com até 10.000 miniaturas
- ✅ Códigos auto-gerados (0001 a 9999)
- ✅ Sistema de autocomplete para seleção
- ✅ Visualização de clientes por miniatura

### 🚚 Estoque USA
- ✅ Tabela de miniaturas em estoque nos EUA
- ✅ Rastreamento de preço e quantidade
- ✅ Peso para cálculo de envio
- ✅ Notas e observações

### ✈️ Gerenciamento de Envios
- ✅ Criar listas de envio com data, frete e impostos
- ✅ Associar miniaturas a cada envio
- ✅ Visualizar totais por envio
- ✅ Calcular custo completo

### 🔧 Painel Admin
- ✅ Gerenciamento de usuários
- ✅ Busca de clientes
- ✅ Edição de miniaturas
- ✅ Visualização de inventário

### 🌙 Interface
- ✅ Dark mode completo
- ✅ Design responsivo
- ✅ Tema EVS MINIS
- ✅ Interface intuitiva

---

## 🛠️ Stack Tecnológico

### Frontend
- React 18, Vite 5, Tailwind CSS 3, React Router 6

### Backend
- Node.js, Express.js, Prisma 5, SQLite 3

### Autenticação
- JWT, bcryptjs

---

## 📋 Pré-requisitos

- Node.js 16+
- npm
- Git

---

## 🚀 Quick Start

### 1. Clonar
```bash
git clone https://github.com/seu-usuario/sistema.git
cd sistema
```

### 2. Instalar Backend
```bash
cd server
npm install
```

### 3. Instalar Frontend
```bash
cd client
npm install
```

### 4. Configurar Ambiente
Crie `server/.env`:
```env
DATABASE_URL="file:../sistema.db"
JWT_SECRET="sua-chave-secreta-aqui-minimo-32-caracteres"
PORT=5000
```

### 5. Rodar Migrações
```bash
cd server
npx prisma migrate dev
```

### 6. Iniciar Servidores

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# http://localhost:3000
```

---

## 🔑 Login Padrão

```
Username: admin
Password: admin123
```

(Crie seu usuário na primeira vez)

---

## 📁 Estrutura

```
sistema/
├── server/                # Backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── db/
│   ├── prisma/
│   └── package.json
├── client/                # Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.jsx
│   └── package.json
└── README.md
```

---

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` - Registrar
- `POST /api/auth/login` - Login

### Miniaturas
- `GET/POST /api/miniaturas/pre-sales` - Pré-vendas
- `GET/POST /api/miniaturas/garage` - Garagem

### Admin
- `GET /api/admin/users` - Usuários
- `GET /api/admin/usa-stock` - Estoque USA
- `GET /api/admin/shipments` - Envios

---

## 🔐 Segurança

- ✅ JWT com expiração
- ✅ Hashing de senhas
- ✅ CORS configurado
- ✅ Validação de entrada
- ✅ Proteção por papel

---

## 📝 Licença

MIT License - veja LICENSE para detalhes

---

## ✨ Roadmap

- [ ] Relatórios PDF/Excel
- [ ] Notificações por email
- [ ] Dashboard com gráficos
- [ ] App mobile
- [ ] WebSockets (tempo real)

---

**Desenvolvido com ❤️ para colecionadores de miniaturas 🚗**

O cliente estará disponível em: `http://localhost:3000`

## Primeiros Passos

1. Abra `http://localhost:3000` no navegador
2. Clique em "Registre-se aqui"
3. Preencha os dados e crie sua conta
4. Faça login com suas credenciais

### Para Admin

Para acessar o painel admin, você precisa que um admin exista no banco de dados. Execute:

```bash
cd server
node scripts/create-admin.js  # (arquivo será criado)
```

Ou edite o banco de dados diretamente e mude o role de um usuário para 'admin'.

## Estrutura de Pastas

```
sistema/
├── server/
│   ├── src/
│   │   ├── controllers/     # Lógica de negócio
│   │   ├── routes/         # Endpoints da API
│   │   ├── middleware/     # Autenticação
│   │   ├── db/            # Configuração do banco
│   │   └── index.js       # Arquivo principal
│   └── package.json
└── client/
    ├── src/
    │   ├── pages/         # Páginas
    │   ├── components/    # Componentes reutilizáveis
    │   ├── context/       # Context API
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json
```

## API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login

### Miniaturas (Requer Token)
- `GET /api/miniaturas/pre-sales` - Listar pré-vendas
- `POST /api/miniaturas/pre-sales` - Adicionar pré-venda
- `DELETE /api/miniaturas/pre-sales/:id` - Deletar pré-venda
- `GET /api/miniaturas/garage` - Listar garagem
- `POST /api/miniaturas/garage` - Adicionar miniatura
- `DELETE /api/miniaturas/garage/:id` - Deletar miniatura

### Admin (Requer Token + Role Admin)
- `GET /api/admin/users` - Listar todos os usuários
- `GET /api/admin/users/:userId/pre-sales` - Pré-vendas de um usuário
- `POST /api/admin/users/:userId/pre-sales` - Adicionar pré-venda a usuário
- `PUT /api/admin/pre-sales/:id` - Atualizar pré-venda
- `DELETE /api/admin/pre-sales/:id` - Deletar pré-venda (admin)
- `GET /api/admin/users/:userId/garage` - Garagem de um usuário
- `POST /api/admin/users/:userId/garage` - Adicionar miniatura a usuário
- `PUT /api/admin/garage/:id` - Atualizar miniatura
- `DELETE /api/admin/garage/:id` - Deletar miniatura (admin)

## Variáveis de Ambiente

### Server (.env)
```
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_this
NODE_ENV=development
```

## Tecnologias

### Backend
- Express.js
- SQLite3
- JWT (jsonwebtoken)
- bcryptjs

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios

## Licença

MIT
