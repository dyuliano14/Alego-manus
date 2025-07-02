from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Curso(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String, nullable=False)
    materias = db.relationship("Materia", backref="curso", cascade="all, delete-orphan")

class Materia(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String, nullable=False)
    curso_id = db.Column(db.Integer, db.ForeignKey("curso.id"), nullable=False)
    conteudos = db.relationship("Conteudo", backref="materia", cascade="all, delete-orphan")

class Conteudo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String, nullable=False)
    tipo = db.Column(db.String, nullable=False)
    arquivo = db.Column(db.String, nullable=False)
    materia_id = db.Column(db.Integer, db.ForeignKey("materia.id"), nullable=False)
    anotacoes = db.relationship("Anotacao", backref="conteudo", cascade="all, delete-orphan")

class Anotacao(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    conteudo_id = db.Column(db.Integer, db.ForeignKey("conteudo.id"), nullable=False)
    texto = db.Column(db.String, nullable=False)
