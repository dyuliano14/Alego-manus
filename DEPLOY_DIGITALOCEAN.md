# Deploy Alego-manus no DigitalOcean

## 📋 Pré-requisitos

1. ✅ Conta GitHub Student Pack
2. ✅ Conta DigitalOcean (com créditos $200)
3. ✅ Repositório GitHub: `dyuliano14/Alego-manus`

## 🚀 Passos para Deploy

### 1. Criar App no DigitalOcean

1. Acesse [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Clique em **"Create App"**
3. Escolha **"GitHub"** como fonte
4. Selecione o repositório: `dyuliano14/Alego-manus`
5. Branch: `main`
6. **Importar configuração**: Marque a opção "Use existing app spec file"
7. Arquivo: `.do/app.yaml`

### 2. Configurar Banco de Dados

O PostgreSQL será criado automaticamente pela configuração `.do/app.yaml`:

- **Engine**: PostgreSQL 14
- **Size**: Development (free tier)
- **Nome**: `alego-db`

### 3. Configurar Domínio (Opcional)

1. No dashboard do app, vá para **"Settings"**
2. **"Domains"** → **"Add Domain"**
3. Configure seu domínio personalizado

### 4. Deploy Automático

Executar o script:

```powershell
.\deploy-digitalocean.ps1
```

Ou manualmente:

```bash
git add .
git commit -m "Deploy to DigitalOcean"
git push origin main
```

## 🔧 Configurações

### Backend (Python/Flask)

- **Runtime**: Python 3.11
- **Build Command**: Automático (pip install -r requirements.txt)
- **Run Command**: `gunicorn --bind 0.0.0.0:$PORT app:app`
- **Port**: 5000
- **Routes**: `/api`

### Frontend (React/Vite)

- **Type**: Static Site
- **Build Command**: `npm ci && npm run build`
- **Output Directory**: `/dist`
- **Routes**: `/` (catch-all)

### Database (PostgreSQL)

- **Version**: 14
- **Connection**: Automática via `DATABASE_URL`
- **Size**: Development (1 CPU, 1GB RAM, 10GB Storage)

## 🌐 URLs Finais

Após deploy completo:

- **App**: https://alego-manus-[random].ondigitalocean.app
- **Backend API**: https://alego-manus-[random].ondigitalocean.app/api
- **Admin Panel**: https://alego-manus-[random].ondigitalocean.app/admin

## 📊 Monitoramento

1. **Dashboard**: https://cloud.digitalocean.com/apps
2. **Runtime Logs**: Para debug e monitoramento
3. **Metrics**: CPU, Memory, Requests
4. **Database**: Conexões, queries, performance

## 💰 Custos (com Student Pack)

- **$200 créditos grátis** cobrem ~6 meses
- **Backend**: ~$5/mês (Basic)
- **Database**: ~$7/mês (Dev tier)
- **Frontend**: Grátis (static)
- **Total**: ~$12/mês (coberto pelos créditos)

## 🔧 Troubleshooting

### Build Fails

- Verificar logs no dashboard
- Conferir `requirements.txt` e `package.json`
- Checar configuração `.do/app.yaml`

### Database Connection Issues

- Verificar `DATABASE_URL` nas env vars
- Logs do backend para erros de conexão
- Health check: `/api/debug/health`

### Frontend Não Carrega

- Verificar build do Vite
- Conferir rotas no `.do/app.yaml`
- Cache do navegador (Ctrl+F5)

## 📞 Suporte

- [Documentação DigitalOcean](https://docs.digitalocean.com/products/app-platform/)
- [Community Forum](https://www.digitalocean.com/community/questions)
- GitHub Issues neste repositório
