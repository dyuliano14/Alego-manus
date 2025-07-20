import os
import tempfile
from flask import Flask, jsonify, request, send_from_directory, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Configuração básica
app.config['SECRET_KEY'] = 'dev-key-change-in-production'

# Para produção (Render), usar diretório temporário
if os.environ.get('FLASK_ENV') == 'production':
    app.config['UPLOAD_FOLDER'] = os.path.join(tempfile.gettempdir(), 'alego_uploads')
else:
    app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), 'instance', 'uploads')

# Criar diretório de uploads se não existir
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Frontend build path
FRONTEND_DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend", "dist")

# Mock data para V1 (sem banco de dados)
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
    return {"status": "healthy", "version": "1.0", "python": "3.13.4"}, 200

@app.route("/api/debug/db")
def debug_db():
    return mock_data, 200

@app.route("/api/debug/clear", methods=['POST'])
def debug_clear():
    global mock_data
    mock_data = {
        "cursos": [],
        "materias": [],
        "conteudos": [],
        "anotacoes": [],
        "uploads": []
    }
    return {"status": "cleared"}, 200

@app.route("/api/debug/routes")
def debug_routes():
    """Lista todas as rotas disponíveis para debug"""
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            "endpoint": rule.endpoint,
            "methods": list(rule.methods),
            "rule": str(rule)
        })
    return {"routes": routes}, 200

@app.route("/api/debug/clear", methods=['POST'])
def clear_db():
    """Endpoint para limpar todos os dados mock"""
    global mock_data
    mock_data = {
        "cursos": [],
        "materias": [],
        "conteudos": [],
        "anotacoes": [],
        "uploads": []
    }
    return {"status": "cleared"}, 200

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
            "created_at": "2025-07-19"
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
            "created_at": "2025-07-19"
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
            "tipo": conteudo_data.get("tipo", "pdf"),
            "arquivo": conteudo_data.get("arquivo", ""),
            "materia_id": conteudo_data.get("materia_id", 1),
            "created_at": "2025-07-19"
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
            "created_at": "2025-07-19"
        }
        mock_data["anotacoes"].append(anotacao)
        return jsonify(anotacao), 201

@app.route("/api/upload", methods=['POST', 'OPTIONS'])
def upload_files():
    # Handle preflight requests
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'OK'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
        
    try:
        print(f"Upload request received. Method: {request.method}")
        print(f"Content-Type: {request.content_type}")
        print(f"Files in request: {request.files}")
        
        files = request.files.getlist("files")
        print(f"Number of files: {len(files)}")
        
        if not files:
            return jsonify({"error": "Nenhum arquivo enviado"}), 400
        
        urls = []
        upload_folder = app.config['UPLOAD_FOLDER']
        print(f"Upload folder: {upload_folder}")
        
        for file in files:
            if file and file.filename:
                filename = secure_filename(file.filename)
                filepath = os.path.join(upload_folder, filename)
                print(f"Saving file: {filename} to {filepath}")
                file.save(filepath)
                
                # URL para acessar o arquivo
                url = f"{request.host_url}uploads/{filename}"
                urls.append(url)
                print(f"File URL: {url}")
                
                # Salvar info do upload no mock data
                upload_info = {
                    "id": len(mock_data["uploads"]) + 1,
                    "filename": filename,
                    "url": url,
                    "created_at": "2025-07-20"
                }
                mock_data["uploads"].append(upload_info)
        
        print(f"Upload successful. URLs: {urls}")
        return jsonify({"urls": urls}), 200
        
    except Exception as e:
        print(f"Upload error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route("/api/upload-base64", methods=['POST'])
def upload_base64():
    """Endpoint alternativo para upload usando Base64"""
    try:
        data = request.get_json()
        filename = secure_filename(data.get('filename', 'unnamed_file'))
        content = data.get('content', '')
        file_type = data.get('type', 'application/octet-stream')
        
        # Remover o prefixo data:...;base64, se existir
        if ',' in content:
            content = content.split(',', 1)[1]
        
        # Decodificar Base64
        import base64
        file_data = base64.b64decode(content)
        
        # Salvar arquivo
        upload_folder = app.config['UPLOAD_FOLDER']
        filepath = os.path.join(upload_folder, filename)
        
        with open(filepath, 'wb') as f:
            f.write(file_data)
        
        # URL para acessar o arquivo
        url = f"{request.host_url}uploads/{filename}"
        
        # Salvar info do upload no mock data
        upload_info = {
            "id": len(mock_data["uploads"]) + 1,
            "filename": filename,
            "url": url,
            "created_at": "2025-07-20"
        }
        mock_data["uploads"].append(upload_info)
        
        return jsonify({"url": url}), 200
        
    except Exception as e:
        print(f"Base64 upload error: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Serve frontend estático
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
        return jsonify({
            "error": "Frontend não encontrado", 
            "dist_path": FRONTEND_DIST,
            "exists": os.path.exists(FRONTEND_DIST)
        }), 404

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    app.run(host='0.0.0.0', port=port, debug=debug)