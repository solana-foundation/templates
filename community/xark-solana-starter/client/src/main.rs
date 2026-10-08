use std::path::PathBuf;

use anyhow::{bail, Context, Result};
use clap::{Parser, Subcommand, ValueEnum};
use client::{
    code::Code,
    interface::{self, state, PublicInputs},
    ix,
    prover::{Prover, XarkCli},
};
use solana_address::Address;
use solana_instruction::Instruction;
use solana_keypair::{read_keypair_file, Keypair};
use solana_rpc_client::rpc_client::RpcClient;
use solana_signer::Signer;
use solana_transaction::Transaction;

#[derive(Parser)]
#[command(about = "Secret-code claims verified by an xark ZK proof on Solana")]
struct Cli {
    /// Which program build to talk to.
    #[arg(long, value_enum, default_value_t = ProgramKind::Anchor, global = true)]
    program: ProgramKind,
    /// RPC endpoint.
    #[arg(long, default_value = "http://127.0.0.1:8899", global = true)]
    url: String,
    /// Wallet that signs (admin for initialize/register, claimant for claim).
    #[arg(long, global = true)]
    keypair: Option<PathBuf>,
    /// Circuit crate, built and set up by `just build`.
    #[arg(long, default_value = "circuit", global = true)]
    circuit: PathBuf,
    #[command(subcommand)]
    command: Command,
}

#[derive(Clone, Copy, ValueEnum)]
enum ProgramKind {
    Anchor,
    Pinocchio,
}

impl ProgramKind {
    fn id(self) -> Address {
        match self {
            Self::Anchor => interface::ANCHOR_PROGRAM_ID,
            Self::Pinocchio => interface::PINOCCHIO_PROGRAM_ID,
        }
    }
}

#[derive(Subcommand)]
enum Command {
    /// Create a random secret code and print its commitment.
    NewCode {
        #[arg(long)]
        out: PathBuf,
    },
    /// Create the config account; the signer becomes the admin.
    Initialize,
    /// Admin: register a code's commitment so it can be claimed.
    Register {
        #[arg(long)]
        code: PathBuf,
    },
    /// Prove you know the code and claim it with your wallet.
    Claim {
        #[arg(long)]
        code: PathBuf,
    },
    /// Show whether a code is registered and who claimed it.
    Status {
        #[arg(long)]
        code: PathBuf,
    },
}

fn main() -> Result<()> {
    let cli = Cli::parse();
    let program_id = cli.program.id();

    if let Command::NewCode { out } = &cli.command {
        let code = Code::random()?;
        code.save(out)?;
        println!("Wrote secret code to {} (keep it private)", out.display());
        println!("commitment: {}", hex::encode(code.commitment()));
        return Ok(());
    }

    let rpc = RpcClient::new(cli.url.clone());
    match &cli.command {
        Command::NewCode { .. } => unreachable!(),
        Command::Initialize => {
            let signer = load_keypair(&cli)?;
            send(
                &rpc,
                &signer,
                &[ix::initialize(&program_id, &signer.pubkey())],
            )?;
            println!("Initialized. Admin: {}", signer.pubkey());
        }
        Command::Register { code } => {
            let signer = load_keypair(&cli)?;
            let commitment = Code::load(code)?.commitment();
            send(
                &rpc,
                &signer,
                &[ix::register(&program_id, &signer.pubkey(), &commitment)],
            )?;
            println!("Registered commitment {}", hex::encode(commitment));
        }
        Command::Claim { code } => {
            let signer = load_keypair(&cli)?;
            let code = Code::load(code)?;
            let public = PublicInputs::new(code.commitment(), &signer.pubkey());
            println!("Proving (secret stays on this machine)...");
            let proof = XarkCli::new(&cli.circuit).prove(&code, &public)?;
            send(
                &rpc,
                &signer,
                &[ix::claim(&program_id, &signer.pubkey(), &proof, &public)],
            )?;
            println!("Claimed by {}", signer.pubkey());
        }
        Command::Status { code } => {
            let commitment = Code::load(code)?.commitment();
            let address = ix::code_address(&program_id, &commitment);
            let account = rpc
                .get_account_with_commitment(&address, rpc.commitment())
                .context("fetching code account")?
                .value;
            match account {
                None => println!("Not registered (no account at {address})"),
                Some(account) if account.data.len() != state::CODE_LEN => {
                    bail!("unexpected code account size {}", account.data.len())
                }
                Some(account) => {
                    let claimed_by = Address::try_from(&account.data[8..40]).expect("32 bytes");
                    if claimed_by == Address::default() {
                        println!("Registered, unclaimed ({address})");
                    } else {
                        println!("Claimed by {claimed_by}");
                    }
                }
            }
        }
    }
    Ok(())
}

fn load_keypair(cli: &Cli) -> Result<Keypair> {
    let path = match &cli.keypair {
        Some(p) => p.clone(),
        None => PathBuf::from(std::env::var("HOME").context("HOME not set")?)
            .join(".config/solana/id.json"),
    };
    read_keypair_file(&path).map_err(|e| anyhow::anyhow!("reading {}: {e}", path.display()))
}

fn send(rpc: &RpcClient, signer: &Keypair, ixs: &[Instruction]) -> Result<()> {
    let blockhash = rpc.get_latest_blockhash()?;
    let tx = Transaction::new_signed_with_payer(ixs, Some(&signer.pubkey()), &[signer], blockhash);
    let sig = rpc
        .send_and_confirm_transaction(&tx)
        .context("transaction failed")?;
    println!("signature: {sig}");
    Ok(())
}
