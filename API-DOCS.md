# 📡 Documentação da API

## Base URL
```
http://localhost:5000/api
```

---

## 🔐 Autenticação

Todos os endpoints, exceto `/auth/*`, requerem um header:

```
Authorization: Bearer <token>
```

O token é obtido no login e válido por 24 horas.

---

## 🔑 Endpoints de Autenticação

### POST `/auth/register`
Criar nova conta

**Body:**
```json
{
  "username": "joao",
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta (201):**
```json
{
  "message": "Usuário registrado com sucesso"
}
```

---

### POST `/auth/login`
Fazer login

**Body:**
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "joao@email.com",
    "username": "joao",
    "role": "client"
  }
}
```

---

## 📦 Endpoints de Miniaturas (Cliente)

### GET `/miniaturas/pre-sales`
Listar pré-vendas do usuário

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta (200):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "name": "Ferrari F40",
    "description": "Escala 1:18",
    "addedDate": "2025-11-20T10:30:00Z",
    "deliveryDate": "2025-12-25",
    "status": "pending"
  }
]
```

---

### POST `/miniaturas/pre-sales`
Adicionar pré-venda

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Ferrari F40",
  "description": "Escala 1:18",
  "deliveryDate": "2025-12-25"
}
```

**Resposta (201):**
```json
{
  "id": 1,
  "message": "Pré-venda adicionada"
}
```

---

### DELETE `/miniaturas/pre-sales/:id`
Deletar pré-venda

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta (200):**
```json
{
  "message": "Pré-venda deletada"
}
```

---

### GET `/miniaturas/garage`
Listar miniaturas na garagem

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta (200):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "name": "Corvette C3",
    "description": "Escala 1:18 - Vermelho",
    "addedDate": "2025-11-20T10:30:00Z",
    "deliveryDate": "2025-11-15",
    "status": "pending"
  }
]
```

---

### POST `/miniaturas/garage`
Adicionar miniatura na garagem

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Corvette C3",
  "description": "Escala 1:18 - Vermelho",
  "deliveryDate": "2025-11-15"
}
```

**Resposta (201):**
```json
{
  "id": 1,
  "message": "Miniatura adicionada à garagem"
}
```

---

### DELETE `/miniaturas/garage/:id`
Deletar miniatura

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta (200):**
```json
{
  "message": "Miniatura deletada"
}
```

---

## 🔧 Endpoints Admin

**Requer:** Token + Role = "admin"

---

### GET `/admin/users`
Listar todos os usuários

**Headers:**
```
Authorization: Bearer <token_admin>
```

**Resposta (200):**
```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@sistema.com",
    "role": "admin",
    "createdAt": "2025-11-20T10:30:00Z"
  },
  {
    "id": 2,
    "username": "joao",
    "email": "joao@email.com",
    "role": "client",
    "createdAt": "2025-11-20T10:30:00Z"
  }
]
```

---

### GET `/admin/users/:userId/pre-sales`
Listar pré-vendas de um cliente

**Headers:**
```
Authorization: Bearer <token_admin>
```

**Resposta (200):**
```json
[
  {
    "id": 1,
    "userId": 2,
    "name": "Ferrari F40",
    "description": "Escala 1:18",
    "addedDate": "2025-11-20T10:30:00Z",
    "deliveryDate": "2025-12-25",
    "status": "pending"
  }
]
```

---

### POST `/admin/users/:userId/pre-sales`
Adicionar pré-venda a um cliente

**Headers:**
```
Authorization: Bearer <token_admin>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Lamborghini Countach",
  "description": "Escala 1:18 - Edição Limitada",
  "deliveryDate": "2025-11-30"
}
```

**Resposta (201):**
```json
{
  "id": 2,
  "message": "Pré-venda adicionada"
}
```

---

### PUT `/admin/pre-sales/:id`
Atualizar pré-venda

**Headers:**
```
Authorization: Bearer <token_admin>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Lamborghini Countach",
  "description": "Escala 1:18 - Edição Limitada",
  "deliveryDate": "2025-11-30",
  "status": "completed"
}
```

**Resposta (200):**
```json
{
  "message": "Pré-venda atualizada"
}
```

---

### DELETE `/admin/pre-sales/:id`
Deletar pré-venda (Admin)

**Headers:**
```
Authorization: Bearer <token_admin>
```

**Resposta (200):**
```json
{
  "message": "Pré-venda deletada"
}
```

---

### GET `/admin/users/:userId/garage`
Listar garagem de um cliente

**Headers:**
```
Authorization: Bearer <token_admin>
```

**Resposta (200):**
```json
[
  {
    "id": 1,
    "userId": 2,
    "name": "Corvette C3",
    "description": "Escala 1:18 - Vermelho",
    "addedDate": "2025-11-20T10:30:00Z",
    "deliveryDate": "2025-11-15",
    "status": "pending"
  }
]
```

---

### POST `/admin/users/:userId/garage`
Adicionar miniatura na garagem de um cliente

**Headers:**
```
Authorization: Bearer <token_admin>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "BMW M3",
  "description": "Escala 1:18 - Cinza",
  "deliveryDate": "2025-11-25"
}
```

**Resposta (201):**
```json
{
  "id": 2,
  "message": "Miniatura adicionada"
}
```

---

### PUT `/admin/garage/:id`
Atualizar miniatura

**Headers:**
```
Authorization: Bearer <token_admin>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "BMW M3",
  "description": "Escala 1:18 - Cinza",
  "deliveryDate": "2025-11-25",
  "status": "completed"
}
```

**Resposta (200):**
```json
{
  "message": "Miniatura atualizada"
}
```

---

### DELETE `/admin/garage/:id`
Deletar miniatura (Admin)

**Headers:**
```
Authorization: Bearer <token_admin>
```

**Resposta (200):**
```json
{
  "message": "Miniatura deletada"
}
```

---

## 📊 Status Codes

| Código | Significado |
|--------|------------|
| 200 | OK - Sucesso |
| 201 | Criado - Recurso criado |
| 400 | Erro do Cliente - Dados inválidos |
| 401 | Não Autorizado - Token ausente/inválido |
| 403 | Proibido - Sem permissão |
| 500 | Erro do Servidor |

---

## 🧪 Testando com Curl

### Registrar:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"joao","email":"joao@email.com","password":"senha123"}'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"senha123"}'
```

### Listar Pré-Vendas (com token):
```bash
curl -X GET http://localhost:5000/api/miniaturas/pre-sales \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 🛠️ Testing com Postman/Insomnia

1. Importe como collection
2. Copie o token do login
3. Use `{{token}}` nos headers de autorização dos outros requests
