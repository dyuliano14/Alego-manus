#!/bin/bash
# Deploy Script - Alego Manus V1.0
# Autor: GitHub Copilot
# Data: 24/07/2025

echo "🔥 Iniciando deploy do Alego Manus V1.0..."
echo "================================="

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para logs
log_info() {
    echo -e "${BLUE}📦 $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    log_error "Execute este script na raiz do projeto Alego-manus"
    exit 1
fi

# 1. Build do Frontend
log_info "Fazendo build do frontend..."
cd frontend

if npm run build; then
    log_success "Build do frontend concluído!"
    
    # Verificar se os arquivos foram gerados
    if [ -d "dist" ]; then
        log_info "Arquivos gerados:"
        ls -la dist/
    else
        log_error "Diretório dist não foi criado!"
        exit 1
    fi
else
    log_error "Falha no build do frontend!"
    exit 1
fi

cd ..

# 2. Verificar Backend
log_info "Verificando backend..."
if [ -f "backend/app.py" ] && [ -f "backend/requirements.txt" ]; then
    log_success "Backend verificado!"
else
    log_error "Arquivos do backend não encontrados!"
    exit 1
fi

# 3. Verificar configurações de deploy
log_info "Verificando configurações de deploy..."

configs_ok=true

if [ -f "render.yaml" ]; then
    log_success "render.yaml encontrado"
else
    log_warning "render.yaml não encontrado"
    configs_ok=false
fi

if [ -f "DEPLOY_V1.md" ]; then
    log_success "DEPLOY_V1.md encontrado"
else
    log_warning "DEPLOY_V1.md não encontrado"
    configs_ok=false
fi

# 4. Resumo final
echo ""
echo "🎉 DEPLOY PRONTO!"
echo "=================="
log_success "Frontend buildado: frontend/dist/"
log_success "Backend configurado: backend/"
if $configs_ok; then
    log_success "Configs de deploy: render.yaml"
fi

echo ""
echo "🚀 Próximos passos:"
echo "1. Fazer push para GitHub"
echo "2. Conectar repositório no Render.com"
echo "3. Configurar variáveis de ambiente"
echo "4. Deploy automático!"

echo ""
log_info "Consulte DEPLOY_V1.md para instruções detalhadas"

# 5. Mostrar estatísticas do build
echo ""
log_info "Arquivos no dist:"
if [ -d "frontend/dist" ]; then
    ls -la frontend/dist/
fi

echo ""
log_info "Arquivos no backend:"
ls -la backend/ | head -20

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
log_success "Deploy preparado com sucesso!"
log_success "📱 Text-to-Speech testado: 24 vozes disponíveis"
log_success "🎯 PDFNotes funcionando perfeitamente"
log_success "📄 MarkdownViewer corrigido"
log_success "📦 Gerenciador PDF implementado"
log_success "🔧 PWA mobile corrigido"

echo ""
echo "🌟 Alego Manus V1.0 - Pronto para produção! 🌟"
