//! Same instructions, accounts and errors as `programs/anchor`.
#![cfg_attr(not(test), no_std)]

use interface::{error, ix, seeds, state, PublicInputs, PROOF_LEN};
use pinocchio::{
    cpi::{Seed, Signer},
    error::ProgramError,
    program_entrypoint, AccountView, Address, ProgramResult,
};
use pinocchio_system::instructions::CreateAccount;
use secret_code_verifier as verifier;

const _: () = assert!(verifier::NUM_PUBLIC_INPUTS == PublicInputs::COUNT);

/// Anchor's `ConstraintHasOne`.
const CONSTRAINT_HAS_ONE: u32 = 2001;

program_entrypoint!(process_instruction);
#[cfg(not(test))]
pinocchio::no_allocator!();
#[cfg(not(test))]
pinocchio::nostd_panic_handler!();

fn process_instruction(
    program_id: &Address,
    accounts: &mut [AccountView],
    data: &[u8],
) -> ProgramResult {
    if data.len() < 8 {
        return Err(ProgramError::InvalidInstructionData);
    }
    let (tag, args) = data.split_at(8);
    match tag {
        t if t == ix::INITIALIZE => initialize(program_id, accounts),
        t if t == ix::REGISTER => register(program_id, accounts, args),
        t if t == ix::CLAIM => claim(program_id, accounts, args),
        _ => Err(ProgramError::InvalidInstructionData),
    }
}

/// Accounts: admin (signer, writable), config (writable), system program.
fn initialize(program_id: &Address, accounts: &mut [AccountView]) -> ProgramResult {
    let [admin, config, system_program] = accounts else {
        return Err(ProgramError::NotEnoughAccountKeys);
    };
    require_signer(admin)?;
    require_system_program(system_program)?;

    let (expected, bump) = Address::find_program_address(&[seeds::CONFIG], program_id);
    if config.address() != &expected {
        return Err(ProgramError::InvalidSeeds);
    }
    let bump_seed = [bump];
    let signer_seeds = [Seed::from(seeds::CONFIG), Seed::from(&bump_seed)];
    CreateAccount::with_minimum_balance(admin, config, state::CONFIG_LEN as u64, program_id, None)?
        .invoke_signed(&[Signer::from(&signer_seeds)])?;

    let admin_key = *admin.address();
    let mut data = config.try_borrow_mut()?;
    data[..8].copy_from_slice(&state::CONFIG_DISCRIMINATOR);
    data[8..40].copy_from_slice(admin_key.as_ref());
    data[40] = bump;
    Ok(())
}

/// Accounts: admin (signer, writable), config, code (writable), system program.
/// Data: commitment.
fn register(program_id: &Address, accounts: &mut [AccountView], args: &[u8]) -> ProgramResult {
    let [admin, config, code, system_program] = accounts else {
        return Err(ProgramError::NotEnoughAccountKeys);
    };
    let commitment: &[u8; 32] = args
        .try_into()
        .map_err(|_| ProgramError::InvalidInstructionData)?;
    require_signer(admin)?;
    require_system_program(system_program)?;

    {
        let data = load_account(
            config,
            program_id,
            &state::CONFIG_DISCRIMINATOR,
            state::CONFIG_LEN,
        )?;
        require_pda(config, &[seeds::CONFIG], data[40], program_id)?;
        if &data[8..40] != admin.address().as_ref() {
            return Err(ProgramError::Custom(CONSTRAINT_HAS_ONE));
        }
    }

    // Creation fails if the commitment is already registered.
    let (expected, bump) = Address::find_program_address(&[seeds::CODE, commitment], program_id);
    if code.address() != &expected {
        return Err(ProgramError::InvalidSeeds);
    }
    let bump_seed = [bump];
    let signer_seeds = [
        Seed::from(seeds::CODE),
        Seed::from(commitment),
        Seed::from(&bump_seed),
    ];
    CreateAccount::with_minimum_balance(admin, code, state::CODE_LEN as u64, program_id, None)?
        .invoke_signed(&[Signer::from(&signer_seeds)])?;

    let mut data = code.try_borrow_mut()?;
    data[..8].copy_from_slice(&state::CODE_DISCRIMINATOR);
    data[40] = bump;
    Ok(())
}

/// Accounts: claimant (signer), code (writable).
/// Data: proof, then public inputs.
fn claim(program_id: &Address, accounts: &mut [AccountView], args: &[u8]) -> ProgramResult {
    let [claimant, code] = accounts else {
        return Err(ProgramError::NotEnoughAccountKeys);
    };
    if args.len() != PROOF_LEN + PublicInputs::LEN {
        return Err(ProgramError::InvalidInstructionData);
    }
    let public = PublicInputs::from_bytes(&args[PROOF_LEN..])
        .ok_or(ProgramError::Custom(error::INVALID_PUBLIC_INPUTS))?;
    require_signer(claimant)?;

    if public.signer().as_ref() != Some(claimant.address()) {
        return Err(ProgramError::Custom(error::SIGNER_MISMATCH));
    }

    let claimant_key = *claimant.address();
    {
        let data = load_account(
            code,
            program_id,
            &state::CODE_DISCRIMINATOR,
            state::CODE_LEN,
        )?;
        require_pda(
            code,
            &[seeds::CODE, &public.commitment],
            data[40],
            program_id,
        )?;
        if data[8..40] != [0; 32] {
            return Err(ProgramError::Custom(error::ALREADY_CLAIMED));
        }
    }

    if !verifier::verify_instruction_data_strict(args) {
        return Err(ProgramError::Custom(error::INVALID_PROOF));
    }

    code.try_borrow_mut()?[8..40].copy_from_slice(claimant_key.as_ref());

    // TODO: your logic.
    log("code claimed");
    Ok(())
}

fn require_signer(account: &AccountView) -> ProgramResult {
    if account.is_signer() {
        Ok(())
    } else {
        Err(ProgramError::MissingRequiredSignature)
    }
}

fn require_system_program(account: &AccountView) -> ProgramResult {
    if account.address() == &pinocchio_system::ID {
        Ok(())
    } else {
        Err(ProgramError::IncorrectProgramId)
    }
}

fn load_account<'a>(
    account: &'a AccountView,
    program_id: &Address,
    discriminator: &[u8; 8],
    len: usize,
) -> Result<pinocchio::account::Ref<'a, [u8]>, ProgramError> {
    if !account.owned_by(program_id) {
        return Err(ProgramError::IllegalOwner);
    }
    let data = account.try_borrow()?;
    if data.len() != len || &data[..8] != discriminator {
        return Err(ProgramError::InvalidAccountData);
    }
    Ok(data)
}

fn require_pda(
    account: &AccountView,
    seeds: &[&[u8]],
    bump: u8,
    program_id: &Address,
) -> ProgramResult {
    let bump_seed = [bump];
    let mut with_bump = [&[][..]; 3];
    with_bump[..seeds.len()].copy_from_slice(seeds);
    with_bump[seeds.len()] = &bump_seed;
    let derived = Address::create_program_address(&with_bump[..=seeds.len()], program_id)
        .map_err(|_| ProgramError::InvalidSeeds)?;
    if account.address() == &derived {
        Ok(())
    } else {
        Err(ProgramError::InvalidSeeds)
    }
}

fn log(message: &str) {
    #[cfg(target_os = "solana")]
    unsafe {
        pinocchio::syscalls::sol_log_(message.as_ptr(), message.len() as u64)
    };
    #[cfg(not(target_os = "solana"))]
    let _ = message;
}
