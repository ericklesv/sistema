# 📚 Guia Passo a Passo: Subir Projeto no GitHub

Este guia vai te ajudar a colocar seu projeto no GitHub de forma rápida e fácil!

---

## ✅ Passo 1: Instalar Git

1. Acesse: https://git-scm.com/download/win
2. Baixe e instale (versão mais recente)
3. Durante a instalação, clique "Next" em tudo
4. **Reinicie seu computador** após a instalação

---

## ✅ Passo 2: Configurar Git

Abra o PowerShell e execute:

```powershell
git config --global user.name "Seu Nome Aqui"
git config --global user.email "seu.email@gmail.com"
```

**Exemplo:**
```powershell
git config --global user.name "Erickles Silva"
git config --global user.email "erickles@gmail.com"
```

---

## ✅ Passo 3: Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name:** `sistema`
   - **Description:** `Sistema de gerenciamento de miniaturas EVS MINIS`
   - **Visibility:** Escolha "Public" (visível para todos) ou "Private" (só você)
3. **NÃO marque** nenhuma das opções de inicialização
4. Clique em **"Create repository"**

**Resultado:** Você verá uma página com instruções. Copie a URL HTTPS (começa com https://github.com/)

---

## ✅ Passo 4: Inicializar Git no Projeto

Abra o PowerShell na pasta do projeto:

```powershell
cd "C:\Users\Erickles\Documents\sistema"
```

Execute:

```powershell
# Inicializar repositório Git
git init

# Configurar branch padrão
git branch -M main

# Ver o status
git status
```

---

## ✅ Passo 5: Adicionar Todos os Arquivos

Execute:

```powershell
git add .
```

**Verificar:** Digite `git status` - você deve ver arquivos em verde (staged)

---

## ✅ Passo 6: Fazer o Primeiro Commit

Execute:

```powershell
git commit -m "Initial commit: EVS MINIS - Sistema de Gerenciamento de Miniaturas"
```

---

## ✅ Passo 7: Adicionar Repositório Remoto

**IMPORTANTE:** Substitua `SEU_USUARIO` pelo seu username do GitHub!

```powershell
git remote add origin https://github.com/SEU_USUARIO/sistema.git
```

**Exemplo:**
```powershell
git remote add origin https://github.com/erickles-silva/sistema.git
```

**Verificar:**
```powershell
git remote -v
```

---

## ✅ Passo 8: Enviar para o GitHub (Push)

Execute:

```powershell
git push -u origin main
```

---

## 🔐 Passo 9: Autenticar (Primeira Vez)

O git pedirá autenticação. Você tem 2 opções:

### Opção A: Token de Acesso (Recomendado)

1. Acesse: https://github.com/settings/tokens/new
2. Nome: `github-access-token`
3. Validade: 90 dias
4. Selecione:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. Clique em **"Generate token"**
6. **Copie o token** (você não vai poder ver de novo!)
7. Cole no PowerShell quando pedir a senha (aparecerá como `password` ou similar)

### Opção B: Autenticação SSH (Mais Seguro)

Se preferir SSH, gere uma chave:
```powershell
ssh-keygen -t ed25519 -C "seu.email@gmail.com"
```

---

## ✅ Passo 10: Verificar no GitHub

1. Acesse: https://github.com/seu-usuario/sistema
2. Você deve ver todos os seus arquivos e pastas!
3. Parabéns! 🎉

---

## 🔄 Próximas Vezes (Enviar Mudanças)

Sempre que fizer mudanças no código:

```powershell
# Ver o que mudou
git status

# Adicionar tudo
git add .

# Comentar a mudança
git commit -m "Descrição da mudança"

# Enviar
git push
```

---

## 📝 Exemplos de Mensagens de Commit

```powershell
git commit -m "Adiciona funcionalidade de envios"
git commit -m "Corrige bug na tabela de estoque"
git commit -m "Atualiza documentação README"
git commit -m "Refatora componente de autocomplete"
```

---

## ❓ Troubleshooting

### Erro: "git: command not found"
- Git não foi instalado. Instale novamente de https://git-scm.com/download/win
- Reinicie o computador após instalar

### Erro: "authentication failed"
- Verifique se o token está correto
- Crie um novo token em https://github.com/settings/tokens

### Erro: "remote origin already exists"
- Execute: `git remote remove origin`
- Depois adicione de novo com o comando correto

### Mudanças não aparecem no GitHub
- Execute `git status` para verificar
- Se nada aparecer, suas mudanças já foram enviadas!

---

## 🎓 Comandos Úteis

```powershell
# Ver histórico de commits
git log

# Ver diferenças
git diff

# Deletar um arquivo
git rm nome-do-arquivo.txt

# Ignorar arquivo de agora em diante
git update-index --skip-worktree caminho/arquivo

# Criar nova branch (ramo)
git checkout -b nova-branch

# Trocar de branch
git checkout main

# Listar branches
git branch -a
```

---

## 📞 Dúvidas?

Se tiver qualquer problema, procure:
- https://github.com/git-tips/tips
- https://docs.github.com/pt
- Abra uma issue no repositório

---

**Boa sorte! 🚀**
