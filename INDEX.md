# 📚 Índice da Documentação

## 🚀 Começar Rápido

1. **[GUIA-PT-BR.md](./GUIA-PT-BR.md)** ⭐ **LEIA PRIMEIRO**
   - Setup passo a passo
   - Como executar
   - Credenciais de teste

2. **[README.md](./README.md)**
   - Visão geral do projeto
   - Requisitos
   - Estrutura de pastas

---

## 📖 Documentação Detalhada

### Backend

- **[server/README.md](./server/README.md)** - Documentação do servidor
- **[API-DOCS.md](./API-DOCS.md)** - Endpoints e exemplos da API

### Frontend

- **[client/README.md](./client/README.md)** - Documentação do cliente
- **[CUSTOMIZATION.md](./CUSTOMIZATION.md)** - Guia de personalização

---

## 🎯 Scripts Disponíveis

### Inicialização

| Script | Plataforma | Descrição |
|--------|-----------|-----------|
| `setup.bat` | Windows | Instala dependências |
| `setup.sh` | macOS/Linux | Instala dependências |
| `start.bat` | Windows | Inicia ambos os servidores |
| `start.sh` | macOS/Linux | Inicia ambos os servidores |

### Admin

| Script | Função |
|--------|--------|
| `server/create-admin.js` | Cria usuário admin |
| `server/seed-data.js` | Carrega dados de teste |

---

## 📁 Estrutura de Arquivos

```
sistema/
├── 📄 GUIA-PT-BR.md          ⭐ Comece por aqui!
├── 📄 README.md               Visão geral
├── 📄 API-DOCS.md            Documentação da API
├── 📄 CUSTOMIZATION.md       Guia de personalização
├── 📄 INDEX.md               Este arquivo
├── 🚀 setup.bat              Setup Windows
├── 🚀 setup.sh               Setup macOS/Linux
├── 🚀 start.bat              Start Windows
├── 🚀 start.sh               Start macOS/Linux
│
├── 📂 server/                Backend (Node.js)
│   ├── 📄 package.json
│   ├── 📄 .env              Variáveis de ambiente
│   ├── 📄 README.md         Docs do servidor
│   ├── 🚀 create-admin.js   Criar admin
│   ├── 🚀 seed-data.js      Dados de teste
│   └── 📁 src/
│       ├── 📄 index.js      Servidor principal
│       ├── 📁 db/
│       │   └── database.js  Config SQLite
│       ├── 📁 routes/       Endpoints
│       ├── 📁 controllers/  Lógica
│       └── 📁 middleware/   Autenticação
│
├── 📂 client/               Frontend (React)
│   ├── 📄 package.json
│   ├── 📄 index.html
│   ├── 📄 vite.config.js
│   ├── 📄 tailwind.config.js
│   ├── 📄 README.md        Docs do cliente
│   └── 📁 src/
│       ├── 📄 App.jsx
│       ├── 📄 main.jsx
│       ├── 📄 index.css
│       ├── 📁 pages/       Páginas
│       ├── 📁 components/  Componentes
│       └── 📁 context/     State Management
│
└── 📂 .vscode/             Configuração VS Code
    ├── tasks.json         Tasks automáticas
    └── extensions.json    Extensões recomendadas
```

---

## 🚀 Fluxo de Execução

### 1️⃣ Primeira Vez

```bash
# Windows
setup.bat

# macOS/Linux
bash setup.sh
```

### 2️⃣ Iniciar Projeto

```bash
# Windows
start.bat

# macOS/Linux
bash start.sh
```

### 3️⃣ Acessar

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API: http://localhost:5000/api

---

## 👥 Usuários de Teste

### Admin

```
Email: admin@sistema.com
Senha: admin123
```

### Cliente 1

```
Email: cliente1@exemplo.com
Senha: senha123
```

### Cliente 2

```
Email: cliente2@exemplo.com
Senha: senha123
```

**⚠️ Crie com:** `node seed-data.js`

---

## 🎯 Próximas Etapas Recomendadas

1. ✅ Execute `setup.bat` (ou .sh)
2. ✅ Execute `start.bat` (ou .sh)
3. ✅ Acesse http://localhost:3000
4. ✅ Registre-se ou use credenciais de teste
5. ✅ Explore o painel de admin
6. ✅ Leia [CUSTOMIZATION.md](./CUSTOMIZATION.md) para personalizar

---

## 💡 Dicas Importantes

- 📱 Sistema é totalmente responsivo (mobile, tablet, desktop)
- 🌙 Dark mode ativa/desativa automaticamente
- 🔐 Senhas são criptografadas com bcrypt
- 🗄️ Dados salvos localmente em `sistema.db`
- 🚀 Pronto para expandir e customizar

---

## 📞 Troubleshooting

### Node.js não encontrado
- Instale em: https://nodejs.org/
- Reinicie o computador

### Portas ocupadas
- Mude em `.env` (server) ou `vite.config.js` (client)

### Erro ao executar setup
- Use terminal com privilégios de administrador
- Verifique antivírus (pode bloquear npm)

---

## 📚 Documentação Externa

- [Express.js](https://expressjs.com)
- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [SQLite](https://www.sqlite.org)
- [JWT](https://jwt.io)

---

**Bem-vindo ao Sistema de Miniaturas! 🎉**

Qualquer dúvida, consulte os arquivos de documentação acima.
