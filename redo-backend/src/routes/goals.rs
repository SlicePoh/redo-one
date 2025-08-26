use axum::{extract::State, Json};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use uuid::Uuid;

#[derive(Deserialize)]
pub struct RegisterRequest {
    pub name: String,
    pub email: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct RegisterResponse {
    pub id: Uuid,
    pub name: String,
    pub email: String,
}

pub async fn register(
    State(_db): State<PgPool>,
    Json(payload): Json<RegisterRequest>,
) -> Json<RegisterResponse> {
    // TODO: Insert into Supabase "users" table
    Json(RegisterResponse {
        id: Uuid::new_v4(),
        name: payload.name,
        email: payload.email,
    })
}

#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct LoginResponse {
    pub token: String,
}

pub async fn login(
    State(_db): State<PgPool>,
    Json(_payload): Json<LoginRequest>,
) -> Json<LoginResponse> {
    // TODO: Check credentials in DB + return JWT
    Json(LoginResponse {
        token: "dummy-jwt-token".to_string(),
    })
}

pub async fn character_sheet(State(_db): State<PgPool>) -> Json<serde_json::Value> {
    // TODO: Query stats from DB
    Json(serde_json::json!({
        "stats": {
            "Vitality": { "level": 2, "xp_current": 40, "xp_needed": 100 },
            "Intelligence": { "level": 1, "xp_current": 20, "xp_needed": 100 }
        },
        "total_xp": 150,
        "character_level": 2,
        "statuses": []
    }))
}

pub async fn set_goals() -> &'static str {
    "set goals (not implemented yet)"
}
pub async fn progress() -> &'static str {
    "progress endpoint (not implemented yet)"
}
