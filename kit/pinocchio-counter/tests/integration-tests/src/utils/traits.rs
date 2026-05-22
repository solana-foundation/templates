use solana_sdk::{
    instruction::{AccountMeta, Instruction},
    signature::Keypair,
    transaction::TransactionError,
};

use crate::utils::{Address, TestContext};

/// Wrapper around an instruction and its required signers for testing
pub struct TestInstruction {
    pub instruction: Instruction,
    pub signers: Vec<Keypair>,
    pub name: &'static str,
}

impl TestInstruction {
    /// Get references to signers for transaction signing
    pub fn signer_refs(&self) -> Vec<&Keypair> {
        self.signers.iter().collect()
    }

    /// Send this instruction expecting it to succeed, returning compute units consumed.
    /// If CU tracking is enabled, writes to .cus/results.txt
    pub fn send_expect_success(self, ctx: &mut TestContext) -> u64 {
        let signer_refs: Vec<&Keypair> = self.signers.iter().collect();
        let cus = ctx
            .send_transaction(self.instruction, &signer_refs)
            .expect("Transaction should succeed");

        if let Some(tracker) = &mut ctx.cu_tracker {
            tracker.write(self.name, cus);
        }
        cus
    }

    /// Send this instruction expecting it to fail, returning the error
    pub fn send_expect_error(self, ctx: &mut TestContext) -> TransactionError {
        let signer_refs: Vec<&Keypair> = self.signers.iter().collect();
        ctx.send_transaction_expect_error(self.instruction, &signer_refs)
    }

    /// Remove a signer and mark the corresponding account as non-signer
    /// The account_index is the index in instruction.accounts
    /// The signer_vec_index is the index in the signers Vec to remove
    pub fn without_signer(mut self, account_index: usize, signer_vec_index: usize) -> Self {
        // Mark the account as not a signer in the instruction
        if account_index < self.instruction.accounts.len() {
            self.instruction.accounts[account_index].is_signer = false;
        }
        // Remove from signers vec
        if signer_vec_index < self.signers.len() {
            self.signers.remove(signer_vec_index);
        }
        self
    }

    /// Replace an account address at the given instruction account index
    pub fn with_account_at(mut self, account_index: usize, address: Address) -> Self {
        if account_index < self.instruction.accounts.len() {
            let meta = &self.instruction.accounts[account_index];
            self.instruction.accounts[account_index] = AccountMeta {
                pubkey: address,
                is_signer: meta.is_signer,
                is_writable: meta.is_writable,
            };
        }
        self
    }

    /// Make an account at the given index read-only (to test writable requirements)
    pub fn with_readonly_at(mut self, account_index: usize) -> Self {
        if account_index < self.instruction.accounts.len() {
            self.instruction.accounts[account_index].is_writable = false;
        }
        self
    }

    /// Truncate or extend instruction data to a specific length
    pub fn with_data_len(mut self, len: usize) -> Self {
        self.instruction.data.resize(len, 0);
        self
    }

    /// Replace instruction data with new data
    pub fn with_data(mut self, data: Vec<u8>) -> Self {
        self.instruction.data = data;
        self
    }

    /// Modify a specific byte in the instruction data
    pub fn with_data_byte_at(mut self, index: usize, value: u8) -> Self {
        if index < self.instruction.data.len() {
            self.instruction.data[index] = value;
        }
        self
    }
}

/// Trait for instruction test fixtures
///
/// Implement this trait for each instruction to enable generic error testing.
/// The trait provides metadata about the instruction's requirements, allowing
/// generic test helpers to verify error conditions.
pub trait InstructionTestFixture {
    /// Instruction name for CU tracking
    const INSTRUCTION_NAME: &'static str;

    /// Build a valid instruction with all correct accounts, data, and signers
    fn build_valid(ctx: &mut TestContext) -> TestInstruction;

    /// Indices of accounts that must be signers (in instruction.accounts order)
    fn required_signers() -> &'static [usize];

    /// Indices of accounts that must be writable (in instruction.accounts order)
    fn required_writable() -> &'static [usize];

    /// Index of the system program account (if applicable)
    fn system_program_index() -> Option<usize> {
        None
    }

    /// Index of the current program account (if applicable)
    fn current_program_index() -> Option<usize> {
        None
    }

    /// Expected instruction data length
    fn data_len() -> usize;
}
