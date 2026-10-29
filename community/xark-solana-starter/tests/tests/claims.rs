//! Every test runs against both programs. Needs `just build` first.

use std::path::{Path, PathBuf};

use client::{
    code::Code,
    interface::{self, error, state, PublicInputs, PROOF_LEN},
    ix,
    prover::{Prover, XarkCli},
};
use litesvm::LiteSVM;
use solana_address::Address;
use solana_instruction::Instruction;
use solana_instruction_error::InstructionError;
use solana_keypair::Keypair;
use solana_signer::Signer;
use solana_transaction::Transaction;
use solana_transaction_error::TransactionError;

#[derive(Clone, Copy, Debug)]
enum Program {
    Anchor,
    Pinocchio,
}

const BOTH: [Program; 2] = [Program::Anchor, Program::Pinocchio];

impl Program {
    fn id(self) -> Address {
        match self {
            Self::Anchor => interface::ANCHOR_PROGRAM_ID,
            Self::Pinocchio => interface::PINOCCHIO_PROGRAM_ID,
        }
    }

    fn so_path(self) -> PathBuf {
        let (dir, file) = match self {
            Self::Anchor => ("anchor", "xark_starter_anchor.so"),
            Self::Pinocchio => ("pinocchio", "xark_starter_pinocchio.so"),
        };
        root()
            .join("programs")
            .join(dir)
            .join("target/deploy")
            .join(file)
    }
}

fn root() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR")).join("..")
}

struct Env {
    svm: LiteSVM,
    program: Program,
    admin: Keypair,
}

impl Env {
    fn new(program: Program) -> Self {
        let mut svm = LiteSVM::new();
        let so = program.so_path();
        svm.add_program_from_file(program.id(), &so)
            .unwrap_or_else(|e| panic!("loading {} (run `just build`): {e:?}", so.display()));
        let admin = Keypair::new();
        svm.airdrop(&admin.pubkey(), 10_000_000_000).unwrap();
        let mut env = Self {
            svm,
            program,
            admin,
        };
        let init = ix::initialize(&program.id(), &env.admin.pubkey());
        env.send(&[init], &[]).expect("initialize");
        env
    }

    fn id(&self) -> Address {
        self.program.id()
    }

    fn funded_wallet(&mut self) -> Keypair {
        let wallet = Keypair::new();
        self.svm.airdrop(&wallet.pubkey(), 1_000_000_000).unwrap();
        wallet
    }

    /// Returns compute units consumed.
    fn send(&mut self, ixs: &[Instruction], signers: &[&Keypair]) -> Result<u64, TransactionError> {
        self.svm.expire_blockhash();
        let mut all: Vec<&Keypair> = vec![&self.admin];
        all.extend_from_slice(signers);
        let tx = Transaction::new_signed_with_payer(
            ixs,
            Some(&self.admin.pubkey()),
            &all,
            self.svm.latest_blockhash(),
        );
        self.svm
            .send_transaction(tx)
            .map(|meta| meta.compute_units_consumed)
            .map_err(|failed| failed.err)
    }

    fn register(&mut self, code: &Code) -> Result<u64, TransactionError> {
        let ix = ix::register(&self.id(), &self.admin.pubkey(), &code.commitment());
        self.send(&[ix], &[])
    }

    fn claim(
        &mut self,
        claimant: &Keypair,
        proof: &[u8; PROOF_LEN],
        public: &PublicInputs,
    ) -> Result<u64, TransactionError> {
        let ix = ix::claim(&self.id(), &claimant.pubkey(), proof, public);
        self.send(&[ix], &[claimant])
    }

    fn account_data(&self, address: &Address) -> Option<Vec<u8>> {
        self.svm.get_account(address).map(|a| a.data)
    }
}

fn prove(code: &Code, public: &PublicInputs) -> [u8; PROOF_LEN] {
    XarkCli::new(root().join("circuit"))
        .prove(code, public)
        .expect("xark prove (run `just build` first)")
}

fn custom_error(result: Result<u64, TransactionError>) -> u32 {
    match result {
        Err(TransactionError::InstructionError(_, InstructionError::Custom(code))) => code,
        other => panic!("expected a custom program error, got {other:?}"),
    }
}

#[test]
fn register_and_claim() {
    for program in BOTH {
        let mut env = Env::new(program);
        let code = Code::random().unwrap();
        env.register(&code).unwrap();

        let claimant = env.funded_wallet();
        let public = PublicInputs::new(code.commitment(), &claimant.pubkey());
        let proof = prove(&code, &public);
        let units = env.claim(&claimant, &proof, &public).unwrap();
        println!("{program:?}: claim used {units} compute units");

        let config = env.account_data(&ix::config_address(&env.id())).unwrap();
        assert_eq!(config.len(), state::CONFIG_LEN);
        assert_eq!(config[..8], state::CONFIG_DISCRIMINATOR);
        assert_eq!(config[8..40], env.admin.pubkey().to_bytes());

        let account = env
            .account_data(&ix::code_address(&env.id(), &code.commitment()))
            .unwrap();
        assert_eq!(account.len(), state::CODE_LEN);
        assert_eq!(account[..8], state::CODE_DISCRIMINATOR);
        assert_eq!(account[8..40], claimant.pubkey().to_bytes(), "{program:?}");
    }
}

#[test]
fn tampered_proof_is_rejected() {
    for program in BOTH {
        let mut env = Env::new(program);
        let code = Code::random().unwrap();
        env.register(&code).unwrap();
        let claimant = env.funded_wallet();
        let public = PublicInputs::new(code.commitment(), &claimant.pubkey());
        let mut proof = prove(&code, &public);
        proof[100] ^= 1;
        assert_eq!(
            custom_error(env.claim(&claimant, &proof, &public)),
            error::INVALID_PROOF,
            "{program:?}"
        );
    }
}

#[test]
fn copied_proof_fails_from_another_wallet() {
    for program in BOTH {
        let mut env = Env::new(program);
        let code = Code::random().unwrap();
        env.register(&code).unwrap();
        let owner = env.funded_wallet();
        let thief = env.funded_wallet();
        let public = PublicInputs::new(code.commitment(), &owner.pubkey());
        let proof = prove(&code, &public);

        assert_eq!(
            custom_error(env.claim(&thief, &proof, &public)),
            error::SIGNER_MISMATCH,
            "{program:?}"
        );

        // Swapping in the thief's address must break the proof itself.
        let rewritten = PublicInputs::new(code.commitment(), &thief.pubkey());
        assert_eq!(
            custom_error(env.claim(&thief, &proof, &rewritten)),
            error::INVALID_PROOF,
            "{program:?}"
        );

        env.claim(&owner, &proof, &public).unwrap();
    }
}

#[test]
fn code_cannot_be_claimed_twice() {
    for program in BOTH {
        let mut env = Env::new(program);
        let code = Code::random().unwrap();
        env.register(&code).unwrap();
        let first = env.funded_wallet();
        let second = env.funded_wallet();

        let public = PublicInputs::new(code.commitment(), &first.pubkey());
        env.claim(&first, &prove(&code, &public), &public).unwrap();

        let public = PublicInputs::new(code.commitment(), &second.pubkey());
        assert_eq!(
            custom_error(env.claim(&second, &prove(&code, &public), &public)),
            error::ALREADY_CLAIMED,
            "{program:?}"
        );
    }
}

#[test]
fn unregistered_code_is_rejected() {
    for program in BOTH {
        let mut env = Env::new(program);
        let made_up = Code::random().unwrap();
        let claimant = env.funded_wallet();
        let public = PublicInputs::new(made_up.commitment(), &claimant.pubkey());
        let proof = prove(&made_up, &public);
        assert!(
            env.claim(&claimant, &proof, &public).is_err(),
            "{program:?}"
        );
    }
}

#[test]
fn proof_does_not_transfer_between_codes() {
    for program in BOTH {
        let mut env = Env::new(program);
        let a = Code::random().unwrap();
        let b = Code::random().unwrap();
        env.register(&a).unwrap();
        env.register(&b).unwrap();
        let claimant = env.funded_wallet();

        let proof_a = prove(&a, &PublicInputs::new(a.commitment(), &claimant.pubkey()));
        let public_b = PublicInputs::new(b.commitment(), &claimant.pubkey());
        assert_eq!(
            custom_error(env.claim(&claimant, &proof_a, &public_b)),
            error::INVALID_PROOF,
            "{program:?}"
        );
    }
}

#[test]
fn only_the_admin_registers_codes() {
    for program in BOTH {
        let mut env = Env::new(program);
        let stranger = env.funded_wallet();
        let code = Code::random().unwrap();
        let ix = ix::register(&env.id(), &stranger.pubkey(), &code.commitment());
        assert!(env.send(&[ix], &[&stranger]).is_err(), "{program:?}");
    }
}

#[test]
fn setup_steps_run_once() {
    for program in BOTH {
        let mut env = Env::new(program);
        let init = ix::initialize(&env.id(), &env.admin.pubkey());
        assert!(
            env.send(&[init], &[]).is_err(),
            "{program:?}: second initialize"
        );

        let code = Code::random().unwrap();
        env.register(&code).unwrap();
        assert!(env.register(&code).is_err(), "{program:?}: second register");
    }
}

#[test]
fn commitment_matches_circuit() {
    let code = Code::random().unwrap();
    let public = PublicInputs::new(code.commitment(), &Address::new_unique());
    // Fails if the native hash and the circuit disagree.
    prove(&code, &public);
}
