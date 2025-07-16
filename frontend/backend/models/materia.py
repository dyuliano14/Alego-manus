from . import db

class Materia(db.Model):
    __tablename__ = "materias"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    curso_id = db.Column(db.Integer, db.ForeignKey("cursos.id"), nullable=False)

    conteudos = db.relationship(
        "Conteudo", backref="materia", cascade="all, delete-orphan"
    )
