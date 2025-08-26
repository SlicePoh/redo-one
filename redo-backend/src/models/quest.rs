use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Quest {
    pub id: Uuid,
    pub user_id: Uuid,
    pub title: String,
    pub description: String,
    pub difficulty: String,
    pub xp: i32,
    pub stats: serde_json::Value,
    pub time_estimate: Option<i32>,
    pub status: String,
}
