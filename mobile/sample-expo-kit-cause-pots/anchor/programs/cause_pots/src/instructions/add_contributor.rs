use anchor_lang::prelude::*;

use crate::{constants::*, error::ErrorCode, state::Pot};

#[derive(Accounts)]
pub struct AddContributor<'info> {
    #[account(mut, has_one = authority)]
    pub pot: Account<'info, Pot>,
    pub authority: Signer<'info>,
}

pub fn handle_add_contributor(ctx: Context<AddContributor>, new_contributor: Pubkey) -> Result<()> {
    let pot = &mut ctx.accounts.pot;

    require!(!pot.is_released, ErrorCode::PotAlreadyReleased);
    require!(!pot.contributors.contains(&new_contributor), ErrorCode::AlreadyAContributor);
    require!(pot.contributors.len() < MAX_CONTRIBUTORS, ErrorCode::MaxContributorsReached);

    pot.contributors.push(new_contributor);

    msg!("Contributor added: {}", new_contributor);
    Ok(())
}
