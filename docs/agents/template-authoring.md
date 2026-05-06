# Template Authoring

Use this when adding or changing a template.

## Required Files

Each template directory scanned by `repokit.groups` must include:

- `package.json`
- `og-image.png`

Community templates belong under `community/<template-name>/` unless a maintainer asks for another root.

## Package Metadata

Template `package.json` files should include these listing fields:

- `name`
- `displayName`
- `description`
- `usecase`
- `keywords`

Follow existing templates for conventions. Keep descriptions concise because they are shown in listings.

The generator and linter currently enforce `name`, `description`, and non-empty `keywords`. The contributor guide also expects `displayName` and `usecase` for complete template listings.

## Configuration And Secrets

- Do not commit `.env` files, private keys, seed phrases, API tokens, or personal wallet addresses.
- Use `.env.example` for required configuration.
- Use placeholders for sensitive values; safe defaults such as `SOLANA_CLUSTER=devnet` are okay.
- Avoid dependencies or setup scripts that require hidden local state.

## Generated Metadata

Run `pnpm generate` after adding, removing, renaming, or changing metadata for a template.

Do not manually patch `templates.json`, `TEMPLATES.md`, or `.github/workflows/templates.json` unless the generator itself is being changed and you are checking expected output.

## Agent And MCP Templates

Templates that expose agent, MCP, wallet, signing, or transaction automation behavior need clear README notes for:

- What the agent can access.
- What authentication is required.
- Which actions require explicit user approval.
- Whether the template can sign messages, submit transactions, trade, or move funds.
- How users revoke access.

Avoid unsafe defaults. Wallet or transaction automation should not run without a deliberate user action.
