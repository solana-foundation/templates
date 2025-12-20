use crate::{
    facilitator::{
        Facilitator,
        utils::{decode_transaction, validate_payment_transaction, broadcast_to_chain},
    },
    shared::{
        error::X402Error,
        types::{VerifyRequest, VerifyResponse, SettleRequest, SettleResponse},
    },
};

/// Direct blockchain facilitator for local transaction processing
///
/// Handles payment verification and settlement without external dependencies
/// by directly interacting with the Solana RPC endpoint.
pub struct LocalFacilitator {
    rpc_url: String,
}

impl LocalFacilitator {
    pub fn new(rpc_url: &str) -> Self {
        Self { rpc_url: rpc_url.to_string() }
    }
}

#[async_trait::async_trait]
impl Facilitator for LocalFacilitator {
    async fn verify_payment(&self, request: VerifyRequest) -> Result<VerifyResponse, X402Error> {
        // Decode and deserialize transaction
        let transaction = match decode_transaction(&request.payment.payload.transaction) {
            Ok(tx) => tx,
            Err(e) => return Ok(VerifyResponse {
                is_valid: false,
                error: Some(e.to_string()),
            }),
        };

        // Validate against payment requirements
        match validate_payment_transaction(&transaction, &request.requirements) {
            Ok(_) => Ok(VerifyResponse {
                is_valid: true,
                error: None,
            }),
            Err(reason) => Ok(VerifyResponse {
                is_valid: false,
                error: Some(reason),
            }),
        }
    }

    async fn settle_payment(&self, request: SettleRequest) -> Result<SettleResponse, X402Error> {
        // Decode and deserialize transaction
        let transaction = decode_transaction(&request.payment.payload.transaction)?;

        // Submit to blockchain
        let sig = broadcast_to_chain(&self.rpc_url, transaction).await?;

        // Return settlement confirmation
        Ok(SettleResponse {
            signature: sig.to_string(),
            timestamp: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap_or_default()
                .as_millis() as u64,
        })
    }

    async fn health(&self) -> Result<String, X402Error> {
        Ok("Local Facilitator Healthy".to_string())
    }
}
