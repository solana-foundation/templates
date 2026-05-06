# Agent Instructions

This file gives AI coding agents the minimum context needed to work safely in this repository. It applies to the whole repo.

## Start Here

- Read `README.md`, `CONTRIBUTING.md`, and `COMMUNITY_TEMPLATE_GUIDE.md` before changing template behavior.
- Use the focused notes in `docs/agents/` for repo map, template metadata, validation, and review checks.
- Keep changes small and local to the affected template or script.
- Do not overwrite user work or generated files by hand.

## Common Commands

- `pnpm install` installs root tooling.
- `pnpm generate` regenerates template metadata and docs.
- `pnpm lint` validates template structure, metadata, Open Graph images, and formatting.
- `pnpm format` formats repo files.

## Editing Rules

- Read `docs/agents/repository-map.md` before assuming current directory layout.
- Do not manually edit generated files unless you are updating the generator and intentionally checking output.
- If you change a template `package.json`, add/remove a template, or change metadata, run `pnpm generate`.
- Every template directory listed in root `package.json` `repokit.groups` must contain a `package.json` and `og-image.png`.
- Never add secrets, private keys, personal wallet data, local RPC credentials, or real API tokens.
- Keep `.env` files out of templates. Use `.env.example` when configuration is needed, with placeholders for sensitive values and safe defaults for non-sensitive values.
- For agent, MCP, wallet, or transaction automation templates, document authentication, permissions, and user approval boundaries clearly.

## More Detail

- `docs/agents/repository-map.md`
- `docs/agents/template-authoring.md`
- `docs/agents/template-metadata.md`
- `docs/agents/testing-and-ci.md`
- `docs/agents/review-checklist.md`
- `docs/agents/known-gotchas.md`
