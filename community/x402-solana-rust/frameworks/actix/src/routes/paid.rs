use actix_web::{get, web, HttpRequest, HttpResponse};
use serde_json::json;
use std::sync::Arc;
use crate::shared::{
    config::Config,
    verification::{create_402_response, verify_payment, PaymentResult},
};

#[get("/paid")]
pub async fn paid_endpoint(
    req: HttpRequest,
    config: web::Data<Arc<Config>>,
) -> HttpResponse {
    log::info!("Received request to /api/paid");

    let payment_header = req.headers()
        .get("x-payment")
        .and_then(|h| h.to_str().ok());

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
            HttpResponse::Ok().json(json!({
                "success": true,
                "message": "Payment verified! Here's your paid content.",
                "signature": signature,
                "data": {
                    "secret": "This is the protected content you paid for",
                    "timestamp": chrono::Utc::now().to_rfc3339(),
                }
            }))
        }
        PaymentResult::PaymentRequired(requirements) => {
            log::info!("Payment required - sending 402 response");
            let response = create_402_response(requirements);
            HttpResponse::PaymentRequired().json(response)
        }
        PaymentResult::InvalidPayment(details) => {
            log::warn!("Invalid payment header: {}", details);
            HttpResponse::BadRequest().json(json!({
                "error": "Invalid payment",
                "message": "The payment header is invalid or malformed"
            }))
        }
        PaymentResult::Error(details) => {
            log::error!("Payment processing failed: {}", details);
            HttpResponse::InternalServerError().json(json!({
                "error": "Payment failed",
                "message": "An error occurred while processing your payment"
            }))
        }
    }
}
