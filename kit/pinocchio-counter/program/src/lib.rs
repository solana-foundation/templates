//! # Pinocchio Counter
//!
//! A counter Solana program demonstrating Pinocchio patterns.
//!
//! ## Features
//! - Counter PDA per authority
//! - Increment counter functionality
//! - Event emission via CPI
//!
//! ## Architecture
//! Built with Pinocchio (no_std). Clients auto-generated via Codama.

#![no_std]

extern crate alloc;

use pinocchio::address::declare_id;

pub mod errors;
pub mod traits;
pub mod utils;

pub mod events;
pub mod instructions;
pub mod state;

#[cfg(not(feature = "no-entrypoint"))]
pub mod entrypoint;

declare_id!("PinocchioTemp1ate11111111111111111111111111");
