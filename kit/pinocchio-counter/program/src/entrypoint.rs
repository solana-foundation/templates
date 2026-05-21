use pinocchio::{account::AccountView, entrypoint, error::ProgramError, Address, ProgramResult};

use crate::{
    instructions::{
        process_close_counter, process_create_counter, process_emit_event, process_increment,
    },
    traits::PinocchioCounterInstructionDiscriminators,
};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Address,
    accounts: &[AccountView],
    instruction_data: &[u8],
) -> ProgramResult {
    let (discriminator, instruction_data) = instruction_data
        .split_first()
        .ok_or(ProgramError::InvalidInstructionData)?;

    let ix_discriminator = PinocchioCounterInstructionDiscriminators::try_from(*discriminator)?;

    match ix_discriminator {
        PinocchioCounterInstructionDiscriminators::CreateCounter => {
            process_create_counter(program_id, accounts, instruction_data)
        }
        PinocchioCounterInstructionDiscriminators::Increment => {
            process_increment(program_id, accounts, instruction_data)
        }
        PinocchioCounterInstructionDiscriminators::CloseCounter => {
            process_close_counter(program_id, accounts, instruction_data)
        }
        PinocchioCounterInstructionDiscriminators::EmitEvent => {
            process_emit_event(program_id, accounts)
        }
    }
}
