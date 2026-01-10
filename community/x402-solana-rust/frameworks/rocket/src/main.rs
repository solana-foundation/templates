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
    log::info!("Receiver: {}", config.receiver_address);
    log::info!("Network: {}", config.solana_network);

    let addr = config.server_address();
    log::info!("Server listening on http://{}", addr);
    log::info!("Try: curl http://{}/api/health", addr);

    let app_config = Arc::new(config);

    // Configure Rocket to use our host and port
    let figment = rocket::Config::figment()
        .merge(("address", &*app_config.host))
        .merge(("port", app_config.port));

    // Configure CORS
    // ⚠️  WARNING: This configuration allows ALL origins and is suitable for development only.
    //
    // SECURITY RISK: In production/mainnet deployments, this allows any website to make
    // requests to your API, which could be exploited by malicious sites.
    //
    // For production, restrict origins to your specific domain(s):
    //
    // Example for production:
    //   let cors = CorsOptions::default()
    //       .allowed_origins(AllowedOrigins::some_exact(&["https://yourdomain.com"]))
    //       .allowed_methods(vec![Method::Get, Method::Post].into_iter().map(From::from).collect())
    //       .allowed_headers(AllowedHeaders::some(&["content-type", "x-payment"]))
    //       .allow_credentials(true);
    //
    let cors = CorsOptions::default()
        .allowed_origins(AllowedOrigins::all())  // ⚠️  Development only!
        .allowed_methods(
            vec![Method::Get, Method::Post]
                .into_iter()
                .map(From::from)
                .collect(),
        )
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
