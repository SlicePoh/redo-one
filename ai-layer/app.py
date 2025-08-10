import json
import requests
from flask import Flask, request, jsonify

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

def merge_json(original, update):
    """Merge two JSON objects without overwriting existing complete fields."""
    for key, value in update.items():
        if key not in original or not original[key]:
            original[key] = value
        elif isinstance(value, dict) and isinstance(original[key], dict):
            merge_json(original[key], value)
    return original

@app.route("/generate-quests", methods=["POST"])
def generate_quests():
    data = request.get_json()
    user_data = data.get("user_data", {})

    DIFFICULTY_TARGETS = {
        "Easy": 8,
        "Medium": 15,
        "Hard": 15,
        "Legendary": 12
    }

    all_quests = []
    titles_set = set()
    difficulty_counts = {k: 0 for k in DIFFICULTY_TARGETS}

    def generate_batch(batch_size, already_titles, needed_difficulties):
        prompt = f"""
Generate {batch_size} unique RPG-style quests for the gamified life app 'Redo'.

User stats:
{json.dumps(user_data.get("stats", {}), indent=2)}

Rules:
- Stats: Vitality, Intelligence, Fortitude, Charisma, Creativity, Luck.
- Difficulty → XP: Easy=20, Medium=50, Hard=100, Legendary=200.
- Distribute quests as: {needed_difficulties}.
- Each quest has: title, description, stats (1–3), difficulty, xpGain.
- No duplicate titles (avoid: {list(already_titles)}).
- Keep descriptions under 20 words.
- Output JSON ONLY in this format:
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
}}
"""
        inner_json, _ = call_ollama(prompt, num_predict=800)
        try:
            parsed = json.loads(inner_json)
            return parsed.get("quests", [])
        except json.JSONDecodeError:
            return []

    while sum(difficulty_counts.values()) < 50:
        remaining_by_diff = {
            diff: DIFFICULTY_TARGETS[diff] - difficulty_counts[diff]
            for diff in DIFFICULTY_TARGETS
            if DIFFICULTY_TARGETS[diff] - difficulty_counts[diff] > 0
        }

        batch_size = min(25, sum(remaining_by_diff.values()))
        new_quests = generate_batch(batch_size, titles_set, remaining_by_diff)

        for q in new_quests:
            diff = q.get("difficulty")
            if diff in DIFFICULTY_TARGETS and difficulty_counts[diff] < DIFFICULTY_TARGETS[diff]:
                if q["title"] not in titles_set:
                    titles_set.add(q["title"])
                    all_quests.append(q)
                    difficulty_counts[diff] += 1

    return jsonify({"quests": all_quests})

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


# @app.route("/generate-quest", methods=["POST"])
# def generate_quest():
#     data = request.get_json()
#     user_data = data.get("user_data", {})
#     question = data.get("question", "")

#     prompt = f"""
# You are an RPG quest designer for the gamified life app 'Redo'.
# User data: {user_data}
# User question/goal: {question}

# Follow these game rules:
# {GAME_RULES}

# Return exactly ONE quest in this JSON format:
# {{
#   "title": "string",
#   "description": "string",
#   "stats": ["Stat1", "Stat2", "Stat3"],
#   "xpGain": integer,
#   "difficulty": "Easy" | "Medium" | "Hard" | "Legendary"
# }}
# """
#     inner_json, _ = call_ollama(prompt, num_predict=300)
#     try:
#         quest = json.loads(inner_json)
#     except json.JSONDecodeError:
#         quest = {"error": "Malformed JSON", "raw": inner_json}
#     return jsonify({"quest": quest})


# def mentor_action():
#     data = request.get_json()
#     stats = data.get("stats", {})
#     goals = data.get("goals", [])
#     recent_quests = data.get("recent_quests", {})
#     today = "August 10, 2025"

#     base_prompt = f"""
# You are an AI mentor in the RPG self-improvement game 'Redo'.
# Today is {today}.
# User stats: {stats}
# User goals (priority order): {goals}
# Recent quest activity: {recent_quests}

# Follow these game rules:
# {GAME_RULES}

# Return today's game output **as raw JSON only**, no markdown, no extra text:
# {{
#   "quests_today": [
#     {{
#       "title": "string",
#       "description": "string",
#       "stats": ["Stat1", "Stat2"],
#       "xpGain": integer,
#       "difficulty": "Easy" | "Medium" | "Hard" | "Legendary"
#     }}
#   ],
#   "xp_updates": {{"StatName": xp_change_int}},
#   "statuses_applied": ["Status1", "Status2"],
#   "level_ups": {{"StatName": {{"old": int, "new": int}}}},
#   "mentor_message": "string"
# }}
# """
#     inner_json, done_reason = call_ollama(base_prompt)
#     try:
#         parsed = json.loads(inner_json)
#     except json.JSONDecodeError:
#         parsed = {}

#     if done_reason == "length":
#         missing_fields = [k for k in ["quests_today", "xp_updates", "statuses_applied", "level_ups", "mentor_message"] if k not in parsed]
#         if missing_fields:
#             retry_prompt = f"""
# The previous JSON output was truncated.  
# Only return the missing fields: {missing_fields} in the same JSON format.
# Do not repeat fields that are already complete.
# """
#             retry_inner_json, _ = call_ollama(retry_prompt, num_predict=300)
#             try:
#                 retry_parsed = json.loads(retry_inner_json)
#                 parsed = merge_json(parsed, retry_parsed)
#             except json.JSONDecodeError:
#                 pass

#     return jsonify({"mentor_action": parsed})

if __name__ == "__main__":
    app.run(debug=True)
