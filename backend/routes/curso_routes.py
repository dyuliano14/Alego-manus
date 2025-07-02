from flask import Blueprint, request, jsonify, abort
from models import db
from models.curso import Curso

bp = Blueprint("cursos", __name__, url_prefix="/api/cursos")

@bp.route("", methods=["GET"])
def get_cursos():
    curs = Curso.query.all()
    return jsonify([{"id": c.id, "nome": c.nome} for c in curs])

@bp.route("", methods=["POST"])
def create_curso():
    data = request.get_json()
    if not data.get("nome"):
        abort(400, "nome é obrigatório")
    c = Curso(nome=data["nome"])
    db.session.add(c); db.session.commit()
    return jsonify({"id": c.id, "nome": c.nome}), 201

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
