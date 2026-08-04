import { useCallback, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE } from '@/utils/anim'
import { cn } from '@/utils/cn'

export interface RippleItem {
  id: number
  x: number
  y: number
  size: number
}

/**
 * Tracks ripples for a pressable element. Pair with <RippleLayer /> inside a
 * `relative overflow-hidden` container.
 */
export function useRipples() {
  const [ripples, setRipples] = useState<RippleItem[]>([])

  const add = useCallback((event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2.2
    const id = Date.now() + Math.random()
    setRipples((current) => [
      ...current,
      {
        id,
        x: event.clientX - rect.left - size / 2,
        y: event.clientY - rect.top - size / 2,
        size,
      },
    ])
    window.setTimeout(() => {
      setRipples((current) => current.filter((item) => item.id !== id))
    }, 700)
  }, [])

  return { add, ripples }
}

interface RippleLayerProps {
  ripples: RippleItem[]
  color?: string
  className?: string
}

/** Expanding ink circles rendered on top of a pressable element. */
export function RippleLayer({ ripples, color, className }: RippleLayerProps) {
  return (
    <span
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.4 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="absolute rounded-full"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              background: color ?? 'currentColor',
            }}
          />
        ))}
      </AnimatePresence>
    </span>
  )
}
