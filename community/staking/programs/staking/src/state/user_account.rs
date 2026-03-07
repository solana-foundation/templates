use anchor_lang::prelude::*;

/// Lifetime summary for a user. One per wallet, seeded by "user" + pubkey.
/// Tracks aggregate staking totals and claimable rewards.
#[account]
#[derive(InitSpace)]
pub struct UserAccount {
    pub owner: Pubkey,
    /// rewards earned but not yet claimed
    pub accumulated_rewards: u64,
    /// historical total of claimed rewards (bookkeeping)
    pub claimed_rewards: u64,
    /// running total of lamports currently staked across all stakes
    pub amount_staked: u64,
    /// guard so we don't re-init on subsequent stakes
    pub is_initialized: bool,
    pub bump: u8,
}
