from flask import Blueprint, request, jsonify
from models.user_model import UserDB

goals_bp = Blueprint("goals", __name__)

@goals_bp.route("/set-goals/<user_id>", methods=["POST"])
def set_goals(user_id):
    data = request.get_json()
    goals = data.get("goals", [])
    if len(goals) < 3:
        return jsonify({"error": "At least 3 goals required"}), 400
    
    user = UserDB.update_goals(user_id, goals)
    return jsonify({"message": "Goals set", "goals": user["goals"]})

@goals_bp.route("/questionnaire/<goal_type>", methods=["GET"])
def get_questionnaire(goal_type):
    # simple static definitions pulled from README
    questionnaires = {
        "fitness": ["Current weight/height", "Ideal body target", "Diet restrictions", "Current activity level"],
        "mental_health": ["Stress level 1-10", "Coping methods", "Daily time commitment", "Triggers"],
        "discipline": ["Areas lacking discipline", "Daily distractions", "Preferred habit style"],
        "career": ["Current role", "Target role", "Skills to improve", "Networking comfort"],
        # ... add all 10 from README
    }
    return jsonify({"questions": questionnaires.get(goal_type, [])})

@goals_bp.route("/progress/<user_id>", methods=["GET"])
def goal_progress(user_id):
    user = UserDB.get_user(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Simple example: average % of stat levels linked to goals
    stats = user.get("character_sheet", {}).get("stats", {})
    goals = user.get("goals", [])
    
    progress = {}
    for goal in goals:
        linked_stats = goal.get("linked_stats", [])
        if not linked_stats:
            continue
        avg = sum(stats.get(s, 0) for s in linked_stats) / len(linked_stats)
        progress[goal["goal"]] = avg
    
    return jsonify({"progress": progress})
