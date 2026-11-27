use interface::{ix, seeds, PublicInputs, PROOF_LEN};
use solana_address::Address;
use solana_instruction::{AccountMeta, Instruction};

pub const SYSTEM_PROGRAM_ID: Address = Address::from_str_const("11111111111111111111111111111111");

pub fn config_address(program_id: &Address) -> Address {
    Address::find_program_address(&[seeds::CONFIG], program_id).0
}

pub fn code_address(program_id: &Address, commitment: &[u8; 32]) -> Address {
    Address::find_program_address(&[seeds::CODE, commitment], program_id).0
}

pub fn initialize(program_id: &Address, admin: &Address) -> Instruction {
    Instruction {
        program_id: *program_id,
        accounts: vec![
            AccountMeta::new(*admin, true),
            AccountMeta::new(config_address(program_id), false),
            AccountMeta::new_readonly(SYSTEM_PROGRAM_ID, false),
        ],
        data: ix::INITIALIZE.to_vec(),
    }
}

pub fn register(program_id: &Address, admin: &Address, commitment: &[u8; 32]) -> Instruction {
    let mut data = ix::REGISTER.to_vec();
    data.extend_from_slice(commitment);
    Instruction {
        program_id: *program_id,
        accounts: vec![
            AccountMeta::new(*admin, true),
            AccountMeta::new_readonly(config_address(program_id), false),
            AccountMeta::new(code_address(program_id, commitment), false),
            AccountMeta::new_readonly(SYSTEM_PROGRAM_ID, false),
        ],
        data,
    }
}

pub fn claim(
    program_id: &Address,
    claimant: &Address,
    proof: &[u8; PROOF_LEN],
    public: &PublicInputs,
) -> Instruction {
    let mut data = ix::CLAIM.to_vec();
    data.extend_from_slice(proof);
    data.extend_from_slice(&public.to_bytes());
    Instruction {
        program_id: *program_id,
        accounts: vec![
            AccountMeta::new_readonly(*claimant, true),
            AccountMeta::new(code_address(program_id, &public.commitment), false),
        ],
        data,
    }
}
