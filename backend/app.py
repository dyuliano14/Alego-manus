import os
from flask import Flask, jsonify, request, send_from_directory, send_file
from flask_cors import CORS
from models import db

# Rotas
import routes.curso_routes as curso_routes
import routes.materia_routes as materia_routes
import routes.conteudo_routes as conteudo_routes
import routes.anotacao_routes as anotacao_routes
import routes.upload_routes as upload_routes
import routes.debug_routes as debug_routes

app = Flask(__name__)
CORS(app, origins=[
    "https://alego-manus-frontend.onrender.com",  # Produção
    "http://localhost:3000"  # Desenvolvimento
])

# Configurações
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///alego.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["UPLOAD_FOLDER"] = os.path.join(app.instance_path, "uploads")

# Configuração básica
app.config['SECRET_KEY'] = 'dev-key-change-in-production'

# Pasta do frontend buildado
FRONTEND_DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend", "dist")

# Mock data para V1
mock_data = {
    "cursos": [],
    "materias": [],
    "conteudos": [],
    "anotacoes": [],
    "uploads": []
}

# Health check para Render
@app.route("/api/debug/health")
def health_check():
    return {"status": "healthy", "version": "1.0", "python": "minimal"}, 200

@app.route("/api/debug/db")
def debug_db():
    return mock_data, 200

# APIs básicas com mock data
@app.route("/api/cursos", methods=['GET', 'POST'])
def cursos_api():
    if request.method == 'GET':
        return jsonify(mock_data["cursos"])
    
    if request.method == 'POST':
        curso_data = request.get_json()
        curso = {
            "id": len(mock_data["cursos"]) + 1,
            "nome": curso_data.get("nome", ""),
            "descricao": curso_data.get("descricao", ""),
            "created_at": "2025-01-19"
        }
        mock_data["cursos"].append(curso)
        return jsonify(curso), 201

@app.route("/api/materias", methods=['GET', 'POST'])
def materias_api():
    if request.method == 'GET':
        return jsonify(mock_data["materias"])
    
    if request.method == 'POST':
        materia_data = request.get_json()
        materia = {
            "id": len(mock_data["materias"]) + 1,
            "nome": materia_data.get("nome", ""),
            "curso_id": materia_data.get("curso_id", 1),
            "created_at": "2025-01-19"
        }
        mock_data["materias"].append(materia)
        return jsonify(materia), 201

@app.route("/api/conteudos", methods=['GET', 'POST'])
def conteudos_api():
    if request.method == 'GET':
        return jsonify(mock_data["conteudos"])
    
    if request.method == 'POST':
        conteudo_data = request.get_json()
        conteudo = {
            "id": len(mock_data["conteudos"]) + 1,
            "titulo": conteudo_data.get("titulo", ""),
            "materia_id": conteudo_data.get("materia_id", 1),
            "created_at": "2025-01-19"
        }
        mock_data["conteudos"].append(conteudo)
        return jsonify(conteudo), 201

@app.route("/api/anotacoes", methods=['GET', 'POST'])
def anotacoes_api():
    if request.method == 'GET':
        return jsonify(mock_data["anotacoes"])
    
    if request.method == 'POST':
        anotacao_data = request.get_json()
        anotacao = {
            "id": len(mock_data["anotacoes"]) + 1,
            "texto": anotacao_data.get("texto", ""),
            "conteudo_id": anotacao_data.get("conteudo_id", 1),
            "created_at": "2025-01-19"
        }
        mock_data["anotacoes"].append(anotacao)
        return jsonify(anotacao), 201

# Serve arquivos estáticos do frontend
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    if path and not path.startswith('api') and not path.startswith('uploads'):
        file_path = os.path.join(FRONTEND_DIST, path)
        if os.path.exists(file_path):
            return send_file(file_path)
    
    # Fallback para SPA
    index_path = os.path.join(FRONTEND_DIST, "index.html")
    if os.path.exists(index_path):
        return send_file(index_path)
    else:
        return jsonify({"error": "Frontend não encontrado", "dist_path": FRONTEND_DIST}), 404

# Serve arquivos enviados
@app.route("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

# Banco de dados
db.init_app(app)

with app.app_context():
    db.create_all()

# Blueprints
app.register_blueprint(curso_routes.bp)
app.register_blueprint(materia_routes.bp)
app.register_blueprint(conteudo_routes.bp)
app.register_blueprint(anotacao_routes.bp)
app.register_blueprint(debug_routes.bp)
app.register_blueprint(upload_routes.bp)  # 👈 correto aqui

# DEBUG
print("Rotas registradas:")
for rule in app.url_map.iter_rules():
    print(rule)

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    app.run(host='0.0.0.0', port=port, debug=debug)