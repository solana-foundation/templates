use serde::{Deserialize, Serialize};

/// x402 Payment Requirements returned in 402 response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PaymentRequirements {
    pub scheme: String,
    pub network: String,
    #[serde(rename = "payTo")]
    pub pay_to: String,
    #[serde(rename = "maxAmountRequired")]
    pub max_amount_required: String,
    pub asset: String,
    pub resource: String,
    pub description: Option<String>,
    #[serde(rename = "mimeType")]
    pub mime_type: Option<String>,
}

/// x402 Payment Payload sent by client in X-PAYMENT header
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PaymentPayload {
    #[serde(rename = "x402Version")]
    pub x402_version: u32,
    pub scheme: String,
    pub network: String,
    pub payload: SolanaPaymentPayload,
}

/// Solana-specific payment payload
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SolanaPaymentPayload {
    pub transaction: String, // Base64 encoded serialized transaction
}

/// 402 Error Response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Payment402Response {
    pub error: String,
    #[serde(rename = "paymentRequirements")]
    pub payment_requirements: Vec<PaymentRequirements>,
}

/// Verification request (verify endpoint)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VerifyRequest {
    pub payment: PaymentPayload,
    pub requirements: PaymentRequirements,
}

/// Verification response (verify endpoint)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VerifyResponse {
    #[serde(rename = "isValid")]
    pub is_valid: bool,
    pub error: Option<String>,
}

/// Settlement request (settle endpoint)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SettleRequest {
    pub payment: PaymentPayload,
}

/// Settlement response (settle endpoint)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SettleResponse {
    pub signature: String,
    pub timestamp: u64,
}
