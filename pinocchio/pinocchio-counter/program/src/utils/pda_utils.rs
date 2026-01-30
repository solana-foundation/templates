use pinocchio::{account::AccountView, address::Address, error::ProgramError};
use pinocchio::{
    cpi::{Seed, Signer},
    sysvars::{rent::Rent, Sysvar},
    ProgramResult,
};
use pinocchio_system::instructions::CreateAccount;

/// Create a PDA account for the given seeds.
///
/// Will return an error if the account already exists (has lamports).
pub fn create_pda_account<const N: usize>(
    payer: &AccountView,
    space: usize,
    owner: &Address,
    pda_account: &AccountView,
    pda_signer_seeds: [Seed; N],
) -> ProgramResult {
    let rent = Rent::get()?;

    let required_lamports = rent.try_minimum_balance(space).unwrap().max(1);

    let signers = [Signer::from(&pda_signer_seeds)];

    if pda_account.lamports() > 0 {
        Err(ProgramError::AccountAlreadyInitialized)
    } else {
        CreateAccount {
            from: payer,
            to: pda_account,
            lamports: required_lamports,
            space: space as u64,
            owner,
        }
        .invoke_signed(&signers)
    }
}

/// Close a PDA account and return the lamports to the recipient.
pub fn close_pda_account(pda_account: &AccountView, recipient: &AccountView) -> ProgramResult {
    let payer_lamports = recipient.lamports();
    recipient.set_lamports(
        payer_lamports
            .checked_add(pda_account.lamports())
            .ok_or(ProgramError::ArithmeticOverflow)?,
    );
    pda_account.set_lamports(0);
    pda_account.close()?;

    Ok(())
}
