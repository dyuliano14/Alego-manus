# Script de deploy para Render (PowerShell)
Write-Host "🚀 Iniciando deploy para Render..." -ForegroundColor Green

# 1. Verificar status do git
Write-Host "📋 Verificando status do Git..." -ForegroundColor Yellow
git status

# 2. Adicionar todas as mudanças
Write-Host "📦 Adicionando arquivos modificados..." -ForegroundColor Yellow
git add .

# 3. Fazer commit das mudanças
Write-Host "💾 Fazendo commit das mudanças..." -ForegroundColor Yellow
$commitMessage = Read-Host "Digite a mensagem do commit"
git commit -m $commitMessage

# 4. Push para o repositório
Write-Host "🔄 Enviando para o repositório..." -ForegroundColor Yellow
git push origin main

Write-Host "✅ Deploy concluído!" -ForegroundColor Green
Write-Host "🌐 Acesse: https://alego-manus.onrender.com" -ForegroundColor Cyan
Write-Host "⏰ O Render pode levar alguns minutos para fazer o build..." -ForegroundColor Yellow

# 5. Verificar logs de deploy
Write-Host ""
Write-Host "📊 Para verificar os logs:" -ForegroundColor Magenta
Write-Host "1. Acesse https://dashboard.render.com"
Write-Host "2. Vá para o seu serviço 'alego-manus'"
Write-Host "3. Clique na aba 'Logs' para acompanhar o deployment"
