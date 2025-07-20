# Script de deploy para DigitalOcean App Platform
Write-Host "Iniciando deploy para DigitalOcean App Platform..." -ForegroundColor Green

# Verificar se estamos no diretorio correto
if (!(Test-Path ".do\app.yaml") -and !(Test-Path "frontend")) {
    Write-Host "Erro: Execute o script na raiz do projeto Alego-manus!" -ForegroundColor Red
    exit 1
}

# 1. Build do frontend
Write-Host "Fazendo build do frontend..." -ForegroundColor Yellow
Set-Location "frontend"
if (Test-Path "node_modules") {
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Erro no build do frontend!" -ForegroundColor Red
        Set-Location ".."
        exit 1
    }
}
else {
    Write-Host "Instalando dependencias do frontend..." -ForegroundColor Yellow
    npm install
    npm run build
}
Set-Location ".."

# 2. Verificar dependencias do backend
Write-Host "Verificando dependencias do backend..." -ForegroundColor Yellow
if (!(Test-Path "backend\requirements.txt")) {
    Write-Host "Erro: requirements.txt nao encontrado!" -ForegroundColor Red
    exit 1
}

# 3. Verificar status do git
Write-Host "Verificando status do Git..." -ForegroundColor Yellow
git status

# 4. Adicionar todas as mudancas
Write-Host "Adicionando arquivos modificados..." -ForegroundColor Yellow
git add .

# 5. Verificar se ha mudancas para commit
$status = git status --porcelain
if ([string]::IsNullOrEmpty($status)) {
    Write-Host "Nenhuma mudanca detectada para commit." -ForegroundColor Blue
    Write-Host "Acesse o DigitalOcean Dashboard para verificar o status do app." -ForegroundColor Cyan
    exit 0
}

# 6. Fazer commit das mudancas
Write-Host "Fazendo commit das mudancas..." -ForegroundColor Yellow
$commitMessage = Read-Host "Digite a mensagem do commit"
if ([string]::IsNullOrEmpty($commitMessage)) {
    $commitMessage = "Deploy DigitalOcean: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    Write-Host "Usando mensagem padrao: $commitMessage" -ForegroundColor Gray
}
git commit -m $commitMessage

# 7. Push para o repositorio
Write-Host "Enviando para o repositorio..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "Deploy iniciado com sucesso!" -ForegroundColor Green
    Write-Host "DigitalOcean detectara as mudancas e fara deploy automatico." -ForegroundColor Cyan
    Write-Host "O deploy pode levar 3-7 minutos para conclusao..." -ForegroundColor Yellow
}
else {
    Write-Host "Erro no push! Verifique sua conexao e credenciais." -ForegroundColor Red
    exit 1
}

# 8. Informacoes uteis
Write-Host ""
Write-Host "Para monitorar o deploy:" -ForegroundColor Magenta
Write-Host "1. Dashboard: https://cloud.digitalocean.com/apps" -ForegroundColor White
Write-Host "2. Selecione o app 'alego-manus'" -ForegroundColor White
Write-Host "3. Aba 'Runtime Logs' para acompanhar o progresso" -ForegroundColor White
Write-Host ""
Write-Host "Configuracoes importantes:" -ForegroundColor Yellow
Write-Host "- Backend: Python/Flask com PostgreSQL" -ForegroundColor White
Write-Host "- Frontend: Static site (React/Vite)" -ForegroundColor White  
Write-Host "- Database: Managed PostgreSQL 14" -ForegroundColor White
Write-Host "- Auto-deploy: Ativado no push para main" -ForegroundColor White
