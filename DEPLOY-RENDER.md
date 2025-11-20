# 🚀 Deploy no Render - EVS MINIS

## 📋 Pré-requisitos
- Conta no [Render](https://render.com) conectada ao GitHub
- Repositório: `https://github.com/ericklesv/sistema`

---

## 🗄️ PASSO 1: Criar Banco de Dados PostgreSQL

1. Acesse o [Dashboard do Render](https://dashboard.render.com)
2. Clique em **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name:** `evsminis-database`
   - **Database:** `evsminis`
   - **Region:** Ohio (US East)
   - **Plan:** Free
4. Clique em **"Create Database"**
5. Aguarde ficar "Available" (~2 minutos)
6. **COPIE a "Internal Database URL"** (começa com `postgresql://`)
   - Exemplo: `postgresql://evsminis_user:abc123@dpg-xxxxx-a.ohio-postgres.render.com/evsminis`

---

## 🖥️ PASSO 2: Deploy do Backend (API)

1. No dashboard, clique em **"New +"** → **"Web Service"**
2. Conecte o repositório: `ericklesv/sistema`
3. Configure:
   - **Name:** `evsminis-api`
   - **Region:** Ohio (US East)
   - **Branch:** `main`
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:** 
     ```
     npm install && npx prisma generate && npx prisma migrate deploy
     ```
   - **Start Command:** 
     ```
     npm start
     ```
   - **Plan:** Free

4. **Environment Variables** (clique em "Add Environment Variable"):
   ```
   DATABASE_URL = [COLE A INTERNAL DATABASE URL AQUI]
   JWT_SECRET = evsminis2025secret
   NODE_ENV = production
   FRONTEND_URL = https://evsminis-app.onrender.com
   ```

5. Clique em **"Create Web Service"**
6. Aguarde o deploy (~5-10 minutos)
7. **COPIE A URL** (ex: `https://evsminis-api.onrender.com`)
8. **Teste:** Acesse `https://evsminis-api.onrender.com/api/health`

---

## 🎨 PASSO 3: Deploy do Frontend

1. No dashboard, clique em **"New +"** → **"Static Site"**
2. Conecte o repositório: `ericklesv/sistema`
3. Configure:
   - **Name:** `evsminis-app`
   - **Branch:** `main`
   - **Root Directory:** `client`
   - **Build Command:** 
     ```
     npm install && npm run build
     ```
   - **Publish Directory:** `dist`

4. **Environment Variables**:
   ```
   VITE_API_URL = [COLE A URL DO BACKEND AQUI]
   ```
   Exemplo: `https://evsminis-api.onrender.com`

5. Clique em **"Create Static Site"**
6. Aguarde o deploy (~3-5 minutos)
7. **SUA URL FINAL:** `https://evsminis-app.onrender.com`

---

## 🔄 PASSO 4: Atualizar CORS no Backend

1. Vá no **Web Service do Backend** (evsminis-api)
2. Vá em **"Environment"**
3. Edite a variável `FRONTEND_URL` e coloque a URL real do frontend
4. Salve (o backend vai reiniciar automaticamente)

---

## ✅ PASSO 5: Criar Usuário Admin

1. No **Web Service do Backend**, vá na aba **"Shell"**
2. Execute:
   ```bash
   node create-admin.js
   ```
3. Siga as instruções para criar o primeiro usuário admin

---

## 🎉 Pronto!

Acesse: **https://evsminis-app.onrender.com**

### Login:
- **Email:** (o que você criou)
- **Senha:** (a que você definiu)

---

## ⚠️ Limitações do Plano Gratuito

1. **Backend "dorme"** após 15 minutos sem uso
   - Primeiro acesso demora ~30-50 segundos
2. **750 horas/mês** de backend (suficiente para uso normal)
3. **Banco de dados expira em 90 dias**
   - Você receberá email e pode renovar gratuitamente

---

## 🔧 Comandos Úteis

### Verificar logs do Backend:
1. Acesse o Web Service
2. Vá na aba **"Logs"**

### Executar migrations:
1. Vá na aba **"Shell"** do backend
2. Execute: `npx prisma migrate deploy`

### Ver banco de dados:
1. Acesse o PostgreSQL service
2. Vá na aba **"Info"**
3. Use a "External Database URL" com um cliente PostgreSQL

---

## 📱 Próximos Passos (Opcional)

- [ ] Adicionar domínio customizado (ex: evsminis.com.br)
- [ ] Configurar notificações por WhatsApp
- [ ] Fazer backup regular do banco de dados
- [ ] Upgrade para plano pago (remove o "sleep" do backend)
