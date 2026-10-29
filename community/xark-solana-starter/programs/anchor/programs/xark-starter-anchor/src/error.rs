use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Public inputs are malformed")]
    InvalidPublicInputs,
    #[msg("The proof is bound to a different wallet")]
    SignerMismatch,
    #[msg("This code has already been claimed")]
    AlreadyClaimed,
    #[msg("Proof verification failed")]
    InvalidProof,
}
