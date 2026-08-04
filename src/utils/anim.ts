/**
 * Shared motion presets so every interaction feels consistent.
 * Easing arrays are "expo-out" style curves inspired by Linear / Arc.
 */
export const EASE = [0.22, 1, 0.36, 1] as const
export const EASE_SNAP = [0.16, 1, 0.3, 1] as const

export const springs = {
  gentle: { type: 'spring', stiffness: 200, damping: 26, mass: 0.9 },
  soft: { type: 'spring', stiffness: 300, damping: 30 },
  snappy: { type: 'spring', stiffness: 420, damping: 26 },
} as const

/** Entrance used by sections while scrolling into view. */
export const viewOnce = {
  margin: '-70px',
  once: true,
} as const

/** Fade-and-rise entrance keyframes factory. */
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay, ease: EASE },
  }),
} as const

/** Staggered child delay helper. */
export const staggerDelay = (index: number, base = 0.06, cap = 0.5) =>
  Math.min(index * base, cap)
