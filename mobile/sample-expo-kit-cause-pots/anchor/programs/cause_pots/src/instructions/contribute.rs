use anchor_lang::prelude::*;

use crate::{constants::*, error::ErrorCode, state::*};

#[derive(Accounts)]
pub struct Contribute<'info> {
    #[account(mut)]
    pub pot: Account<'info, Pot>,
    #[account(mut, seeds = [VAULT_SEED, pot.key().as_ref()], bump = pot.vault_bump)]
    pub vault: SystemAccount<'info>,
    #[account(
        init_if_needed,
        payer = contributor,
        space = 8 + Contributor::INIT_SPACE,
        seeds = [CONTRIBUTOR_SEED, pot.key().as_ref(), contributor.key().as_ref()],
        bump
    )]
    pub contributor_account: Account<'info, Contributor>,
    #[account(mut)]
    pub contributor: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handle_contribute(ctx: Context<Contribute>, amount: u64) -> Result<()> {
    require!(amount > 0, ErrorCode::InvalidAmount);

    let pot = &mut ctx.accounts.pot;
    let contributor_account = &mut ctx.accounts.contributor_account;
    let contributor = ctx.accounts.contributor.key();
    let clock = Clock::get()?;

    require!(!pot.is_released, ErrorCode::PotAlreadyReleased);
    if !pot.contributors.contains(&contributor) {
        require!(pot.contributors.len() < MAX_CONTRIBUTORS, ErrorCode::MaxContributorsReached);
        pot.contributors.push(contributor);
    }

    let ix = anchor_lang::solana_program::system_instruction::transfer(
        &contributor,
        &ctx.accounts.vault.key(),
        amount,
    );
    anchor_lang::solana_program::program::invoke(
        &ix,
        &[
            ctx.accounts.contributor.to_account_info(),
            ctx.accounts.vault.to_account_info(),
        ],
    )?;

    pot.total_contributed = pot
        .total_contributed
        .checked_add(amount)
        .ok_or(ErrorCode::Overflow)?;

    // `init_if_needed` zero-initializes the account on first use.
    if contributor_account.pot == Pubkey::default() {
        contributor_account.pot = pot.key();
        contributor_account.contributor = contributor;
        contributor_account.joined_at = clock.unix_timestamp;
        contributor_account.bump = ctx.bumps.contributor_account;
    }
    contributor_account.total_contributed = contributor_account
        .total_contributed
        .checked_add(amount)
        .ok_or(ErrorCode::Overflow)?;
    contributor_account.contribution_count += 1;
    contributor_account.last_contribution_at = clock.unix_timestamp;

    msg!("Contribution: {} lamports", amount);
    Ok(())
}
