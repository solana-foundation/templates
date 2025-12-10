mod routes;
mod facilitator;
mod shared;

use actix_web::{web, App, HttpServer, middleware::Logger, http};
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
    log::info!("Receiver: {}", config.receiver_address);
    log::info!("Network: {}", config.solana_network);

    let config = Arc::new(config);

    log::info!("Server listening on http://{}", addr);
    log::info!("Try: curl http://{}/api/health", addr);

    HttpServer::new(move || {
        // Configure CORS
        // ⚠️  WARNING: This configuration allows ALL origins and is suitable for development only.
        //
        // SECURITY RISK: In production/mainnet deployments, this allows any website to make
        // requests to your API, which could be exploited by malicious sites.
        //
        // For production, restrict origins to your specific domain(s):
        //
        // Example for production:
        //   let cors = Cors::default()
        //       .allowed_origin("https://yourdomain.com")
        //       .allowed_methods(vec!["GET", "POST"])
        //       .allowed_headers(vec![header::CONTENT_TYPE, header::HeaderName::from_static("x-payment")])
        //       .max_age(3600);
        //
        let cors = Cors::default()  // ⚠️  Development only!
            .allow_any_origin()
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![http::header::CONTENT_TYPE, http::header::HeaderName::from_static("x-payment")]);

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
