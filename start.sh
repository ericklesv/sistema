#!/bin/bash
# Quick start script para macOS/Linux

echo ""
echo "╔═══════════════════════════════════════════╗"
echo "║  Sistema de Miniaturas - Quick Start      ║"
echo "╚═══════════════════════════════════════════╝"
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado!"
    echo "   Instale em: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"
echo ""

# Iniciar servidores
echo "🚀 Iniciando servidor Backend..."
echo "   Pressione Ctrl+C para parar"
echo ""

cd server
npm run dev &
SERVER_PID=$!

sleep 2

echo ""
echo "🚀 Iniciando servidor Frontend..."
echo "   Acesse: http://localhost:3000"
echo ""

cd ../client
npm run dev &
CLIENT_PID=$!

# Cleanup ao sair
trap "kill $SERVER_PID $CLIENT_PID" EXIT

wait
