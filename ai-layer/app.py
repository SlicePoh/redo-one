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

PERPLEXITY_API_KEY = os.getenv('PERPLEXITY_API_KEY')
PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions'

user_states = {}

PROMPT_TEMPLATE = (
    "Analyze the following user input and extract detailed information about their life, goals, relationships, career, health, habits, interests, and challenges. "
    "Return a comprehensive JSON object with these keys: biodata, goals, relationships, career, health, habits, interests, challenges. "
    "If any information is missing, use an empty string or empty array for that key. Output only valid JSON. "
    "User input: {user_input}"
)

def call_perplexity_api(prompt):
    headers = {
        'Authorization': f'Bearer {PERPLEXITY_API_KEY}',
        'Content-Type': 'application/json',
    }
    payload = {
        'model': 'sonar-pro',
        'messages': [
            {'role': 'user', 'content': prompt}
        ],
        'max_tokens': 256,
    }
    response = requests.post(PERPLEXITY_API_URL, headers=headers, json=payload)
    response.raise_for_status()
    result = response.json()
    return result['choices'][0]['message']['content'] if 'choices' in result and result['choices'] else ''

@app.route('/process-input', methods=['POST'])
@limiter.limit("1 per minute")
def process_input():
    data = request.json
    user_id = data.get('user_id', 'demo')
    user_input = data.get('input', '')
    conversation = user_states.get(user_id, {'history': []})

    prompt = PROMPT_TEMPLATE.format(user_input=user_input)

    try:
        ai_text = call_perplexity_api(prompt)
    except Exception as e:
        return jsonify({'error': 'Failed to contact Perplexity API', 'details': str(e)}), 502

    try:
        ai_json = json.loads(ai_text) if ai_text.strip().startswith('{') else {}
    except Exception:
        ai_json = {}

    conversation['history'].append({'user': user_input, 'ai': ai_json})
    user_states[user_id] = conversation

    return jsonify({
        'status': 'done',
        'data': ai_json
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True)
