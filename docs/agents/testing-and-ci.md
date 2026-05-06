# Testing And CI

Use the smallest validation that proves the change, then run broader checks when touching shared tooling or generated metadata.

## Local Commands

- `pnpm generate` updates generated template metadata.
- `pnpm lint` checks template metadata, duplicate names, `og-image.png`, and formatting.
- `pnpm format` applies Prettier.
- `pnpm validate` checks generated metadata shape.

## Template Checks

For a changed template, prefer validating from a fresh install path when practical. CI uses `create-solana-dapp` to instantiate templates, install dependencies, and run `npm run ci`.

Non-community templates tested by CI need a `ci` script. If a community template has no `ci` script, make sure its README setup commands still match its actual package scripts.

## CI Files

- `.github/workflows/validate-templates.yml` checks metadata generation and validation.
- `.github/workflows/test-templates.yml` runs template tests across package managers and non-community template paths.
- `.github/actions/create-solana-dapp/action.yml` contains the shared template creation and install flow.
- `.github/actions/setup/action.yml` controls Node, package manager, Solana, Anchor, Rust, and other tool setup.

## Interpreting Failures

- Metadata failures usually mean `pnpm generate` was not run or a template `package.json` is missing fields.
- Image failures usually mean `og-image.png` is missing, too large, or not `1200x630`.
- `npm run ci` failures usually mean a tested template is missing a `ci` script or its CI script no longer matches the template.
- Package manager failures can come from dependency engine constraints, lockfile differences, or template package scripts.
- Do not assume an unrelated CI failure is caused by the current PR without reproducing or isolating it.
