# Script de limpeza para Render
Write-Host "Limpando arquivos desnecessarios para deploy no Render..." -ForegroundColor Yellow

# Arquivos Docker (nao usado no Render)
if (Test-Path "docker-compose.yml") { Remove-Item "docker-compose.yml" -Force }
if (Test-Path "Dockerfile") { Remove-Item "Dockerfile" -Force }
if (Test-Path "nginx.conf") { Remove-Item "nginx.conf" -Force }

# Scripts bash desnecessarios
if (Test-Path "deploy.sh") { Remove-Item "deploy.sh" -Force }
if (Test-Path "dev-start.sh") { Remove-Item "dev-start.sh" -Force }

# Pasta static duplicada na raiz
if (Test-Path "static") { Remove-Item "static" -Recurse -Force }

# Arquivos config duplicados na raiz (devem ficar so no frontend)
if (Test-Path "package.json") { Remove-Item "package.json" -Force }
if (Test-Path "package-lock.json") { Remove-Item "package-lock.json" -Force }
if (Test-Path "postcss.config.js") { Remove-Item "postcss.config.js" -Force }
if (Test-Path "tailwind.config.js") { Remove-Item "tailwind.config.js" -Force }
if (Test-Path "tsconfig.json") { Remove-Item "tsconfig.json" -Force }
if (Test-Path "vite.config.ts") { Remove-Item "vite.config.ts" -Force }
if (Test-Path "node_modules") { Remove-Item "node_modules" -Recurse -Force }

# Pasta static duplicada no frontend
if (Test-Path "frontend/static") { Remove-Item "frontend/static" -Recurse -Force }

# Service worker duplicado
if (Test-Path "frontend/service-worker.js") { Remove-Item "frontend/service-worker.js" -Force }

# Arquivos temporarios de debug
if (Test-Path "attached_assets") { Remove-Item "attached_assets" -Recurse -Force }

Write-Host "Limpeza concluida!" -ForegroundColor Green
Write-Host "Arquivos removidos:" -ForegroundColor Cyan
Write-Host "- Docker files (docker-compose.yml, Dockerfile, nginx.conf)"
Write-Host "- Scripts bash desnecessarios"
Write-Host "- Configs duplicados na raiz"
Write-Host "- Pastas static duplicadas"
Write-Host "- Service workers duplicados"
Write-Host "- Arquivos temporarios de debug (attached_assets)"
