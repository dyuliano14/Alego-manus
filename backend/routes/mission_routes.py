from flask import Blueprint, request, jsonify
from models import db, Resolution, Mission

missions_bp = Blueprint('missions', __name__)

@missions_bp.route('/api/resolutions', methods=['GET'])
def get_all_resolutions():
    resolutions = Resolution.query.all()
    result = []
    for resolution in resolutions:
        result.append({
            'id': resolution.id,
            'title': resolution.title,
            'description': resolution.description
        })
    return jsonify(result)

@missions_bp.route('/api/resolutions/<int:resolution_id>', methods=['GET'])
def get_resolution(resolution_id):
    resolution = Resolution.query.get(resolution_id)
    if not resolution:
        return jsonify({'error': 'Resolution not found'}), 404
    
    return jsonify({
        'id': resolution.id,
        'title': resolution.title,
        'description': resolution.description,
        'content_file': resolution.content_file
    })

@missions_bp.route('/api/resolutions/<int:resolution_id>/missions', methods=['GET'])
def get_missions(resolution_id):
    missions = Mission.query.filter_by(resolution_id=resolution_id).order_by(Mission.order).all()
    result = []
    for mission in missions:
        result.append({
            'id': mission.id,
            'title': mission.title,
            'description': mission.description,
            'type': mission.type,
            'completed': mission.completed,
            'locked': mission.locked,
            'contentId': mission.id  # Usamos o ID como referência para buscar conteúdo
        })
    return jsonify(result)

@missions_bp.route('/api/resolutions/<int:resolution_id>/missions/<int:mission_id>', methods=['GET'])
def get_mission(resolution_id, mission_id):
    mission = Mission.query.filter_by(id=mission_id, resolution_id=resolution_id).first()
    if not mission:
        return jsonify({'error': 'Mission not found'}), 404
    
    return jsonify({
        'id': mission.id,
        'title': mission.title,
        'type': mission.type,
        'content': mission.content
    })

@missions_bp.route('/api/resolutions/<int:resolution_id>/missions/<int:mission_id>/complete', methods=['POST'])
def complete_mission(resolution_id, mission_id):
    mission = Mission.query.filter_by(id=mission_id, resolution_id=resolution_id).first()
    if not mission:
        return jsonify({'error': 'Mission not found'}), 404
    
    mission.completed = True
    
    # Desbloquear a próxima missão
    next_mission = Mission.query.filter_by(
        resolution_id=resolution_id,
        order=mission.order + 1
    ).first()
    
    if next_mission:
        next_mission.locked = False
    
    db.session.commit()
    return jsonify({'success': True})

@missions_bp.route('/api/resolutions/<int:resolution_id>/missions/<int:mission_id>/next', methods=['GET'])
def get_next_mission(resolution_id, mission_id):
    current_mission = Mission.query.filter_by(id=mission_id, resolution_id=resolution_id).first()
    if not current_mission:
        return jsonify({'error': 'Mission not found'}), 404
    
    next_mission = Mission.query.filter_by(
        resolution_id=resolution_id,
        order=current_mission.order + 1
    ).first()
    
    if not next_mission:
        return jsonify({'nextMissionId': None})
    
    return jsonify({'nextMissionId': next_mission.id})

# Registrar o blueprint no app.py
# app.register_blueprint(missions_bp)