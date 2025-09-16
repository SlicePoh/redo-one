use axum::{
    routing::{get, post, put},
    Router,
};
use std::net::SocketAddr;
use tracing_subscriber;

mod config;
mod db;
mod models;
mod routes;

use config::Config;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    // Load env + config
    let config = Config::from_env();
    // Connect to Supabase/Postgres
    let pool = db::connect_db(&config.database_url).await;
    // Build routes
    let app = Router::new()
        // Health check
        .route("/health", get(|| async { "✅ OK" }))
        .route("/register", post(routes::users::register))
        .route("/login", post(routes::users::login))
        .route("/character-sheet", get(routes::users::character_sheet))
        .route("/goals", post(routes::goals::set_goals))
        .route("/goals/progress", get(routes::goals::progress))
        .route("/quests/generate", post(routes::quests::generate_quests))
        .route("/quests", post(routes::quests::generate_quests)) // manual add later
        .route("/mentor/action", post(routes::mentor::mentor_action))
        .route("/habits", post(routes::habits::log_habit))
        .route("/rewards", get(routes::rewards::list_rewards))
        .route("/rewards/claim", put(routes::rewards::claim_reward))
        // Pass DB connection pool everywhere
        .with_state(pool);

    // Bind server
    let addr = SocketAddr::from(([127, 0, 0, 1], config.port));
    tracing::info!("🚀 Server running at http://{}", addr);
    axum::serve(tokio::net::TcpListener::bind(addr).await.unwrap(), app)
        .await
        .unwrap();
}
