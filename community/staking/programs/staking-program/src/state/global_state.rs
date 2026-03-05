use anchor_lang::prelude::*;

#[account]
pub struct GlobalState {
    pub admin: Pubkey,
    pub staking_token_mint: Pubkey,
    pub vault: Pubkey,
    pub total_staked: u64,
    pub reward_rate: u64,      // Reward rate per second
    pub last_reward_time: i64, // Last time rewards were updated
    pub reward_pool: u64,      // Total rewards available for distribution
}
