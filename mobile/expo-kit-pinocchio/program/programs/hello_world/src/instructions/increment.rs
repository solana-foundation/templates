use pinocchio::{error::ProgramError, AccountView, Address, ProgramResult};

use crate::{constants::*, error::HelloWorldError, state::Counter};

pub fn handle_increment(program_id: &Address, accounts: &mut [AccountView]) -> ProgramResult {
    let [counter, authority] = accounts else {
        return Err(ProgramError::NotEnoughAccountKeys);
    };
    if !authority.is_signer() {
        return Err(ProgramError::MissingRequiredSignature);
    }
    if !counter.owned_by(program_id) {
        return Err(ProgramError::IncorrectProgramId);
    }

    let (counter_address, _) =
        Address::find_program_address(&[COUNTER_SEED, authority.address().as_ref()], program_id);
    if counter.address() != &counter_address {
        return Err(ProgramError::InvalidSeeds);
    }

    let mut data = counter.try_borrow_mut()?;
    let mut state = Counter::load(&data)?;
    state.count = state
        .count
        .checked_add(1)
        .ok_or(HelloWorldError::CounterOverflow)?;
    state.store(&mut data)
}
