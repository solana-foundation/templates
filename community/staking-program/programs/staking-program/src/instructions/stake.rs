use crate::accounts_context::stake::Stake;
use anchor_lang::prelude::*;
use anchor_spl::token::{transfer, Transfer};

pub fn handler(ctx: Context<Stake<'_>>, amount: u64) -> Result<()> {
    let staker = &mut ctx.accounts.staker;
    let global_state = &mut ctx.accounts.global_state;

    staker.address = ctx.accounts.signer.key();
    staker.staked_amount = 0;

    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.vault.to_account_info(),
            authority: ctx.accounts.signer.to_account_info(),
        },
    );

    transfer(cpi_ctx, amount)?;

    staker.staked_amount += amount;
    global_state.total_staked += amount;

    Ok(())
}
