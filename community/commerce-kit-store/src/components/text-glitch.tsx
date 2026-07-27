'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TextGlitchProps {
  children: ReactNode
  className?: string
  glitchProbability?: number
  minInterval?: number
  maxInterval?: number
  glitchDuration?: number
}

export default function TextGlitch({
  children,
  className,
  glitchProbability = 0.4,
  minInterval = 2000,
  maxInterval = 8000,
  glitchDuration,
}: TextGlitchProps) {
  const [isGlitching, setIsGlitching] = useState(false)
  const [offsets, setOffsets] = useState([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ])
  const [resolvedGlitchDuration] = useState(() => glitchDuration ?? Math.floor(Math.random() * (1400 - 500)) + 850)

  useEffect(() => {
    const tryGlitch = () => {
      if (Math.random() < glitchProbability) {
        setOffsets([
          { x: Math.random() * 10 - 5, y: Math.random() * 5 - 2.5 },
          { x: Math.random() * 10 - 5, y: Math.random() * 5 - 2.5 },
        ])
        setIsGlitching(true)
        setTimeout(() => {
          setIsGlitching(false)
        }, resolvedGlitchDuration)
      }
    }

    const scheduleNextGlitch = () => {
      const nextInterval = Math.floor(Math.random() * (maxInterval - minInterval)) + minInterval

      return setTimeout(() => {
        tryGlitch()
        const timerId = scheduleNextGlitch()
        return () => clearTimeout(timerId)
      }, nextInterval)
    }

    const timerId = scheduleNextGlitch()
    return () => clearTimeout(timerId)
  }, [glitchProbability, minInterval, maxInterval, resolvedGlitchDuration])

  return (
    <span
      className={cn(className, isGlitching && 'glitch-text')}
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      {children}
      {isGlitching && (
        <>
          <span
            className="glitch-clone glitch-clone-1"
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
              transform: `translate(${offsets[0].x}px, ${offsets[0].y}px)`,
              opacity: 0.8,
              zIndex: 1,
            }}
          >
            {children}
          </span>
          <span
            className="glitch-clone glitch-clone-2"
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              clipPath: 'polygon(0 80%, 100% 20%, 100% 100%, 0 100%)',
              transform: `translate(${offsets[1].x}px, ${offsets[1].y}px)`,
              opacity: 0.8,
              zIndex: 1,
            }}
          >
            {children}
          </span>
        </>
      )}
    </span>
  )
}
