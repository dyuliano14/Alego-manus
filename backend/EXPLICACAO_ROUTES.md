# Explicação das Rotas (Endpoints)

As rotas (ou endpoints) são funções que respondem a requisições HTTP feitas pelo frontend ou por outros sistemas. Cada rota é definida com um decorator `@app.route`.

## Como funciona uma rota?

- O decorator `@app.route` define o caminho (URL) e os métodos aceitos (GET, POST, etc).
- A função associada executa a lógica e retorna uma resposta (geralmente JSON).

## Exemplos de Rotas

### 1. Endpoints de Debug

- `/api/debug/health`: Verifica se o backend e o banco estão funcionando.
- `/api/debug/env`: Mostra variáveis de ambiente (apenas em desenvolvimento).
- `/api/debug/db`: Mostra estatísticas do banco.
- `/api/debug/reset`: Limpa todas as tabelas do banco.
- `/api/debug/seed`: Popula o banco com dados iniciais.
- `/api/debug/routes`: Lista todas as rotas disponíveis.

### 2. Endpoints Principais

- `/api/cursos`: CRUD de cursos (criar, listar, editar, deletar)
- `/api/materias`: CRUD de matérias
- `/api/conteudos`: CRUD de conteúdos
- `/api/anotacoes/<conteudo_id>`: CRUD de anotações para um conteúdo
- `/api/upload`: Upload de arquivos
- `/api/upload-base64`: Upload alternativo via base64
- `/api/pdf/convert`: Converte PDF para DOCX

### 3. Endpoints Root

- `/` e `/api/`: Mostram status do backend

## Dicas

- Para cada entidade (curso, matéria, etc), existe um endpoint principal.
- Os métodos HTTP mais usados são GET (buscar), POST (criar), PUT (editar), DELETE (remover).
- As respostas geralmente são em formato JSON.
- O upload de arquivos é feito via POST, usando `request.files`.

Se quiser ver a lógica de cada rota, procure pela função decorada com `@app.route` no `app.py`.
