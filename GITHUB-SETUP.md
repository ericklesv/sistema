# 🚀 Guia para Subir o Projeto no GitHub

## Passo 1: Instalar Git

1. Acesse: https://git-scm.com/download/win
2. Baixe e instale a versão mais recente
3. Durante a instalação, mantém as opções padrão
4. Após instalar, reinicie o terminal

## Passo 2: Configurar Git Globalmente

Abra o PowerShell e execute:

```powershell
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@github.com"
```

## Passo 3: Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name**: `sistema` (ou o nome que preferir)
   - **Description**: "Sistema de gerenciamento de miniaturas EVS MINIS com estoque USA"
   - **Visibility**: Escolha "Public" ou "Private"
3. NÃO marque "Initialize this repository with"
4. Clique em **"Create repository"**
5. Copie a URL do repositório (HTTPS ou SSH)

## Passo 4: Subir o Projeto

No PowerShell, navegue até a pasta do projeto e execute:

```powershell
cd "C:\Users\Erickles\Documents\sistema"

# Inicializar repositório local
git init

# Adicionar arquivo de configuração Git
# Crie um arquivo .gitignore na raiz (já está pronto)

# Adicionar todos os arquivos
git add .

# Fazer commit inicial
git commit -m "Initial commit: EVS MINIS - Miniatura Management System"

# Adicionar o repositório remoto (substitua pela URL do seu repositório)
git remote add origin https://github.com/SEU_USUARIO/sistema.git

# Enviar para o GitHub
git branch -M main
git push -u origin main
```

## Passo 5: Autenticar no GitHub

Se for a primeira vez, o Git pedirá autenticação:

**Opção 1: Token de Acesso Pessoal (Recomendado)**
1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token" → "Generate new token (classic)"
3. Marque: `repo`, `workflow`, `admin:repo_hook`
4. Clique em "Generate token"
5. Copie o token
6. Cole como senha quando o Git pedir

**Opção 2: SSH (Mais seguro)**
1. Gere uma chave SSH
2. Configure no GitHub Settings → SSH and GPG keys

## Passo 6: Verificar Push

Acesse seu repositório GitHub e veja se todos os arquivos aparecem!

---

## 📋 Arquivos que Serão Sincronizados

✅ **Backend** (Node.js, Express, Prisma)
✅ **Frontend** (React, Vite, Tailwind)
✅ **Banco de Dados** (SQLite migrations)
✅ **Documentação** (README, setup guides)

---

## 🔗 Comandos Úteis para Depois

```powershell
# Ver status
git status

# Fazer novo commit
git add .
git commit -m "Sua mensagem aqui"
git push

# Ver histórico
git log

# Criar branch nova
git branch nome-da-branch
git checkout nome-da-branch
git push -u origin nome-da-branch
```

---

**Tem alguma dúvida? Avise! 🎯**
