# pinocchio-counter

Native Solana program template using [Pinocchio](https://github.com/anza-xyz/pinocchio) with Codama-generated clients and LiteSVM integration tests.

## Getting Started

```shell
npx -y create-solana-dapp@latest -t solana-foundation/templates/pinocchio/pinocchio-counter
```

### Prerequisites

- [Rust](https://rustup.rs/)
- [Solana CLI](https://solana.com/docs/intro/installation)
- [just](https://github.com/casey/just) (command runner)
- Node.js 20+

### Build & Test

```shell
pnpm install
just build          # Build program and generate clients
just test           # Run all tests
```

## What's Included

- **Native Solana program** using Pinocchio for minimal compute overhead
- **Counter PDA** with authority-based access control
- **Event emission** via CPI (Anchor-compatible format)
- **Codama-generated clients** for both TypeScript and Rust
- **LiteSVM integration tests** with comprehensive coverage

## Stack

| Layer          | Technology                      |
| -------------- | ------------------------------- |
| Program        | Pinocchio (native Rust)         |
| IDL Generation | Codama (from Rust attributes)   |
| Client (TS)    | `@solana/kit`, Codama-generated |
| Client (Rust)  | Codama-generated                |
| Testing        | LiteSVM, Rust integration tests |

## Project Structure

```
├── program/                      # Solana program (Rust)
│   └── src/
│       ├── instructions/         # Instruction handlers
│       │   ├── create_counter/   # CreateCounter instruction
│       │   └── increment/        # Increment instruction
│       ├── state/                # Account state definitions
│       ├── traits/               # Serialization & PDA traits
│       ├── events/               # Event definitions
│       └── utils/                # Validation utilities
├── clients/
│   ├── typescript/               # Generated TypeScript client
│   └── rust/                     # Generated Rust client
├── tests/
│   └── integration-tests/        # LiteSVM integration tests
├── idl/                          # Generated IDL
├── scripts/                      # Codama generation scripts
└── justfile                      # Build commands
```

## Program Instructions

### CreateCounter

Creates a new counter PDA with the specified authority.

**Accounts:**

- `payer` - Transaction fee payer (signer, writable)
- `authority` - Counter authority (signer)
- `counter` - Counter PDA (writable)
- `system_program` - System Program
- `event_authority` - Event authority PDA
- `program` - This program

### Increment

Increments the counter value by 1. Only the authority can increment.

**Accounts:**

- `authority` - Counter authority (signer)
- `counter` - Counter PDA (writable)
- `event_authority` - Event authority PDA
- `program` - This program

## Available Commands

```shell
just install            # Install dependencies
just build              # Build program and generate clients
just unit-test          # Run unit tests only
just integration-test   # Run integration tests only
just fmt                # Format and lint code
just check              # Check formatting and lints
just generate-idl       # Generate IDL from Rust code
just generate-clients   # Regenerate clients from IDL
```

## Why Pinocchio?

[Pinocchio](https://github.com/anza-xyz/pinocchio) is a zero-dependency framework for writing Solana programs with minimal compute unit overhead. Compared to Anchor:

- **Lower CU usage** - No framework overhead, direct syscalls
- **Smaller binary size** - Minimal dependencies
- **Full control** - Manual serialization and validation
- **Learning tool** - Understand Solana at a lower level

This template demonstrates Pinocchio patterns while maintaining developer ergonomics through:

- Trait-based serialization (`AccountSerialize`, `AccountDeserialize`)
- PDA utilities (`PdaSeeds` trait)
- Validation helpers (`verify_signer`, `verify_writable`, etc.)
- Codama for type-safe client generation

## Learn More

- [Pinocchio](https://github.com/anza-xyz/pinocchio) - Zero-dependency Solana program framework
- [Codama](https://github.com/codama-idl/codama) - IDL and client generation
- [LiteSVM](https://github.com/LiteSVM/litesvm) - Fast Solana VM for testing
- [Solana Docs](https://solana.com/docs) - Core concepts and guides
