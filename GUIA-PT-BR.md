# 🚗 Sistema de Miniaturas - Guia Completo

## O que você recebeu

Um sistema web **completo e funcional** para gerenciar miniaturas com:

✅ **Login/Registro** de clientes
✅ **Dashboard** com 2 listas: PRÉ-VENDAS e GARAGEM  
✅ **Painel Admin** para gerenciar dados dos clientes
✅ **Dark Mode** ativável/desativável
✅ **Banco de Dados** SQLite (local, sem configuração)
✅ **Servidor Local** em localhost:5000 e localhost:3000

---

## ⚙️ Requisitos

1. **Node.js** - [Baixar aqui](https://nodejs.org/)
   - Escolha a versão LTS (recomendado)
   - Instale normalmente

---

## 🚀 Instalação e Execução (Rápido)

### Opção 1: Windows (COM GUI)

1. Abra a pasta `sistema` no Windows Explorer
2. **Clique duplo** no arquivo `setup.bat`
3. Aguarde a instalação terminar

### Opção 2: Terminal (Qualquer SO)

```bash
# Abra a pasta do projeto
cd c:\Users\Erickles\Documents\sistema

# Windows
setup.bat

# macOS/Linux
bash setup.sh
```

---

## ▶️ Executando o Projeto

### Opção 1: Inicialização Rápida (Automática)

**Windows:**
```bash
start.bat
```

**macOS/Linux:**
```bash
bash start.sh
```

Isso abrirá 2 abas do terminal automaticamente com os servidores rodando.

### Opção 2: Manual (2 Terminais)

**Terminal 1 - Backend (Servidor):**

```bash
cd server
npm run dev
```

Você verá:
```
Conectado ao SQLite
Servidor rodando em http://localhost:5000
```

**Terminal 2 - Frontend (Interface):**

```bash
cd client
npm run dev
```

Você verá:
```
  ➜  Local:   http://localhost:3000/
```

---

## 🌐 Acessando o Sistema

1. **Abra no navegador**: http://localhost:3000
2. **Clique em "Registre-se aqui"**
3. Preencha os dados:
   - Usuário: seu nome
   - Email: seu@email.com
   - Senha: sua_senha

---

## 👨‍💼 Acessando o Painel Admin

### Opção 1: Criar Admin Manualmente

```bash
cd server
node create-admin.js
```

Credenciais padrão:
- **Email**: admin@sistema.com
- **Senha**: admin123

### Opção 2: Carregar Dados de Exemplo

Cria automaticamente 1 admin e 2 clientes com dados de teste:

```bash
cd server
node seed-data.js
```

Credenciais criadas:
- **Admin**: admin@sistema.com / admin123
- **Cliente 1**: cliente1@exemplo.com / senha123
- **Cliente 2**: cliente2@exemplo.com / senha123

**⚠️ Importante**: Mude as senhas após o primeiro login!

Depois faça login com essas credenciais, e verá um botão "Admin" na barra superior.

---

## 📋 Funcionalidades

### Para Clientes

1. **Visualizar suas miniaturas** em 2 categorias:
   - 📋 **PRÉ-VENDAS** - Itens em processo
   - 🚗 **GARAGEM** - Itens em estoque

2. **Cada miniatura mostra**:
   - Nome
   - Data de adição
   - Data de entrega prevista
   - Status

3. **Adicionar novos itens** com o botão "+ Adicionar"

4. **Dark Mode** - Ativar/desativar com o botão 🌙/☀️

### Para Admin

1. **Selecionar cliente** na sidebar esquerda
2. **Gerenciar suas miniaturas**:
   - Adicionar itens
   - Deletar itens
   - Ver status

3. **Listar todos os clientes**
4. **Acesso total aos dados**

---

## 📦 Dados Armazenados

Todas as informações são salvas no arquivo:
```
c:\Users\Erickles\Documents\sistema\sistema.db
```

Esse é o **banco de dados SQLite**. Não delete!

---

## 🛠️ Estrutura do Projeto

```
sistema/
├── server/                   # Backend (Node.js)
│   ├── src/
│   │   ├── db/
│   │   │   └── database.js   # Banco de dados
│   │   ├── controllers/      # Lógica
│   │   ├── routes/          # Endpoints
│   │   └── index.js         # Servidor principal
│   ├── create-admin.js       # Script para criar admin
│   └── package.json
│
├── client/                   # Frontend (React)
│   ├── src/
│   │   ├── pages/           # Páginas
│   │   ├── components/      # Componentes
│   │   ├── context/         # Estado global
│   │   └── App.jsx          # App principal
│   └── package.json
│
├── setup.bat                 # Setup automático (Windows)
└── README.md                 # Documentação
```

---

## 🔐 Segurança

- Senhas criptografadas com bcrypt
- Tokens JWT para autenticação
- Dados armazenados localmente
- Admin pode gerenciar todos os clientes

---

## 🐛 Troubleshooting

### Erro: "npm não é reconhecido"

**Solução**: Node.js não está instalado ou não foi adicionado ao PATH
- Reinstale Node.js
- Reinicie o computador depois

### Erro: "Porta 5000/3000 já em uso"

**Solução**: Mude a porta nos arquivos:
- Server: `server/.env` (trocar `PORT=5000`)
- Client: `client/vite.config.js` (trocar `port: 3000`)

### Banco de dados vazio

**Solução**: Criará tabelas automaticamente na primeira execução

---

## 💡 Próximos Passos

1. **Customize as cores** no Tailwind CSS (`client/tailwind.config.js`)
2. **Adicione logotipos** na pasta `client/public`
3. **Mude as credenciais** de admin
4. **Teste com vários clientes**

---

## 📞 Suporte

Se tiver problemas:

1. Verifique se Node.js está instalado: `node --version`
2. Verifique se npm está disponível: `npm --version`
3. Veja os logs no terminal (mostra os erros)
4. Confirme que executou `setup.bat` ou `setup.sh`

---

**Divirta-se com seu sistema! 🎉**
