from transformers import pipeline

# Load the model once at startup (change model name if needed)
llm_pipe = pipeline(
    "text-generation",
    model="mistralai/Mistral-7B-Instruct-v0.2",  # or another model you prefer
    device_map="auto",
    torch_dtype="auto"
)

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_limiter.errors import RateLimitExceeded
limiter = Limiter(get_remote_address, app=app, default_limits=["5 per minute"])

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_API_URL = (
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key='
    + (GEMINI_API_KEY or '')
)

user_states = {}

PROMPT_TEMPLATE = (
    "The user has provided the following paragraph about their goals and background. "
    "Please extract a list of quests, stats, biodata, and effects that are relevant to this user's unique context. "
    "The stat names, quest types, and biodata fields should be customized for the user's goals. "
    "If any important information is missing, suggest a follow-up question. Output the data as flexible JSON.\n\n"
    "User input: {user_input}"
)

def is_data_quality_sufficient(ai_response):
    return (
        'quests' in ai_response and ai_response['quests'] and
        'stats' in ai_response and ai_response['stats'] and
        'biodata' in ai_response and ai_response['biodata']
    )

@app.route('/process-input', methods=['POST'])
@limiter.limit("1 per minute") 
def process_input():
    if not GEMINI_API_KEY:
        return jsonify({'error': 'GEMINI_API_KEY not set'}), 500

    data = request.json
    user_id = data.get('user_id', 'demo')
    user_input = data.get('input', '')
    conversation = user_states.get(user_id, {'history': []})

    prompt = PROMPT_TEMPLATE.format(user_input=user_input)
    gemini_payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(GEMINI_API_URL, json=gemini_payload, headers=headers, timeout=15)
        response.raise_for_status()
        gemini_data = response.json()
    except Exception as e:
        return jsonify({'error': 'Failed to contact Gemini API', 'details': str(e)}), 502

    ai_text = gemini_data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
    try:
        ai_json = json.loads(ai_text) if ai_text.strip().startswith('{') else {}
    except Exception:
        ai_json = {}

    conversation['history'].append({'user': user_input, 'ai': ai_json})
    user_states[user_id] = conversation

    if is_data_quality_sufficient(ai_json):
        return jsonify({
            'status': 'done',
            'data': ai_json
        })
    else:
        follow_up = ai_json.get('follow_up_question') or 'Can you provide more details about your goals or background?'
        return jsonify({
            'status': 'incomplete',
            'follow_up': follow_up
        })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True)
