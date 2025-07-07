📚 Alego Manus – Backend API
API Flask para gerenciamento de cursos, matérias, conteúdos e anotações no projeto Alego Manus.

🧠 Estrutura do Banco de Dados
Curso

id: int

nome: string

materias: [Matéria]

Matéria

id: int

nome: string

curso_id: FK → Curso

conteudos: [Conteúdo]

Conteúdo

id: int

titulo: string

tipo: string (pdf | markdown | video)

arquivo: string

materia_id: FK → Matéria

anotacoes: [Anotação]

Anotação

id: int

texto: string

conteudo_id: FK → Conteúdo

🔌 Endpoints da API
📘 Cursos
GET /api/cursos
Retorna todos os cursos com suas matérias (nome e id).

json
Copiar
Editar
[
  {
    "id": 1,
    "nome": "Curso de Teste",
    "materias": [
      { "id": 1, "nome": "Matéria de Teste" }
    ]
  }
]
POST /api/cursos

json
Copiar
Editar
{
  "nome": "Novo Curso"
}
✅ Retorno:

json
Copiar
Editar
{
  "id": 2,
  "nome": "Novo Curso",
  "materias": []
}
PUT /api/cursos/<id>

json
Copiar
Editar
{
  "nome": "Nome Atualizado"
}
DELETE /api/cursos/<id>

📕 Matérias
GET /api/materias
Retorna todas as matérias com o curso vinculado.

json
Copiar
Editar
[
  { "id": 1, "nome": "Matéria A", "curso_id": 1 }
]
POST /api/materias

json
Copiar
Editar
{
  "nome": "Nova Matéria",
  "curso_id": 1
}
PUT /api/materias/<id>

DELETE /api/materias/<id>

📗 Conteúdos
GET /api/conteudos

POST /api/conteudos

json
Copiar
Editar
{
  "titulo": "Título do PDF",
  "tipo": "pdf",
  "arquivo": "https://site.com/arquivo.pdf",
  "materia_id": 1
}
PUT /api/conteudos/<id>

DELETE /api/conteudos/<id>

📝 Anotações
GET /api/anotacoes/<conteudo_id>

Retorna todas as anotações associadas ao conteúdo.

POST /api/anotacoes/<conteudo_id>

json
Copiar
Editar
[
  "Texto da anotação 1",
  "Texto da anotação 2"
]
⚠️ Esse endpoint sobrescreve todas as anotações existentes para o conteúdo fornecido.

🛠️ Debug Helpers
GET /api/debug/db
Lista toda a estrutura e registros existentes.

POST /api/debug/reset
Limpa o banco de dados.

POST /api/debug/seed
Popula o banco com dados de exemplo.

🧪 Testando Localmente
bash
Copiar
Editar
# No diretório /backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

flask run
Acesse: http://localhost:5000/api/cursos