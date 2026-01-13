'use client'

import { useEffect, useRef } from 'react'

interface NoiseBackgroundProps {
  className?: string
  intensity?: number
  alpha?: number
}

export default function NoiseBackground({
  className = 'fixed inset-0 w-full h-full -z-10',
  intensity = 50,
  alpha = 70,
}: NoiseBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth || 1
      canvas.height = window.innerHeight || 1
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let animationFrameId: number

    const generateNoise = () => {
      if (!canvas.width || !canvas.height) {
        animationFrameId = requestAnimationFrame(generateNoise)
        return
      }

      try {
        const imageData = ctx.createImageData(canvas.width, canvas.height)
        const data = imageData.data

        for (let i = 0; i < data.length; i += 4) {
          const value = Math.floor(Math.random() * intensity)
          data[i] = value
          data[i + 1] = value
          data[i + 2] = value
          data[i + 3] = alpha
        }

        ctx.putImageData(imageData, 0, 0)
      } catch (error) {
        console.error('Error generating noise:', error)
      }

      animationFrameId = requestAnimationFrame(generateNoise)
    }

    generateNoise()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [intensity, alpha])

  return <canvas ref={canvasRef} className={className} />
}
