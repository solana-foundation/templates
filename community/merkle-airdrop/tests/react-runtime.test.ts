import { createRequire } from 'node:module'
import { expect, test } from 'vitest'

const load = createRequire(import.meta.url)

test('Next, next-themes and styled-jsx share the application React runtime', () => {
  const react = load('react') as typeof import('react')
  const next = createRequire(load.resolve('next/package.json'))
  const themes = createRequire(load.resolve('next-themes'))
  const styled = createRequire(next.resolve('styled-jsx'))
  for (const dependency of [next, themes, styled]) expect(dependency('react')).toBe(react)
  expect(next('react-dom')).toBe(load('react-dom'))
  expect(themes('react-dom')).toBe(load('react-dom'))
})

test('the installed theme provider renders without an invalid-hook-call error', () => {
  const react = load('react') as typeof import('react')
  const server = load('react-dom/server') as typeof import('react-dom/server')
  const { ThemeProvider } = load('next-themes') as typeof import('next-themes')
  expect(
    server.renderToString(react.createElement(ThemeProvider, null, react.createElement('span', null, 'Theme check'))),
  ).toContain('Theme check')
})
