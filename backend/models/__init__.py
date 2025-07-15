from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Importar modelos para registrar no metadata do SQLAlchemy
from .curso import Curso
from .materia import Materia
from .conteudo import Conteudo
from .anotacao import Anotacao
from .upload import Upload

