from flask import Blueprint, request, jsonify
from models.user_model import UserDB

quests_crud_bp = Blueprint("quests_crud", __name__)

@quests_crud_bp.route("/quests/<user_id>", methods=["POST"])
def add_quest(user_id):
    quest = request.get_json()
    user = UserDB.add_quest(user_id, quest)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"message": "Quest added", "quests": user["quests"]})

@quests_crud_bp.route("/quests/<user_id>/<quest_id>", methods=["PUT"])
def update_quest(user_id, quest_id):
    updates = request.get_json()
    user = UserDB.update_quest(user_id, quest_id, updates)
    if not user:
        return jsonify({"error": "User or quest not found"}), 404
    return jsonify({"message": "Quest updated", "quests": user["quests"]})

@quests_crud_bp.route("/quests/<user_id>/<quest_id>", methods=["DELETE"])
def delete_quest(user_id, quest_id):
    user = UserDB.delete_quest(user_id, quest_id)
    if not user:
        return jsonify({"error": "User or quest not found"}), 404
    return jsonify({"message": "Quest deleted", "quests": user["quests"]})
