# 📁 Estrutura Completa do Projeto

```
sistema/
│
├── 📄 Documentação e Guides
├── ├── RESUMO.md                 ⭐ COMECE AQUI - Resumo executivo
├── ├── GUIA-PT-BR.md             ⭐ LEIA ESTE - Guia completo em português
├── ├── README.md                 Visão geral do projeto
├── ├── API-DOCS.md               Documentação completa da API
├── ├── CUSTOMIZATION.md          Guia de personalização
├── ├── INDEX.md                  Índice de documentação
├── └── CHECKLIST.md              Checklist de implementação
│
├── 🚀 Scripts de Inicialização
├── ├── setup.bat                 Setup para Windows (execute uma vez)
├── ├── setup.sh                  Setup para macOS/Linux (execute uma vez)
├── ├── start.bat                 Iniciar para Windows (execute depois)
├── └── start.sh                  Iniciar para macOS/Linux (execute depois)
│
├── 📂 server/                    Backend - Node.js/Express
│
│   ├── 📄 Configuração
│   ├── ├── package.json          Dependências do backend
│   ├── ├── .env                  Variáveis de ambiente (JWT_SECRET, PORT)
│   ├── ├── .gitignore            O que não commitar
│   ├── ├── .eslintrc.json        Config de linting
│   ├── └── README.md             Documentação do backend
│   │
│   ├── 🚀 Scripts
│   ├── ├── create-admin.js       Criar usuário admin
│   ├── └── seed-data.js          Carregar dados de teste
│   │
│   └── 📁 src/                   Código fonte
│       │
│       ├── 📄 index.js           Servidor principal (Express)
│       │
│       ├── 📁 db/
│       │   └── database.js       Conexão SQLite + init tabelas
│       │
│       ├── 📁 middleware/
│       │   └── auth.js           Validação JWT
│       │
│       ├── 📁 routes/
│       │   ├── auth.js           Rotas: login, register
│       │   ├── miniatura.js      Rotas: pré-vendas, garagem
│       │   └── admin.js          Rotas: gerenciar clientes
│       │
│       └── 📁 controllers/
│           ├── authController.js       Login, Registro
│           ├── miniaturaController.js  Pré-vendas, Garagem (cliente)
│           └── adminController.js      Gerenciar dados (admin)
│
├── 📂 client/                   Frontend - React/Vite
│
│   ├── 📄 Configuração
│   ├── ├── package.json          Dependências do frontend
│   ├── ├── index.html            HTML principal
│   ├── ├── vite.config.js        Configuração Vite + proxy API
│   ├── ├── tailwind.config.js    Configuração Tailwind CSS
│   ├── ├── postcss.config.js     Processamento CSS
│   ├── ├── .gitignore            O que não commitar
│   ├── ├── .eslintrc.json        Config de linting
│   ├── └── README.md             Documentação do frontend
│   │
│   ├── 📁 public/
│   │   └── README.md             Coloque imagens e assets aqui
│   │
│   └── 📁 src/
│       │
│       ├── 📄 App.jsx            Componente raiz + Router
│       ├── 📄 main.jsx           Entry point React
│       ├── 📄 index.css          Estilos globais + Tailwind
│       │
│       ├── 📁 context/
│       │   └── AuthContext.jsx   Estado global (user, login, logout)
│       │
│       ├── 📁 components/        Componentes reutilizáveis
│       │   ├── Navbar.jsx        Barra de navegação
│       │   ├── DarkModeToggle.jsx Botão dark mode
│       │   └── MiniaturaThumbnail.jsx Card de miniatura
│       │
│       └── 📁 pages/             Páginas da aplicação
│           ├── LoginPage.jsx     Tela de login
│           ├── RegisterPage.jsx  Tela de registro
│           ├── DashboardPage.jsx Dashboard do cliente (2 abas)
│           └── AdminPage.jsx     Painel do admin
│
├── 📂 .vscode/                   Configuração VS Code
│   ├── tasks.json               Tasks automáticas (build, run)
│   └── extensions.json          Extensões recomendadas
│
└── 📄 ESTE ARQUIVO             Você está aqui!
```

---

## 📊 Componentes e Páginas

### Estrutura do React

```
App (Router)
├── LoginPage          /login        (Público)
├── RegisterPage       /register     (Público)
├── DashboardPage      /            (Privado) ← Clientes
│   ├── Navbar
│   ├── DarkModeToggle
│   └── MiniaturaThumbnail x N
└── AdminPage          /admin       (Privado + Admin) ← Admin
    ├── Navbar
    ├── DarkModeToggle
    ├── Lista de Usuários (sidebar)
    └── Tabela de Miniaturas
```

---

## 📡 Estrutura da API

```
/api
├── /auth               (Público)
│   ├── POST /register
│   └── POST /login
│
├── /miniaturas         (Privado)
│   ├── GET /pre-sales
│   ├── POST /pre-sales
│   ├── DELETE /pre-sales/:id
│   ├── GET /garage
│   ├── POST /garage
│   └── DELETE /garage/:id
│
└── /admin              (Privado + Admin)
    ├── GET /users
    ├── GET /users/:userId/pre-sales
    ├── POST /users/:userId/pre-sales
    ├── PUT /pre-sales/:id
    ├── DELETE /pre-sales/:id
    ├── GET /users/:userId/garage
    ├── POST /users/:userId/garage
    ├── PUT /garage/:id
    └── DELETE /garage/:id
```

---

## 🗄️ Estrutura do Banco de Dados (SQLite)

```
sistema.db
│
├── Tabela: users
│   ├── id (PK)
│   ├── username (UNIQUE)
│   ├── email (UNIQUE)
│   ├── password (hash)
│   ├── role (admin | client)
│   └── createdAt
│
├── Tabela: pre_sales
│   ├── id (PK)
│   ├── userId (FK → users)
│   ├── name
│   ├── description
│   ├── addedDate
│   ├── deliveryDate
│   └── status
│
└── Tabela: garage
    ├── id (PK)
    ├── userId (FK → users)
    ├── name
    ├── description
    ├── addedDate
    ├── deliveryDate
    └── status
```

---

## 🔄 Fluxo de Autenticação

```
1. Usuário clica em "Registrar"
   ↓
2. AuthContext recebe dados
   ↓
3. axios POST /api/auth/register
   ↓
4. Backend criptografa senha (bcrypt)
   ↓
5. Usuário salvo no banco (users)
   ↓
6. Redireciona para /login

---

1. Usuário clica em "Entrar"
   ↓
2. axios POST /api/auth/login
   ↓
3. Backend verifica credenciais
   ↓
4. Backend gera JWT token (24h)
   ↓
5. Frontend recebe token
   ↓
6. AuthContext salva em localStorage
   ↓
7. Token enviado em Authorization header
   ↓
8. Acesso ao dashboard garantido
```

---

## 🚀 Como Executar

### Primeira Vez
```bash
setup.bat    # Windows
# ou
bash setup.sh # macOS/Linux
```

### Próximas Vezes
```bash
start.bat    # Windows
# ou
bash start.sh # macOS/Linux
```

Acesse: **http://localhost:3000**

---

## 💾 Banco de Dados

- **Local**: `sistema.db` (raiz do projeto)
- **Tipo**: SQLite (sem servidor)
- **Criado**: Automaticamente na primeira execução
- **Backup**: Copie o arquivo `sistema.db`

---

## 🔐 Variáveis Importantes

### Server `.env`
```
PORT=5000                              # Porta do servidor
JWT_SECRET=sua_chave_secreta_complexa  # Chave JWT
NODE_ENV=development                   # Ambiente
```

### Client `vite.config.js`
```
server.port=3000                       # Porta frontend
proxy: '/api' → 'http://localhost:5000' # Proxy API
```

---

## 📦 Tamanho do Projeto

```
node_modules/  (Não incluído, cria com setup)
server/        ~100KB (sem node_modules)
client/        ~200KB (sem node_modules)
Docs/          ~500KB
Total:         ~800KB + node_modules
```

---

## ✨ Próximas Implementações (Opcional)

- Upload de fotos
- Notificações por email
- Relatórios em PDF
- Filtros avançados
- Paginação
- Exportar Excel
- Chat em tempo real
- Deploy online

---

**Projeto Completo e Pronto para Usar!** 🎉

Comece agora com `setup.bat` ou `bash setup.sh`
