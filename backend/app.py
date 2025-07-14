
import os
from flask import Flask
from flask_cors import CORS
from models import db
# from routes.upload_routes import bp as upload_bp
# from routes.curso_routes import bp as curso_bp

import routes.curso_routes as curso_routes
import routes.materia_routes as materia_routes
import routes.conteudo_routes as conteudo_routes
import routes.anotacao_routes as anotacao_routes
import routes.upload_routes as upload_routes
#import routes.debug_routes as debug_routes



app = Flask(__name__)
CORS(app, origins="*")  # ou especifique domínios se quiser limitar


app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///alego.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["UPLOAD_FOLDER"] = os.path.join(app.instance_path, "uploads")




db.init_app(app)

with app.app_context():
    from models import db  # já importa todos os modelos via __init__.py
    db.create_all()


# REGISTRAR BLUEPRINTS
app.register_blueprint(curso_routes.bp)
app.register_blueprint(materia_routes.bp)
app.register_blueprint(conteudo_routes.bp)
app.register_blueprint(anotacao_routes.bp)
#app.register_blueprint(debug_routes.bp)
app.register_blueprint(upload_routes.bp)
# app.register_blueprint(curso_bp)
# app.register_blueprint(upload_bp)

# DEBUG ROTAS (opcional para diagnosticar)
print("Rotas registradas:")
for rule in app.url_map.iter_rules():
    print(rule)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
