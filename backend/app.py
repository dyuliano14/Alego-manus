import os
from flask import Flask, send_from_directory, send_file
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
CORS(app, origins="*")

# Configurações
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///alego.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["UPLOAD_FOLDER"] = os.path.join(app.instance_path, "uploads")

# Pasta do frontend buildado
FRONTEND_DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend", "dist")

# Serve arquivos estáticos do frontend
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    if path and os.path.exists(os.path.join(FRONTEND_DIST, path)):
        return send_from_directory(FRONTEND_DIST, path)
    else:
        return send_file(os.path.join(FRONTEND_DIST, "index.html"))

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
    app.run(host="0.0.0.0", debug=True)