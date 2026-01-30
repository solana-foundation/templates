use pinocchio::{account::AccountView, error::ProgramError, Address, ProgramResult};

use crate::utils::{verify_event_authority, verify_signer};

/// Processes the EmitEvent instruction.
///
/// This is a no-op instruction that only validates the event authority PDA is a signer.
/// Event data is stored in the instruction data itself (passed via CPI).
pub fn process_emit_event(_program_id: &Address, accounts: &[AccountView]) -> ProgramResult {
    let [event_authority] = accounts else {
        return Err(ProgramError::NotEnoughAccountKeys);
    };

    verify_event_authority(event_authority)?;
    verify_signer(event_authority, false)?;

    Ok(())
}
