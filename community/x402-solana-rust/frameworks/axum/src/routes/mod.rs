mod health;
mod free;
mod paid;

use axum::{Router, routing::get};
use std::sync::Arc;
use crate::shared::config::Config;

pub fn create_router() -> Router<Arc<Config>> {
    Router::new()
        .route("/health", get(health::health_check))
        .route("/free", get(free::free_endpoint))
        .route("/paid", get(paid::paid_endpoint))
}
