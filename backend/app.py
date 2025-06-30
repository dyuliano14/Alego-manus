from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)
DATA_FILE = "cursos.json"

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def save_data(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

@app.route("/api/cursos", methods=["GET"])
def get_cursos():
    return jsonify(load_data())


@app.route("/api/cursos", methods=["POST"])
def save_cursos():
    data = request.get_json()
    save_data(data)
    return jsonify({"status": "ok"})

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []
    return []

if __name__ == "__main__":
    app.run(debug=True)

from flask import abort

NOTES_FILE = "anotacoes.json"

def load_notes():
    if os.path.exists(NOTES_FILE):
        with open(NOTES_FILE, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except:
                return {}
    return {}

def save_notes(data):
    with open(NOTES_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

@app.route("/api/anotacoes/<int:conteudo_id>", methods=["GET"])
def get_anotacoes(conteudo_id):
    notas = load_notes()
    return jsonify(notas.get(str(conteudo_id), []))

@app.route("/api/anotacoes/<int:conteudo_id>", methods=["POST"])
def post_anotacoes(conteudo_id):
    notas = load_notes()
    data = request.get_json()
    if not isinstance(data, list):
        abort(400, "Payload deve ser uma lista de strings")
    notas[str(conteudo_id)] = data
    save_notes(notas)
    return jsonify({"status": "ok"})