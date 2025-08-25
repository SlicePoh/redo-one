from flask import Blueprint, request, jsonify
from helpers.ollama_client import call_ollama
from helpers.game_rules import GAME_RULES, STATUS_EFFECTS
from utils.json_utils import merge_json
import json, uuid
from datetime import datetime, timezone

mentor_bp = Blueprint("mentor", __name__)

def normalize_status(name, raw):
    """Force status into UI schema."""
    rule = STATUS_EFFECTS.get(name, {})
    return {
        "name": name,
        "effect": rule.get("effect", ""),
        "description": raw.get("description", ""),
        "time_remaining": raw.get("time_remaining", f"{rule.get('duration_days','?')} days")
    }

def normalize_activity(entry):
    """Force activity logs into schema."""
    return {
        "id": str(uuid.uuid4()),
        "type": entry.get("type", "generic"),
        "description": entry.get("description", ""),
        "xp_change": entry.get("xp_change", 0),
        "timestamp": entry.get("timestamp", datetime.now(timezone.utc).isoformat())
    }

@mentor_bp.route("/mentor-action", methods=["POST"])
def mentor_action():
    data = request.get_json()
    stats = data.get("stats", {})
    goals = data.get("goals", [])
    recent_quests = data.get("recent_quests", {})
    today = datetime.now(timezone.utc).strftime("%B %d, %Y")

    base_prompt = f"""
    You are an AI mentor for the RPG self-improvement game 'Redo'.
    Today is {today}.
    User stats: {stats}
    User goals: {goals}
    Recent quest activity: {recent_quests}
    Rules: {GAME_RULES}
    Respond with JSON:
    {{
      "dashboard": {{
        "current_streak": 0,
        "total_xp": 0,
        "character_level": 1
      }},
      "active_status_effects": [
        {{ "name": "Momentum", "description": "You're on fire!", "time_remaining": "18 hours" }}
      ],
      "quests_today": [],
      "character_stats": [
        {{ "name": "Vitality", "level": 1, "xp_current": 0, "xp_needed": 100, "description": "..." }}
      ],
      "recent_activity": [
        {{ "type": "quest_completed", "description": "Completed meditation", "xp_change": +20 }}
      ],
      "mentor_message": "short motivational text"
    }}
    """
    inner_json, done_reason = call_ollama(base_prompt, num_predict=400)

    try:
        parsed = json.loads(inner_json)
    except json.JSONDecodeError:
        parsed = {}

    # Retry if truncated
    if done_reason == "length":
        required_keys = ["dashboard", "active_status_effects", "quests_today", "character_stats", "recent_activity", "mentor_message"]
        missing_keys = [k for k in required_keys if k not in parsed]
        if missing_keys:
            retry_prompt = f"Previous output truncated. Return missing fields only: {missing_keys} (raw JSON)."
            retry_inner_json, _ = call_ollama(retry_prompt, num_predict=200)
            try:
                retry_parsed = json.loads(retry_inner_json)
                parsed = merge_json(parsed, retry_parsed)
            except json.JSONDecodeError:
                pass

    # Normalize schema for frontend
    parsed["active_status_effects"] = [
        normalize_status(s.get("name",""), s) for s in parsed.get("active_status_effects", [])
    ]
    parsed["recent_activity"] = [
        normalize_activity(a) for a in parsed.get("recent_activity", [])
    ]

    return jsonify({"mentor_action": parsed})
