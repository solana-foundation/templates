use crate::accounts_context::initialize::Initialize;
use anchor_lang::prelude::*;

pub fn handler(ctx: Context<Initialize<'_>>) -> Result<()> {
    let global_state = &mut ctx.accounts.global_state;

    global_state.total_staked = 0;
    global_state.admin = ctx.accounts.admin.key();
    global_state.staking_token_mint = ctx.accounts.mint.key();
    global_state.vault = ctx.accounts.vault.key();
    global_state.reward_rate = 0;
    global_state.reward_pool = 0;

    msg!("Reward pool initialized");
    msg!("Staking account initialized");
    Ok(())
}
