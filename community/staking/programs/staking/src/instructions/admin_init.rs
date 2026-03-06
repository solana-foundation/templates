use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use std::str::FromStr;

use crate::state::PoolState;
pub mod constants {
    pub const MASTER_ADMIN: &str = "GPdCfSB8Gvy2pVq5Ricr4WGzHG8pEQ2Nrixd4HWxZWCq"; 
}

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(
        mut, 
        address = Pubkey::from_str(constants::MASTER_ADMIN).unwrap()
    )]
    pub admin: Signer<'info>,

    #[account(
        init,
        payer = admin,
        space = 8 + PoolState::INIT_SPACE,
        seeds = [b"pool_state", reward_mint.key().as_ref()],
        bump
    )]
    pub pool_state: Account<'info, PoolState>,

    pub reward_mint: Account<'info, Mint>,
    #[account(
        init,
        payer = admin,
        seeds = [b"reward_vault", reward_mint.key().as_ref()],
        bump,
        token::mint = reward_mint,
        token::authority = reward_vault, 
    )]
    pub reward_vault: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
impl<'info> InitializePool<'info> {
    pub fn handle_initialize_pool(&mut self, reward_rate: u64, pool_state_bump: u8) -> Result<()> {
        let pool_state = &mut self.pool_state;

        // Save the global configuration
        pool_state.admin = self.admin.key();
        pool_state.reward_mint = self.reward_mint.key();
        pool_state.reward_rate = reward_rate;
        pool_state.total_staked = 0;
        pool_state.is_paused = false;
        pool_state.bump = pool_state_bump;

        Ok(())
    }
}