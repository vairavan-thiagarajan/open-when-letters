import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { EASE } from '@/utils/anim'

/**
 * Premium page transition: the outgoing screen fades and eases out while the
 * incoming screen rises into place. Blur is deliberately avoided — animating
 * `filter` forces a repaint each frame and hurts the mobile experience.
 */
export function AnimatedRoutes({ children }: { children: ReactNode }) {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 14, scale: 0.998 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.998 }}
        transition={{ duration: 0.42, ease: EASE }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
