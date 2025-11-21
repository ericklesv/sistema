# 🚀 Sistema de Pré-Vendas - EVS MINIS

## Funcionalidades Implementadas

### 1. **Banco de Dados de Miniaturas Dividido**
- ✅ Já Lançadas (produtos disponíveis)
- 🚀 Pré-Vendas (produtos em lançamento futuro)

### 2. **Novos Campos no Catálogo**
- **É Pré-Venda?** - Checkbox para marcar produto como pré-venda
- **Data de Lançamento** - Campo de data para informar quando será lançado

### 3. **Filtros Inteligentes**
Na página de Catálogo (Miniaturas Base), você pode filtrar por:
- **Todas** - Mostra todos os produtos
- **✅ Já Lançadas** - Apenas produtos disponíveis
- **🚀 Pré-Vendas** - Apenas pré-vendas

### 4. **Badges e Indicadores Visuais**
- Badge **🚀 PRÉ-VENDA** roxo para produtos em pré-venda
- Badge **✅ LANÇADA** verde para produtos disponíveis
- Data de lançamento exibida diretamente na tabela e autocomplete

### 5. **Auto-Preenchimento de Data**
Quando você adiciona uma miniatura de pré-venda à lista de um cliente:
- A **Data de Entrega** é automaticamente preenchida com a **Data de Lançamento**
- Funciona tanto na página do usuário quanto na página do admin
- Elimina digitação manual e garante consistência

---

## Como Usar

### Adicionar uma Pré-Venda no Catálogo

1. Vá para **Catálogo de Miniaturas**
2. Clique em **➕ Nova Miniatura**
3. Preencha:
   - Nome da Miniatura
   - Marca
   - Foto (opcional)
4. **Marque o checkbox "🚀 É Pré-Venda?"**
5. Selecione a **Data de Lançamento** (DD/MM/AAAA)
6. Clique em **Criar Miniatura**

### Adicionar Pré-Venda à Lista de um Cliente

1. Vá para **Pré-Vendas** ou **Admin** (gerenciar clientes)
2. Pesquise a miniatura
3. **Observe o badge 🚀 PRÉ-VENDA e a data no autocomplete**
4. Selecione a miniatura
5. ✅ **A data de entrega será preenchida automaticamente!**
6. Complete os outros campos (valor, etc.)
7. Adicione ao cliente

---

## Alterações Técnicas

### Frontend (`client/`)
- ✅ `MiniaturasBasePage.jsx` - Formulário com checkbox e DateInput
- ✅ `MiniaturaAutocomplete.jsx` - Badges e data nos resultados
- ✅ `DashboardPage.jsx` - Auto-preenchimento da data
- ✅ `AdminPage.jsx` - Auto-preenchimento da data
- ✅ `DateInput.jsx` - Componente de data (já existia)

### Backend (`server/`)
- ✅ `schema.prisma` - Campos `isPreOrder` e `releaseDate`
- ✅ `miniaturaBaseController.js` - Suporte aos novos campos
- ✅ Migração criada: `20251121181836_add_preorder_and_release_date_to_miniatura_base`

### Banco de Dados
- ✅ Campos adicionados:
  - `isPreOrder` (BOOLEAN, default: false)
  - `releaseDate` (TIMESTAMP, nullable)

---

## Próximos Passos - APLICAR NA PRODUÇÃO

### 1. **Aplicar Migração no PostgreSQL do Render**

Acesse o Shell do **evsminis-api** no Render e execute:

```bash
psql $DATABASE_URL << EOF
ALTER TABLE "miniatura_base" ADD COLUMN IF NOT EXISTS "isPreOrder" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "miniatura_base" ADD COLUMN IF NOT EXISTS "releaseDate" TIMESTAMP(3);
EOF
```

### 2. **Regenerar Prisma Client no Render**

Ainda no Shell do Render:

```bash
npx prisma generate
```

### 3. **Fazer Deploy das Alterações**

No terminal local:

```bash
git add .
git commit -m "Feature: Sistema de pré-vendas com datas de lançamento"
git push origin main
```

O Render vai fazer deploy automático em 3-5 minutos.

---

## Testes Sugeridos Após Deploy

1. ✅ Criar uma miniatura marcada como pré-venda com data de lançamento
2. ✅ Verificar se aparece o badge 🚀 PRÉ-VENDA na tabela
3. ✅ Usar os filtros (Todas / Já Lançadas / Pré-Vendas)
4. ✅ Pesquisar a pré-venda no autocomplete e verificar badge
5. ✅ Adicionar a pré-venda a um cliente e confirmar que a data foi auto-preenchida
6. ✅ Editar uma miniatura e mudar entre pré-venda e lançada

---

## Benefícios do Sistema

- 📦 **Organização**: Separa produtos disponíveis de futuros lançamentos
- ⏰ **Automação**: Data de lançamento preenche automaticamente na pré-venda
- 🎯 **Visibilidade**: Filtros e badges facilitam gestão do catálogo
- ✅ **Consistência**: Elimina erros de digitação de datas
- 🚀 **Experiência**: Cliente sabe quando vai receber a miniatura

---

## Notas Importantes

- Produtos existentes serão marcados como "Já Lançadas" por padrão (`isPreOrder=false`)
- A data de lançamento é opcional mesmo para pré-vendas
- Se não houver data de lançamento, a data de entrega não será auto-preenchida
- O sistema continua funcionando normalmente para produtos já lançados
