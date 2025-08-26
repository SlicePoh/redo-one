use axum::{extract::State, Json};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use sqlx::PgPool;
use crate::models::Quest;

#[derive(Debug, Deserialize, Serialize)]
pub struct GenerateQuestRequest {
    pub user_data: serde_json::Value,
    pub quests_count: Option<u32>,
}

pub async fn generate_quests(
    State(db): State<PgPool>,
    Json(payload): Json<GenerateQuestRequest>,
) -> Result<Json<Vec<Quest>>, axum::http::StatusCode> {
    // Call Python AI service
    let client = Client::new();
    let ai_response = client
        .post("http://127.0.0.1:5001/ai/generate-quests")
        .json(&payload)
        .send()
        .await
        .map_err(|_| axum::http::StatusCode::BAD_GATEWAY)?
        .json::<serde_json::Value>()
        .await
        .map_err(|_| axum::http::StatusCode::BAD_GATEWAY)?;
    let quests: Vec<Quest> = serde_json::from_value(ai_response["quests"].clone())
        .map_err(|_| axum::http::StatusCode::BAD_REQUEST)?;

    // Save to DB
    for q in &quests {
        sqlx::query(
            r#"
            INSERT INTO quests (id, user_id, title, description, difficulty, xp, stats, time_estimate, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            "#
        )
        .bind(&q.id)
        .bind(&q.user_id)
        .bind(&q.title)
        .bind(&q.description)
        .bind(&q.difficulty)
        .bind(&q.xp)
        .bind(&q.stats)
        .bind(&q.time_estimate)
        .bind(&q.status)
        .execute(&db)
        .await
        .unwrap();
    }

    Ok(Json(quests))
}
