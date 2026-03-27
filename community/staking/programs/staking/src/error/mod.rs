use anchor_lang::prelude::*;

#[error_code]
pub enum StakeError {
    #[msg("Invalid amount")]
    InvalidAmount,
    
    #[msg("Invalid timestamp")]
    InvalidTimestamp,
    
    #[msg("Unauthorized")]
    Unauthorized,
    
    #[msg("Math overflow or underflow occurred")]
    Overflow,
}