//! Byte layouts shared by both programs(Anchor and Pinocchio), the client and the tests.
#![no_std]

use solana_address::Address;

// Placeholders. `just sync-ids` rewrites these.
pub const ANCHOR_PROGRAM_ID: Address =
    Address::from_str_const("Bm8G39aXoNKtWNAr35bcPJKctwTsqTfAgXCDDQNPpe2Q");
pub const PINOCCHIO_PROGRAM_ID: Address =
    Address::from_str_const("8oWdpStiJVPVASHi3TJaRcaVWuHf2iYUtpryi7PbufjF");

pub const PROOF_LEN: usize = 256;
/// Public inputs are little-endian BN254 field elements.
pub const FIELD_LEN: usize = 32;

pub mod seeds {
    pub const CONFIG: &[u8] = b"config";
    /// Followed by the commitment.
    pub const CODE: &[u8] = b"code";
}

/// Anchor's `sha256("global:<name>")[..8]`, reused by the Pinocchio program.
pub mod ix {
    pub const INITIALIZE: [u8; 8] = [175, 175, 109, 31, 13, 152, 155, 237];
    pub const REGISTER: [u8; 8] = [211, 124, 67, 15, 211, 194, 178, 240];
    pub const CLAIM: [u8; 8] = [62, 198, 214, 193, 213, 159, 108, 210];
}

/// Matches Anchor's `#[error_code]` numbering, which starts at 6000.
pub mod error {
    pub const INVALID_PUBLIC_INPUTS: u32 = 6000;
    pub const SIGNER_MISMATCH: u32 = 6001;
    pub const ALREADY_CLAIMED: u32 = 6002;
    pub const INVALID_PROOF: u32 = 6003;
}

/// Anchor account layouts: `sha256("account:<Name>")[..8]`, then the fields.
pub mod state {
    pub const CONFIG_DISCRIMINATOR: [u8; 8] = [155, 12, 170, 224, 30, 250, 204, 130];
    pub const CODE_DISCRIMINATOR: [u8; 8] = [205, 134, 78, 99, 65, 245, 91, 121];

    /// discriminator | admin | bump
    pub const CONFIG_LEN: usize = 8 + 32 + 1;
    /// discriminator | claimed_by (zeroed until claimed) | bump
    pub const CODE_LEN: usize = 8 + 32 + 1;
}

/// In the circuit's declaration order.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct PublicInputs {
    pub commitment: [u8; FIELD_LEN],
    pub signer_hi: [u8; FIELD_LEN],
    pub signer_lo: [u8; FIELD_LEN],
}

impl PublicInputs {
    pub const COUNT: usize = 3;
    pub const LEN: usize = Self::COUNT * FIELD_LEN;

    pub fn new(commitment: [u8; FIELD_LEN], signer: &Address) -> Self {
        let (hi, lo) = split_address(signer);
        Self {
            commitment,
            signer_hi: hi,
            signer_lo: lo,
        }
    }

    pub fn from_bytes(bytes: &[u8]) -> Option<Self> {
        if bytes.len() != Self::LEN {
            return None;
        }
        let slot = |i: usize| -> [u8; FIELD_LEN] {
            let mut out = [0; FIELD_LEN];
            out.copy_from_slice(&bytes[i * FIELD_LEN..(i + 1) * FIELD_LEN]);
            out
        };
        Some(Self {
            commitment: slot(0),
            signer_hi: slot(1),
            signer_lo: slot(2),
        })
    }

    pub fn to_bytes(&self) -> [u8; Self::LEN] {
        let mut out = [0; Self::LEN];
        out[..FIELD_LEN].copy_from_slice(&self.commitment);
        out[FIELD_LEN..2 * FIELD_LEN].copy_from_slice(&self.signer_hi);
        out[2 * FIELD_LEN..].copy_from_slice(&self.signer_lo);
        out
    }

    pub fn signer(&self) -> Option<Address> {
        if self.signer_hi[16..] != [0; 16] || self.signer_lo[16..] != [0; 16] {
            return None;
        }
        let mut bytes = [0; 32];
        bytes[..16].copy_from_slice(&self.signer_hi[..16]);
        bytes[16..].copy_from_slice(&self.signer_lo[..16]);
        Some(Address::new_from_array(bytes))
    }
}

/// An address is 256 bits and a field element under 254, so it goes in as two
/// 128-bit halves.
pub fn split_address(address: &Address) -> ([u8; FIELD_LEN], [u8; FIELD_LEN]) {
    let bytes = address.to_bytes();
    let mut hi = [0; FIELD_LEN];
    let mut lo = [0; FIELD_LEN];
    hi[..16].copy_from_slice(&bytes[..16]);
    lo[..16].copy_from_slice(&bytes[16..]);
    (hi, lo)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn public_inputs_round_trip() {
        let signer = Address::new_from_array([7; 32]);
        let inputs = PublicInputs::new([9; 32], &signer);
        let parsed = PublicInputs::from_bytes(&inputs.to_bytes()).unwrap();
        assert_eq!(parsed, inputs);
        assert_eq!(parsed.signer(), Some(signer));
    }

    #[test]
    fn signer_rejects_oversized_halves() {
        let mut inputs = PublicInputs::new([0; 32], &Address::new_from_array([1; 32]));
        inputs.signer_lo[31] = 1;
        assert_eq!(inputs.signer(), None);
    }
}
