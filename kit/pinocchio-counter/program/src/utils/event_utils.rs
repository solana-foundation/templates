use crate::errors::PinocchioCounterProgramError::InvalidEventAuthority;
use pinocchio::{
    account::AccountView,
    cpi::{invoke_signed, Seed, Signer},
    error::ProgramError,
    instruction::{InstructionAccount, InstructionView},
    Address, ProgramResult,
};

use crate::events::{event_authority_pda, EVENT_AUTHORITY_SEED};

/// Verify the account is the event authority PDA, returning an error if it is not.
///
/// # Arguments
/// * `account` - The account to verify.
///
/// # Returns
/// * `Result<(), ProgramError>` - The result of the operation
#[inline(always)]
pub fn verify_event_authority(account: &AccountView) -> Result<(), ProgramError> {
    if account.address() != &event_authority_pda::ID {
        return Err(InvalidEventAuthority.into());
    }

    Ok(())
}

/// Emits an event via CPI to prevent log truncation.
///
/// Event data is stored in instruction data (not logs), making it indexer-friendly.
pub fn emit_event(
    program_id: &Address,
    event_authority: &AccountView,
    program: &AccountView,
    event_data: &[u8],
) -> ProgramResult {
    verify_event_authority(event_authority)?;

    let bump = [event_authority_pda::BUMP];
    let signer_seeds: [Seed; 2] = [Seed::from(EVENT_AUTHORITY_SEED), Seed::from(&bump)];
    let signer = Signer::from(&signer_seeds);

    let accounts = [InstructionAccount::readonly_signer(
        event_authority.address(),
    )];

    let instruction = InstructionView {
        program_id,
        accounts: &accounts,
        data: event_data,
    };

    invoke_signed(&instruction, &[event_authority, program], &[signer])
}
