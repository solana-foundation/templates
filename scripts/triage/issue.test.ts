import { test } from 'node:test'
import assert from 'node:assert/strict'
import { classifyIssue, referencedTemplates, titleSimilarity, toIssueInput } from './issue.js'
import type { IssueInput } from './types.js'

const catalog = ['kit/nextjs', 'kit/nextjs-anchor', 'kit/react-vite', 'web3js/web3js-nextjs', 'mobile/kit-expo-minimal']

const issue = (over: Partial<IssueInput>): IssueInput => ({
  number: 500,
  title: '',
  body: '',
  labels: [],
  comments: [],
  ...over,
})

const openIssues = [
  { number: 454, title: 'Issue classifier and automated patcher' },
  { number: 452, title: 'Automated QA agent with screenshots' },
  { number: 430, title: 'kit/nextjs build fails with TS2322 after next 16 upgrade' },
]

test('toIssueInput flattens the gh --json shape', () => {
  const input = toIssueInput(
    { number: 7, title: 'T', body: 'B', labels: [{ name: 'Bug' }], comments: [{ body: 'c1' }] },
    0,
  )
  assert.deepEqual(input, { number: 7, title: 'T', body: 'B', labels: ['bug'], comments: ['c1'] })
  assert.equal(toIssueInput({}, 9).number, 9)
})

test('referencedTemplates matches full ids, unambiguous dir names and csd flags', () => {
  assert.deepEqual(referencedTemplates('Using kit/nextjs-anchor and the react-vite one', catalog), [
    'kit/nextjs-anchor',
    'kit/react-vite',
  ])
  assert.deepEqual(referencedTemplates('create-solana-dapp -t web3js/web3js-nextjs my-app', catalog), [
    'web3js/web3js-nextjs',
  ])
  // "nextjs" alone reads as prose, not a template reference: no match
  assert.deepEqual(referencedTemplates('the nextjs template', catalog), [])
  assert.deepEqual(referencedTemplates('kit-expo-minimal crashes on Android', catalog), ['mobile/kit-expo-minimal'])
})

test('titleSimilarity is 1 for the same words and low for unrelated titles', () => {
  assert.equal(titleSimilarity('Build fails on kit/nextjs', 'build fails on kit/nextjs'), 1)
  assert.ok(titleSimilarity('Build fails on kit/nextjs', 'Add a Svelte template') < 0.2)
})

test('a near-identical title to an open issue is a duplicate', () => {
  const triage = classifyIssue(
    issue({ title: 'kit/nextjs build fails with TS2322 after Next 16 upgrade', body: 'Same as the other report.' }),
    { catalog, openIssues },
  )
  assert.equal(triage.kind, 'duplicate')
  assert.equal(triage.confidence, 'high')
  assert.equal(triage.duplicateOf?.number, 430)
  assert.match(triage.commentDraft, /same problem as #430/)
  assert.deepEqual(triage.referencedTemplates, ['kit/nextjs'])
})

test('the issue itself is never its own duplicate', () => {
  const triage = classifyIssue(
    issue({ number: 430, title: 'kit/nextjs build fails with TS2322 after next 16 upgrade', body: 'error TS2322: x' }),
    {
      catalog,
      openIssues,
    },
  )
  assert.notEqual(triage.kind, 'duplicate')
})

test('a bug claim with no repro, versions or error output is needs-info with a targeted comment', () => {
  const triage = classifyIssue(issue({ title: 'kit/react-vite is broken', body: 'It does not work for me.' }), {
    catalog,
    openIssues,
    healthStatus: (id) => (id === 'kit/react-vite' ? 'pass' : 'unknown'),
  })
  assert.equal(triage.kind, 'needs-info')
  assert.deepEqual(triage.signals, { hasReproSteps: false, hasVersions: false, hasErrorOutput: false })
  assert.match(triage.commentDraft, /exact steps you ran/)
  assert.match(triage.commentDraft, /Node, package manager and OS versions/)
  assert.match(triage.commentDraft, /full error output/)
  assert.deepEqual(triage.templateHealth, { 'kit/react-vite': 'pass' })
})

test('a bug with error output and repro steps is a bug, with template health attached', () => {
  const body = [
    'Steps to reproduce:',
    '1. run create-solana-dapp -t kit/nextjs-anchor app',
    '2. run npm run build',
    '',
    'Node 24.1.0, npm 11.0.0',
    '',
    '```',
    "src/app/page.tsx:3:1 - error TS2307: Cannot find module '@solana/kit'",
    '```',
  ].join('\n')
  const triage = classifyIssue(issue({ title: 'Build error in nextjs-anchor', body }), {
    catalog,
    openIssues,
    healthStatus: () => 'fail',
  })
  assert.equal(triage.kind, 'bug')
  assert.equal(triage.confidence, 'high')
  assert.deepEqual(triage.referencedTemplates, ['kit/nextjs-anchor'])
  assert.equal(triage.templateHealth['kit/nextjs-anchor'], 'fail')
  assert.deepEqual(triage.signals, { hasReproSteps: true, hasVersions: true, hasErrorOutput: true })
  assert.match(triage.commentDraft, /pnpm health --only <template>/)
})

test('questions and feature requests are told apart from bugs', () => {
  const question = classifyIssue(
    issue({ title: 'How do I switch the RPC endpoint in kit/nextjs?', body: 'Just asking.' }),
    {
      catalog,
      openIssues,
    },
  )
  assert.equal(question.kind, 'question')
  const feature = classifyIssue(
    issue({ title: 'Svelte template', body: 'It would be great to add support for SvelteKit.' }),
    {
      catalog,
      openIssues,
    },
  )
  assert.equal(feature.kind, 'feature')
  const labelled = classifyIssue(issue({ title: 'Something', body: 'x', labels: ['enhancement'] }), {
    catalog,
    openIssues,
  })
  assert.equal(labelled.kind, 'feature')
  assert.equal(labelled.confidence, 'high')
})

test('classification is deterministic', () => {
  const input = issue({ title: 'kit/react-vite is broken', body: 'It does not work for me.' })
  assert.deepEqual(classifyIssue(input, { catalog, openIssues }), classifyIssue(input, { catalog, openIssues }))
})
