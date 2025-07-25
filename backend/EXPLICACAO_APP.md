# Explicação Detalhada do app.py

Este arquivo explica, de forma didática, o funcionamento do `app.py`, que é o coração do backend do Alego Manus.

## O que é o app.py?

É o arquivo principal da aplicação Flask. Ele:

- Cria e configura o app Flask
- Define as configurações do banco de dados
- Inicializa o banco
- Registra todos os endpoints (rotas) da API
- Faz a ponte entre o frontend e o banco de dados

## Estrutura Geral

- **Importações**: Traz todas as bibliotecas e módulos necessários.
- **Configuração**: Define variáveis de ambiente, banco de dados, uploads, etc.
- **Inicialização**: Prepara o banco de dados e diretórios.
- **Endpoints**: Funções que respondem às requisições HTTP (GET, POST, etc).

## Principais Blocos

### 1. Importações

Importa Flask, CORS, utilitários, dotenv, pdf2docx e os modelos do banco.

### 2. Configuração do App

- Cria o app Flask
- Ativa o CORS
- Define a URL do banco (SQLite local ou PostgreSQL)
- Configura uploads

### 3. Inicialização do Banco

Chama `init_database(app)` para criar as tabelas e conectar o banco.

### 4. Endpoints de Debug

- `/api/debug/health`: Testa se o backend e o banco estão funcionando
- `/api/debug/env`: Mostra variáveis de ambiente (apenas dev)
- `/api/debug/db`: Mostra estatísticas do banco
- `/api/debug/reset`: Limpa todas as tabelas
- `/api/debug/seed`: Popula dados iniciais
- `/api/debug/routes`: Lista todas as rotas

### 5. Endpoints Principais

- `/api/cursos`: CRUD de cursos
- `/api/materias`: CRUD de matérias
- `/api/conteudos`: CRUD de conteúdos
- `/api/anotacoes/<conteudo_id>`: CRUD de anotações
- `/api/upload`: Upload de arquivos
- `/api/upload-base64`: Upload alternativo via base64
- `/api/pdf/convert`: Converte PDF para DOCX

### 6. Root Endpoints

- `/` e `/api/`: Mostram status do backend

## Dicas para Estudo

- Cada endpoint é uma função Python decorada com `@app.route`.
- O banco é manipulado via SQLAlchemy (ORM), usando métodos como `.query`, `.add`, `.commit`.
- O upload de arquivos usa `secure_filename` para evitar problemas de segurança.
- O endpoint de conversão usa a biblioteca `pdf2docx` para transformar PDF em Word.

## Recomendações

- Leia o código comentado para entender cada parte.
- Consulte também os arquivos de explicação dos modelos e rotas para ver como tudo se conecta.
- Se tiver dúvidas, pesquise sobre Flask, SQLAlchemy e REST API.
