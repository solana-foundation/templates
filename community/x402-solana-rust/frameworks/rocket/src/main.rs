#[macro_use] extern crate rocket;

mod routes;
mod facilitator;
mod shared;

use rocket::http::Method;
use rocket_cors::{AllowedOrigins, CorsOptions};
use shared::config::Config;
use std::sync::Arc;

#[launch]
fn rocket() -> _ {
    // Load configuration
    let config = Config::from_env()
        .expect("Failed to load configuration");

    log::info!("Starting x402 Rust Server (Rocket)");
    log::info!("Facilitator: {}", config.facilitator_url);
    log::info!("Receiver: {}", config.receiver_address);
    log::info!("Network: {}", config.solana_network);

    let addr = config.server_address();
    log::info!("Server listening on http://{}", addr);
    log::info!("Try: curl http://{}/api/health", addr);

    let app_config = Arc::new(config);

    // Configure Rocket to use our host and port
    let figment = rocket::Config::figment()
        .merge(("address", app_config.host.clone()))
        .merge(("port", app_config.port));

    // Configure CORS
    let cors = CorsOptions::default()
        .allowed_origins(AllowedOrigins::all())
        .allowed_methods(
            vec![Method::Get, Method::Post, Method::Patch]
                .into_iter()
                .map(From::from)
                .collect(),
        )
        .allow_credentials(true)
        .to_cors()
        .expect("Failed to create CORS fairing");

    rocket::custom(figment)
        .manage(app_config)
        .mount("/api", routes![
            routes::health::health_check,
            routes::free::free_endpoint,
            routes::paid::paid_endpoint,
        ])
        .attach(cors)
}
