from flask import Blueprint, request, jsonify, abort
from models import db
from models.anotacao import Anotacao
from models.conteudo import Conteudo

bp = Blueprint("anotacoes", __name__, url_prefix="/api/anotacoes")

@bp.route("/<int:cid>", methods=["GET"])
def get_notes(cid):
    conteudo = Conteudo.query.get(cid)
    if not conteudo:
        abort(404, "Conteúdo não encontrado")
    return jsonify([{"id": a.id, "texto": a.texto} for a in conteudo.anotacoes])

@bp.route("/<int:cid>", methods=["POST"])
def save_notes(cid):
    conteudo = Conteudo.query.get(cid)
    if not conteudo:
        abort(404, "Conteúdo não encontrado")
    data = request.get_json()
    if not isinstance(data, list):
        abort(400, "Deve enviar uma lista de strings")
    # Limpa e salva novamente
    Anotacao.query.filter_by(conteudo_id=cid).delete()
    for txt in data:
        db.session.add(Anotacao(conteudo_id=cid, texto=txt))
    db.session.commit()
    return jsonify({"ok": True})