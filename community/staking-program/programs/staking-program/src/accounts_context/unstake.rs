use crate::state::{global_state::GlobalState, staker::Staker};
use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    /// CHECK: This account is used as a PDA authority for the vault.
    #[account(mut, constraint = vault.mint == global_state.staking_token_mint)]
    pub vault: Account<'info, TokenAccount>,
    #[account(mut, seeds = [b"staker", signer.key().as_ref()], bump)]
    pub staker: Account<'info, Staker>,
    #[account(
        mut,
        seeds = [b"global_state"],
        bump
    )]
    pub global_state: Account<'info, GlobalState>,
    /// CHECK: This account is used as a PDA authority for the vault.
    #[account(seeds = [b"vault_authority"], bump)]
    pub vault_authority: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
}
