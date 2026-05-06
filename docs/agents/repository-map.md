# Repository Map

This repository stores templates consumed by `create-solana-dapp` and surfaced at `templates.solana.com`.

## Root Files

- `README.md` explains user-facing template usage and the high-level contribution flow.
- `CONTRIBUTING.md` explains the general GitHub workflow and local commands.
- `COMMUNITY_TEMPLATE_GUIDE.md` is the main guide for new community templates.
- `package.json` defines root scripts and the `repokit.groups` template groups scanned by the generator and linter.
- `templates.json` is generated metadata consumed by downstream tooling.
- `TEMPLATES.md` is generated human-readable template metadata.

## Template Groups

- `kit/` contains primary templates using modern Solana libraries.
- `mobile/` contains React Native and Expo templates.
- `web3js/` contains legacy `@solana/web3.js` templates.
- `pinocchio/` contains Pinocchio program templates.
- `community/` contains community-maintained templates.

## Tooling

- `scripts/generate.ts` scans template groups and writes `templates.json`, `TEMPLATES.md`, and `.github/workflows/templates.json`.
- `scripts/lint.ts` validates template package metadata, duplicate names, and `og-image.png` requirements.
- `scripts/validate.ts` validates generated metadata shape.
- `scripts/create-image.ts` creates template `og-image.png` assets.
- `scripts/clean.ts` removes `templates.json` and `TEMPLATES.md`.

## CI

- `.github/workflows/validate-templates.yml` validates generated metadata.
- `.github/workflows/test-templates.yml` runs template creation and install checks across package managers.
- `.github/actions/create-solana-dapp/action.yml` defines the per-template create/install/CI flow.
- `.github/actions/setup/action.yml` installs runtime tooling used by workflows.
