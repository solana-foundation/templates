use anchor_lang::prelude::*;

#[account]
pub struct Staker {
    pub address: Pubkey,
    pub staked_amount: u64,
    pub reward_debt: u64, // Tracks the staker's share of distributed rewards
}
