from flask import Flask
from flask_cors import CORS
from models import db
import routes.curso_routes as curso_routes
import routes.materia_routes as materia_routes
import routes.conteudo_routes as conteudo_routes
import routes.anotacao_routes as anotacao_routes
import routes.debug_routes as debug_routes

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///alego.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
CORS(app)  # CORS liberado

db.init_app(app)

with app.app_context():
    from models.materia import Materia
    from models import db

    nova_materia = Materia(nome="Matéria de Teste", curso_id=1)
    db.session.add(nova_materia)
    db.session.commit()
    print(f"Matéria criada com ID: {nova_materia.id}")

# REGISTRAR BLUEPRINTS
app.register_blueprint(curso_routes.bp)
app.register_blueprint(materia_routes.bp)
app.register_blueprint(conteudo_routes.bp)
app.register_blueprint(anotacao_routes.bp)
app.register_blueprint(debug_routes.bp)

# DEBUG ROTAS (opcional para diagnosticar)
print("Rotas registradas:")
for rule in app.url_map.iter_rules():
    print(rule)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
