from flask import Blueprint, request, jsonify
from models.user_model import UserDB

users_bp = Blueprint("users", __name__)

@users_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")  # ⚠️ store hashed in real app
    if not all([name, email, password]):
        return jsonify({"error": "Missing required fields"}), 400
    
    user = UserDB.create_user(name, email, password)
    return jsonify({"message": "User registered", "user": user}), 201

@users_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    user = UserDB.validate_login(email, password)
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401
    return jsonify({"message": "Login successful", "user": user})

@users_bp.route("/character-sheet/<user_id>", methods=["GET"])
def character_sheet(user_id):
    user = UserDB.get_user(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"character_sheet": user.get("character_sheet", {})})

@users_bp.route("/character-sheet/<user_id>", methods=["PUT"])
def update_character_sheet(user_id):
    updates = request.get_json()
    user = UserDB.update_character_sheet(user_id, updates)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"message": "Character sheet updated", "character_sheet": user["character_sheet"]})
