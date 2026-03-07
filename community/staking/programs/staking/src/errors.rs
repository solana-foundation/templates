use anchor_lang::error_code;

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
}
