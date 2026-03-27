use crate::state::{global_state::GlobalState, staker::Staker};
use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};

#[derive(Accounts)]
pub struct Claim<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(mut, seeds = [b"staker", signer.key().as_ref()], bump)]
    pub staker: Account<'info, Staker>,
    #[account(mut, seeds = [b"global_state"], bump)]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        mut,
        token::mint = global_state.staking_token_mint,
        token::authority = signer
    )]
    pub user_reward_token_account: Account<'info, TokenAccount>,

    #[account(seeds = [b"reward_pool_authority"], bump)]
    /// CHECK: This account is used as a PDA authority for the reward pool.
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
