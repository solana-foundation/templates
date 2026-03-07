use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct StakeConfig {
    pub rewards_per_stake: u8,
    pub max_stake: u64,
    pub freeze_period: i64,
    pub mint_key: Pubkey,
    pub token_mint_bump: u8,
    pub bump: u8,
}
