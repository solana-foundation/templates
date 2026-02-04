# Install dependencies
install:
    pnpm install

# Generate IDL from Rust code using Codama
generate-idl:
    @echo "Generating IDL..."
    pnpm run generate-idl

# Generate clients from IDL using Codama
generate-clients: generate-idl
    @echo "Generating clients..."
    pnpm run generate-clients

# Build the program
build: generate-idl generate-clients
    cd program && cargo-build-sbf

# Format / lint code
fmt:
    cargo fmt -p pinocchio-counter -p tests-pinocchio-counter
    @cd program && cargo clippy --all-targets -- -D warnings
    @cd tests && cargo clippy --all-targets -- -D warnings
    pnpm format
    pnpm lint:fix

check:
    cd program && cargo check --features idl
    pnpm run format:check
    pnpm lint

# Run unit tests
unit-test:
    cargo test -p pinocchio-counter

# Run integration tests
integration-test *args:
    cargo test -p tests-pinocchio-counter "$@"

# Run all tests
test *args: build unit-test (integration-test args)

# Sync program ID across Rust and TypeScript files
sync-program-id program_id:
    @echo "Syncing program ID: {{program_id}}"
    @sed -i '' 's/declare_id!("[^"]*")/declare_id!("{{program_id}}")/' program/src/lib.rs
    @echo "Updated program/src/lib.rs"
    @sed -i '' "s/const PINOCCHIO_COUNTER_PROGRAM_ID = '[^']*'/const PINOCCHIO_COUNTER_PROGRAM_ID = '{{program_id}}'/" scripts/lib/updates/set-instruction-account-default-values.ts
    @echo "Updated scripts/lib/updates/set-instruction-account-default-values.ts"
    @echo "Remember to run 'just generate-clients' to update TypeScript/Rust clients"
