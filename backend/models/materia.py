from . import db

class Materia(db.Model):
    __tablename__ = "materia"
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String, nullable=False)
    curso_id = db.Column(db.Integer, db.ForeignKey("curso.id"), nullable=False)
    conteudos = db.relationship(
        "Conteudo", backref="materia", cascade="all, delete-orphan"
    )
