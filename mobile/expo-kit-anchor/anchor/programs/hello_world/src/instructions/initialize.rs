use anchor_lang::prelude::*;

use crate::{constants::*, state::Counter};

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init,
        payer = payer,
        space = 8 + Counter::INIT_SPACE,
        seeds = [COUNTER_SEED, payer.key().as_ref()],
        bump
    )]
    pub counter: Account<'info, Counter>,
    pub system_program: Program<'info, System>,
}

pub fn handle_initialize(ctx: Context<Initialize>) -> Result<()> {
    ctx.accounts.counter.count = 0;
    ctx.accounts.counter.authority = ctx.accounts.payer.key();

    msg!("Hello, world! Counter initialized for {}", ctx.accounts.payer.key());
    Ok(())
}
