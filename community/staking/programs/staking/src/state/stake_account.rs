use anchor_lang::prelude::*;

/// Per-stake record. Each stake() call creates a new one (keyed by user + id).
/// Closed on unstake so rent is returned.
#[account]
#[derive(InitSpace)]
pub struct StakeAccount {
    pub owner: Pubkey,
    /// lamports locked in this particular stake
    pub amount: u64,
    /// unix timestamp — used to enforce freeze period & compute rewards
    pub staked_at: i64,
    pub bump: u8,
}
