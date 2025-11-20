# ⚡ Comandos Rápidos para GitHub

Copie e cole os comandos abaixo no PowerShell. Substitua os valores entre `< >`.

---

## 1️⃣ Configurar Git (Primeira Vez)

```powershell
git config --global user.name "Seu Nome Aqui"
git config --global user.email "seu.email@gmail.com"
```

---

## 2️⃣ Inicializar e Preparar Projeto

Navegue até a pasta do projeto:
```powershell
cd "C:\Users\Erickles\Documents\sistema"
```

Execute:
```powershell
git init
git branch -M main
git add .
git commit -m "Initial commit: EVS MINIS - Sistema de Gerenciamento de Miniaturas"
```

---

## 3️⃣ Conectar ao GitHub

Substitua `SEU_USUARIO` pelo seu username GitHub:

```powershell
git remote add origin https://github.com/SEU_USUARIO/sistema.git
```

**Exemplo:**
```powershell
git remote add origin https://github.com/erickles-silva/sistema.git
```

---

## 4️⃣ Enviar para GitHub

```powershell
git push -u origin main
```

Na primeira vez, ele pedirá autenticação. Cole seu token de acesso.

---

## ✨ Enviar Mudanças Futuras

Sempre que fizer mudanças:

```powershell
git add .
git commit -m "Descrição breve da mudança"
git push
```

---

## 📋 Comandos Úteis

```powershell
# Ver status
git status

# Ver histórico
git log

# Ver diferenças
git diff

# Criar branch
git checkout -b nome-da-branch

# Ver todas as branches
git branch -a

# Trocar de branch
git checkout main
```

---

## 🔗 Links Importantes

1. **GitHub:** https://github.com
2. **Git Download:** https://git-scm.com/download/win
3. **Gerar Token:** https://github.com/settings/tokens/new
4. **Novo Repositório:** https://github.com/new

---

**Dica:** Salve este arquivo para referência futura!
