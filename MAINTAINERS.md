# Template Maintainers

This document is aimed at developers that maintain templates in this repository.

The templates for [create-solana-dapp](https://github.com/solana-developers/create-solana-dapp) (eg, "the cli") are
currently all
based on JavaScript/TypeScript.

This means that they expect to be installed by running a Node package manager install command.

The cli supports creating templates with `bun`/`npm`/`pnpm`/`yarn`, in this repo though the default package manager is
`pnpm`.

We depend on tests to ensure that templates will work well across the different package managers.

## Template groups

The repository is divided in groups:

```shell
# Community templates
community
# Modern templates (eg gill/@solana/kit)
templates
# Mobile templates
mobile
# Solana Web3.js templates (legacy)
web3js
```

These groups are configured in the `repokit.groups` array in `package.json`.

The [CODEOWNERS](./CODEOWNERS) file is used by GitHub to assign owners for review on Pull Requests.

## Template naming

> Naming is one of the two hard things in computer science. Next to invalidating cache and off-by-one errors.

We aim to keep the following structure:

```shell
[group]/[sdk]-[name]-[variant]
```

- Group
  - One of `community`/`templates`/`mobile`/`web3js` as per `repokit.groups` in `package.json`.
- SDK
  - This specifies which primary SDK is used. One of `gill` or `web3js`.
- Name
  - This is the name of the template. Either the framework (`next`/`expo`/`react-vite`) or the name of your
    organization (`jito`/`metaplex`/ etc).
- Variant
  - The variant of your template. Something that makes it clear what this is about.

Take a look at the `templates`, `web3js`, or `mobile` templates for inspiration.

Examples are:

```shell
# Template by Jito for doing airdrops
community/gill-jito-airdrops
# Template by Metaplex for MPL Core Collections
community/web3js-metaplex-core
# Template by Metaplex for MPL Core Collections with MPL 404 (variant of the above)
community/web3js-metaplex-core-404
```

If in doubt, please reach out to the repo maintainer and discuss it!

## Adding a new template

- Decide on the group. Pick `community` unless instructed otherwise.
- Decide on the repository `group` and `name`. Make sure it follows the convention.
- Create the new directory and add your code.
- Run `pnpm repokit lint` to make sure the template metadata is valid.
- TBD: any more steps...

## Repokit

Repokit is a tool to automate management of template repos to maintain consitency.

TBD: More docs!
