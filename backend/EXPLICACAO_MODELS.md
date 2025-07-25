# Explicação dos Modelos de Dados (models)

Os modelos de dados representam as tabelas do banco de dados. Cada modelo é uma classe Python que herda de `db.Model` (SQLAlchemy).

## Principais Modelos

- **Curso**: Representa um curso (ex: Direito, Administração)
- **Materia**: Representa uma matéria/disciplina de um curso
- **Conteudo**: Representa um conteúdo (ex: PDF, texto, vídeo) vinculado a uma matéria
- **Anotacao**: Representa anotações feitas pelo usuário em um conteúdo
- **Upload**: Representa arquivos enviados (uploads) para o sistema

## Estrutura de um Modelo

Cada modelo tem:

- Campos (colunas do banco)
- Relacionamentos (ex: um curso tem várias matérias)
- Métodos auxiliares (ex: `to_dict()` para converter para dicionário)

## Exemplo Simplificado

```python
class Curso(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    materias = db.relationship('Materia', backref='curso', lazy=True)

    def to_dict(self, include_materias=False):
        data = {
            'id': self.id,
            'nome': self.nome,
            'descricao': self.descricao,
            'created_at': self.created_at.isoformat()
        }
        if include_materias:
            data['materias'] = [m.to_dict() for m in self.materias]
        return data
```

## Dicas

- Os modelos ficam em `backend/models/` ou em `database.py`.
- Sempre que mudar um modelo, é preciso atualizar o banco (resetar ou migrar).
- Use o método `to_dict()` para retornar dados em JSON para o frontend.

Se quiser ver cada modelo detalhado, abra os arquivos em `backend/models/`.
