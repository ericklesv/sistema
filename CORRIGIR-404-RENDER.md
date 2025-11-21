# 🔧 Corrigir Erro 404 no Render

## Problema
As requisições estão indo para `/api/api/...` causando erro 404.

## Causa
A variável `VITE_API_URL` está configurada com `/api` no final, mas o código já adiciona `/api` em todas as chamadas.

## Solução

### 1. Acesse o Render Dashboard
- Vá em: https://dashboard.render.com
- Selecione seu serviço de **frontend** (evsminis-app)

### 2. Corrija a Variável de Ambiente
- Clique em **Environment**
- Encontre `VITE_API_URL`
- **Remova o `/api` do final**
- Valor correto: `https://evsminis-api.onrender.com`
- ❌ Errado: `https://evsminis-api.onrender.com/api`

### 3. Redeploy
- Clique em **Manual Deploy** → **Clear build cache & deploy**
- Aguarde 2-3 minutos

### 4. Teste
Após o deploy, teste:
- Editar miniatura (botão amarelo ✏️) → Alterar quantidade → Salvar
- Alterar status (botão roxo 🔄) → Alterar quantidade → Salvar

Ambos devem funcionar sem erro 404.

## Verificação Rápida
Abra o console do navegador e execute:
```javascript
console.log(import.meta.env.VITE_API_URL)
```
Deve retornar: `https://evsminis-api.onrender.com` (sem `/api`)
