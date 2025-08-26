use axum::{extract::State, Json};
use sqlx::PgPool;

pub async fn list_rewards(State(_db): State<PgPool>) -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "rewards": [
            {
                "title": "New Running Shoes",
                "description": "Unlock at Vitality Lv 8",
                "unlock_condition": "Vitality Level 8",
                "xp_progress": { "current": 1250, "target": 1900 },
                "status": "ready"
            }
        ]
    }))
}

pub async fn claim_reward(State(_db): State<PgPool>) -> Json<serde_json::Value> {
    Json(serde_json::json!({ "message": "Reward claimed" }))
}
