use anchor_lang::prelude::*;

use crate::{constants::*, error::ErrorCode, state::Pot};

#[derive(Accounts)]
pub struct ReleaseFunds<'info> {
    #[account(mut, has_one = authority)]
    pub pot: Account<'info, Pot>,
    #[account(mut, seeds = [VAULT_SEED, pot.key().as_ref()], bump = pot.vault_bump)]
    pub vault: SystemAccount<'info>,
    pub authority: Signer<'info>,
    /// CHECK: The recipient can be any account except the pot, which has no way to pay lamports out.
    #[account(mut, constraint = recipient.key() != pot.key() @ ErrorCode::RecipientIsPot)]
    pub recipient: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handle_release_funds(ctx: Context<ReleaseFunds>) -> Result<()> {
    let pot = &mut ctx.accounts.pot;
    let recipient = ctx.accounts.recipient.key();
    let clock = Clock::get()?;

    require!(!pot.is_released, ErrorCode::PotAlreadyReleased);
    require!(clock.unix_timestamp >= pot.unlock_timestamp, ErrorCode::TimeLockNotExpired);
    require!(
        pot.signatures.len() >= pot.signers_required as usize,
        ErrorCode::InsufficientSignatures
    );

    let vault_balance = ctx.accounts.vault.lamports();
    require!(vault_balance > 0, ErrorCode::InsufficientFunds);

    // The vault is a PDA, so the program signs the transfer with the vault seeds.
    let pot_key = pot.key();
    let seeds = &[VAULT_SEED, pot_key.as_ref(), &[pot.vault_bump]];
    let ix = anchor_lang::solana_program::system_instruction::transfer(
        &ctx.accounts.vault.key(),
        &recipient,
        vault_balance,
    );
    anchor_lang::solana_program::program::invoke_signed(
        &ix,
        &[
            ctx.accounts.vault.to_account_info(),
            ctx.accounts.recipient.to_account_info(),
        ],
        &[&seeds[..]],
    )?;

    pot.is_released = true;
    pot.released_at = Some(clock.unix_timestamp);
    pot.recipient = Some(recipient);

    msg!("Released {} lamports to {}", vault_balance, recipient);
    Ok(())
}
