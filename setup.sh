#!/bin/bash

echo "============================================"
echo "Sistema de Miniaturas - Setup Inicial"
echo "============================================"
echo ""

echo "Verificando Node.js..."
node --version
if [ $? -ne 0 ]; then
    echo ""
    echo "ERRO: Node.js não está instalado!"
    echo "Baixe e instale em: https://nodejs.org/"
    exit 1
fi

echo ""
echo "============================================"
echo "Instalando dependências do Server..."
echo "============================================"
cd server
npm install
if [ $? -ne 0 ]; then
    echo "ERRO ao instalar dependências do server"
    exit 1
fi

echo ""
echo "============================================"
echo "Instalando dependências do Client..."
echo "============================================"
cd ../client
npm install
if [ $? -ne 0 ]; then
    echo "ERRO ao instalar dependências do client"
    exit 1
fi

echo ""
echo "============================================"
echo "Setup concluído com sucesso!"
echo "============================================"
echo ""
echo "Para iniciar o projeto:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd server"
echo "  npm run dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd client"
echo "  npm run dev"
echo ""
echo "Acesse: http://localhost:3000"
echo ""
