import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def call_gemini(prompt, model="gemini-2.5-flash", max_output_tokens=800):
    model_instance = genai.GenerativeModel(model)
    response = model_instance.generate_content(
        prompt,
        generation_config={"max_output_tokens": max_output_tokens}
    )
    finish_reason = response.candidates[0].finish_reason
    print("Gemini finish_reason:", finish_reason)
    if finish_reason != 1:  # 1 = "STOP"
        # safety or refusal
        return '{"quests": []}'
    if response.candidates:
        parts = response.candidates[0].content.parts
        if parts:
            return "".join([p.text for p in parts if hasattr(p, "text")])
    return '{"quests": []}'
