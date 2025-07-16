from . import db

class Conteudo(db.Model):
    __tablename__ = "conteudos"

    id = db.Column(db.Integer, primary_key=True)  # 🆔 Coluna ID
    titulo = db.Column(db.String, nullable=False)  # 📌 Título do conteúdo
    tipo = db.Column(db.String, nullable=False)    # 📁 Tipo: "pdf", "markdown", etc
    arquivo = db.Column(db.String, nullable=False) # 🔗 URL ou caminho do arquivo
    materia_id = db.Column(db.Integer, db.ForeignKey("materias.id"), nullable=False)

    anotacoes = db.relationship(
        "Anotacao",                # 👈 Classe relacionada
        backref="conteudo",        # 👈 Cada anotação pode acessar `anotacao.conteudo`
        cascade="all, delete-orphan"  # 👈 Apaga todas as anotações se esse conteúdo for excluído!!
    )

