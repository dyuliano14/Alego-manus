from flask import Blueprint, jsonify, abort, request
from models import db
from models.curso import Curso
from models.materia import Materia

bp = Blueprint("cursos", __name__, url_prefix="/api/cursos")

@bp.route("", methods=["GET"])
def listar_cursos():
    cursos = Curso.query.all()
    resultado = []

    for curso in cursos:
        resultado.append({
            "id": curso.id,
            "nome": curso.nome,
            "materias": [
                {"id": m.id, "nome": m.nome}
                for m in curso.materias
            ]
        })
    return jsonify(resultado)

@bp.route("", methods=["POST"])
def criar_curso():
    data = request.get_json()
    nome = data.get("nome")
    if not nome:
        abort(400, "Nome é obrigatório")
    curso = Curso(nome=nome)
    db.session.add(curso)
    db.session.commit()
    return jsonify({"id": curso.id, "nome": curso.nome, "materias": []}), 201

@bp.route("/<int:id>", methods=["PUT"])
def update_curso(id):
    c = Curso.query.get_or_404(id)
    data = request.get_json()
    c.nome = data.get("nome", c.nome)
    db.session.commit()
    return jsonify({"id": c.id, "nome": c.nome})

@bp.route("/<int:id>", methods=["DELETE"])
def delete_curso(id):
    c = Curso.query.get_or_404(id)
    db.session.delete(c); db.session.commit()
    return jsonify({}), 204
