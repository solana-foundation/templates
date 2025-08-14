import { Address } from 'gill'

interface MerkleTreeNode {
  claimant: number[] // PublicKey as byte array
  proof: number[][] // Merkle proof as byte arrays
  total_locked_searcher: number
  total_locked_staker: number
  total_locked_validator: number
  total_unlocked_searcher: number
  total_unlocked_staker: number
  total_unlocked_validator: number
}

export interface MerkleTree {
  merkle_root: number[]
  max_num_nodes: number
  max_total_claim: number
  tree_nodes: MerkleTreeNode[]
}

export interface Recipient {
  recipient: Address
  amount: number
}
