use crate::accounts_context::unstake::Unstake;
use crate::error::CustomError;
use anchor_lang::prelude::*;
use anchor_spl::token::{transfer, Transfer};

pub fn handler(ctx: Context<Unstake<'_>>, amount: u64) -> Result<()> {
    let staker = &mut ctx.accounts.staker;
    let global_state = &mut ctx.accounts.global_state;

    require!(
        staker.staked_amount >= amount,
        CustomError::InsufficientStake
    );

    let seeds: &[&[u8]] = &[b"vault_authority", &[ctx.bumps.vault_authority]];
    let signer_seeds = &[&seeds[..]];

    let cpi_ctx = Transfer {
        from: ctx.accounts.vault.to_account_info(),
        to: ctx.accounts.user_token_account.to_account_info(),
        authority: ctx.accounts.vault_authority.to_account_info(),
    };

    transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_ctx,
            signer_seeds,
        ),
        amount,
    )?;

    staker.staked_amount -= amount;
    global_state.total_staked -= amount;

    Ok(())
}
