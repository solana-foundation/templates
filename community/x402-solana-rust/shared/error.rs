use thiserror::Error;

#[derive(Error, Debug)]
pub enum X402Error {
    #[error("Invalid payment: {0}")]
    InvalidPayment(String),

    #[error("Payment verification failed: {0}")]
    VerificationFailed(String),

    #[error("Facilitator error: {0}")]
    FacilitatorError(String),

    #[error("Internal server error: {0}")]
    InternalError(String),
}
