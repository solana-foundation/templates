use rocket::{State, serde::json::Json};
use serde_json::{json, Value};
use std::sync::Arc;
use crate::shared::config::Config;

#[get("/health")]
pub fn health_check(config: &State<Arc<Config>>) -> Json<Value> {
    log::info!("Health check requested");
    Json(json!({
        "status": "healthy",
        "service": "x402-rust-server",
        "framework": "rocket",
        "network": config.solana_network,
        "receiver": config.receiver_address,
    }))
}
