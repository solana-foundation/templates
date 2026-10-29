use anchor_lang::prelude::*;

use crate::{error::ErrorCode, state::Pot};

#[derive(Accounts)]
pub struct SignRelease<'info> {
    #[account(mut)]
    pub pot: Account<'info, Pot>,
    pub signer: Signer<'info>,
}

pub fn handle_sign_release(ctx: Context<SignRelease>) -> Result<()> {
    let pot = &mut ctx.accounts.pot;
    let signer = ctx.accounts.signer.key();
    let clock = Clock::get()?;

    require!(!pot.is_released, ErrorCode::PotAlreadyReleased);
    require!(pot.contributors.contains(&signer), ErrorCode::NotAContributor);
    require!(!pot.signatures.contains(&signer), ErrorCode::AlreadySigned);
    require!(clock.unix_timestamp >= pot.unlock_timestamp, ErrorCode::TimeLockNotExpired);

    pot.signatures.push(signer);

    msg!("Release signed by {} ({}/{})", signer, pot.signatures.len(), pot.signers_required);
    Ok(())
}
