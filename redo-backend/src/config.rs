use std::env;

#[derive(Debug, Clone)]
pub struct Config {
    pub database_url: String,
    pub supabase_url: String,
    pub supabase_anon_key: String,
    pub supabase_service_role_key: String,
    pub jwt_secret: String,
    pub ai_service_url: String,
    pub port: u16,
}

impl Config {
    pub fn from_env() -> Self {
        // Load .env file (only needed for local dev)
        dotenvy::dotenv().ok();
        Self {
            database_url: env::var("DATABASE_URL").expect("DATABASE_URL must be set"),
            supabase_url: env::var("SUPABASE_URL").expect("SUPABASE_URL must be set"),
            supabase_anon_key: env::var("SUPABASE_ANON_KEY")
                .expect("SUPABASE_ANON_KEY must be set"),
            supabase_service_role_key: env::var("SUPABASE_SERVICE_ROLE_KEY").unwrap_or_default(), // optional for now
            jwt_secret: env::var("JWT_SECRET").expect("JWT_SECRET must be set"),
            ai_service_url: env::var("AI_SERVICE_URL")
                .unwrap_or_else(|_| "http://127.0.0.1:8000".to_string()),
            port: env::var("PORT")
                .unwrap_or_else(|_| "5000".to_string())
                .parse()
                .expect("PORT must be a number"),
        }
    }
}
