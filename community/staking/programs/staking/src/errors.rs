use anchor_lang::error_code;

/// Custom program errors — mapped to numeric codes by Anchor.
#[error_code]
pub enum StakeError {
    #[msg("This stake will take your total staked amount over the max allowed")]
    StakeOverflow,
    #[msg("You are trying to unstake before the freeze period is over")]
    FreezePeriodNotPassed,
    #[msg("Can't claim more than accumulated rewards")]
    ClaimExceeded,
    #[msg("You cannot claim rewards from this user account")]
    InvalidClaim,
    #[msg("Stake amount must be greater than zero")]
    ZeroStakeAmount,
    #[msg("Reward calculation overflowed")]
    RewardOverflow,
}
