use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Already a contributor")]
    AlreadyAContributor,

    #[msg("You have already signed the release")]
    AlreadySigned,

    #[msg("Pot description is too long (max 200 characters)")]
    DescriptionTooLong,

    #[msg("Contribution amount must be greater than 0")]
    InvalidAmount,

    #[msg("Signers required must be between 1 and the maximum number of contributors")]
    InvalidSignersRequired,

    #[msg("Target amount must be greater than 0")]
    InvalidTargetAmount,

    #[msg("Unlock days must not be negative")]
    InvalidUnlockDays,

    #[msg("Insufficient funds in pot")]
    InsufficientFunds,

    #[msg("Insufficient signatures for release")]
    InsufficientSignatures,

    #[msg("Pot has reached the maximum number of contributors")]
    MaxContributorsReached,

    #[msg("Pot name is too long (max 32 characters)")]
    NameTooLong,

    #[msg("You are not a contributor to this pot")]
    NotAContributor,

    #[msg("Arithmetic overflow")]
    Overflow,

    #[msg("Pot has already been released")]
    PotAlreadyReleased,

    #[msg("The pot cannot receive its own funds")]
    RecipientIsPot,

    #[msg("Time-lock period has not expired yet")]
    TimeLockNotExpired,
}
