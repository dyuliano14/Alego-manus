from . import db

class Anotacao(db.Model):
    __tablename__ = "anotacao"
    id = db.Column(db.Integer, primary_key=True)
    conteudo_id = db.Column(db.Integer, db.ForeignKey("conteudo.id"), nullable=False)
    texto = db.Column(db.Text, nullable=False)
