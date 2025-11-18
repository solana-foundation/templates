mod routes;
mod facilitator;
mod shared;

use axum::{Router, http::Method};
use tower_http::cors::{CorsLayer, Any};
use shared::config::Config;
use std::sync::Arc;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Initialize logging
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    // Load configuration
    let config = Config::from_env()?;
    let addr = config.server_address();

    log::info!("Starting x402 Rust Server (Axum)");
    log::info!("Facilitator: {}", config.facilitator_url);
    log::info!("Receiver: {}", config.receiver_address);
    log::info!("Network: {}", config.solana_network);

    let config = Arc::new(config);

    // Configure CORS
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST])
        .allow_headers(Any);

    // Build router
    let app = Router::new()
        .nest("/api", routes::create_router())
        .layer(cors)
        .with_state(config);

    // Start server
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    log::info!("Server listening on http://{}", addr);
    log::info!("Try: curl http://{}/api/health", addr);

    axum::serve(listener, app).await?;

    Ok(())
}
