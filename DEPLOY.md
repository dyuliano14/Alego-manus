# 🚀 Deploy do Alego Manus

## ✅ Status das Correções Implementadas

### Frontend
- ✅ **PDFNotes funcionando** com CSS inline
- ✅ **Text-to-Speech otimizado** para dispositivos móveis (24 vozes disponíveis)
- ✅ **MarkdownViewer corrigido** com sintaxe adequada
- ✅ **Tailwind CSS configurado** corretamente
- ✅ **Build de produção** gerado em `frontend/dist/`

### Backend
- ✅ **Serve arquivos estáticos** do frontend
- ✅ **APIs funcionando** para anotações, cursos, conteúdos
- ✅ **CORS configurado** para produção
- ✅ **Procfile e wsgi.py** preparados para deploy

## 🔧 Como fazer Deploy

### 1. Deploy no Heroku (Recomendado)

```bash
# 1. Instale o Heroku CLI
# 2. Faça login
heroku login

# 3. Crie a aplicação
heroku create seu-app-alego-manus

# 4. Defina a pasta do backend como raiz
echo "backend/" > .git/.gitsubtree

# 5. Deploy
git subtree push --prefix=backend heroku main
```

### 2. Deploy no Railway

```bash
# 1. Instale Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Deploy
railway deploy
```

### 3. Deploy no Render

1. Conecte seu repositório GitHub
2. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn wsgi:app`

## 📁 Estrutura para Deploy

```
backend/
├── app.py              # Servidor Flask principal
├── wsgi.py             # Entry point para produção
├── Procfile            # Configuração Heroku
├── requirements.txt    # Dependências Python
├── models/             # Modelos do banco
├── routes/             # Rotas da API
└── ../frontend/dist/   # Frontend buildado (servido pelo Flask)
```

## 🌐 URLs da Aplicação

- **Frontend**: `https://seu-app.herokuapp.com/`
- **API**: `https://seu-app.herokuapp.com/api/`
- **Upload**: `https://seu-app.herokuapp.com/uploads/`

## 📱 Funcionalidades Testadas

### ✅ Text-to-Speech Mobile
- **24 vozes disponíveis** detectadas
- **Configuração otimizada** para iOS/Android
- **Botões responsivos** com feedback visual
- **Tratamento de erros** robusto

### ✅ PDFNotes
- **Botões flutuantes** funcionando
- **CSS inline** para máxima compatibilidade
- **Sistema de anotações** operacional

### ✅ MarkdownViewer
- **Sintaxe corrigida** e funcional
- **Carregamento de arquivos** por prop/URL
- **Renderização GitHub-flavored** markdown

## 🐛 Debug em Produção

Se houver problemas, verifique:

1. **Logs do servidor**: `heroku logs --tail`
2. **Console do navegador**: F12 > Console
3. **Network tab**: Verificar requests da API
4. **Text-to-Speech**: Console mostra vozes disponíveis

## 🔑 Variáveis de Ambiente

```bash
# Adicione se necessário
heroku config:set FLASK_ENV=production
heroku config:set DATABASE_URL=seu-database-url
```

---

**🎯 A aplicação está pronta para deploy com todas as correções implementadas!**
