use anchor_lang::prelude::*;

/// Global pool config — one per program, seeded by "config"
#[account]
#[derive(InitSpace)]
pub struct StakeConfig {
    /// reward tokens minted per lamport per second staked (multiplier)
    pub rewards_per_stake: u8,
    /// ceiling on total lamports a single user can stake
    pub max_stake: u64,
    /// min seconds a stake must stay locked before unstake
    pub freeze_period: i64,
    /// the SPL mint we use for reward/receipt tokens
    pub mint_key: Pubkey,
    pub token_mint_bump: u8,
    pub bump: u8,
}
