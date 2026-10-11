#![cfg_attr(xark, no_std)]
use xark::prelude::*;
use xark_poseidon2::hash2;

// Must match `COMMIT_DOMAIN` in `client/src/code.rs`.
const COMMIT_DOMAIN: u64 = 1;

/// Public input order must match `interface::PublicInputs`.
#[circuit]
pub fn secret_code(
    secret: Private<Field>,
    commitment: Public<Field>,
    signer_hi: Public<Field>,
    signer_lo: Public<Field>,
) {
    require_eq(hash2(secret, Field::from(COMMIT_DOMAIN)), commitment);
    // Public inputs must appear in a constraint to be bound to the proof.
    require_fits_16_bytes(signer_hi);
    require_fits_16_bytes(signer_lo);
}

fn require_fits_16_bytes(x: Field) {
    require_eq(Field::from_bits::<128>(x.to_bits::<128>()), x);
}

#[cfg(test)]
mod tests {
    use super::*;

    // Poseidon2(1, COMMIT_DOMAIN)
    const COMMITMENT_OF_1: &str =
        "17847258390462923071212518425927834238796435801505415407318169918090986946609";

    fn inputs(secret: &str, signer_lo: &str) -> SecretCodeInputs {
        SecretCodeInputs {
            secret: secret.into(),
            commitment: COMMITMENT_OF_1.into(),
            signer_hi: "0".into(),
            signer_lo: signer_lo.into(),
        }
    }

    #[test]
    fn accepts_valid() {
        let c = xark_prover::circuit("secret_code");
        c.check(inputs("1", "0")).unwrap();
    }

    #[test]
    fn rejects_wrong_secret() {
        let c = xark_prover::circuit("secret_code");
        assert!(c.check(inputs("2", "0")).is_err());
    }

    #[test]
    fn rejects_oversized_signer_half() {
        let c = xark_prover::circuit("secret_code");
        // 2^128
        assert!(c
            .check(inputs("1", "340282366920938463463374607431768211456"))
            .is_err());
    }
}
