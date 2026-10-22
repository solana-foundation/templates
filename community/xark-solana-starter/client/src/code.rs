use std::{fmt, fs::OpenOptions, io::Write, path::Path, str::FromStr};

use anyhow::{Context, Result};
use ark_bn254::Fr;
use ark_ff::{BigInteger, PrimeField};

use crate::poseidon2;

// Must match the circuit.
const COMMIT_DOMAIN: u64 = 1;

#[derive(Clone, Copy, PartialEq, Eq)]
pub struct Code(Fr);

impl Code {
    pub fn random() -> Result<Self> {
        let mut bytes = [0u8; 32];
        getrandom::fill(&mut bytes).map_err(|e| anyhow::anyhow!("rng: {e}"))?;
        Ok(Self(Fr::from_le_bytes_mod_order(&bytes)))
    }

    pub fn commitment(&self) -> [u8; 32] {
        to_le_bytes(poseidon2::hash2(self.0, Fr::from(COMMIT_DOMAIN)))
    }

    pub fn to_decimal(&self) -> String {
        self.0.to_string()
    }

    /// Creates `path` readable by the owner only; fails if it already exists.
    pub fn save(&self, path: &Path) -> Result<()> {
        let mut options = OpenOptions::new();
        options.write(true).create_new(true);
        #[cfg(unix)]
        std::os::unix::fs::OpenOptionsExt::mode(&mut options, 0o600);
        let mut file = options
            .open(path)
            .with_context(|| format!("creating {}", path.display()))?;
        writeln!(file, "{}", self.to_decimal())
            .with_context(|| format!("writing {}", path.display()))
    }

    pub fn load(path: &Path) -> Result<Self> {
        let text =
            std::fs::read_to_string(path).with_context(|| format!("reading {}", path.display()))?;
        text.trim().parse()
    }
}

impl FromStr for Code {
    type Err = anyhow::Error;

    fn from_str(s: &str) -> Result<Self> {
        Fr::from_str(s)
            .map(Self)
            .map_err(|_| anyhow::anyhow!("not a decimal field element: {s}"))
    }
}

// Keeps the secret out of logs.
impl fmt::Debug for Code {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str("Code(<secret>)")
    }
}

pub fn field_to_decimal(bytes: &[u8; 32]) -> String {
    Fr::from_le_bytes_mod_order(bytes).to_string()
}

fn to_le_bytes(f: Fr) -> [u8; 32] {
    let mut out = [0u8; 32];
    out.copy_from_slice(&f.into_bigint().to_bytes_le());
    out
}
