from . import db

class Curso(db.Model):
    __tablename__ = "curso"
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String, nullable=False)
    materias = db.relationship(
        "Materia", backref="curso", cascade="all, delete-orphan"
    )
