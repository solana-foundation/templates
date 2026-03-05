use crate::state::global_state::GlobalState;
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use core::mem::size_of;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    /// CHECK: This account is used as a PDA authority for the vault.
    #[account(seeds = [b"vault_authority"], bump)]
    pub vault_authority: AccountInfo<'info>,

    /// CHECK: This account is used as a PDA authority for the reward pool.
    #[account(seeds = [b"reward_pool_authority"], bump)]
    pub reward_pool_authority: AccountInfo<'info>,

    pub mint: Account<'info, Mint>,

    #[account(
        init,
        payer = admin,
        space = size_of::<GlobalState>() + 8,
        seeds = [b"global_state"],
        bump
    )]
    pub global_state: Box<Account<'info, GlobalState>>,

    #[account(
        init,
        payer = admin,
        seeds = [b"staking_vault"],
        token::mint = mint,
        token::authority = vault_authority,
        bump
    )]
    pub vault: Box<Account<'info, TokenAccount>>,

    #[account(
        init,
        payer = admin,
        seeds = [b"reward_pool"],
        token::mint = mint,
        token::authority = reward_pool_authority,
        bump
    )]
    pub reward_pool: Box<Account<'info, TokenAccount>>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}
