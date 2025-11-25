use axum::{
    Json,
    extract::State,
    http::{StatusCode, HeaderMap},
    response::{IntoResponse, Response},
};
use serde_json::json;
use std::sync::Arc;
use crate::shared::{
    config::Config,
    verification::{create_402_response, verify_payment, PaymentResult},
};

pub async fn paid_endpoint(
    State(config): State<Arc<Config>>,
    headers: HeaderMap,
) -> Response {
    log::info!("Received request to /api/paid");

    let payment_header = headers.get("x-payment").and_then(|h| h.to_str().ok());

    if payment_header.is_none() {
        log::warn!("No payment header found - returning 402");
    } else {
        log::info!("Payment header detected - verifying payment");
    }

    let result = verify_payment(
        &config,
        payment_header,
        "/api/paid",
        Some("Access to paid API endpoint".to_string()),
    ).await;

    match result {
        PaymentResult::Success(signature) => {
            log::info!("Payment verified successfully: {}", signature);
            (StatusCode::OK, Json(json!({
                "success": true,
                "message": "Payment verified! Here's your paid content.",
                "signature": signature,
                "data": {
                    "secret": "This is the protected content you paid for",
                    "timestamp": chrono::Utc::now().to_rfc3339(),
                }
            }))).into_response()
        }
        PaymentResult::PaymentRequired(requirements) => {
            log::info!("Payment required - sending 402 response");
            let response = create_402_response(requirements);
            (StatusCode::PAYMENT_REQUIRED, Json(response)).into_response()
        }
        PaymentResult::InvalidPayment(details) => {
            log::warn!("Invalid payment header: {}", details);
            (StatusCode::BAD_REQUEST, Json(json!({
                "error": "Invalid payment",
                "message": "The payment header is invalid or malformed"
            }))).into_response()
        }
        PaymentResult::Error(details) => {
            log::error!("Payment processing failed: {}", details);
            (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({
                "error": "Payment failed",
                "message": "An error occurred while processing your payment"
            }))).into_response()
        }
    }
}
