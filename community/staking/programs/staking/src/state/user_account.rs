use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct UserAccount {
    pub owner: Pubkey,
    pub accumulated_rewards: u64,
    pub claimed_rewards: u64,
    pub amount_staked: u64,
    pub is_initialized: bool,
    pub bump: u8,
}
