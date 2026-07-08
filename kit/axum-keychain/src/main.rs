mod api;
mod signers;

use std::env;
use std::sync::Arc;

use axum::routing::{get, post};
use axum::Router;
use solana_keychain::SolanaSigner;
use tokio::net::TcpListener;

#[tokio::main]
async fn main() {
    dotenvy::from_filename(".env.local").ok();
    dotenvy::dotenv().ok();

    let port: u16 = match env::var("PORT") {
        Ok(value) => value
            .parse()
            .unwrap_or_else(|_| panic!("Invalid PORT value \"{value}\"")),
        Err(_) => 8080,
    };

    let registry = Arc::new(signers::build());
    for (backend, entry) in registry.iter() {
        match entry {
            Ok(signer) => println!("signer {backend}: {}", signer.pubkey()),
            Err(error) => println!("signer {backend}: failed to initialize — {error}"),
        }
    }

    let app = Router::new()
        .route("/api/signers", get(api::signers))
        .route("/api/sign/message", post(api::sign_message))
        .route("/api/sign/transaction", post(api::sign_transaction))
        .with_state(registry);

    let listener = TcpListener::bind(("127.0.0.1", port))
        .await
        .unwrap_or_else(|e| panic!("Failed to bind port {port}: {e}"));
    println!("Keychain signing API listening on http://127.0.0.1:{port}");
    axum::serve(listener, app).await.expect("server error");
}
