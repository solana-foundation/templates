use crate::state::global_state::GlobalState;
use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};

#[derive(Accounts)]
pub struct AddRewards<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        mut,
        token::authority = admin,
        token::mint = global_state.staking_token_mint
    )]
    pub admin_token_account: Account<'info, TokenAccount>,
    #[account(mut, seeds = [b"global_state"], bump)]
    pub global_state: Account<'info, GlobalState>,

    /// CHECK: This account is used as a PDA authority for the reward pool.
    #[account(seeds = [b"reward_pool_authority"], bump)]
    pub reward_pool_authority: AccountInfo<'info>,

    #[account(
        mut,
        seeds = [b"reward_pool"],
        bump,
        token::mint = global_state.staking_token_mint,
        token::authority = reward_pool_authority
    )]
    pub reward_pool: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}
