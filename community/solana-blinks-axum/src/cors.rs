use axum::http::header;
use axum::http::{HeaderValue, Method};
use tower_http::cors::CorsLayer;

pub fn actions_cors() -> CorsLayer {
    CorsLayer::new()
        .allow_origin(HeaderValue::from_static("*"))
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::OPTIONS])
        .allow_headers([
            header::CONTENT_TYPE,
            header::AUTHORIZATION,
            header::CONTENT_ENCODING,
            header::ACCEPT_ENCODING,
        ])
}
