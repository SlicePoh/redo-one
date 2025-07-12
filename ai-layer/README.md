# AI Layer for redo-one

This folder will contain the Python/Flask AI microservice.

## 🧠 AI Microservice Setup Guide (for Frontend Devs)


This guide will help you set up an AI-powered microservice that:
- Accepts long-form (or voice-generated) user input
- Uses Gemini API to process and extract quests, stats, biodata, and effects
- **Dynamically generates stat names, quest types, and biodata fields based on each user's unique requirements** (e.g., cooking, karate, music, etc.)
- Acts as a chatbot: asks follow-up questions if input is unclear or incomplete
- Stops asking when data quality is high enough, then generates structured data
- Sends the generated data to the backend/database for the user

---

## 🚦 Key Principles

- **Dynamic Data**: Do not hardcode stat names, quest types, or biodata fields. The AI should infer and generate these based on the user's goals and context. For example, if a user wants to improve at cooking, the AI should create relevant stats (e.g., "Cooking Skill"), quests (e.g., "Try a new recipe"), and effects.
- **Flexible Schema**: The output JSON structure should be able to handle any stat, quest, or biodata field the AI generates for different users.
- **Conversational Flow**: The AI should ask clarifying questions to fill in missing or ambiguous information, and adapt its questions based on the user's responses and goals.

---


### 1. **Set Up the Python/Flask Microservice**
- Create a new Python virtual environment in this folder
- Install Flask and required libraries (`pip install flask flask-cors requests`)
- (Optional) Add `python-dotenv` for managing secrets


### 2. **Integrate Gemini API**
- Store your Gemini API key securely (e.g., in a `.env` file)
- Use the Gemini API to send user input and receive AI-generated responses
- Start with prompt engineering: send the user's paragraph and ask Gemini to extract quests, stats, biodata, and effects as JSON
- **Prompt Gemini to create custom stat names, quest types, and biodata fields based on the user's unique goals and context.**
- Ensure the output is flexible and not tied to any specific example (like the provided dummy data).


### 3. **Implement Chatbot Logic**
- If Gemini's response is missing required fields or is low-confidence, ask the user clarifying questions
- Track the conversation state (e.g., what info is missing)
- Set a threshold for data quality (e.g., all required fields present, or confidence score high)
- When threshold is met, stop asking and generate the final structured data
- **Adapt questions and data extraction to each user's context/goals.**


### 4. **API Endpoints**
- `/process-input`: Accepts user input (text/voice transcript), returns follow-up question or final data
- (Optional) `/health` for health checks


### 5. **Connect to Backend**
- Once data is generated, send it to the backend API (Node/Express) for storage in the database
- Use user authentication (e.g., user ID/token) to associate data with the correct user
- **Ensure the backend can handle dynamic fields and structures.**


### 6. **Testing**
- Test with sample paragraphs for different user types (e.g., cooking, music, fitness, etc.)
- Check if the AI asks relevant questions and generates correct, user-specific data
- Adjust prompts and logic as needed


### 7. **(Optional) Voice Input**
- For voice, use a speech-to-text service on the frontend, then send the transcript to the AI microservice

---
**Tip:** You do NOT need deep data science or LLM knowledge. Focus on API calls, prompt design, and conversation flow. Use Gemini's documentation for prompt examples and best practices.

---

## 📝 Example Prompt for Gemini

> "The user has provided the following paragraph about their goals and background. Please extract a list of quests, stats, biodata, and effects that are relevant to this user's unique context. The stat names, quest types, and biodata fields should be customized for the user's goals. If any important information is missing, suggest a follow-up question. Output the data as flexible JSON."

---

**Remember:**
- Make the system flexible and user-driven, not tied to any one example or static schema.
- Always adapt to the user's needs and context.
