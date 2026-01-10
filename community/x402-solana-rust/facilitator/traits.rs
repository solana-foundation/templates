use crate::shared::{
    error::X402Error,
    types::{VerifyRequest, VerifyResponse, SettleRequest, SettleResponse},
};

/// Trait for payment facilitator implementations
///
/// Facilitators handle payment verification and settlement.
/// There are two main implementations:
/// - Local: Direct blockchain submission (txn_submitter)
/// - Remote: HTTP gateway that handles verification and settlement
#[async_trait::async_trait]
pub trait Facilitator: Send + Sync {
    /// Verify payment transaction against requirements
    ///
    /// This validates that the transaction meets the payment requirements
    /// without actually broadcasting it to the blockchain.
    async fn verify_payment(
        &self,
        request: VerifyRequest,
    ) -> Result<VerifyResponse, X402Error>;

    /// Settle payment by broadcasting transaction to blockchain
    ///
    /// Takes a signed transaction and broadcasts it to the blockchain,
    /// returning the transaction signature and timestamp.
    async fn settle_payment(
        &self,
        request: SettleRequest,
    ) -> Result<SettleResponse, X402Error>;

    /// Health check for the facilitator
    ///
    /// Returns a health status message. Default implementation returns
    /// a generic healthy message, but can be overridden for custom checks.
    async fn health(&self) -> Result<String, X402Error> {
        Ok("Healthy Facilitator".to_string())
    }
}
