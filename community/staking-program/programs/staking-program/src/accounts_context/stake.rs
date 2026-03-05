use crate::state::{global_state::GlobalState, staker::Staker};
use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};
use core::mem::size_of;

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(mut, constraint = vault.mint == global_state.staking_token_mint)]
    pub vault: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = signer,
        space = size_of::<Staker>() + 8,
        seeds = [b"staker", signer.key().as_ref()],
        bump
    )]
    pub staker: Account<'info, Staker>,

    #[account(
        mut,
        seeds = [b"global_state"],
        bump
    )]
    pub global_state: Account<'info, GlobalState>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}
