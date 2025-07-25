# Explicação do Banco de Dados (Visão Geral)

O banco de dados do Alego Manus armazena todas as informações essenciais do sistema: cursos, matérias, conteúdos, anotações e uploads. Ele é gerenciado pelo SQLAlchemy (ORM do Flask), que permite manipular dados usando Python ao invés de SQL puro.

## Estrutura do Banco

- **Curso**: Tabela de cursos (ex: Direito, Administração)
- **Materia**: Tabela de matérias/disciplina, vinculada a um curso
- **Conteudo**: Tabela de conteúdos (PDFs, textos, vídeos), vinculada a uma matéria
- **Anotacao**: Tabela de anotações feitas pelo usuário em um conteúdo
- **Upload**: Tabela de arquivos enviados para o sistema

## Como funciona

- Cada tabela é representada por uma classe Python (modelo) em `models/` ou `database.py`
- Os relacionamentos (ex: um curso tem várias matérias) são definidos nos modelos
- O SQLAlchemy cuida de criar, consultar, atualizar e deletar registros

## Fluxo de Criação e Uso

1. O backend inicializa o banco ao rodar `init_database(app)`
2. Se o banco não existir, as tabelas são criadas automaticamente
3. O backend usa métodos como `.query`, `.add`, `.commit` para manipular os dados
4. O frontend consome os dados via API (endpoints)

## Dicas para Estudo

- Veja os modelos em `backend/models/` ou `database.py` para entender os campos e relações
- Sempre que mudar um modelo, é preciso resetar ou migrar o banco
- Use os endpoints de debug (`/api/debug/db`, `/api/debug/reset`, `/api/debug/seed`) para testar o banco

Se quiser explicações detalhadas de cada modelo ou exemplos de queries, é só pedir!
