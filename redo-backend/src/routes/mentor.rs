use axum::{extract::State, Json};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use axum::http::StatusCode;

#[derive(Deserialize, Serialize)]
pub struct MentorRequest {
    pub stats: serde_json::Value,
    pub goals: Vec<serde_json::Value>,
    pub recent_quests: Vec<serde_json::Value>,
}

pub async fn mentor_action(
    State(_db): State<PgPool>,
    Json(payload): Json<MentorRequest>,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    let client = Client::new();

    let res = client
        .post("http://127.0.0.1:5001/ai/mentor-action")
        .json(&payload)
        .send()
        .await
        .map_err(|e| (StatusCode::BAD_GATEWAY, format!("Failed to call AI: {}", e)))?;

    if !res.status().is_success() {
        return Err((
            StatusCode::BAD_GATEWAY,
            format!("AI service error: {}", res.status()),
        ));
    }

    let ai_response = res
        .json::<serde_json::Value>()
        .await
        .map_err(|e| (StatusCode::BAD_GATEWAY, format!("Bad AI response: {}", e)))?;

    // TODO: Apply XP updates + persist mentor action in DB (_db)

    Ok(Json(ai_response))
}
