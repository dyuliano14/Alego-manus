from flask import Blueprint, request, jsonify, abort
from models import db
from models.conteudo import Conteudo
from models.materia import Materia

bp = Blueprint("conteudos", __name__, url_prefix="/api/conteudos")

@bp.route("", methods=["GET"])
def get_all():
    cs = Conteudo.query.all()
    return jsonify([
        {
            "id": c.id,
            "titulo": c.titulo,
            "tipo": c.tipo,
            "arquivo": c.arquivo,
            "materia_id": c.materia_id
        } for c in cs
    ])

@bp.route("", methods=["POST"])
def create():
    data = request.get_json()
    if not all(k in data for k in ["titulo", "tipo", "arquivo", "materia_id"]):
        abort(400, "Campos obrigatórios: titulo, tipo, arquivo, materia_id")
    m = Materia.query.get(data["materia_id"])
    if not m:
        abort(404, "Matéria não encontrada")
    c = Conteudo(**data)
    db.session.add(c); db.session.commit()
    # após db.session.commit()
    return jsonify({
        "id": c.id,
        "titulo": c.titulo,
        "tipo": c.tipo,
        "arquivo": c.arquivo,
        "materia_id": c.materia_id
    }), 201

@bp.route("/<int:id>", methods=["PUT"])
def update(id):
    c = Conteudo.query.get_or_404(id)
    data = request.get_json()
    c.titulo = data.get("titulo", c.titulo)
    c.tipo = data.get("tipo", c.tipo)
    c.arquivo = data.get("arquivo", c.arquivo)
    db.session.commit()
    # após db.session.commit()
    return jsonify({
        "id": c.id,
        "titulo": c.titulo,
        "tipo": c.tipo,
        "arquivo": c.arquivo,
        "materia_id": c.materia_id
    }), 201

@bp.route("/<int:id>", methods=["DELETE"])
def delete(id):
    c = Conteudo.query.get_or_404(id)
    db.session.delete(c); db.session.commit()
    # após db.session.commit()
    return jsonify({
        "id": c.id,
        "titulo": c.titulo,
        "tipo": c.tipo,
        "arquivo": c.arquivo,
        "materia_id": c.materia_id
    }), 201
