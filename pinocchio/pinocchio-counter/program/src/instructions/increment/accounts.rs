use pinocchio::{account::AccountView, error::ProgramError};

use crate::{
    traits::InstructionAccounts,
    utils::{
        verify_current_program, verify_current_program_account, verify_event_authority,
        verify_signer, verify_writable,
    },
};

/// Accounts for the Increment instruction
///
/// # Account Layout
/// 0. `[signer]` authority - Authority of the counter
/// 1. `[writable]` counter - Counter PDA to increment
/// 2. `[]` event_authority - Event authority PDA
/// 3. `[]` program - Current program
pub struct IncrementAccounts<'a> {
    pub authority: &'a AccountView,
    pub counter: &'a AccountView,
    pub event_authority: &'a AccountView,
    pub program: &'a AccountView,
}

impl<'a> TryFrom<&'a [AccountView]> for IncrementAccounts<'a> {
    type Error = ProgramError;

    #[inline(always)]
    fn try_from(accounts: &'a [AccountView]) -> Result<Self, Self::Error> {
        let [authority, counter, event_authority, program] = accounts else {
            return Err(ProgramError::NotEnoughAccountKeys);
        };

        verify_signer(authority)?;
        verify_writable(counter)?;
        verify_current_program_account(counter)?;

        verify_event_authority(event_authority)?;
        verify_current_program(program)?;

        Ok(Self {
            authority,
            counter,
            event_authority,
            program,
        })
    }
}

impl<'a> InstructionAccounts<'a> for IncrementAccounts<'a> {}
