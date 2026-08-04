import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface FloatingHeartsProps {
  count?: number
  className?: string
}

interface Heart {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  opacity: number
}

export function FloatingHearts({ count = 14, className }: FloatingHeartsProps) {
  const hearts = useMemo<Heart[]>(
    () =>
      Array.from({ length: count }, (_, id) => ({
        id,
        left: Math.random() * 100,
        size: 9 + Math.random() * 13,
        duration: 9 + Math.random() * 9,
        delay: Math.random() * 7,
        opacity: 0.05 + Math.random() * 0.09,
      })),
    [count],
  )

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {hearts.map((heart) => (
        <motion.span
          key={heart.id}
          className="absolute text-terracotta"
          style={{ left: `${heart.left}%`, fontSize: heart.size, opacity: 0 }}
          initial={{ y: '108%' }}
          animate={{ y: '-115%', opacity: [0, heart.opacity, 0] }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: 'linear',
            times: [0, 0.5, 1],
          }}
        >
          ♥
        </motion.span>
      ))}
    </div>
  )
}
