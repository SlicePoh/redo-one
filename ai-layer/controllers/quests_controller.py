from flask import Blueprint, request, jsonify
from helpers.ollama_client import call_ollama
from helpers.game_rules import GAME_RULES, XP_BY_DIFFICULTY
from concurrent.futures import ThreadPoolExecutor, as_completed
import json, uuid
from utils.rag_utils import retrieve_context

quests_bp = Blueprint("quests", __name__)

def normalize_quest(raw_q):
    """Force quest into UI schema."""
    return {
        "id": raw_q.get("id", str(uuid.uuid4())),
        "title": raw_q.get("title", "Untitled Quest"),
        "description": raw_q.get("description", ""),
        "difficulty": raw_q.get("difficulty", "Easy"),
        "xp": raw_q.get("xpGain", XP_BY_DIFFICULTY.get(raw_q.get("difficulty", "Easy"), 20)),
        "stats": raw_q.get("stats", []),
        "time_estimate": raw_q.get("time_estimate", "30 min"),
        "status": raw_q.get("status", "Pending")
    }

@quests_bp.route("/generate-quests", methods=["POST"])
def generate_quests():
    data = request.get_json()
    user_data = data.get("user_data", {})
    goals = user_data.get("goals", [])
    target_quests = data.get("quests_count", 20)
    titles_set = set()
    all_quests = []
    def generate_for_goal(goal, already_titles):
        query_text = goal.get("goal", "") + " " + " ".join(goal.get("questions", {}).values())
        retrieved = retrieve_context(query_text, top_k=3)
        prompt = f"""
        You are an RPG quest designer for the gamified life app 'Redo'.
        User stats: {json.dumps(user_data.get("stats", {}), indent=2)}
        Goal: {goal.get("goal", "")}
        Related answers: {json.dumps(goal.get("questions", {}), indent=2)}
        Retrieved knowledge: {retrieved}
        Rules: {GAME_RULES}
        Format STRICT JSON...
        """
        inner_json, _ = call_ollama(prompt, num_predict=800)
        try:
            parsed = json.loads(inner_json)
            return parsed.get("quests", [])
        except json.JSONDecodeError:
            return []

    for _ in range(5):
        if len(all_quests) >= target_quests:
            break
        with ThreadPoolExecutor(max_workers=len(goals)) as executor:
            futures = [executor.submit(generate_for_goal, goal, titles_set) for goal in goals]
            for future in as_completed(futures):
                quests = future.result()
                for q in quests:
                    if isinstance(q, dict) and "title" in q and q["title"] not in titles_set:
                        titles_set.add(q["title"])
                        all_quests.append(normalize_quest(q))
                        if len(all_quests) >= target_quests:
                            break
    return jsonify({"quests": all_quests[:target_quests]})
