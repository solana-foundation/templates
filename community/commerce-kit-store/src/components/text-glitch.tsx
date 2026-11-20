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
  glitchDuration = 1200,
}: TextGlitchProps) {
  const [isGlitching, setIsGlitching] = useState(false)
  const [offsets, setOffsets] = useState([0, 0, 0, 0])

  useEffect(() => {
    let nextTimer: ReturnType<typeof setTimeout>
    let endTimer: ReturnType<typeof setTimeout> | undefined
    const tryGlitch = () => {
      if (Math.random() < glitchProbability) {
        setOffsets([Math.random() * 10 - 5, Math.random() * 5 - 2.5, Math.random() * 10 - 5, Math.random() * 5 - 2.5])
        setIsGlitching(true)
        clearTimeout(endTimer)
        endTimer = setTimeout(() => {
          setIsGlitching(false)
        }, glitchDuration)
      }
    }

    const scheduleNextGlitch = () => {
      const nextInterval = Math.floor(Math.random() * (maxInterval - minInterval)) + minInterval

      nextTimer = setTimeout(() => {
        tryGlitch()
        scheduleNextGlitch()
      }, nextInterval)
    }

    scheduleNextGlitch()
    return () => {
      clearTimeout(nextTimer)
      clearTimeout(endTimer)
    }
  }, [glitchProbability, minInterval, maxInterval, glitchDuration])

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
              transform: `translate(${offsets[0]}px, ${offsets[1]}px)`,
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
              transform: `translate(${offsets[2]}px, ${offsets[3]}px)`,
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
