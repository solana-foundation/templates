use crate::accounts_context::add_rewards::AddRewards;
use anchor_lang::prelude::*;
use anchor_spl::token::{transfer, Transfer};

pub fn handler(ctx: Context<AddRewards<'_>>, amount: u64, reward_rate: u64) -> Result<()> {
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.admin_token_account.to_account_info(),
            to: ctx.accounts.reward_pool.to_account_info(),
            authority: ctx.accounts.admin.to_account_info(),
        },
    );

    transfer(cpi_ctx, amount)?;

    ctx.accounts.global_state.reward_pool += amount;
    ctx.accounts.global_state.reward_rate = reward_rate;
    ctx.accounts.global_state.last_reward_time = Clock::get()?.unix_timestamp;

    msg!("Added {} rewards with rate {}", amount, reward_rate);
    Ok(())
}
