pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use pinocchio::{address::declare_id, error::ProgramError, AccountView, Address, ProgramResult};

pub use constants::*;
pub use error::*;
pub use instructions::*;
pub use state::*;

declare_id!("ADiv89yPUzyRC7tLJ8zNDWnaHVyYkYGTTcSoSfTKc4hV");

#[cfg(not(feature = "no-entrypoint"))]
pinocchio::entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Address,
    accounts: &mut [AccountView],
    data: &[u8],
) -> ProgramResult {
    match data.first() {
        Some(&INITIALIZE_DISCRIMINATOR) => {
            instructions::initialize::handle_initialize(program_id, accounts)
        }
        Some(&INCREMENT_DISCRIMINATOR) => {
            instructions::increment::handle_increment(program_id, accounts)
        }
        _ => Err(ProgramError::InvalidInstructionData),
    }
}
