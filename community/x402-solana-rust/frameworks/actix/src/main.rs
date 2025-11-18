mod routes;
mod facilitator;
mod shared;

use actix_web::{web, App, HttpServer, middleware::Logger};
use actix_cors::Cors;
use std::sync::Arc;
use shared::config::Config;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialize logging
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    // Load configuration
    let config = Config::from_env()
        .expect("Failed to load configuration");

    let addr = config.server_address();

    log::info!("Starting x402 Rust Server (Actix)");
    log::info!("Facilitator: {}", config.facilitator_url);
    log::info!("Receiver: {}", config.receiver_address);
    log::info!("Network: {}", config.solana_network);

    let config = Arc::new(config);
    let addr_clone = addr.clone();

    log::info!("Server listening on http://{}", addr_clone);
    log::info!("Try: curl http://{}/api/health", addr_clone);

    HttpServer::new(move || {
        let cors = Cors::permissive();

        App::new()
            .app_data(web::Data::new(config.clone()))
            .wrap(cors)
            .wrap(Logger::default())
            .service(
                web::scope("/api")
                    .service(routes::health::health_check)
                    .service(routes::free::free_endpoint)
                    .service(routes::paid::paid_endpoint)
            )
    })
    .bind(&addr)?
    .run()
    .await
}
