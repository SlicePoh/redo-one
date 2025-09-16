from flask import Blueprint, request, jsonify #type: ignore
from helpers.gemini_client import call_gemini
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

    def generate_for_goal(goal):
        query_text = goal.get("goal", "") + " " + " ".join(goal.get("questions", {}).values())
        retrieved = retrieve_context(query_text, top_k=3)

        prompt = f"""
        You are an RPG quest designer for the gamified life app 'Redo'.

        User stats: {json.dumps(user_data.get("stats", {}), indent=2)}
        Goal: {goal.get("goal", "")}
        Related answers: {json.dumps(goal.get("questions", {}), indent=2)}
        Retrieved knowledge: {retrieved}
        Rules: {GAME_RULES}

        Respond ONLY with valid JSON. Do not add explanations or markdown.
        Follow this schema strictly:
        {{
          "quests": [
            {{
              "title": "string",
              "description": "string",
              "difficulty": "Easy|Medium|Hard",
              "xpGain": integer,
              "stats": ["Vitality", "Intelligence"],
              "time_estimate": "30 min"
            }}
          ]
        }}

        If you cannot generate quests, return exactly:
        {{"quests":[]}}
        """

        inner_json = call_gemini(prompt, max_output_tokens=800)
        print("Gemini raw output:", inner_json)

        quests = []
        try:
            parsed = json.loads(inner_json)
            quests = parsed.get("quests", [])
            if not isinstance(quests, list):
                quests = []
        except Exception as e:
            print("Gemini JSON parse error:", e, "Raw:", inner_json)
            quests = []

        # Retry once with a simpler prompt if Gemini refused
        if not quests:
            retry_prompt = f"""
            Generate 2 simple quests for the goal: {goal.get("goal", "")}.
            Each quest should have: title, description, difficulty (Easy|Medium|Hard),
            xpGain (int), stats (list), and time_estimate.
            Respond ONLY in JSON, format:
            {{"quests":[...]}}
            """
            inner_json_retry = call_gemini(retry_prompt, max_output_tokens=500)
            print("Gemini retry output:", inner_json_retry)
            try:
                parsed_retry = json.loads(inner_json_retry)
                quests = parsed_retry.get("quests", [])
                if not isinstance(quests, list):
                    quests = []
            except Exception as e:
                print("Gemini retry parse error:", e, "Raw:", inner_json_retry)
                quests = []

        # Fallback if still empty
        if not quests:
            quests = [
                {
                    "title": f"Fallback Quest {i+1}",
                    "description": "Simple default quest when AI refuses",
                    "difficulty": "Easy",
                    "xpGain": 5,
                    "stats": ["Vitality"],
                    "time_estimate": "5 min"
                }
                for i in range(2)
            ]

        return quests

    # Sequential loop — no ThreadPoolExecutor
    for goal in goals:
        if len(all_quests) >= target_quests:
            break
        quests = generate_for_goal(goal)
        for q in quests:
            if isinstance(q, dict) and "title" in q and q["title"] not in titles_set:
                titles_set.add(q["title"])
                all_quests.append(normalize_quest(q))
                if len(all_quests) >= target_quests:
                    break

    # Ensure we always return the requested number of quests
    while len(all_quests) < target_quests:
        all_quests.append(normalize_quest({
            "title": f"Extra Fallback Quest {len(all_quests)+1}",
            "description": "Auto-filled quest to meet required count",
            "difficulty": "Easy",
            "xpGain": 5,
            "stats": ["Vitality"],
            "time_estimate": "5 min"
        }))
    return jsonify({"quests": all_quests[:target_quests]})
