# backend/database.py
import os
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Curso(db.Model):
    __tablename__ = 'cursos'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text, default='')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    materias = db.relationship('Materia', backref='curso', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'descricao': self.descricao,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Materia(db.Model):
    __tablename__ = 'materias'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    curso_id = db.Column(db.Integer, db.ForeignKey('cursos.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    conteudos = db.relationship('Conteudo', backref='materia', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'curso_id': self.curso_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Conteudo(db.Model):
    __tablename__ = 'conteudos'
    
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200), nullable=False)
    tipo = db.Column(db.String(50), default='pdf')
    arquivo = db.Column(db.String(255), default='')
    conteudo_texto = db.Column(db.Text, default='')  # Para texto extraído do PDF
    materia_id = db.Column(db.Integer, db.ForeignKey('materias.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    anotacoes = db.relationship('Anotacao', backref='conteudo', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'titulo': self.titulo,
            'tipo': self.tipo,
            'arquivo': self.arquivo,
            'conteudo_texto': self.conteudo_texto,
            'materia_id': self.materia_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Anotacao(db.Model):
    __tablename__ = 'anotacoes'
    
    id = db.Column(db.Integer, primary_key=True)
    texto = db.Column(db.Text, nullable=False)
    conteudo_id = db.Column(db.Integer, db.ForeignKey('conteudos.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'texto': self.texto,
            'conteudo_id': self.conteudo_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Upload(db.Model):
    __tablename__ = 'uploads'
    
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    file_size = db.Column(db.Integer, default=0)
    mime_type = db.Column(db.String(100), default='')
    conteudo_extraido = db.Column(db.Text, default='')  # Texto extraído do PDF
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'filename': self.filename,
            'original_filename': self.original_filename,
            'file_path': self.file_path,
            'file_size': self.file_size,
            'mime_type': self.mime_type,
            'conteudo_extraido': self.conteudo_extraido,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

def init_database(app):
    """Inicializa o banco de dados"""
    db.init_app(app)
    
    with app.app_context():
        # Criar todas as tabelas
        db.create_all()
        
        # Seed inicial (se não houver dados)
        if Curso.query.count() == 0:
            seed_initial_data()

def seed_initial_data():
    """Popula dados iniciais"""
    # Cursos
    curso1 = Curso(nome="Direito Constitucional", descricao="Fundamentos do Direito Constitucional")
    curso2 = Curso(nome="Direito Administrativo", descricao="Princípios e práticas do Direito Administrativo")
    
    db.session.add(curso1)
    db.session.add(curso2)
    db.session.commit()
    
    # Matérias
    materias = [
        Materia(nome="Princípios Fundamentais", curso_id=curso1.id),
        Materia(nome="Direitos e Garantias", curso_id=curso1.id),
        Materia(nome="Organização do Estado", curso_id=curso1.id),
        Materia(nome="Princípios Administrativos", curso_id=curso2.id),
        Materia(nome="Atos Administrativos", curso_id=curso2.id),
        Materia(nome="Licitações e Contratos", curso_id=curso2.id),
    ]
    
    for materia in materias:
        db.session.add(materia)
    
    db.session.commit()
    
    # Conteúdos de exemplo
    conteudos = [
        Conteudo(titulo="Constituição Federal - Artigos 1º a 5º", tipo="pdf", materia_id=1),
        Conteudo(titulo="Direitos Individuais e Coletivos", tipo="pdf", materia_id=2),
        Conteudo(titulo="Separação dos Poderes", tipo="pdf", materia_id=3),
        Conteudo(titulo="Princípios da Administração Pública", tipo="pdf", materia_id=4),
    ]
    
    for conteudo in conteudos:
        db.session.add(conteudo)
    
    db.session.commit()
    print("✅ Dados iniciais inseridos no banco PostgreSQL!")
