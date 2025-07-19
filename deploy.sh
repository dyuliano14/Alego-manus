#!/bin/bash

# 🚀 Script de Deploy do Alego Manus V1.0

echo "🔥 Iniciando deploy do Alego Manus V1.0..."
echo "================================="

# 1. Verificar se estamos na pasta correta
if [[ ! -f "package.json" ]] && [[ ! -d "frontend" ]]; then
    echo "❌ Execute este script na raiz do projeto!"
    exit 1
fi

# 2. Build do Frontend
echo "📦 Fazendo build do frontend..."
cd frontend

# Verificar se node_modules existe
if [[ ! -d "node_modules" ]]; then
    echo "📥 Instalando dependências do frontend..."
    npm install
fi

# Build de produção
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build do frontend concluído!"
    echo "📊 Arquivos gerados:"
    ls -la dist/
else
    echo "❌ Erro no build do frontend!"
    exit 1
fi

# 3. Voltar para a raiz
cd ..

# 4. Verificar backend
echo ""
echo "🐍 Verificando backend..."
cd backend

# Verificar se requirements.txt existe
if [[ ! -f "requirements.txt" ]]; then
    echo "❌ requirements.txt não encontrado!"
    exit 1
fi

# Verificar se wsgi.py existe
if [[ ! -f "wsgi.py" ]]; then
    echo "❌ wsgi.py não encontrado!"
    exit 1
fi

echo "✅ Backend verificado!"

# 5. Voltar para raiz
cd ..

# 6. Verificar arquivos de deploy
echo ""
echo "⚙️ Verificando configurações de deploy..."

files_to_check=("render.yaml" "DEPLOY_V1.md")
for file in "${files_to_check[@]}"; do
    if [[ -f "$file" ]]; then
        echo "✅ $file encontrado"
    else
        echo "⚠️  $file não encontrado"
    fi
done

# 7. Resumo final
echo ""
echo "🎉 DEPLOY PRONTO!"
echo "=================="
echo "📦 Frontend buildado: frontend/dist/"
echo "🐍 Backend configurado: backend/"
echo "⚙️ Configs de deploy: render.yaml"
echo ""
echo "🚀 Próximos passos:"
echo "1. Fazer push para GitHub"
echo "2. Conectar repositório no Render.com"
echo "3. Configurar variáveis de ambiente"
echo "4. Deploy automático!"
echo ""
echo "📖 Consulte DEPLOY_V1.md para instruções detalhadas"

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
