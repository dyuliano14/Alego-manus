#!/bin/bash

# 🚀 Script para iniciar Frontend + Backend simultaneamente

echo "🔥 Iniciando Alego Manus - Desenvolvimento"
echo "========================================"

# Verificar se já há processos rodando
if lsof -i :3000 >/dev/null 2>&1; then
    echo "⚠️  Porta 3000 já está em uso (Frontend)"
fi

if lsof -i :5000 >/dev/null 2>&1; then
    echo "⚠️  Porta 5000 já está em uso (Backend)"
fi

echo ""
echo "📦 Iniciando Backend Flask (Porta 5000)..."
cd backend && python app.py &
BACKEND_PID=$!

echo "🌐 Iniciando Frontend Vite (Porta 3000)..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Servidores iniciados:"
echo "   🔹 Backend:  http://localhost:5000"
echo "   🔹 Frontend: http://localhost:3000"
echo ""
echo "🛑 Para parar os servidores, pressione Ctrl+C"

# Função para limpar processos ao sair
cleanup() {
    echo ""
    echo "🔄 Parando servidores..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "✅ Servidores parados!"
    exit 0
}

# Capturar Ctrl+C
trap cleanup INT

# Aguardar até que o usuário pressione Ctrl+C
wait
