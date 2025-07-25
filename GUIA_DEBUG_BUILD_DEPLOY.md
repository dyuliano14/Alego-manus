# Guia de Debug, Build e Deploy

Este guia explica como depurar (debug), construir (build) e preparar o projeto para subir para o servidor (deploy), tanto no backend quanto no frontend.

---

## 1. Debug (Depuração)

### Frontend

- Use o comando `npm run dev` ou `yarn dev` para rodar o frontend em modo desenvolvimento
- O Vite/React mostra erros no navegador e no terminal
- Use o console do navegador (F12) para ver logs, erros e warnings
- Edite componentes e veja o resultado em tempo real (hot reload)

### Backend

- Rode `python app.py` para iniciar o backend em modo debug
- Mensagens de erro aparecem no terminal
- Use endpoints de debug (`/api/debug/health`, `/api/debug/db`, etc) para testar o backend
- Adicione prints ou logs para investigar problemas

---

## 2. Build (Construção)

### Frontend

- Rode `npm run build` ou `yarn build` para gerar a versão otimizada do frontend
- Os arquivos finais ficam em `frontend/dist/`
- Essa pasta pode ser servida por um servidor web (Nginx, Vercel, etc)

### Backend

- Não precisa de build, mas garanta que todas as dependências estão no `requirements.txt`
- Se for usar Docker, crie um `Dockerfile` e rode `docker build`

---

## 3. Deploy (Subir para o Servidor)

### Frontend

- Faça upload do conteúdo de `dist/` para o servidor web
- Configure o domínio e HTTPS se necessário

### Backend

- Suba o código para o servidor (via git, FTP, etc)
- Instale as dependências: `pip install -r requirements.txt`
- Configure variáveis de ambiente (ex: `DATABASE_URL`, `SECRET_KEY`)
- Rode o backend com um servidor WSGI (ex: Gunicorn) ou via Docker
- Configure o banco de dados (PostgreSQL, SQLite, etc)

---

## Dicas Finais

- Sempre teste localmente antes de subir para produção
- Use logs para monitorar erros em produção
- Mantenha backups do banco de dados
- Documente comandos e variáveis importantes

Se quiser exemplos de arquivos de configuração (Dockerfile, render.yaml, etc), só pedir!
