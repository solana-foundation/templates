use axum::{Json, extract::State};
use serde_json::{json, Value};
use std::sync::Arc;
use crate::shared::config::Config;

pub async fn health_check(
    State(config): State<Arc<Config>>
) -> Json<Value> {
    log::info!("Health check requested");
    Json(json!({
        "status": "healthy",
        "service": "x402-rust-server",
        "framework": "axum",
        "network": config.solana_network,
        "receiver": config.receiver_address,
    }))
}
