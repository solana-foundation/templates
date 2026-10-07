//! xark's Rust proving API is test-only (fixed randomness), so this shells out
//! to the `xark` CLI.

use std::{
    fs,
    path::{Path, PathBuf},
    process::Command,
};

use anyhow::{bail, ensure, Context, Result};
use interface::{PublicInputs, PROOF_LEN};

use crate::code::{field_to_decimal, Code};

pub trait Prover {
    fn prove(&self, code: &Code, public: &PublicInputs) -> Result<[u8; PROOF_LEN]>;
}

/// Needs `just build` to have set up the circuit's keys.
pub struct XarkCli {
    pub circuit_dir: PathBuf,
}

impl XarkCli {
    pub fn new(circuit_dir: impl Into<PathBuf>) -> Self {
        Self {
            circuit_dir: circuit_dir.into(),
        }
    }
}

impl Prover for XarkCli {
    fn prove(&self, code: &Code, public: &PublicInputs) -> Result<[u8; PROOF_LEN]> {
        // Inputs go in a file, not argv, so the secret never shows up in `ps`.
        let work = tempfile::tempdir().context("creating temp dir")?;
        let inputs_path = work.path().join("inputs.json");
        let inputs = serde_json::json!({
            "secret": code.to_decimal(),
            "commitment": field_to_decimal(&public.commitment),
            "signer_hi": field_to_decimal(&public.signer_hi),
            "signer_lo": field_to_decimal(&public.signer_lo),
        });
        fs::write(&inputs_path, inputs.to_string()).context("writing inputs")?;

        let output = Command::new("xark")
            .arg("prove")
            .arg(&self.circuit_dir)
            .arg("--inputs")
            .arg(&inputs_path)
            .arg("--out")
            .arg(work.path().join("proof.bin"))
            .output()
            .context("running `xark prove` (is xark installed? see README)")?;
        if !output.status.success() {
            bail!(
                "xark prove failed:\n{}{}",
                String::from_utf8_lossy(&output.stdout),
                String::from_utf8_lossy(&output.stderr)
            );
        }

        let calldata = read_calldata(work.path())?;
        ensure!(
            calldata.len() == PROOF_LEN + PublicInputs::LEN,
            "unexpected calldata length {} (circuit and `interface` out of sync?)",
            calldata.len()
        );
        ensure!(
            calldata[PROOF_LEN..] == public.to_bytes(),
            "xark's public inputs differ from `interface::PublicInputs`"
        );
        let mut proof = [0u8; PROOF_LEN];
        proof.copy_from_slice(&calldata[..PROOF_LEN]);
        Ok(proof)
    }
}

/// `calldata.hex` in the `.proof.json` bundle is the proof followed by the
/// public inputs, in the on-chain format.
fn read_calldata(dir: &Path) -> Result<Vec<u8>> {
    let bundle = fs::read_dir(dir)?
        .filter_map(|e| e.ok().map(|e| e.path()))
        .find(|p| p.to_string_lossy().ends_with(".proof.json"))
        .context("xark prove wrote no .proof.json bundle")?;
    let json: serde_json::Value = serde_json::from_slice(&fs::read(&bundle)?)?;
    let hex_str = json["calldata"]["hex"]
        .as_str()
        .context("bundle has no calldata.hex")?;
    Ok(hex::decode(hex_str.trim_start_matches("0x"))?)
}
