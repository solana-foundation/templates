use anchor_lang::prelude::*;

use crate::{
    constants::*,
    state::{Code, Config},
};

#[derive(Accounts)]
#[instruction(commitment: [u8; 32])]
pub struct Register<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(seeds = [CONFIG_SEED], bump = config.bump, has_one = admin)]
    pub config: Account<'info, Config>,
    #[account(
        init,
        payer = admin,
        space = 8 + Code::INIT_SPACE,
        seeds = [CODE_SEED, commitment.as_ref()],
        bump,
    )]
    pub code: Account<'info, Code>,
    pub system_program: Program<'info, System>,
}

pub fn handle_register(ctx: Context<Register>, _commitment: [u8; 32]) -> Result<()> {
    ctx.accounts.code.bump = ctx.bumps.code;
    Ok(())
}
