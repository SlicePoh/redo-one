import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama2:latest"

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
