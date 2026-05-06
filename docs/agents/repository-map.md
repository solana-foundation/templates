# Repository Map

This repository is the template source consumed directly by `create-solana-dapp`. The public gallery at https://solana.com/developers/templates is a browsing surface, not a separate template source.

## Root Files

- `README.md` explains user-facing template usage and the high-level contribution flow.
- `CONTRIBUTING.md` explains the general GitHub workflow and local commands.
- `COMMUNITY_TEMPLATE_GUIDE.md` is the main guide for new community templates.
- `package.json` defines root scripts and the `repokit.groups` template groups scanned by the generator and linter.
- `templates.json` is generated metadata consumed by downstream tooling.
- `TEMPLATES.md` is generated human-readable template metadata.

## Template Roots

Template roots are configured in root `package.json` under `repokit.groups`. Use that file as the source of truth instead of hard-coding group names in docs or scripts.

Most new externally maintained templates belong under `community/` unless a maintainer asks for a different root.

## Reference Flow

- Use root `package.json` `repokit.groups` to find the current template roots.
- Use `TEMPLATES.md` for the generated catalog of current templates.
- Use nearby templates in the same root as examples for scripts, README structure, metadata, and assets.
- Use `COMMUNITY_TEMPLATE_GUIDE.md` for community submission requirements.

## Agent Docs

- `repository-map.md` explains where repo-level information lives.
- `template-authoring.md` explains template contents and safety expectations.
- `template-metadata.md` explains package metadata and generated outputs.
- `testing-and-ci.md` explains local validation and CI behavior.
- `review-checklist.md` gives review criteria.
- `known-gotchas.md` captures edge cases that do not belong in the main guides.

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
