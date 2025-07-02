from flask import Blueprint, request, jsonify, abort
from models import db
from models.materia import Materia
from models.curso import Curso

bp = Blueprint("materias", __name__, url_prefix="/api/materias")

@bp.route("", methods=["GET"])
def get_all():
    materias = Materia.query.all()
    return jsonify([{"id": m.id, "nome": m.nome, "curso_id": m.curso_id} for m in materias])

@bp.route("", methods=["POST"])
def create():
    data = request.get_json()
    if not data.get("nome") or not data.get("curso_id"):
        abort(400, "nome e curso_id são obrigatórios")
    curso = Curso.query.get(data["curso_id"])
    if not curso:
        abort(404, "Curso não encontrado")
    m = Materia(nome=data["nome"], curso_id=data["curso_id"])
    db.session.add(m); db.session.commit()
    return jsonify({"id": m.id, "nome": m.nome, "curso_id": m.curso_id}), 201

@bp.route("/<int:id>", methods=["PUT"])
def update(id):
    m = Materia.query.get_or_404(id)
    data = request.get_json()
    m.nome = data.get("nome", m.nome)
    db.session.commit()
    return jsonify({"id": m.id, "nome": m.nome, "curso_id": m.curso_id})

@bp.route("/<int:id>", methods=["DELETE"])
def delete(id):
    m = Materia.query.get_or_404(id)
    db.session.delete(m); db.session.commit()
    return jsonify({}), 204
