from flask import Blueprint, jsonify
from models import db
from models.curso import Curso
from models.materia import Materia
from models.conteudo import Conteudo
from models.anotacao import Anotacao
from models.upload import Upload

bp = Blueprint("debug", __name__, url_prefix="/api/debug")

@bp.route("/db", methods=["GET"])
def show_all_data():
    cursos = Curso.query.all()
    materias = Materia.query.all()
    conteudos = Conteudo.query.all()
    anotacoes = Anotacao.query.all()
    uploads = Upload.query.all()

    return jsonify({
        "cursos": [{"id": c.id, "nome": c.nome} for c in cursos],
        "materias": [{"id": m.id, "nome": m.nome, "curso_id": m.curso_id} for m in materias],
        "conteudos": [
            {"id": c.id, "titulo": c.titulo, "tipo": c.tipo, "arquivo": c.arquivo, "materia_id": c.materia_id}
            for c in conteudos
        ],
        "anotacoes": [{"id": a.id, "texto": a.texto, "conteudo_id": a.conteudo_id} for a in anotacoes],
        "uploads": [{"id": u.id, "filename": u.filename, "url": u.url} for u in uploads],
    }), 200


@bp.route("/reset", methods=["POST"])
def reset_db():
    db.session.query(Anotacao).delete()
    db.session.query(Conteudo).delete()
    db.session.query(Materia).delete()
    db.session.query(Curso).delete()
    db.session.query(Upload).delete()
    db.session.commit()

    return jsonify({"ok": True, "mensagem": "Banco de dados limpo com sucesso!"})


@bp.route("/seed", methods=["POST"])
def seed_db():
    db.session.query(Anotacao).delete()
    db.session.query(Conteudo).delete()
    db.session.query(Materia).delete()
    db.session.query(Curso).delete()
    db.session.query(Upload).delete()

    curso = Curso(nome="Curso de Teste")
    db.session.add(curso)
    db.session.commit()

    materia = Materia(nome="Matéria de Teste", curso_id=curso.id)
    db.session.add(materia)
    db.session.commit()

    conteudo = Conteudo(
        titulo="PDF Teste",
        tipo="pdf",
        arquivo="https://www.africau.edu/images/default/sample.pdf",
        materia_id=materia.id
    )
    db.session.add(conteudo)
    db.session.commit()

    anotacao = Anotacao(texto="Anotação de exemplo", conteudo_id=conteudo.id)
    db.session.add(anotacao)
    db.session.commit()

    upload = Upload(filename="sample.pdf", url="https://www.africau.edu/images/default/sample.pdf")
    db.session.add(upload)
    db.session.commit()

    return jsonify({
        "ok": True,
        "mensagem": "Dados de teste criados com sucesso!",
        "ids": {
            "curso_id": curso.id,
            "materia_id": materia.id,
            "conteudo_id": conteudo.id,
            "anotacao_id": anotacao.id,
            "upload_id": upload.id,
        }
    })
