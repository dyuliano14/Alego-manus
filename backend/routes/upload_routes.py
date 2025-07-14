    from flask import Blueprint, request, jsonify, current_app, url_for
    import os
    from werkzeug.utils import secure_filename

    bp = Blueprint("upload", __name__, url_prefix="/api/upload")

    ALLOWED_EXTENSIONS = {"pdf", "md", "mp4", "mov", "webm"}

    def allowed(filename):
        ext = filename.lower().rsplit(".", 1)[-1]
        return ext in ALLOWED_EXTENSIONS

    @bp.route("", methods=["POST"])
    def upload():
        if "files" not in request.files:
            return jsonify({"error": "Nenhum arquivo enviado"}), 400

        uploaded = request.files.getlist("files")
        saved_urls = []

        upload_folder = current_app.config["UPLOAD_FOLDER"]
        os.makedirs(upload_folder, exist_ok=True)

        for f in uploaded:
            if f and allowed(f.filename):
                filename = secure_filename(f.filename)
                path = os.path.join(upload_folder, filename)
                f.save(path)
                # gera URL relativa
                url = url_for("uploaded_file", filename=filename, _external=True)
                saved_urls.append(url)
            else:
                return jsonify({"error": f"Formato não permitido: {f.filename}"}), 400

        return jsonify({ "urls": saved_urls }), 201
