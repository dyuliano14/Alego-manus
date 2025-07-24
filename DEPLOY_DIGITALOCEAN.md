# 🚀 Deploy DigitalOcean - Alego Manus V1.0

Este guia específico é para deploy no **DigitalOcean App Platform** com auto-deploy via GitHub.

## 📋 Pré-requisitos

1. ✅ Conta no DigitalOcean
2. ✅ Repositório no GitHub (público ou privado)
3. ✅ Código commitado na branch `main`

## 🔧 Configuração Automática

### 1. Arquivos de Configuração Incluídos

O projeto já inclui todos os arquivos necessários:

```
.do/
  ├── app.yaml          # Configuração principal do DO
  └── build.yaml        # Instruções de build

backend/
  ├── wsgi.py           # Entry point WSGI
  ├── procfile          # Processo para execução
  └── requirements.txt  # Dependências Python

frontend/
  ├── package.json      # Scripts de build/start
  └── dist/             # Build assets (gerado)
```

### 2. Variáveis de Ambiente Necessárias

Configure estas variáveis no DigitalOcean:

```bash
# Backend
FLASK_ENV=production
SECRET_KEY=sua-chave-secreta-super-segura-aqui
DATABASE_URL=sqlite:///instance/alego.db
UPLOAD_FOLDER=uploads

# Frontend
VITE_API_URL=https://alego-manus-backend.ondigitalocean.app
```

## 🚀 Processo de Deploy

### Método 1: Via Dashboard DigitalOcean (Recomendado)

1. **Acesse o Dashboard**:
   - Vá para [cloud.digitalocean.com](https://cloud.digitalocean.com)
   - Clique em "Apps" no menu lateral

2. **Criar Nova App**:
   - Clique em "Create App"
   - Selecione "GitHub" como source
   - Conecte seu repositório `dyuliano14/Alego-manus`
   - Branch: `main`

3. **Configuração Automática**:
   - O DigitalOcean detectará automaticamente os arquivos `.do/app.yaml`
   - Ou configure manualmente:

4. **Configuração Manual (se necessário)**:
   
   **Backend Service:**
   ```yaml
   Name: alego-backend
   Source Directory: /backend
   Build Command: pip install -r requirements.txt
   Run Command: gunicorn wsgi:app --bind 0.0.0.0:$PORT
   Environment: Python
   Plan: Basic ($5/mês)
   ```

   **Frontend Service:**
   ```yaml
   Name: alego-frontend  
   Source Directory: /frontend
   Build Command: npm ci && npm run build
   Run Command: npm start
   Environment: Node.js
   Plan: Basic ($5/mês)
   ```

5. **Configurar Variáveis de Ambiente**:
   - Na seção "Environment Variables"
   - Adicione todas as variáveis listadas acima

6. **Deploy**:
   - Clique em "Create Resources"
   - Aguarde o build (~5-10 minutos)

### Método 2: Via CLI (Avançado)

```bash
# Instalar doctl
snap install doctl

# Autenticar
doctl auth init

# Deploy
doctl apps create .do/app.yaml
```

## 📊 Monitoramento

### URLs da Aplicação

Após o deploy, você terá:

- **Frontend**: `https://alego-manus-frontend.ondigitalocean.app`
- **Backend**: `https://alego-manus-backend.ondigitalocean.app`
- **Custom Domain**: Configure seu próprio domínio

### Logs e Métricas

1. **Runtime Logs**:
   - Dashboard → Apps → Sua App → Runtime Logs
   - Útil para debug de problemas

2. **Build Logs**:
   - Veja o progresso do build em tempo real
   - Identifique erros de dependências

3. **Métricas**:
   - CPU, Memory, Network usage
   - Response times e error rates

## 🔄 Auto-Deploy

### Configuração

O auto-deploy está configurado para:
- ✅ **Branch**: `main`
- ✅ **Trigger**: Push para o repositório
- ✅ **Build**: Automático quando detecta mudanças

### Workflow

```bash
# Fazer mudanças localmente
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# DigitalOcean detecta automaticamente
# ↓ Inicia build
# ↓ Deploy automático
# ✅ App atualizada em produção
```

## 💰 Custos Estimados

### Plano Básico (Recomendado)

- **Frontend (Static)**: $0-3/mês
- **Backend (Basic)**: $5/mês  
- **Database**: Incluído (SQLite local)
- **Total**: ~$5-8/mês

### Plano Escalável

- **Frontend (Pro)**: $12/mês
- **Backend (Pro)**: $12/mês
- **Managed Database**: $15/mês
- **Total**: ~$39/mês

## 🐛 Troubleshooting

### Problemas Comuns

1. **Build Failed - Frontend**:
   ```bash
   # Verificar se build funciona localmente
   cd frontend && npm run build
   ```

2. **Build Failed - Backend**:
   ```bash
   # Verificar dependências
   cd backend && pip install -r requirements.txt
   ```

3. **App não carrega**:
   - Verificar variáveis de ambiente
   - Checar logs de runtime
   - Validar URLs de API

4. **CORS Errors**:
   - Verificar VITE_API_URL
   - Confirmar configuração Flask-CORS

### Comandos de Debug

```bash
# Testar localmente antes do deploy
cd frontend && npm run build && npm run preview
cd backend && python wsgi.py

# Verificar variáveis
echo $VITE_API_URL
echo $FLASK_ENV
```

## ✅ Checklist de Deploy

- [ ] ✅ Código commitado na branch `main`
- [ ] ✅ Build local funcionando (`npm run build`)
- [ ] ✅ Backend testado (`python wsgi.py`)
- [ ] ✅ Variáveis de ambiente configuradas
- [ ] ✅ App criada no DigitalOcean
- [ ] ✅ Auto-deploy configurado
- [ ] ✅ URLs funcionando
- [ ] ✅ PWA instalável no mobile

## 🎉 Sucesso!

Quando tudo estiver funcionando:

1. **Frontend**: Acesse sua URL do DigitalOcean
2. **PWA**: Instale no mobile via browser
3. **Funcionalidades**: Teste upload de PDF, conversões, etc.
4. **Performance**: Monitore via dashboard

**Parabéns! Seu Alego Manus V1.0 está em produção! 🚀**

---

## 🔗 Links Úteis

- [DigitalOcean Apps Documentation](https://docs.digitalocean.com/products/app-platform/)
- [Troubleshooting Guide](https://docs.digitalocean.com/products/app-platform/how-to/troubleshoot-builds/)
- [Custom Domains](https://docs.digitalocean.com/products/app-platform/how-to/manage-domains/)
