use crate::accounts_context::stake::Stake;
use crate::error::CustomError;
use anchor_lang::prelude::*;
use anchor_spl::token::{transfer, Transfer};

pub fn handler(ctx: Context<Stake<'_>>, amount: u64) -> Result<()> {
    let staker = &mut ctx.accounts.staker;
    let global_state = &mut ctx.accounts.global_state;

    require!(amount > 0, CustomError::InvalidAmount);

    if staker.address == Pubkey::default() {
        staker.address = ctx.accounts.signer.key();
        staker.staked_amount = 0;
        staker.reward_debt = 0;
    } else {
        require_keys_eq!(
            staker.address,
            ctx.accounts.signer.key(),
            CustomError::InvalidOperation
        );
    }

    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.vault.to_account_info(),
            authority: ctx.accounts.signer.to_account_info(),
        },
    );

    transfer(cpi_ctx, amount)?;

    staker.staked_amount = staker
        .staked_amount
        .checked_add(amount)
        .ok_or(CustomError::MathOverflow)?;
    global_state.total_staked = global_state
        .total_staked
        .checked_add(amount)
        .ok_or(CustomError::MathOverflow)?;

    Ok(())
}
