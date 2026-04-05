use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use std::str::FromStr;

use crate::{state::PoolState, error::StakeError};
pub mod constants {
    pub const MASTER_ADMIN: &str = "GPdCfSB8Gvy2pVq5Ricr4WGzHG8pEQ2Nrixd4HWxZWCq"; 
}


#[derive(Accounts)]

pub struct FundRewardVault<'info> {
    #[account(
        mut, 
        address = Pubkey::from_str(constants::MASTER_ADMIN).unwrap()
    )]
    pub admin: Signer<'info>,

    /// Anchor checks if the signer matches the admin pubkey stored in the pool_state
    #[account(
        mut,
        has_one = admin @ StakeError::Unauthorized
    )]
    pub pool_state: Account<'info, PoolState>,

    pub reward_mint: Account<'info, Mint>,

    /// The admin's personal token account where the funds are coming from
    #[account(
        mut,
        associated_token::mint = reward_mint,
        associated_token::authority = admin
    )]
    pub admin_token_account: Account<'info, TokenAccount>,

    /// The protocol's token vault where the funds are going
    #[account(
        mut,
        seeds = [b"reward_vault", reward_mint.key().as_ref()],
        bump,
    )]
    pub reward_vault: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}
impl<'info> FundRewardVault<'info> {
    pub fn handle_fund_reward_vault(&mut self, amount: u64) -> Result<()> {
        require!(amount > 0, StakeError::InvalidAmount);

        // Perform a standard CPI token transfer from the Admin to the Protocol Vault
        let cpi_ctx = CpiContext::new(
            self.token_program.to_account_info(),
            Transfer {
                from: self.admin_token_account.to_account_info(),
                to: self.reward_vault.to_account_info(),
                authority: self.admin.to_account_info(),
            },
        );

        token::transfer(cpi_ctx, amount)?;

        Ok(())
    }
}