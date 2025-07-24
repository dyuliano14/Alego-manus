# Endpoint para conversão de PDF para DOCX
from pdf2docx import Converter

@app.route('/api/pdf/convert', methods=['POST'])
def convert_pdf():
    if 'file' not in request.files:
        return jsonify({'error': 'Arquivo não enviado'}), 400
    file = request.files['file']
    output_format = request.form.get('output_format', 'docx')
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({'error': 'Apenas arquivos PDF são suportados'}), 400

    # Salvar PDF temporariamente
    temp_pdf = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
    file.save(temp_pdf.name)

    # Definir caminho de saída
    output_filename = os.path.splitext(file.filename)[0] + '.docx'
    temp_docx = tempfile.NamedTemporaryFile(delete=False, suffix='.docx')

    try:
        # Converter PDF para DOCX
        cv = Converter(temp_pdf.name)
        cv.convert(temp_docx.name, start=0, end=None)
        cv.close()

        # Retornar arquivo convertido
        return send_file(temp_docx.name, as_attachment=True, download_name=output_filename)
    except Exception as e:
        return jsonify({'error': f'Erro na conversão: {str(e)}'}), 500
    finally:
        temp_pdf.close()
        os.unlink(temp_pdf.name)
        # temp_docx será removido pelo sistema após envio
import os
import tempfile
from flask import Flask, jsonify, request, send_from_directory, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

# Importar modelos do banco
from database import db, init_database, Curso, Materia, Conteudo, Anotacao, Upload, seed_initial_data

# Carregar variáveis de ambiente
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuração do banco de dados
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///alego.db')

# Debug: verificar se DATABASE_URL tem placeholder
if DATABASE_URL.startswith('${') and DATABASE_URL.endswith('}'):
    print(f"❌ DATABASE_URL contém placeholder não resolvido: {DATABASE_URL}")
    print("⚠️  Usando SQLite como fallback")
    DATABASE_URL = 'sqlite:///alego.db'

# Debug: log da URL do banco em produção
if os.environ.get('FLASK_ENV') == 'production':
    print(f"🔍 DATABASE_URL final: {DATABASE_URL}")
    
    # Verificar se é uma URL válida
    if DATABASE_URL and len(DATABASE_URL) > 10 and '://' in DATABASE_URL:
        print("✅ DATABASE_URL parece válida")
        if DATABASE_URL.startswith('postgresql') or DATABASE_URL.startswith('postgres'):
            print("✅ Usando PostgreSQL")
        else:
            print("⚠️  Usando SQLite como fallback")
    else:
        print("❌ DATABASE_URL parece inválida, usando SQLite")

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-key-change-in-production')

# Configuração de upload
if os.environ.get('FLASK_ENV') == 'production':
    app.config['UPLOAD_FOLDER'] = os.path.join(tempfile.gettempdir(), 'alego_uploads')
else:
    app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), 'instance', 'uploads')

# Criar diretório de uploads
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Inicializar banco de dados
try:
    init_database(app)
except Exception as e:
    print(f"⚠️  Erro ao inicializar banco: {e}")
    print("⚠️  Aplicação continuará sem banco de dados")

# =====================================
# ENDPOINTS DE DEBUG/HEALTH
# =====================================

@app.route("/api/debug/health")
def health_check():
    from sqlalchemy import text
    try:
        # Testar conexão com banco
        db.session.execute(text('SELECT 1'))
        return jsonify({
            "status": "healthy",
            "database": "connected",
            "env": os.getenv('FLASK_ENV', 'development'),
            "database_url": DATABASE_URL.split('@')[0] + '@***' if '@' in DATABASE_URL else DATABASE_URL
        })
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "error": str(e),
            "database": "disconnected"
        }), 500

@app.route("/api/debug/env")
def debug_env():
    """Debug das variáveis de ambiente - APENAS PARA DESENVOLVIMENTO"""
    if os.getenv('FLASK_ENV') != 'production':
        return jsonify({"error": "Endpoint disponível apenas em desenvolvimento"}), 403
    
    return jsonify({
        "DATABASE_URL": "***" + (os.getenv('DATABASE_URL', 'NOT_SET')[-20:] if os.getenv('DATABASE_URL') else "NOT_SET"),
        "SQLALCHEMY_DATABASE_URI": "***" + (os.getenv('SQLALCHEMY_DATABASE_URI', 'NOT_SET')[-20:] if os.getenv('SQLALCHEMY_DATABASE_URI') else "NOT_SET"),
        "FLASK_ENV": os.getenv('FLASK_ENV', 'NOT_SET'),
        "current_database_url": DATABASE_URL[:50] + "..." if len(DATABASE_URL) > 50 else DATABASE_URL
    })

@app.route("/api/debug/db")
def debug_db():
    """Mostra estatísticas do banco"""
    try:
        return jsonify({
            "cursos": Curso.query.count(),
            "materias": Materia.query.count(),
            "conteudos": Conteudo.query.count(),
            "anotacoes": Anotacao.query.count(),
            "uploads": Upload.query.count(),
            "database_type": "PostgreSQL" if "postgresql" in DATABASE_URL else "SQLite"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/debug/reset", methods=['POST'])
def reset_database():
    """Limpa todas as tabelas"""
    try:
        # Deletar tudo na ordem correta (FK constraints)
        Anotacao.query.delete()
        Upload.query.delete()
        Conteudo.query.delete()
        Materia.query.delete()
        Curso.query.delete()
        db.session.commit()
        
        return jsonify({
            "message": "Database reset successfully",
            "tables_cleared": ["anotacoes", "uploads", "conteudos", "materias", "cursos"]
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route("/api/debug/seed", methods=['POST'])
def seed_database():
    """Popula dados iniciais"""
    try:
        seed_initial_data()
        return jsonify({
            "message": "Database seeded successfully",
            "cursos": Curso.query.count(),
            "materias": Materia.query.count(),
            "conteudos": Conteudo.query.count()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route("/api/debug/routes")
def list_routes():
    """Lista todas as rotas disponíveis"""
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            "endpoint": rule.endpoint,
            "methods": list(rule.methods),
            "url": str(rule)
        })
    return jsonify({"routes": routes})

# =====================================
# ENDPOINTS PRINCIPAIS - CURSOS
# =====================================

@app.route("/api/cursos", methods=['GET', 'POST'])
def cursos_api():
    if request.method == 'GET':
        try:
            cursos = Curso.query.all()
            return jsonify([curso.to_dict(include_materias=True) for curso in cursos])
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    if request.method == 'POST':
        try:
            data = request.get_json()
            novo_curso = Curso(
                nome=data.get("nome", ""),
                descricao=data.get("descricao", "")
            )
            db.session.add(novo_curso)
            db.session.commit()
            return jsonify(novo_curso.to_dict()), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

@app.route("/api/cursos/<int:curso_id>", methods=['PUT', 'DELETE'])
def curso_individual(curso_id):
    try:
        curso = Curso.query.get_or_404(curso_id)
        
        if request.method == 'PUT':
            data = request.get_json()
            curso.nome = data.get("nome", curso.nome)
            curso.descricao = data.get("descricao", curso.descricao)
            db.session.commit()
            return jsonify(curso.to_dict())
        
        if request.method == 'DELETE':
            db.session.delete(curso)
            db.session.commit()
            return '', 204
            
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# =====================================
# ENDPOINTS PRINCIPAIS - MATÉRIAS
# =====================================

@app.route("/api/materias", methods=['GET', 'POST'])
def materias_api():
    if request.method == 'GET':
        try:
            materias = Materia.query.all()
            return jsonify([materia.to_dict() for materia in materias])
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    if request.method == 'POST':
        try:
            data = request.get_json()
            nova_materia = Materia(
                nome=data.get("nome", ""),
                curso_id=data.get("curso_id", 1)
            )
            db.session.add(nova_materia)
            db.session.commit()
            return jsonify(nova_materia.to_dict()), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

@app.route("/api/materias/<int:materia_id>", methods=['PUT', 'DELETE'])
def materia_individual(materia_id):
    try:
        materia = Materia.query.get_or_404(materia_id)
        
        if request.method == 'PUT':
            data = request.get_json()
            materia.nome = data.get("nome", materia.nome)
            materia.curso_id = data.get("curso_id", materia.curso_id)
            db.session.commit()
            return jsonify(materia.to_dict())
        
        if request.method == 'DELETE':
            db.session.delete(materia)
            db.session.commit()
            return '', 204
            
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# =====================================
# ENDPOINTS PRINCIPAIS - CONTEÚDOS
# =====================================

@app.route("/api/conteudos", methods=['GET', 'POST'])
def conteudos_api():
    if request.method == 'GET':
        try:
            conteudos = Conteudo.query.all()
            return jsonify([conteudo.to_dict() for conteudo in conteudos])
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    if request.method == 'POST':
        try:
            data = request.get_json()
            novo_conteudo = Conteudo(
                titulo=data.get("titulo", ""),
                tipo=data.get("tipo", "pdf"),
                arquivo=data.get("arquivo", ""),
                conteudo_texto=data.get("conteudo_texto", ""),
                materia_id=data.get("materia_id", 1)
            )
            db.session.add(novo_conteudo)
            db.session.commit()
            return jsonify(novo_conteudo.to_dict()), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

@app.route("/api/conteudos/<int:conteudo_id>", methods=['PUT', 'DELETE'])
def conteudo_individual(conteudo_id):
    try:
        conteudo = Conteudo.query.get_or_404(conteudo_id)
        
        if request.method == 'PUT':
            data = request.get_json()
            conteudo.titulo = data.get("titulo", conteudo.titulo)
            conteudo.tipo = data.get("tipo", conteudo.tipo)
            conteudo.arquivo = data.get("arquivo", conteudo.arquivo)
            conteudo.conteudo_texto = data.get("conteudo_texto", conteudo.conteudo_texto)
            conteudo.materia_id = data.get("materia_id", conteudo.materia_id)
            db.session.commit()
            return jsonify(conteudo.to_dict())
        
        if request.method == 'DELETE':
            db.session.delete(conteudo)
            db.session.commit()
            return '', 204
            
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# =====================================
# ENDPOINTS - ANOTAÇÕES
# =====================================

@app.route("/api/anotacoes/<int:conteudo_id>", methods=['GET', 'POST'])
def anotacoes_api(conteudo_id):
    if request.method == 'GET':
        try:
            anotacoes = Anotacao.query.filter_by(conteudo_id=conteudo_id).all()
            return jsonify([{"id": a.id, "texto": a.texto} for a in anotacoes])
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    if request.method == 'POST':
        try:
            textos = request.get_json()  # Array de strings
            
            # Limpar anotações antigas deste conteúdo
            Anotacao.query.filter_by(conteudo_id=conteudo_id).delete()
            
            # Adicionar novas anotações
            for texto in textos:
                if texto.strip():  # Só adicionar se não for vazio
                    nova_anotacao = Anotacao(
                        texto=texto,
                        conteudo_id=conteudo_id
                    )
                    db.session.add(nova_anotacao)
            
            db.session.commit()
            return jsonify({"message": "Anotações salvas com sucesso"}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

# =====================================
# ENDPOINTS - UPLOAD
# =====================================

@app.route("/api/upload", methods=['POST', 'OPTIONS'])
def upload_files():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        if 'files' not in request.files:
            return jsonify({"error": "Nenhum arquivo enviado"}), 400
        
        files = request.files.getlist('files')
        uploaded_files = []
        uploaded_urls = []
        
        for file in files:
            if file and file.filename:
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                
                # Gerar URL pública para o arquivo - usar caminho relativo
                file_url = f"/uploads/{filename}"
                
                # Salvar informações do upload no banco
                novo_upload = Upload(
                    filename=filename,
                    original_filename=file.filename,
                    file_path=file_path,
                    file_size=os.path.getsize(file_path),
                    mime_type=file.content_type or ''
                )
                
                # Extrair texto do PDF (se aplicável)
                if filename.lower().endswith('.pdf'):
                    try:
                        from pdf_utils import extract_text_from_pdf
                        texto_extraido = extract_text_from_pdf(file_path)
                        novo_upload.conteudo_extraido = texto_extraido
                    except Exception as pdf_error:
                        print(f"Erro ao extrair PDF: {pdf_error}")
                
                db.session.add(novo_upload)
                uploaded_files.append({
                    "filename": filename,
                    "original_filename": file.filename,
                    "size": novo_upload.file_size,
                    "url": file_url
                })
                uploaded_urls.append(file_url)
        
        db.session.commit()
        print(f"✅ Upload concluído - {len(uploaded_urls)} arquivos, URLs: {uploaded_urls}")
        return jsonify({
            "message": "Upload realizado com sucesso",
            "files": uploaded_files,
            "urls": uploaded_urls
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route("/api/upload-base64", methods=['POST'])
def upload_base64():
    """Fallback para upload via base64"""
    try:
        import base64
        data = request.get_json()
        
        for file_data in data.get('files', []):
            filename = secure_filename(file_data['name'])
            file_content = base64.b64decode(file_data['content'].split(',')[1])
            
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            with open(file_path, 'wb') as f:
                f.write(file_content)
            
            # Salvar no banco
            novo_upload = Upload(
                filename=filename,
                original_filename=file_data['name'],
                file_path=file_path,
                file_size=len(file_content)
            )
            db.session.add(novo_upload)
        
        db.session.commit()
        return jsonify({"message": "Upload base64 realizado com sucesso"}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# =====================================
# API ROOT ENDPOINT
# =====================================

@app.route("/")
def root():
    """Root endpoint"""
    return jsonify({
        "app": "Alego Manus Backend",
        "status": "running",
        "env": os.getenv('FLASK_ENV', 'development'),
        "database_type": "PostgreSQL" if "postgresql" in DATABASE_URL else "SQLite"
    })

@app.route("/api/")
def api_root():
    """API root endpoint"""
    return jsonify({
        "app": "Alego Manus Backend",
        "status": "running",
        "env": os.getenv('FLASK_ENV', 'development'),
        "database_type": "PostgreSQL" if "postgresql" in DATABASE_URL else "SQLite"
    })

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
