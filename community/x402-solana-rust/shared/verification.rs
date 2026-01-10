use crate::{
    facilitator::{Facilitator, LocalFacilitator},
    shared::{
        config::Config,
        error::X402Error,
        types::{
            PaymentPayload, PaymentRequirements, Payment402Response,
            VerifyRequest, SettleRequest,
        },
    },
};
use base64::{Engine as _, engine::general_purpose};
use std::sync::Arc;

/// Extract payment payload from X-PAYMENT header
pub fn extract_payment_header(header_value: &str) -> Result<PaymentPayload, X402Error> {
    let decoded = general_purpose::STANDARD
        .decode(header_value)
        .map_err(|_| X402Error::InvalidPayment("Invalid base64 encoding".to_string()))?;

    let json_str = String::from_utf8(decoded)
        .map_err(|_| X402Error::InvalidPayment("Invalid UTF-8 in payment header".to_string()))?;

    let payload: PaymentPayload = serde_json::from_str(&json_str)
        .map_err(|e| X402Error::InvalidPayment(format!("Invalid JSON: {}", e)))?;

    Ok(payload)
}

/// Create payment requirements for an endpoint
pub fn create_payment_requirements(
    config: &Config,
    resource: &str,
    price: Option<u64>,
    description: Option<String>,
) -> PaymentRequirements {
    PaymentRequirements {
        scheme: "exact".to_string(),
        network: config.solana_network.clone(),
        pay_to: config.receiver_address.clone(),
        max_amount_required: price.unwrap_or(config.default_price).to_string(),
        asset: config.usdc_mint.clone(),
        resource: resource.to_string(),
        description,
        mime_type: Some("application/json".to_string()),
    }
}

/// Create 402 Payment Required response
pub fn create_402_response(requirements: PaymentRequirements) -> Payment402Response {
    Payment402Response {
        error: "Payment Required".to_string(),
        payment_requirements: vec![requirements],
    }
}

/// Verify and settle payment using facilitator
pub async fn process_payment<F: Facilitator>(
    facilitator: &F,
    payment_payload: PaymentPayload,
    payment_requirements: PaymentRequirements,
) -> Result<String, X402Error> {
    // First verify the payment
    let verify_response = facilitator
        .verify_payment(VerifyRequest {
            payment: payment_payload.clone(),
            requirements: payment_requirements,
        })
        .await?;

    if !verify_response.is_valid {
        return Err(X402Error::VerificationFailed(
            verify_response.error.unwrap_or_else(|| "Unknown error".to_string())
        ));
    }

    // Then settle the payment
    let settle_response = facilitator
        .settle_payment(SettleRequest {
            payment: payment_payload,
        })
        .await?;

    Ok(settle_response.signature)
}

/// Payment verification result
pub enum PaymentResult {
    Success(String),
    PaymentRequired(PaymentRequirements),
    InvalidPayment(String),
    Error(String),
}

/// Verify payment with automatic facilitator selection
pub async fn verify_payment(
    config: &Arc<Config>,
    payment_header: Option<&str>,
    resource: &str,
    description: Option<String>,
) -> PaymentResult {
    let requirements = create_payment_requirements(config, resource, None, description);

    let Some(payment_str) = payment_header else {
        return PaymentResult::PaymentRequired(requirements);
    };

    let payment_payload = match extract_payment_header(payment_str) {
        Ok(p) => p,
        Err(e) => return PaymentResult::InvalidPayment(e.to_string()),
    };

    // Use local facilitator
    let facilitator = LocalFacilitator::new(&config.solana_rpc_url);

    match process_payment(&facilitator, payment_payload, requirements).await {
        Ok(signature) => PaymentResult::Success(signature),
        Err(e) => PaymentResult::Error(e.to_string()),
    }
}
