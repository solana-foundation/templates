use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError {
    #[msg("Insufficient stake amount.")]
    InsufficientStake,

    #[msg("Reward pool is empty.")]
    EmptyRewardPool,

    #[msg("Invalid operation.")]
    InvalidOperation,
}
