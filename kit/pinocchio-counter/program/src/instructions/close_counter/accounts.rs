use pinocchio::{account::AccountView, error::ProgramError};

use crate::{
    traits::InstructionAccounts,
    utils::{
        verify_current_program, verify_current_program_account, verify_event_authority,
        verify_signer, verify_writable,
    },
};

/// Accounts for the CloseCounter instruction
///
/// # Account Layout
/// 0. `[signer]` authority - Authority of the counter
/// 1. `[writable]` counter - Counter PDA to be closed
/// 2. `[writable]` destination - Account to receive the lamports
/// 3. `[]` event_authority - Event authority PDA
/// 4. `[]` program - Current program
pub struct CloseCounterAccounts<'a> {
    pub authority: &'a AccountView,
    pub counter: &'a AccountView,
    pub destination: &'a AccountView,
    pub event_authority: &'a AccountView,
    pub program: &'a AccountView,
}

impl<'a> TryFrom<&'a [AccountView]> for CloseCounterAccounts<'a> {
    type Error = ProgramError;

    #[inline(always)]
    fn try_from(accounts: &'a [AccountView]) -> Result<Self, Self::Error> {
        let [authority, counter, destination, event_authority, program] = accounts else {
            return Err(ProgramError::NotEnoughAccountKeys);
        };

        verify_signer(authority)?;
        verify_writable(counter)?;
        verify_current_program_account(counter)?;
        verify_writable(destination)?;

        verify_event_authority(event_authority)?;
        verify_current_program(program)?;

        Ok(Self {
            authority,
            counter,
            destination,
            event_authority,
            program,
        })
    }
}

impl<'a> InstructionAccounts<'a> for CloseCounterAccounts<'a> {}
