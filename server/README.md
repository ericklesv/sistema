# Backend - Sistema de Miniaturas

Servidor Node.js/Express para gerenciar miniaturas com autenticação JWT e banco de dados SQLite.

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:5000`

## Produção

```bash
npm start
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```
PORT=5000
JWT_SECRET=sua_chave_secreta_aqui
NODE_ENV=development
```

## Estrutura

- `src/index.js` - Arquivo principal
- `src/db/database.js` - Conexão e inicialização do SQLite
- `src/controllers/` - Lógica de negócio
- `src/routes/` - Endpoints da API
- `src/middleware/` - Middlewares (autenticação, etc)

## Documentação Completa

Veja `../README.md` para detalhes sobre a API completa.
