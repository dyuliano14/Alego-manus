# upload_routes.py
from flask import Blueprint, request, jsonify, current_app, send_from_directory, abort
import os
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {"pdf", "md", "mp4"}

bp = Blueprint("uploads", __name__, url_prefix="/api/uploads")

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route("", methods=["POST"])
def upload_files():
    if "files" not in request.files:
        abort(400, "Nenhum arquivo enviado.")
    uploaded = request.files.getlist("files")
    saved_urls = []
    for file in uploaded:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            save_dir = current_app.config["UPLOAD_FOLDER"]
            os.makedirs(save_dir, exist_ok=True)
            filepath = os.path.join(save_dir, filename)
            file.save(filepath)
            url = f"{request.url_root}uploads/{filename}"
            saved_urls.append(url)
    return jsonify({"urls": saved_urls})

@bp.route("/<filename>")
def serve_file(filename):
    return send_from_directory(current_app.config["UPLOAD_FOLDER"], filename)