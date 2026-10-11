/**
 * Stage 2 skeleton: classify a GitHub issue with deterministic rules.
 *
 * Input is the issue JSON `gh issue view` prints; output is a kind (bug, question,
 * feature, duplicate, needs-info), the templates it references, their latest health
 * status, and a comment draft. No LLM, no network beyond the `gh` calls in fetchIssue
 * and fetchOpenIssues, both of which degrade to a clear message when gh is missing.
 */

import { spawnSync } from 'child_process'
import type { Status } from '../health/types.js'
import { err, ok, type Result } from '../shared/result.js'
import type { Confidence, IssueInput, IssueKind, IssueTriage, OpenIssueRef } from './types.js'

export const DUPLICATE_THRESHOLD = 0.6

// ---------- gh wrappers (not unit-tested; they just shell out) ----------

type GhIssue = {
  number?: number
  title?: string
  body?: string
  labels?: Array<{ name: string }>
  comments?: Array<{ body: string }>
}

const gh = (args: string[]): Result<string> => {
  const result = spawnSync('gh', args, { encoding: 'utf-8', timeout: 30_000 })
  if (result.error) return err(`gh is not installed or not on PATH (${result.error.message})`)
  if (result.status !== 0) return err(`gh ${args.slice(0, 2).join(' ')} failed: ${(result.stderr || '').trim()}`)
  return ok(result.stdout)
}

export const fetchIssue = (number: number, repo: string): Result<IssueInput> => {
  const raw = gh(['issue', 'view', String(number), '-R', repo, '--json', 'number,title,body,labels,comments'])
  if (!raw.ok) return raw
  try {
    return ok(toIssueInput(JSON.parse(raw.value) as GhIssue, number))
  } catch (error) {
    return err(`could not parse gh output: ${String(error)}`)
  }
}

export const fetchOpenIssues = (repo: string): Result<OpenIssueRef[]> => {
  const raw = gh(['issue', 'list', '-R', repo, '--state', 'open', '--json', 'number,title', '--limit', '100'])
  if (!raw.ok) return raw
  try {
    return ok(JSON.parse(raw.value) as OpenIssueRef[])
  } catch (error) {
    return err(`could not parse gh output: ${String(error)}`)
  }
}

/** Normalize the `gh issue view --json` shape (labels and comments are objects). */
export const toIssueInput = (issue: GhIssue, fallbackNumber: number): IssueInput => ({
  number: issue.number ?? fallbackNumber,
  title: issue.title ?? '',
  body: issue.body ?? '',
  labels: (issue.labels ?? []).map((label) => label.name.toLowerCase()),
  comments: (issue.comments ?? []).map((comment) => comment.body),
})

// ---------- pure classification ----------

const STOPWORDS = new Set([
  'a',
  'an',
  'the',
  'in',
  'on',
  'of',
  'to',
  'for',
  'with',
  'and',
  'or',
  'is',
  'are',
  'it',
  'this',
  'that',
  'when',
  'not',
  'does',
  'do',
  'be',
  'i',
  'my',
  'we',
  'you',
  'template',
  'templates',
  'issue',
  'error',
])

export const titleTokens = (title: string): Set<string> =>
  new Set(
    title
      .toLowerCase()
      .replace(/[^a-z0-9@/._\s-]/g, ' ')
      .split(/\s+/)
      .filter((token) => token.length > 1 && !STOPWORDS.has(token)),
  )

/** Dice coefficient over title tokens; 1 = same words, 0 = nothing shared. */
export const titleSimilarity = (left: string, right: string): number => {
  const a = titleTokens(left)
  const b = titleTokens(right)
  if (a.size === 0 || b.size === 0) return 0
  let shared = 0
  for (const token of a) if (b.has(token)) shared++
  return (2 * shared) / (a.size + b.size)
}

export const mostSimilarOpenIssue = (
  issue: IssueInput,
  openIssues: readonly OpenIssueRef[],
): { ref: OpenIssueRef; score: number } | null => {
  let best: { ref: OpenIssueRef; score: number } | null = null
  for (const ref of openIssues) {
    if (ref.number === issue.number) continue
    const score = titleSimilarity(issue.title, ref.title)
    if (!best || score > best.score) best = { ref, score }
  }
  return best && best.score >= DUPLICATE_THRESHOLD ? best : null
}

/**
 * Template ids mentioned in the text. Matches full ids (`kit/nextjs`), bare directory
 * names (`nextjs-anchor`, but only compound or long names that are unambiguous in the catalog) and
 * `create-solana-dapp -t <id>` style flags.
 */
export const referencedTemplates = (text: string, catalog: readonly string[]): string[] => {
  const haystack = normalizeTemplateLinks(text.toLowerCase())
  const found = new Set<string>()
  const byBase = new Map<string, string[]>()
  for (const id of catalog) {
    const base = id.split('/').at(-1)!
    byBase.set(base, [...(byBase.get(base) ?? []), id])
  }
  for (const id of catalog) {
    // A full id may follow a `/` (a URL whose branch has slashes); no id is a `/`-suffix of another.
    if (new RegExp(`(^|[^a-z0-9_-])${escapeRegExp(id.toLowerCase())}(?![a-z0-9_-])`).test(haystack)) found.add(id)
  }
  for (const [base, ids] of byBase) {
    // Bare names only when they are compound (`react-vite`) or long; `nextjs` alone is prose.
    if (ids.length !== 1 || (!base.includes('-') && base.length < 8)) continue
    if (new RegExp(`(^|[^a-z0-9/_-])${escapeRegExp(base.toLowerCase())}(?![a-z0-9_-])`).test(haystack))
      found.add(ids[0])
  }
  return [...found].sort()
}

/**
 * `gh:solana-foundation/templates/kit/nextjs` and
 * `https://github.com/solana-foundation/templates/tree/main/kit/nextjs` both name a
 * template; strip the prefix so the id sits on a word boundary for the catalog match.
 */
export const normalizeTemplateLinks = (text: string): string =>
  text
    .replace(/https?:\/\/(www\.)?github\.com\/solana-foundation\/templates\/(tree|blob)\/[^/\s]+\//g, ' ')
    .replace(/\bgh:solana-foundation\/templates\//g, ' ')

const escapeRegExp = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const REPRO_RE =
  /steps? to reproduce|reproduc(e|tion)|repro\b|^\s*(\d+[.)]|-)\s+.*\b(run|open|click|install|create)\b/im
const VERSIONS_RE =
  /\b(node|npm|pnpm|yarn|bun|next(\.js)?|expo|react|anchor|rust|cargo|solana|kit)\b[^\n]{0,30}\bv?\d+\.\d+(\.\d+)?/i
const ERROR_OUTPUT_RE =
  /npm ERR!|ERR_[A-Z_]+|\bTS\d{4}\b|error\[E\d{4}\]|Error:|Cannot find module|ERESOLVE|Module not found|panicked at|stack trace|at .+\(.+:\d+:\d+\)/
const FEATURE_RE =
  /feature request|proposal|would be (nice|great|useful)|add support for|should (also )?support|please add|idea:|enhancement|new template|suggest(ion)?/i
const QUESTION_RE = /^(how|why|what|which|where|can|could|should|is it|does|do i|any way)\b|\?\s*$/i
const BUG_RE =
  /\b(bug|broken|crash(es|ed)?|fail(s|ed|ing)?|doesn'?t work|not working|does not work|unexpected|regression)\b/i

export const classifyIssue = (
  issue: IssueInput,
  context: {
    readonly catalog: readonly string[]
    readonly openIssues: readonly OpenIssueRef[]
    readonly healthStatus?: (templateId: string) => Status | 'unknown'
  },
): IssueTriage => {
  const text = [issue.title, issue.body, ...issue.comments].join('\n')
  const templates = referencedTemplates(text, context.catalog)
  const templateHealth = Object.fromEntries(
    templates.map((id) => [id, context.healthStatus ? context.healthStatus(id) : 'unknown']),
  ) as Record<string, Status | 'unknown'>
  const signals = {
    hasReproSteps: REPRO_RE.test(issue.body),
    hasVersions: VERSIONS_RE.test(text),
    hasErrorOutput: ERROR_OUTPUT_RE.test(issue.body),
  }
  const duplicate = mostSimilarOpenIssue(issue, context.openIssues)
  const labels = new Set(issue.labels)

  let kind: IssueKind
  let confidence: Confidence
  if (duplicate) {
    kind = 'duplicate'
    confidence = duplicate.score >= 0.8 ? 'high' : 'medium'
  } else if (labels.has('enhancement') || labels.has('feature') || (FEATURE_RE.test(text) && !signals.hasErrorOutput)) {
    kind = 'feature'
    confidence = labels.has('enhancement') || labels.has('feature') ? 'high' : 'medium'
  } else if (labels.has('question') || (QUESTION_RE.test(issue.title.trim()) && !signals.hasErrorOutput)) {
    kind = 'question'
    confidence = labels.has('question') ? 'high' : 'medium'
  } else if (labels.has('bug') || signals.hasErrorOutput || BUG_RE.test(text)) {
    const enough = signals.hasErrorOutput || (signals.hasReproSteps && signals.hasVersions)
    kind = enough ? 'bug' : 'needs-info'
    confidence = enough && (labels.has('bug') || signals.hasReproSteps) ? 'high' : enough ? 'medium' : 'medium'
  } else {
    kind = 'needs-info'
    confidence = 'low'
  }

  return {
    number: issue.number,
    kind,
    confidence,
    referencedTemplates: templates,
    templateHealth,
    signals,
    duplicateOf: duplicate?.ref ?? null,
    commentDraft: commentDraft(kind, templates, templateHealth, signals, duplicate?.ref ?? null),
  }
}

const commentDraft = (
  kind: IssueKind,
  templates: readonly string[],
  health: Readonly<Record<string, Status | 'unknown'>>,
  signals: IssueTriage['signals'],
  duplicate: OpenIssueRef | null,
): string => {
  const lines: string[] = ['Thanks for opening this.']
  const healthLine = templates.length
    ? `Latest health check for ${templates.map((id) => `\`${id}\` (${health[id]})`).join(', ')}.`
    : 'No specific template was referenced; if this is about one template, please name it (for example `kit/nextjs`).'
  switch (kind) {
    case 'duplicate':
      lines.push(
        `This looks like the same problem as #${duplicate?.number}. If it is, we will track it there; if not, please say what differs.`,
      )
      break
    case 'feature':
      lines.push(
        'Reading this as a feature request. Could you describe the use case in one or two sentences so we can weigh it against the roadmap?',
      )
      break
    case 'question':
      lines.push('Reading this as a question rather than a defect. ' + healthLine)
      break
    case 'bug':
      lines.push(healthLine)
      lines.push(
        'We will try to reproduce with `pnpm health --only <template>` before changing anything; an upstream dependency release can fail several templates at once.',
      )
      break
    case 'needs-info':
      lines.push('Before we can reproduce this we need:')
      if (!signals.hasReproSteps)
        lines.push('- the exact steps you ran (starting from `create-solana-dapp` or a fresh clone)')
      if (!signals.hasVersions) lines.push('- your Node, package manager and OS versions')
      if (!signals.hasErrorOutput) lines.push('- the full error output, not a screenshot')
      lines.push(healthLine)
      break
  }
  return lines.join('\n')
}
