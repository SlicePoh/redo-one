use serde::{Deserialize, Serialize};

use super::Quest;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MentorActionResponse {
    pub dashboard: serde_json::Value,
    pub active_status_effects: Vec<serde_json::Value>,
    pub quests_today: Vec<Quest>,
    pub character_stats: Vec<serde_json::Value>,
    pub habit_violations: Vec<serde_json::Value>,
    pub rewards: Vec<serde_json::Value>,
    pub recent_activity: Vec<serde_json::Value>,
    pub mentor_message: String,
}
