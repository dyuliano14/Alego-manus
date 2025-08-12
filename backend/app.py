# ... código existente ...

from routes.mission_routes import missions_bp

# ... código existente ...

# Registrando blueprints
app.register_blueprint(missions_bp)

# ... código existente ...

# Rota para converter lei em markdown e criar missões
@app.route('/api/convert-law', methods=['POST'])
def convert_law():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    title = request.form.get('title', 'Lei sem título')
    description = request.form.get('description', '')
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Salva o arquivo temporariamente
    temp_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(temp_path)
    
    # Lê o conteúdo do arquivo
    with open(temp_path, 'r', encoding='utf-8') as f:
        law_text = f.read()
    
    # Converte para markdown
    md_filename = os.path.splitext(file.filename)[0] + '.md'
    md_path = os.path.join(app.config['UPLOAD_FOLDER'], md_filename)
    convert_law_to_markdown(law_text, md_path)
    
    # Cria resolução no banco
    resolution = Resolution(
        title=title,
        description=description,
        content_file=md_filename
    )
    db.session.add(resolution)
    db.session.commit()
    
    # Cria missões
    missions = create_missions_from_law(md_path, resolution.id)
    for mission_data in missions:
        mission = Mission(**mission_data)
        db.session.add(mission)
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'resolution_id': resolution.id
    })

# ... código existente ...