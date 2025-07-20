#!/bin/bash

# Script de deploy para Render
# Execute este script na raiz do projeto

echo "🚀 Iniciando deploy para Render..."

# 1. Verificar se estamos na branch correta
echo "📋 Verificando branch atual..."
git status

# 2. Adicionar todas as mudanças
echo "📦 Adicionando arquivos modificados..."
git add .

# 3. Fazer commit das mudanças
echo "💾 Fazendo commit das mudanças..."
read -p "Digite a mensagem do commit: " commit_message
git commit -m "$commit_message"

# 4. Push para o repositório
echo "🔄 Enviando para o repositório..."
git push origin main

echo "✅ Deploy concluído!"
echo "🌐 Acesse: https://alego-manus.onrender.com"
echo "⏰ O Render pode levar alguns minutos para fazer o build..."

# 5. Verificar logs de deploy
echo ""
echo "📊 Para verificar os logs:"
echo "1. Acesse https://dashboard.render.com"
echo "2. Vá para o seu serviço 'alego-manus'"
echo "3. Clique na aba 'Logs' para acompanhar o deployment"
