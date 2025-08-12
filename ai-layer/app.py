import json
import requests
from flask import Flask, request, jsonify
from concurrent.futures import ThreadPoolExecutor, as_completed

app = Flask(__name__)

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "qwen3"

GAME_RULES = """
Stats: Vitality, Intelligence, Fortitude, Charisma, Creativity, Luck.
Each quest: 1-3 tagged stats; XP split evenly. Difficulty→XP: Easy:20, Medium:50, Hard:100, Legendary:200.
XP_needed(level) = 100 * level^1.5. Global level = floor(totalXP/500).
Statuses: Momentum, Flow State, Luck Surge, Slump, Injury, Burnout.
Penalties: Missed quest → lose 50% XP for tagged stats.
Missed streak day → lose streak bonus & -10% XP next day.
3+ failed quests/week → Slump.
Bonuses: Daily streak: +5% XP/day (max 50%).
Stat combo: ≥3 quests for same stat/day → +20% XP next day for that stat.
Variety bonus: ≥1 quest for each stat/week → +500 global XP.
Goal progression: Based on linked stats' average level %, with milestone rewards.
"""

def call_ollama(prompt, num_predict=500):
    """Call Ollama and return parsed response string + done_reason."""
    resp = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL_NAME,
            "format": "json",
            "prompt": prompt,
            "stream": False,
            "options": {"num_predict": num_predict}
        }
    )
    outer = resp.json()
    inner_json = outer.get("response", "{}").strip()
    done_reason = outer.get("done_reason", "")
    return inner_json, done_reason

@app.route("/generate-quests", methods=["POST"])
def generate_quests():
    data = request.get_json()
    user_data = data.get("user_data", {})
    goals = user_data.get("goals", [])
    target_quests = data.get("quests_count", 20)

    titles_set = set()
    all_quests = []

    def generate_for_goal(goal, already_titles):
        """Generate quests for a single goal."""
        prompt = f"""
        You are an RPG quest designer for the gamified life app 'Redo'.

        User stats:
        {json.dumps(user_data.get("stats", {}), indent=2)}

        Goal: {goal.get("goal", "")}

        Related question answers:
        {json.dumps(goal.get("questions", {}), indent=2)}

        Rules:
        - Stats: Vitality, Intelligence, Fortitude, Charisma, Creativity, Luck.
        - Difficulty → XP: Easy=20, Medium=50, Hard=100, Legendary=200.
        - Each quest: title, description (max 20 words), 1–3 stats, difficulty, xpGain.
        - Avoid duplicate titles (avoid: {list(already_titles)}).
        - Keep tone practical but RPG-themed.

        Output ONLY in JSON:
        {{
        "quests": [
            {{
            "title": "string",
            "description": "string",
            "stats": ["Stat1", "Stat2"],
            "difficulty": "Easy" | "Medium" | "Hard" | "Legendary",
            "xpGain": integer
            }}
        ]
        }}"""
        inner_json, _ = call_ollama(prompt, num_predict=800)
        try:
            parsed = json.loads(inner_json)
            return parsed.get("quests", [])
        except json.JSONDecodeError:
            return []

    max_rounds = 5
    for _ in range(max_rounds):
        if len(all_quests) >= target_quests:
            break

        with ThreadPoolExecutor(max_workers=len(goals)) as executor:
            futures = [
                executor.submit(generate_for_goal, goal, titles_set)
                for goal in goals
            ]
            for future in as_completed(futures):
                quests = future.result()
                for q in quests:
                    if isinstance(q, dict) and "title" in q and q["title"] not in titles_set:
                        titles_set.add(q["title"])
                        all_quests.append(q)
                        if len(all_quests) >= target_quests:
                            break
    # Trim to target count
    all_quests = all_quests[:target_quests]
    return jsonify({"quests": all_quests})


def merge_json(original, update):
    """Merge two JSON objects without overwriting existing complete fields."""
    for key, value in update.items():
        if key not in original or not original[key]:
            original[key] = value
        elif isinstance(value, dict) and isinstance(original[key], dict):
            merge_json(original[key], value)
    return original

@app.route("/mentor-action", methods=["POST"])
def mentor_action():
    data = request.get_json()
    stats = data.get("stats", {})
    goals = data.get("goals", [])
    recent_quests = data.get("recent_quests", {})

    today = "August 10, 2025"

    base_prompt = f"""
You are an AI mentor in the RPG self-improvement game 'Redo'.
Today is {today}.
User stats: {stats}
User goals (priority order): {goals}
Recent quest activity: {recent_quests}

Follow these game rules:
{GAME_RULES}

Return today's game output **as raw JSON only**, no markdown, no extra text, following this schema exactly:
{{
  "quests_today": [
    {{
      "title": "Morning Stretch",
      "description": "Do 5 minutes of stretching to start the day.",
      "stats": ["Vitality", "Fortitude"],
      "xpGain": 50,
      "difficulty": "Medium"
    }}
  ],
  "xp_updates": {{"Vitality": 50, "Fortitude": 50}},
  "statuses_applied": ["Momentum"],
  "level_ups": {{"Vitality": {{"old": 2, "new": 3}}}},
  "mentor_message": "You're building momentum. Keep it up!"
}}
"""

    inner_json, done_reason = call_ollama(base_prompt, num_predict=300)

    try:
        parsed = json.loads(inner_json)
    except json.JSONDecodeError:
        parsed = {}

    if done_reason == "length":
        missing_fields = [
            k for k in ["quests_today", "xp_updates", "statuses_applied", "level_ups", "mentor_message"]
            if k not in parsed
        ]
        if missing_fields:
            retry_prompt = f"""
The previous JSON output was truncated.
Only return the missing fields: {missing_fields} in the same JSON format.
Do not repeat fields that are already complete.
"""
            retry_inner_json, _ = call_ollama(retry_prompt, num_predict=200)
            try:
                retry_parsed = json.loads(retry_inner_json)
                parsed = merge_json(parsed, retry_parsed)
            except json.JSONDecodeError:
                pass

    return jsonify({"mentor_action": parsed})

if __name__ == "__main__":
    app.run(debug=True)


# @app.route("/generate-quests", methods=["POST"])
# def generate_quests():
#     data = request.get_json()
#     user_data = data.get("user_data", {})

#     def generate_batch(batch_num, already_titles):
#         prompt = f"""
# Generate 10 unique RPG-style quests for the gamified life app 'Redo'.

# User stats:
# {json.dumps(user_data.get("stats", {}), indent=2)}

# Rules:
# - Stats: Vitality, Intelligence, Fortitude, Charisma, Creativity, Luck.
# - Difficulty → XP: Easy=20, Medium=50, Hard=100, Legendary=200.
# - Ensure a balanced mix of stats and difficulties across quests.
# - Each quest has: title, description, stats (1–3), difficulty, xpGain.
# - No duplicate titles (avoid: {list(already_titles)}).
# - Keep descriptions under 20 words.
# - Output JSON ONLY in this format:
# {{
#   "quests": [
#     {{
#       "title": "string",
#       "description": "string",
#       "stats": ["Stat1", "Stat2"],
#       "difficulty": "Easy" | "Medium" | "Hard" | "Legendary",
#       "xpGain": integer
#     }}
#   ]
# }}
# """
#         inner_json, _ = call_ollama(prompt, num_predict=800)
#         try:
#             parsed = json.loads(inner_json)
#             quests = parsed.get("quests", [])
#             if not isinstance(quests, list):
#                 return []
#             return quests
#         except json.JSONDecodeError:
#             print(f"[Batch {batch_num}] Malformed JSON:\n{inner_json}")
#             return []

#     all_quests = []
#     titles_set = set()

#     with ThreadPoolExecutor(max_workers=5) as executor:
#         futures = [executor.submit(generate_batch, i, titles_set) for i in range(5)]
#         for future in as_completed(futures):
#             quests = future.result()
#             for q in quests:
#                 # Validate required keys
#                 if not isinstance(q, dict):
#                     continue
#                 if "title" not in q or "description" not in q:
#                     continue
#                 if q["title"] in titles_set:
#                     continue
#                 titles_set.add(q["title"])
#                 all_quests.append(q)

#     # Keep only 50 quests max
#     all_quests = all_quests[:50]

#     return jsonify({"quests": all_quests})