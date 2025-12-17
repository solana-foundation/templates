# Solana Templates

Official templates for [create-solana-dapp](https://github.com/solana-developers/create-solana-dapp).

Browse all templates at https://templates.solana.com

## Usage

Create a new Solana project using the interactive CLI:

```sh
# npm
npm create solana-dapp@latest

# pnpm
pnpm create solana-dapp@latest

# yarn
yarn create solana-dapp
```

Or specify a template directly:

```sh
npm create solana-dapp@latest -t gill-next-tailwind-basic
```

## Template Categories

- **Gill** - Modern templates using @solana/kit
- **Web3.js** - Templates using @solana/web3.js (legacy)
- **Mobile** - React Native templates for Solana Mobile
- **Community** - Templates maintained by the community

See [TEMPLATES.md](TEMPLATES.md) for the complete list.

## Contributing

We welcome contributions!

**Adding a new community template:**

See the [Community Template Contributor Guide](COMMUNITY_TEMPLATE_GUIDE.md) for comprehensive instructions on contributing templates to the community/ directory.

**Adding a new template:**

1. Create your template in the appropriate directory (gill/, web3js/, mobile/, or community/)
2. Add required metadata to package.json (see existing templates for examples)
3. Include displayName, usecase, and og-image.png
4. Run `pnpm generate` to update templates.json
5. Open a PR with your changes

**Improving existing templates:**

- Report issues or suggest improvements
- Submit PRs for bug fixes or enhancements
- Update documentation

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Development

```sh
pnpm install
pnpm generate    # Generate templates.json and TEMPLATES.md
pnpm lint        # Validate templates
pnpm format      # Format code
```

## Contributors

<!-- automd:contributors github="solana-foundation/templates" license="MIT" -->

Published under the [MIT](https://github.com/solana-foundation/templates/blob/main/LICENSE) license.
Made by [community](https://github.com/solana-foundation/templates/graphs/contributors) 💛
<br><br>
<a href="https://github.com/solana-foundation/templates/graphs/contributors">
<img src="https://contrib.rocks/image?repo=solana-foundation/templates" />
</a>

<!-- /automd -->
