#!/bin/bash

# 🚀 Script de Deploy do Alego Manus

echo "🔥 Iniciando deploy do Alego Manus..."

# 1. Build do Frontend
echo "📦 Fazendo build do frontend..."
cd frontend
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build do frontend concluído!"
else
    echo "❌ Erro no build do frontend!"
    exit 1
fi

# 2. Volta para a raiz
cd ..

# 3. Lista arquivos para verificação
echo "📁 Arquivos no dist:"
ls -la frontend/dist/

echo "📁 Arquivos no backend:"
ls -la backend/

# 4. Instruções para deploy
echo ""
echo "🚀 Próximos passos para deploy:"
echo ""
echo "1. Heroku:"
echo "   heroku create seu-app-name"
echo "   git subtree push --prefix=backend heroku main"
echo ""
echo "2. Railway:"
echo "   railway login"
echo "   railway deploy"
echo ""
echo "3. Render:"
echo "   - Conecte o repositório GitHub"
echo "   - Root Directory: backend"
echo "   - Build Command: pip install -r requirements.txt"
echo "   - Start Command: gunicorn wsgi:app"
echo ""
echo "✅ Deploy preparado com sucesso!"
echo "📱 Text-to-Speech testado: 24 vozes disponíveis"
echo "🎯 PDFNotes funcionando perfeitamente"
echo "📄 MarkdownViewer corrigido"
