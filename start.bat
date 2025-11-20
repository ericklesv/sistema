@echo off
REM Quick start script para Windows

echo.
echo ╔═══════════════════════════════════════════╗
echo ║  Sistema de Miniaturas - Quick Start      ║
echo ╚═══════════════════════════════════════════╝
echo.

REM Verificar Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js nao encontrado!
    echo    Instale em: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js encontrado: %NODE_VERSION%
echo.

echo 🚀 Iniciando servidor Backend...
echo    Pressione Ctrl+C para parar
echo.

cd server
start "Backend - Sistema de Miniaturas" cmd /k npm run dev

timeout /t 2 /nobreak

echo.
echo 🚀 Iniciando servidor Frontend...
echo    Acesse: http://localhost:3000
echo.

cd ..\client
start "Frontend - Sistema de Miniaturas" cmd /k npm run dev

echo.
echo ✅ Ambos os servidores foram iniciados em novas janelas
echo.
pause
