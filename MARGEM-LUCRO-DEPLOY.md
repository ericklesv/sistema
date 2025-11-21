# Margem de Lucro - Ready Stock

## ✅ Alterações Implementadas

### 1. **Schema do Banco de Dados**
- Campo `price` renomeado para `cost` (custo)
- Novo campo `profitMargin` adicionado (margem de lucro em %)

### 2. **Interface do Usuário**
- Formulário agora possui:
  - **Custo (R$)**: Campo para inserir o custo da miniatura
  - **Margem de Lucro (%)**: Campo para definir a margem desejada (ex: 50)
  - **Preço de Venda Calculado**: Exibição automática do preço final

### 3. **Cálculo Automático**
```
Preço Final = Custo × (1 + Margem/100)

Exemplos:
- Custo: R$ 100,00 | Margem: 50% → Preço: R$ 150,00
- Custo: R$ 200,00 | Margem: 25% → Preço: R$ 250,00
- Custo: R$ 150,00 | Margem: 100% → Preço: R$ 300,00
```

### 4. **Tabela de Estoque**
Agora exibe 3 colunas de valores:
- **Custo**: Valor de custo do item
- **Margem**: Percentual de lucro aplicado
- **Preço Final**: Valor calculado para venda

---

## 🚀 Deployment no Render

### Status Atual:
✅ Código enviado para GitHub (commit `310ced5`)  
✅ Render fará auto-deploy em ~3-5 minutos  
⏳ **Migração do banco de dados pendente** (precisa ser executada manualmente)

---

## 📋 Passos para Aplicar a Migração no PostgreSQL

### 1. Acesse o Render Dashboard
- Vá para: https://dashboard.render.com/
- Entre no serviço **evsminis-api** (backend)

### 2. Abra o Shell do Backend
- No menu do serviço, clique em **"Shell"** (ícone de terminal)
- Isso abrirá um terminal conectado ao seu servidor

### 3. Execute a Migração SQL
Cole e execute o seguinte comando no Shell:

```sql
psql $DATABASE_URL << EOF
ALTER TABLE "ready_stock" ADD COLUMN IF NOT EXISTS "profitMargin" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "ready_stock" RENAME COLUMN "price" TO "cost";
EOF
```

**OU** se preferir executar linha por linha:

```bash
# Conectar ao PostgreSQL
psql $DATABASE_URL

# Executar os comandos SQL:
ALTER TABLE "ready_stock" ADD COLUMN IF NOT EXISTS "profitMargin" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "ready_stock" RENAME COLUMN "price" TO "cost";

# Sair do psql
\q
```

### 4. Verifique se Funcionou
Após executar a migração, você pode verificar se os campos foram atualizados:

```bash
psql $DATABASE_URL -c "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'ready_stock';"
```

Deve mostrar as colunas `cost` e `profitMargin`.

### 5. Reinicie o Backend (se necessário)
- No dashboard do Render, clique em **"Manual Deploy"** → **"Deploy latest commit"**
- Ou simplesmente aguarde o auto-deploy terminar

---

## 🧪 Testando a Funcionalidade

1. Acesse o sistema: https://evsminis-app.onrender.com
2. Faça login com admin
3. Vá para **Estoque → Pronta Entrega**
4. Clique em **"+ Adicionar ao Estoque"**
5. Preencha:
   - Nome da miniatura
   - Custo: `100`
   - Margem de Lucro: `50`
6. Observe o **Preço de Venda Calculado**: deve mostrar `R$ 150,00`
7. Salve e verifique a tabela

---

## ⚠️ Observações Importantes

### Dados Existentes
- Se você já tinha itens em Ready Stock, eles foram migrados:
  - Campo `price` virou `cost` (os valores foram preservados)
  - Campo `profitMargin` foi criado com valor `0` (zero)
  - **Você precisará editar os itens existentes e adicionar a margem de lucro**

### Fórmula de Cálculo
- A margem é um **percentual**, não um multiplicador
- 50% de margem significa: `custo × 1.50`
- 100% de margem significa: `custo × 2.00`

### Edição de Itens
- Ao editar um item existente, você pode:
  - Ajustar o custo
  - Definir a margem de lucro
  - O preço final será recalculado automaticamente

---

## 🐛 Troubleshooting

### "Erro ao salvar item"
- Verifique se a migração foi executada corretamente no banco
- Confira os logs no Render: **evsminis-api** → **Logs**

### "Campo profitMargin não existe"
- A migração não foi aplicada
- Execute os comandos SQL manualmente no Shell do Render

### "Preço não está sendo calculado"
- Verifique se os valores de custo e margem estão preenchidos
- Ambos devem ser números válidos maiores que zero

---

## 📝 Arquivo de Migração PostgreSQL

O arquivo está em:
```
server/prisma/migrations/20251121152628_add_profit_margin_to_ready_stock/migration_postgresql.sql
```

Conteúdo:
```sql
ALTER TABLE "ready_stock" ADD COLUMN "profitMargin" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "ready_stock" RENAME COLUMN "price" TO "cost";
```

---

## ✅ Checklist Final

- [ ] Render terminou o auto-deploy (aguardar 3-5 min)
- [ ] Migração SQL executada no Shell do Render
- [ ] Backend reiniciado (se necessário)
- [ ] Frontend carregando corretamente
- [ ] Teste de adicionar item com custo + margem
- [ ] Verificação do cálculo do preço final
- [ ] Edição de itens existentes (se houver)

---

**Commit ID**: `310ced5`  
**Branch**: `main`  
**Data**: 21/11/2024
