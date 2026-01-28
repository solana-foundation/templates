'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function BouncingImage({
  src,
  className,
  width = 150,
  height = 150,
  animate = { y: [0, -10, 0] },
  duration = 4,
}: {
  src: string
  className: string
  width?: number
  height?: number
  animate?: { y: number[]; x?: number[] }
  duration?: number
}) {
  return (
    <motion.div
      className={`${className}`}
      animate={animate}
      transition={{
        duration: duration,
        ease: 'easeInOut',
        repeat: Number.POSITIVE_INFINITY,
      }}
    >
      <Image src={src} alt="logo" width={width} height={height} />
    </motion.div>
  )
}
