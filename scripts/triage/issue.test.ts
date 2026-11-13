import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  classifyIssue,
  fetchAuthorAssociation,
  fetchIssue,
  isGhSetupError,
  normalizeTemplateLinks,
  referencedTemplates,
  titleSimilarity,
  toIssueInput,
  type GhRunner,
} from './issue.js'
import { err, ok } from '../shared/result.js'
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

/** A gh stand-in: `issue view` answers with the issue JSON, `api` with whatever `api` returns. */
const fakeGh = (api: () => ReturnType<GhRunner>): { run: GhRunner; calls: string[][] } => {
  const calls: string[][] = []
  const run: GhRunner = (args) => {
    calls.push([...args])
    if (args[0] === 'api') return api()
    if (args[0] === 'issue' && args[1] === 'view')
      return ok(JSON.stringify({ number: 452, title: 'Automated QA agent with screenshots', body: 'x' }))
    return err(`unexpected gh call: ${args.join(' ')}`)
  }
  return { run, calls }
}

test('fetchIssue asks gh issue view without authorAssociation and gets it from the REST payload', () => {
  const { run, calls } = fakeGh(() => ok('COLLABORATOR\n'))
  const issue = fetchIssue(452, 'solana-foundation/templates', run)
  assert.ok(issue.ok)
  assert.equal(issue.value.authorAssociation, 'COLLABORATOR')
  assert.equal(issue.value.title, 'Automated QA agent with screenshots')
  // gh 2.96 rejects authorAssociation as a --json field, so it must never be in that list
  const view = calls.find((call) => call[1] === 'view')!
  assert.doesNotMatch(view.join(' '), /authorAssociation/)
  assert.deepEqual(
    calls.find((call) => call[0] === 'api'),
    ['api', 'repos/solana-foundation/templates/issues/452', '--jq', '.author_association'],
  )
})

test('the author association call is best-effort: a failure or empty output leaves the field absent', () => {
  const failing = fetchIssue(452, 'o/r', fakeGh(() => err('gh api failed: HTTP 403 rate limit')).run)
  assert.ok(failing.ok)
  assert.ok(!('authorAssociation' in failing.value))
  const empty = fetchIssue(452, 'o/r', fakeGh(() => ok('  \n')).run)
  assert.ok(empty.ok)
  assert.ok(!('authorAssociation' in empty.value))
  assert.equal(
    fetchAuthorAssociation(1, 'o/r', () => ok('owner\n')),
    'OWNER',
  )
  assert.equal(
    fetchAuthorAssociation(1, 'o/r', () => err('boom')),
    undefined,
  )
})

test('isGhSetupError only fires for a missing or unauthenticated gh, not for other gh errors', () => {
  assert.ok(isGhSetupError('gh is not installed or not on PATH (spawnSync gh ENOENT)'))
  assert.ok(isGhSetupError('gh issue view failed: To get started with GitHub CLI, please run:  gh auth login'))
  assert.ok(isGhSetupError('gh api failed: HTTP 401: Bad credentials'))
  assert.ok(!isGhSetupError('gh issue view failed: Unknown JSON field: "authorAssociation"'))
  assert.ok(!isGhSetupError('gh issue view failed: GraphQL: Could not resolve to an issue with the number of 999999.'))
})

test('toIssueInput flattens the gh --json shape', () => {
  const input = toIssueInput(
    { number: 7, title: 'T', body: 'B', labels: [{ name: 'Bug' }], comments: [{ body: 'c1' }] },
    0,
  )
  assert.deepEqual(input, { number: 7, title: 'T', body: 'B', labels: ['bug'], comments: ['c1'] })
  assert.equal(toIssueInput({}, 9).number, 9)
  // authorAssociation is normalised when present and left out (not undefined) when gh did not send it
  assert.equal(toIssueInput({ authorAssociation: 'owner' }, 1).authorAssociation, 'OWNER')
  assert.ok(!('authorAssociation' in toIssueInput({}, 1)))
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

test('referencedTemplates understands gh: shorthands and GitHub tree/blob URLs', () => {
  assert.deepEqual(referencedTemplates('scaffolded from gh:solana-foundation/templates/kit/nextjs', catalog), [
    'kit/nextjs',
  ])
  assert.deepEqual(
    referencedTemplates(
      'see https://github.com/solana-foundation/templates/tree/main/kit/nextjs-anchor for the code',
      catalog,
    ),
    ['kit/nextjs-anchor'],
  )
  assert.deepEqual(
    referencedTemplates(
      'https://github.com/solana-foundation/templates/blob/feat/x/web3js/web3js-nextjs/README.md',
      catalog,
    ),
    ['web3js/web3js-nextjs'],
  )
  assert.equal(normalizeTemplateLinks('gh:solana-foundation/templates/kit/nextjs'), ' kit/nextjs')
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

/** The real text of solana-foundation/templates#452, a maintainer roadmap issue with no labels. */
const issue452 = (): IssueInput =>
  issue({
    number: 452,
    title: 'Automated QA agent with screenshots',
    body: [
      'Right now the health check can tell us a template installs, builds, and that its dev server answers with a 2xx. What it cannot tell us is whether the page a user actually lands on is any good. A template can build fine, boot fine, return 200, and still render a blank screen, a Next.js error overlay, or a broken hydration state.',
      '',
      'The idea is to add a QA step that opens each web template in a real browser, looks at it the way a person would, takes a screenshot, and flags the obvious visual failures.',
      '',
      'Some ideas on how we could approach it:',
      '',
      '- Drive the running dev server with Playwright, since we already start the server for the boot check',
      '- Attach the screenshots somewhere useful, a PR comment or a run artifact',
    ].join('\n'),
  })

test('issue #452 (roadmap prose with "broken" and a bullet containing "run") is a feature, not needs-info', () => {
  const triage = classifyIssue(issue452(), { catalog, openIssues })
  assert.equal(triage.kind, 'feature')
  // the ideas bullets are not repro steps: "run" sits mid-sentence, not at the start of the bullet
  assert.deepEqual(triage.signals, { hasReproSteps: false, hasVersions: false, hasErrorOutput: false })
  assert.doesNotMatch(triage.commentDraft, /Node, package manager and OS versions/)
  // the same text from an owner stays a feature; the association is not what decides it here
  assert.equal(classifyIssue({ ...issue452(), authorAssociation: 'OWNER' }, { catalog, openIssues }).kind, 'feature')
})

test('a bug word in prose alone never reaches the bug path; a bug word in the title with versions beats a feature phrase', () => {
  const prose = classifyIssue(
    issue({ title: 'Hydration on kit/nextjs', body: 'Sometimes the page renders a broken state after navigation.' }),
    { catalog, openIssues },
  )
  assert.equal(prose.kind, 'needs-info')
  assert.equal(prose.confidence, 'low')
  const titled = classifyIssue(
    issue({ title: 'Build fails on kit/nextjs', body: 'Node 22.1.0. It would be nice if this worked out of the box.' }),
    { catalog, openIssues },
  )
  assert.equal(titled.kind, 'needs-info')
  assert.match(titled.commentDraft, /exact steps you ran/)
})

test('a prose bug word backed by repro steps and versions is a bug even with feature wording; a bug label always is', () => {
  const report = issue({
    title: 'Blank page in kit/react-vite',
    body: [
      'Node 22.1.0, npm 11.0.0',
      '',
      '1. run create-solana-dapp -t kit/react-vite app',
      '2. open http://localhost:5173',
      '',
      'The page is broken. We could guard the render so it never blanks.',
    ].join('\n'),
  })
  const unlabelled = classifyIssue(report, { catalog, openIssues })
  assert.equal(unlabelled.kind, 'bug')
  assert.equal(unlabelled.confidence, 'high')
  assert.deepEqual(unlabelled.signals, { hasReproSteps: true, hasVersions: true, hasErrorOutput: false })
  const labelled = classifyIssue({ ...report, labels: ['bug'] }, { catalog, openIssues })
  assert.equal(labelled.kind, 'bug')
  assert.equal(labelled.confidence, 'high')
  // a bug label beats feature wording even when the body carries no repro or versions
  const labelledThin = classifyIssue(
    issue({ title: 'Blank page', body: 'We could guard the render.', labels: ['bug'] }),
    { catalog, openIssues },
  )
  assert.equal(labelledThin.kind, 'needs-info')
  assert.match(labelledThin.commentDraft, /exact steps you ran/)
})

test('maintainers (OWNER, MEMBER, COLLABORATOR) never get needs-info: bug by signals, otherwise feature', () => {
  const bare = { title: 'kit/react-vite is broken', body: 'It does not work for me.' }
  for (const authorAssociation of ['OWNER', 'MEMBER', 'COLLABORATOR']) {
    const triage = classifyIssue(issue({ ...bare, authorAssociation }), { catalog, openIssues })
    assert.equal(triage.kind, 'bug', authorAssociation)
    assert.equal(triage.confidence, 'medium')
  }
  assert.equal(
    classifyIssue(issue({ ...bare, authorAssociation: 'CONTRIBUTOR' }), { catalog, openIssues }).kind,
    'needs-info',
  )
  const note = classifyIssue(
    issue({ title: 'Template catalog page', body: 'A page listing every template.', authorAssociation: 'MEMBER' }),
    { catalog, openIssues },
  )
  assert.equal(note.kind, 'feature')
  assert.equal(note.confidence, 'low')
})

test('a question-shaped title beats feature wording in the body, and "approach" alone is not feature wording', () => {
  const question = classifyIssue(
    issue({ title: 'How do I connect a wallet in kit/react-vite?', body: 'What is the recommended approach?' }),
    { catalog, openIssues },
  )
  assert.equal(question.kind, 'question')
  assert.equal(question.confidence, 'medium')
  // an explicit enhancement label still outranks the title shape
  const labelled = classifyIssue(
    issue({ title: 'Could we add a Svelte template?', body: 'x', labels: ['enhancement'] }),
    { catalog, openIssues },
  )
  assert.equal(labelled.kind, 'feature')
  // #452 does not need the bare word: "the idea is to" / "some ideas" carry it
  assert.equal(classifyIssue(issue452(), { catalog, openIssues }).kind, 'feature')
})

test('Markdown-formatted steps ("1. `npm run dev`", "2. **Click** ...") still count as repro steps', () => {
  const report = issue({
    title: 'Wallet button broken in kit/react-vite',
    body: [
      'Node 22.1.0, npm 11.0.0',
      '',
      '1. `npm run dev`',
      '2. **Click** Connect Wallet',
      '',
      'Nothing happens and the console is empty.',
    ].join('\n'),
  })
  const triage = classifyIssue(report, { catalog, openIssues })
  assert.equal(triage.kind, 'bug')
  assert.deepEqual(triage.signals, { hasReproSteps: true, hasVersions: true, hasErrorOutput: false })
  // formatting is only allowed before the imperative; a bullet that merely contains one is still prose
  assert.equal(classifyIssue(issue452(), { catalog, openIssues }).signals.hasReproSteps, false)
})

test('classification is deterministic', () => {
  const input = issue({ title: 'kit/react-vite is broken', body: 'It does not work for me.' })
  assert.deepEqual(classifyIssue(input, { catalog, openIssues }), classifyIssue(input, { catalog, openIssues }))
})
