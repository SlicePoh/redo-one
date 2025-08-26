use axum::{extract::State, Json};
use chrono::{Duration, Utc};
use jsonwebtoken::{encode, EncodingKey, Header};
use serde::{Deserialize, Serialize};
use sqlx::{PgPool, Row};
use uuid::Uuid;

use argon2::{
    password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use rand::rngs::OsRng;

// REGISTER 
#[derive(Deserialize)]
pub struct RegisterRequest {
    pub name: String,
    pub email: String,
    pub password: String,
}

#[derive(Serialize, sqlx::FromRow)]
pub struct RegisterResponse {
    pub id: Uuid,
    pub name: String,
    pub email: String,
}

pub async fn register(
    State(db): State<PgPool>,
    Json(payload): Json<RegisterRequest>,
) -> Result<Json<RegisterResponse>, (axum::http::StatusCode, String)> {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();

    let hash = argon2
        .hash_password(payload.password.as_bytes(), &salt)
        .map_err(|_| {
            (
                axum::http::StatusCode::INTERNAL_SERVER_ERROR,
                "Password hashing failed".into(),
            )
        })?
        .to_string();

    let rec = sqlx::query_as::<_, RegisterResponse>(
        r#"
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email
        "#
    )
    .bind(&payload.name)
    .bind(&payload.email)
    .bind(hash)
    .fetch_one(&db)
    .await
    .map_err(|e| {
        (
            axum::http::StatusCode::INTERNAL_SERVER_ERROR,
            format!("DB error: {}", e),
        )
    })?;

    Ok(Json(rec))
}

// LOGIN 

#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct LoginResponse {
    pub token: String,
}

#[derive(Serialize)]
struct Claims {
    sub: String, // user id
    exp: usize,  // expiry timestamp
}

pub async fn login(
    State(db): State<PgPool>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<LoginResponse>, (axum::http::StatusCode, String)> {
    let row = sqlx::query(
        r#"SELECT id, password_hash FROM users WHERE email = $1"#
    )
    .bind(&payload.email)
    .fetch_one(&db)
    .await
    .map_err(|_| {
        (
            axum::http::StatusCode::UNAUTHORIZED,
            "Invalid credentials".into(),
        )
    })?;

    // row comes as sqlx::postgres::PgRow → extract columns manually
    let id: Uuid = row.try_get("id").unwrap();
    let password_hash: String = row.try_get("password_hash").unwrap();

    // Verify password
    let parsed_hash = PasswordHash::new(&password_hash).map_err(|_| {
        (
            axum::http::StatusCode::INTERNAL_SERVER_ERROR,
            "Invalid stored password hash".into(),
        )
    })?;
    let valid = Argon2::default()
        .verify_password(payload.password.as_bytes(), &parsed_hash)
        .is_ok();
    if !valid {
        return Err((
            axum::http::StatusCode::UNAUTHORIZED,
            "Invalid credentials".into(),
        ));
    }

    // Issue JWT
    let expiration = Utc::now() + Duration::hours(24);
    let claims = Claims {
        sub: id.to_string(),
        exp: expiration.timestamp() as usize,
    };

    let secret = std::env::var("JWT_SECRET").map_err(|_| {
        (
            axum::http::StatusCode::INTERNAL_SERVER_ERROR,
            "JWT_SECRET missing".into(),
        )
    })?;

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    )
    .map_err(|_| {
        (
            axum::http::StatusCode::INTERNAL_SERVER_ERROR,
            "JWT encode failed".into(),
        )
    })?;

    Ok(Json(LoginResponse { token }))
}

pub async fn character_sheet() -> &'static str {
    "character sheet endpoint (not implemented yet)"
}
