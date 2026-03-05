mod actions;
mod consts;
mod cors;
mod error;
mod router;
mod spec;
mod state;

use solana_client::nonblocking::rpc_client::RpcClient;
use std::sync::Arc;
use tokio::net::TcpListener;
use tokio::signal;
use tracing_subscriber::EnvFilter;

#[tokio::main]
async fn main() {
    let _ = dotenvy::dotenv();

    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env().add_directive("info".parse().unwrap()))
        .init();

    let rpc_url = std::env::var("RPC_URL").unwrap_or_else(|_| consts::DEFAULT_RPC_URL.into());
    let host = std::env::var("HOST").unwrap_or_else(|_| consts::DEFAULT_HOST.into());
    let port = std::env::var("PORT").unwrap_or_else(|_| consts::DEFAULT_PORT.into());
    let bind_addr = format!("{host}:{port}");

    tracing::info!("RPC endpoint: {rpc_url}");
    tracing::info!("Listening on {bind_addr}");

    let rpc = Arc::new(RpcClient::new(rpc_url));
    let app = router::build_router(rpc);

    let listener = TcpListener::bind(&bind_addr)
        .await
        .expect("Failed to bind address");

    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .expect("Server error");
}

async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("Failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("Failed to install SIGTERM handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => tracing::info!("Ctrl+C received, shutting down"),
        _ = terminate => tracing::info!("SIGTERM received, shutting down"),
    }
}
