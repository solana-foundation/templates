use anchor_lang::prelude::*;

use crate::{constants::*, error::ErrorCode, state::Counter};

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut, seeds = [COUNTER_SEED, authority.key().as_ref()], bump)]
    pub counter: Account<'info, Counter>,
    pub authority: Signer<'info>,
}

pub fn handle_increment(ctx: Context<Increment>) -> Result<()> {
    ctx.accounts.counter.count = ctx
        .accounts
        .counter
        .count
        .checked_add(1)
        .ok_or(ErrorCode::CounterOverflow)?;

    msg!("Hello, world! Counter is now {}", ctx.accounts.counter.count);
    Ok(())
}
