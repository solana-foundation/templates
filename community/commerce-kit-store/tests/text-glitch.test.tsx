// @vitest-environment jsdom
import { act, cleanup, render } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import TextGlitch from '../src/components/text-glitch'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

test('scheduled animation cleans up both timers on unmount', () => {
  vi.useFakeTimers()
  const { container, unmount } = render(
    <TextGlitch glitchProbability={1} minInterval={100} maxInterval={100} glitchDuration={50}>
      Store
    </TextGlitch>,
  )
  act(() => {
    vi.advanceTimersByTime(100)
  })
  expect(container.querySelectorAll('.glitch-clone')).toHaveLength(2)
  expect(vi.getTimerCount()).toBe(2)
  unmount()
  expect(vi.getTimerCount()).toBe(0)
})
