import { PotCategory } from '@project/anchor'

// Display metadata for the on-chain category enum.
export const POT_CATEGORIES: { category: PotCategory; emoji: string; label: string }[] = [
  { category: PotCategory.Goal, emoji: '🎯', label: 'Goal' },
  { category: PotCategory.Emergency, emoji: '🚨', label: 'Emergency' },
  { category: PotCategory.Bills, emoji: '🧾', label: 'Bills' },
  { category: PotCategory.Events, emoji: '🎉', label: 'Events' },
  { category: PotCategory.Others, emoji: '📦', label: 'Others' },
]

export function getPotCategory(category: PotCategory) {
  return POT_CATEGORIES.find((entry) => entry.category === category) ?? POT_CATEGORIES[POT_CATEGORIES.length - 1]
}
