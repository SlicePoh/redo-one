use axum::{extract::State, Json};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use uuid::Uuid;

#[derive(Deserialize)]
pub struct HabitLogRequest {
    pub name: String,
    pub xp_penalty: i32,
    pub affected_stats: Vec<String>,
}

#[derive(Serialize)]
pub struct HabitLogResponse {
    pub id: Uuid,
    pub name: String,
    pub xp_penalty: i32,
    pub affected_stats: Vec<String>,
}

pub async fn log_habit(
    State(_db): State<PgPool>,
    Json(payload): Json<HabitLogRequest>,
) -> Json<HabitLogResponse> {
    // TODO: Insert into habits table
    Json(HabitLogResponse {
        id: Uuid::new_v4(),
        name: payload.name,
        xp_penalty: payload.xp_penalty,
        affected_stats: payload.affected_stats,
    })
}
