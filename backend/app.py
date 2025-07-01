from flask import Flask, jsonify, request, abort
from flask_cors import CORS
import json, os


app = Flask(__name__)
CORS(app, origins="*")


DATA_FILE = "cursos.json"
NOTES_FILE = "anotacoes.json"

def load_json(path, default):
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            try: return json.load(f)
            except: return default
    else:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(default, f, indent=2, ensure_ascii=False)
        return default

def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

@app.route("/api/cursos", methods=["GET", "POST"])
def cursos():
    if request.method == "POST":
        cursos = request.get_json()
        save_json(DATA_FILE, cursos)
        return jsonify({"ok": True})
    else:
        return jsonify(load_json(DATA_FILE, []))

@app.route("/api/anotacoes/<int:cid>", methods=["GET", "POST"])
def anotacoes(cid):
    notes = load_json(NOTES_FILE, {})
    if request.method == "POST":
        data = request.get_json()
        if not isinstance(data, list):
            abort(400, "Payload deve ser lista")
        notes[str(cid)] = data
        save_json(NOTES_FILE, notes)
        return jsonify({"ok": True})
    else:
        return jsonify(notes.get(str(cid), []))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)