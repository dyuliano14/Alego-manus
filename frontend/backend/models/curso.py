from . import db

class Curso(db.Model):
    __tablename__ = 'cursos'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    materias = db.relationship('Materia', backref='curso', lazy='joined')  # 👈 backref singular!
