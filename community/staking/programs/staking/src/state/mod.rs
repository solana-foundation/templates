use anchor_lang::prelude::*;
use anchor_lang::{account, prelude::Pubkey};


#[account]
#[derive(InitSpace)]
pub struct StakeAccount {
    pub point: u64,
    pub staked_amount: u64,
    pub signer: Pubkey,
    pub bump: u8,
    pub last_update_amount: i64,
    pub seed:u64,
}
#[account]
#[derive(InitSpace)]
pub struct PoolState {
    pub admin: Pubkey,         // The wallet allowed to fund the vault and change settings
    pub reward_mint: Pubkey,   // The specific token being given out as a reward
    pub reward_rate: u64,      // How many points/tokens are given out globally
    pub total_staked: u64,     // Total SOL staked by all users combined
    pub is_paused: bool,       // An emergency kill-switch
    pub bump: u8,
}