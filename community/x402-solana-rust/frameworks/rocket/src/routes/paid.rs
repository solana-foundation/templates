use rocket::{State, Request, serde::json::Json, http::Status};
use rocket::response::{self, Response, Responder};
use rocket::request::{self, FromRequest, Outcome};
use serde_json::{json, Value};
use std::sync::Arc;
use std::io::Cursor;
use crate::shared::{
    config::Config,
    verification::{create_402_response, verify_payment, PaymentResult},
};

pub struct Payment402(pub Value);

impl<'r> Responder<'r, 'static> for Payment402 {
    fn respond_to(self, _: &'r Request<'_>) -> response::Result<'static> {
        Response::build()
            .status(Status::new(402))
            .sized_body(None, Cursor::new(self.0.to_string()))
            .ok()
    }
}

// Custom request guard to extract optional X-PAYMENT header
pub struct PaymentHeader(pub Option<String>);

#[rocket::async_trait]
impl<'r> FromRequest<'r> for PaymentHeader {
    type Error = ();

    async fn from_request(req: &'r Request<'_>) -> request::Outcome<Self, Self::Error> {
        let header = req.headers().get_one("x-payment").map(|s| s.to_string());
        Outcome::Success(PaymentHeader(header))
    }
}

#[get("/paid")]
pub async fn paid_endpoint(
    config: &State<Arc<Config>>,
    payment_header: PaymentHeader,
) -> Result<Json<Value>, Payment402> {
    log::info!("Received request to /api/paid");

    let payment_header_value = payment_header.0.as_deref();

    if payment_header_value.is_none() {
        log::warn!("No payment header found - returning 402");
    } else {
        log::info!("Payment header detected - verifying payment");
    }

    let result = verify_payment(
        config,
        payment_header_value,
        "/api/paid",
        Some("Access to paid API endpoint".to_string()),
    ).await;

    match result {
        PaymentResult::Success(signature) => {
            log::info!("Payment verified successfully: {}", signature);
            Ok(Json(json!({
                "success": true,
                "message": "Payment verified! Here's your paid content.",
                "signature": signature,
                "data": {
                    "secret": "This is the protected content you paid for",
                    "timestamp": chrono::Utc::now().to_rfc3339(),
                }
            })))
        }
        PaymentResult::PaymentRequired(requirements) => {
            log::info!("Payment required - sending 402 response");
            let response = create_402_response(requirements);
            Err(Payment402(serde_json::to_value(response).unwrap()))
        }
        PaymentResult::InvalidPayment(details) => {
            log::warn!("Invalid payment header: {}", details);
            Err(Payment402(json!({
                "error": "Invalid payment header",
                "details": details
            })))
        }
        PaymentResult::Error(details) => {
            log::error!("Payment processing failed: {}", details);
            Err(Payment402(json!({
                "error": "Payment processing failed",
                "details": details
            })))
        }
    }
}
