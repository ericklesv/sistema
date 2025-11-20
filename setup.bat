@echo off
echo ============================================
echo Sistema de Miniaturas - Setup Inicial
echo ============================================
echo.

echo Verificando Node.js...
node --version
if errorlevel 1 (
    echo.
    echo ERRO: Node.js nao esta instalado!
    echo Baixe e instale em: https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo ============================================
echo Instalando dependencias do Server...
echo ============================================
cd server
call npm install
if errorlevel 1 (
    echo ERRO ao instalar dependencias do server
    pause
    exit /b 1
)

echo.
echo ============================================
echo Instalando dependencias do Client...
echo ============================================
cd ..\client
call npm install
if errorlevel 1 (
    echo ERRO ao instalar dependencias do client
    pause
    exit /b 1
)

echo.
echo ============================================
echo Setup concluido com sucesso!
echo ============================================
echo.
echo Para iniciar o projeto:
echo.
echo Terminal 1 - Backend:
echo   cd server
echo   npm run dev
echo.
echo Terminal 2 - Frontend:
echo   cd client
echo   npm run dev
echo.
echo Acesse: http://localhost:3000
echo.
pause
