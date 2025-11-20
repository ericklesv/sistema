# 🚀 RESUMO: Como Subir no GitHub

## 3 Passos Principais

### 1️⃣ Instalar Git
→ https://git-scm.com/download/win

### 2️⃣ Criar Repositório no GitHub
→ https://github.com/new

### 3️⃣ Executar Comandos (em order)

```powershell
# Navegar até a pasta
cd "C:\Users\Erickles\Documents\sistema"

# Inicializar
git init
git branch -M main

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Initial commit: EVS MINIS"

# Conectar ao GitHub (substitua SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/sistema.git

# Enviar
git push -u origin main
```

---

## 📌 Precisa Autenticar?

1. Acesse: https://github.com/settings/tokens/new
2. Clique "Generate token"
3. Cole como senha quando pedir

---

## 📚 Guias Completos no Projeto

| Arquivo | Para Quem |
|---------|-----------|
| `GITHUB-GUIA-PT-BR.md` | Passo a passo detalhado 📖 |
| `GITHUB-COMANDOS-RAPIDOS.md` | Copiar e colar 🔧 |
| `CHECKLIST-GITHUB.md` | Verificar tudo ✅ |
| `README.md` | Documentação do projeto 📚 |

---

## ✅ Pronto!

Se tudo deu certo, seu projeto estará em:
```
https://github.com/SEU_USUARIO/sistema
```

---

## 🎯 Próximas Mudanças

Sempre que fizer mudanças no código:

```powershell
git add .
git commit -m "Descrição da mudança"
git push
```

---

**Sucesso! 🎉**
