# 🎨 Guia de Personalização

## 🎯 Cores e Tema

### Tailwind CSS (Client)

Edite `client/tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',    // Azul padrão
        secondary: '#8b5cf6',  // Roxo
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
```

### Cores padrão usadas

- **Azul**: `#3b82f6` - Principal
- **Verde**: `#16a34a` - Sucesso/Adicionar
- **Vermelho**: `#dc2626` - Deletar
- **Cinza**: `#6b7280` - Neutro

---

## 📝 Personalizando Textos

### Navbar (`client/src/components/Navbar.jsx`)

Procure por:
```jsx
<Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
  🚗 Miniaturas
</Link>
```

Mude para:
```jsx
<Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
  🚗 Seu Nome Aqui
</Link>
```

### Dashboard (`client/src/pages/DashboardPage.jsx`)

Procure por:
```jsx
<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
  Minha Coleção
</h1>
```

---

## 📝 Adicionar Logotipos

1. Crie uma pasta `client/public/`
2. Coloque suas imagens lá
3. Use em componentes:

```jsx
<img src="/seu-logo.png" alt="Logo" className="h-8" />
```

---

## 🗄️ Mudando Banco de Dados

### Localização padrão
```
c:\Users\Erickles\Documents\sistema\sistema.db
```

### Para usar em outro lugar

Edite `server/src/db/database.js`:

```javascript
const dbPath = path.join(__dirname, '../seu-novo-caminho/banco.db');
```

### Para usar PostgreSQL (avançado)

1. Instale: `npm install pg`
2. Reescreva `src/db/database.js` com pool PostgreSQL
3. Adapte queries SQL

---

## 🔐 Mudando Segredo JWT

Edite `server/.env`:

```env
JWT_SECRET=sua_chave_super_secreta_e_complexa
```

**Dica:** Use uma chave aleatória forte!

```bash
# Gerar chave aleatória
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📧 Adicionar Validações Customizadas

### Validar Email

Em `server/src/controllers/authController.js`:

```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({ error: 'Email inválido' });
}
```

### Validar Comprimento de Senha

```javascript
if (password.length < 8) {
  return res.status(400).json({ error: 'Senha deve ter 8+ caracteres' });
}
```

---

## 🔔 Adicionar Notificações

### Exemplo: Toast de Sucesso

Em `client/src/pages/DashboardPage.jsx`, após adicionar:

```javascript
const handleAddMiniatura = async (e) => {
  // ... código anterior
  try {
    await axios.post(endpoint, formData, { ... });
    // Novo:
    alert('✅ Adicionado com sucesso!');
    setFormData({ name: '', description: '', deliveryDate: '' });
    setShowAddModal(false);
    fetchData();
  } catch (err) {
    alert('❌ Erro ao adicionar!');
  }
}
```

---

## 🌍 Adicionar Idiomas

### Criar arquivo de tradução

`client/src/i18n.js`:

```javascript
export const translations = {
  pt: {
    dashboard: 'Painel',
    preSales: 'Pré-Vendas',
    garage: 'Garagem',
  },
  en: {
    dashboard: 'Dashboard',
    preSales: 'Pre-Sales',
    garage: 'Garage',
  }
};
```

### Usar no componente:

```jsx
const [language, setLanguage] = useState('pt');
const t = translations[language];

<h1>{t.dashboard}</h1>
```

---

## 📱 Responsividade

Tailwind CSS está configurado com breakpoints:

- `sm`: 640px
- `md`: 768px  
- `lg`: 1024px
- `xl`: 1280px

Exemplo:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* 1 coluna mobile, 2 tablet, 4 desktop */}
</div>
```

---

## 🚀 Deploy

### Backend (Heroku/Railway)

1. Crie arquivo `Procfile`:
```
web: npm start
```

2. Push para plataforma

### Frontend (Vercel/Netlify)

1. Build: `npm run build`
2. Deploy pasta `dist/`

---

## 📦 Adicionar Dependências

### Backend

```bash
cd server
npm install nome-do-pacote
```

### Frontend

```bash
cd client
npm install nome-do-pacote
```

---

## 🐛 Debug

### Ver logs no Backend

Em `server/src/index.js`:

```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

### Ver logs no Frontend

DevTools do navegador (F12 → Console)

### Ver SQL executado

Em `server/src/db/database.js`:

```javascript
db.configure("busyTimeout", 9000);

// Ativar logs SQL
const sqlite3 = require('sqlite3').verbose();
```

---

## 💡 Dicas de Otimização

1. **Cache**: Use localStorage para dados que não mudam
2. **Lazy Loading**: Carregue dados sob demanda
3. **Índices DB**: Adicione em campos frequentemente consultados
4. **Compressão**: Use gzip no servidor
5. **CDN**: Para assets estáticos (imagens, CSS)

---

## 📚 Recursos Úteis

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com/)
- [Express.js](https://expressjs.com/)
- [SQLite](https://www.sqlite.org/)
- [JWT](https://jwt.io/)

---

**Aproveite para customizar conforme sua necessidade!** 🎉
