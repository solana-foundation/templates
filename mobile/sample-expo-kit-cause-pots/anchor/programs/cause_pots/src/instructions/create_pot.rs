use anchor_lang::prelude::*;

use crate::{constants::*, error::ErrorCode, state::*};

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreatePot<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Pot::INIT_SPACE,
        seeds = [POT_SEED, authority.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub pot: Account<'info, Pot>,
    #[account(seeds = [VAULT_SEED, pot.key().as_ref()], bump)]
    pub vault: SystemAccount<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[allow(clippy::too_many_arguments)]
pub fn handle_create_pot(
    ctx: Context<CreatePot>,
    name: String,
    description: String,
    category: PotCategory,
    currency: Currency,
    target_amount: u64,
    unlock_days: i64,
    signers_required: u8,
) -> Result<()> {
    require!(name.len() <= MAX_NAME_LENGTH, ErrorCode::NameTooLong);
    require!(description.len() <= MAX_DESCRIPTION_LENGTH, ErrorCode::DescriptionTooLong);
    require!(target_amount > 0, ErrorCode::InvalidTargetAmount);
    require!(unlock_days >= 0, ErrorCode::InvalidUnlockDays);
    require!(signers_required > 0, ErrorCode::InvalidSignersRequired);
    // A threshold above the contributor limit could never be met, freezing the funds.
    require!(signers_required as usize <= MAX_CONTRIBUTORS, ErrorCode::InvalidSignersRequired);

    let pot = &mut ctx.accounts.pot;
    let clock = Clock::get()?;

    pot.authority = ctx.accounts.authority.key();
    pot.vault = ctx.accounts.vault.key();
    pot.name = name;
    pot.description = description;
    pot.category = category;
    pot.currency = currency;
    pot.target_amount = target_amount;
    pot.total_contributed = 0;
    // The unlock time derives from the cluster clock, never from a client-supplied timestamp.
    pot.unlock_timestamp = unlock_days
        .checked_mul(SECONDS_PER_DAY)
        .and_then(|seconds| clock.unix_timestamp.checked_add(seconds))
        .ok_or(ErrorCode::Overflow)?;
    pot.signers_required = signers_required;
    pot.signatures = Vec::new();
    // The creator is the first contributor.
    pot.contributors = vec![ctx.accounts.authority.key()];
    pot.is_released = false;
    pot.released_at = None;
    pot.recipient = None;
    pot.created_at = clock.unix_timestamp;
    pot.bump = ctx.bumps.pot;
    pot.vault_bump = ctx.bumps.vault;

    msg!("Pot created: {}", pot.name);
    Ok(())
}
