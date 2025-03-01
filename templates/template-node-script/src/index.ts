// Load environment variables from .env file
import 'dotenv/config'
// Colors and prompts, yay!
import pico from 'picocolors'
import prompts from 'prompts'

// Solana Client SDK
import { Address, createSolanaClient, getMonikerFromGenesisHash } from 'gill'
// Solana Client SDK (Node.js)
import { loadKeypairSignerFromFile } from 'gill/node'
import { isAddress } from '@solana/web3.js'

// Welcome message
console.log(pico.green(pico.bold('Gm! Say hi to your new Solana script!')))

// Get the Solana RPC endpoint from the environment variable or default to devnet
const urlOrMoniker = process.env.SOLANA_RPC_ENDPOINT || 'devnet'
const client = createSolanaClient({ urlOrMoniker })
const cluster = getMonikerFromGenesisHash(await client.rpc.getGenesisHash().send())
console.log(pico.gray(`Endpoint: ${urlOrMoniker.split('?')[0]}`))
console.log(pico.gray(`Cluster : ${pico.whiteBright(cluster)}`))

console.log(pico.magenta(pico.bold('Signer Keypair')))

// Load the keypair from the .env file
const signer = await loadKeypairSignerFromFile('~/.config/solana/id.json')
await showBalance(signer.address)

// This is how you can prompt the user for input
const res = await prompts({ type: 'text', name: 'address', message: 'Check another address', validate: isAddress })
if (!res.address) {
  console.log(pico.red('No address provided'))
  process.exit(1)
}
await showBalance(res.address)

// And we're done!
console.log(pico.green(`Now go build something awesome!`))

async function showBalance(address: Address) {
  const balance = await client.rpc.getBalance(address).send()
  console.log(pico.gray(`Address : ${pico.magenta(address)}`))
  console.log(pico.gray(`Balance : ${pico.magenta(Number(balance.value) / 10 ** 9)} SOL`))
}
