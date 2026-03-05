use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError {
    #[msg("Insufficient stake amount.")]
    InsufficientStake,

    #[msg("Only the admin can perform this action.")]
    Unauthorized,

    #[msg("Reward pool is empty.")]
    EmptyRewardPool,

    #[msg("Amount must be greater than zero.")]
    InvalidAmount,

    #[msg("No active stake position found.")]
    NoStakePosition,

    #[msg("No rewards available to claim yet.")]
    NoRewardsAvailable,

    #[msg("Math overflow detected.")]
    MathOverflow,

    #[msg("Invalid operation.")]
    InvalidOperation,
}
