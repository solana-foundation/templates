use actix_web::{get, web, HttpResponse};
use serde_json::json;
use std::sync::Arc;
use crate::shared::config::Config;

#[get("/health")]
pub async fn health_check(config: web::Data<Arc<Config>>) -> HttpResponse {
    log::info!("Health check requested");
    HttpResponse::Ok().json(json!({
        "status": "healthy",
        "service": "x402-rust-server",
        "framework": "actix",
        "network": config.solana_network,
        "receiver": config.receiver_address,
    }))
}
