use pinocchio::{account::AccountView, error::ProgramError, Address, ProgramResult};

use crate::{
    events::CounterIncrementedEvent,
    instructions::Increment,
    state::Counter,
    traits::{AccountDeserialize, EventSerialize, PdaSeeds},
    utils::emit_event,
};

/// Processes the Increment instruction.
///
/// Increments the counter value by 1.
pub fn process_increment(
    program_id: &Address,
    accounts: &[AccountView],
    instruction_data: &[u8],
) -> ProgramResult {
    let ix = Increment::try_from((instruction_data, accounts))?;

    // Get counter data mutably
    let mut counter_data = ix.accounts.counter.try_borrow_mut()?;
    let counter = Counter::from_bytes_mut(&mut counter_data)?;

    // Validate PDA
    counter.validate_pda(ix.accounts.counter, program_id, counter.bump)?;

    // Validate authority
    counter.validate_authority(ix.accounts.authority.address())?;

    // Increment the count
    counter.count = counter
        .count
        .checked_add(1)
        .ok_or(ProgramError::ArithmeticOverflow)?;

    // Emit event via CPI
    let event = CounterIncrementedEvent::new(*ix.accounts.authority.address(), counter.count);
    emit_event(
        program_id,
        ix.accounts.event_authority,
        ix.accounts.program,
        &event.to_bytes(),
    )?;

    Ok(())
}
