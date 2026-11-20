import type { AirdropProgress } from '@/features/airdrop/data-access/airdrop-types'

interface Submission {
  submitted: boolean
  progress: AirdropProgress | null
  error: string | null
  cluster: string | null
}

const empty: Submission = { submitted: false, progress: null, error: null, cluster: null }

// Lives above the replaceable network client, including while a wallet request settles.
export function createSubmissionStore() {
  const records = new Map<string, Submission>()
  const listeners = new Set<() => void>()
  return {
    get: (key: string) => records.get(key) ?? empty,
    update(key: string, update: (current: Submission) => Submission) {
      records.set(key, update(records.get(key) ?? empty))
      listeners.forEach((listener) => listener())
    },
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}
