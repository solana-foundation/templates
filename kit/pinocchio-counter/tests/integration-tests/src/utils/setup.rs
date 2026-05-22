use litesvm::LiteSVM;
use solana_program::clock::Clock;
use solana_sdk::{
    account::Account,
    instruction::Instruction,
    signature::{Keypair, Signer},
    transaction::{Transaction, TransactionError},
};

use crate::utils::{cu_utils::CuTracker, Address};
use pinocchio_counter_client::PINOCCHIO_COUNTER_ID;

const MIN_LAMPORTS: u64 = 500_000_000;
const CU_TRACKING_ENV_VAR: &str = "CU_TRACKING";

pub struct TestContext {
    pub svm: LiteSVM,
    pub payer: Keypair,
    pub cu_tracker: Option<CuTracker>,
}

impl TestContext {
    pub fn new() -> Self {
        let mut svm = LiteSVM::new().with_sysvars().with_default_programs();

        let current_time = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs() as i64;

        svm.set_sysvar(&Clock {
            slot: 1,
            epoch_start_timestamp: current_time,
            epoch: 0,
            leader_schedule_epoch: 0,
            unix_timestamp: current_time,
        });

        let program_data = include_bytes!("../../../../target/deploy/pinocchio_counter.so");
        let _ = svm.add_program(PINOCCHIO_COUNTER_ID, program_data);

        let payer = Keypair::new();
        svm.airdrop(&payer.pubkey(), MIN_LAMPORTS).unwrap();

        let cu_tracker = if std::env::var(CU_TRACKING_ENV_VAR).is_ok() {
            CuTracker::new()
        } else {
            None
        };

        Self {
            svm,
            payer,
            cu_tracker,
        }
    }

    pub fn airdrop_if_required(
        &mut self,
        address: &Address,
        lamports: u64,
    ) -> Result<(), Box<dyn std::error::Error>> {
        if let Some(account) = self.svm.get_account(address) {
            if account.lamports < MIN_LAMPORTS {
                return match self.svm.airdrop(address, lamports) {
                    Ok(_) => Ok(()),
                    Err(e) => Err(format!("Airdrop failed: {:?}", e).into()),
                };
            }
        } else {
            return match self.svm.airdrop(address, lamports) {
                Ok(_) => Ok(()),
                Err(e) => Err(format!("Airdrop failed: {:?}", e).into()),
            };
        }

        Ok(())
    }

    pub fn send_transaction(
        &mut self,
        instruction: Instruction,
        signers: &[&Keypair],
    ) -> Result<u64, Box<dyn std::error::Error>> {
        self.send_transaction_inner(instruction, signers)
            .map_err(|e| format!("Transaction failed: {:?}", e).into())
    }

    pub fn send_transaction_expect_error(
        &mut self,
        instruction: Instruction,
        signers: &[&Keypair],
    ) -> TransactionError {
        self.send_transaction_inner(instruction, signers)
            .expect_err("Transaction should fail")
    }

    fn send_transaction_inner(
        &mut self,
        instruction: Instruction,
        signers: &[&Keypair],
    ) -> Result<u64, TransactionError> {
        let mut all_signers = vec![&self.payer as &dyn Signer];
        all_signers.extend(signers.iter().map(|k| *k as &dyn Signer));

        let transaction = Transaction::new_signed_with_payer(
            &[instruction],
            Some(&self.payer.pubkey()),
            &all_signers,
            self.svm.latest_blockhash(),
        );

        self.svm
            .send_transaction(transaction)
            .map(|meta| meta.compute_units_consumed)
            .map_err(|e| e.err)
    }

    pub fn get_account(&self, address: &Address) -> Option<Account> {
        self.svm.get_account(address)
    }

    pub fn create_funded_keypair(&mut self) -> Keypair {
        let kp = Keypair::new();
        self.svm.airdrop(&kp.pubkey(), MIN_LAMPORTS).unwrap();
        kp
    }

    pub fn warp_to_timestamp(&mut self, unix_timestamp: i64) {
        self.svm.set_sysvar(&Clock {
            slot: 1,
            epoch_start_timestamp: unix_timestamp,
            epoch: 0,
            leader_schedule_epoch: 0,
            unix_timestamp,
        });
    }

    pub fn get_current_timestamp(&self) -> i64 {
        self.svm.get_sysvar::<Clock>().unix_timestamp
    }

    pub fn warp_to_next_slot(&mut self) {
        let clock = self.svm.get_sysvar::<Clock>();
        let current_slot = clock.slot;
        self.svm.set_sysvar(&Clock {
            slot: current_slot + 1,
            ..clock
        });
        self.svm.expire_blockhash();
    }
}

impl Default for TestContext {
    fn default() -> Self {
        Self::new()
    }
}
