import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { EASE } from '@/utils/anim'

/**
 * Premium page transition: the incoming screen fades and eases into place.
 * Blur is deliberately avoided — animating `filter` forces a repaint each
 * frame and hurts the mobile experience.
 *
 * Note: no `AnimatePresence` here. Pairing it with React.lazy routes + Suspense
 * (mode="wait") is a known framer-motion trap that leaves the new screen stuck
 * at opacity 0 — a blank white page on mobile until refresh. The keyed wrapper
 * below animates each fresh mount and can never deadlock.
 */
export function AnimatedRoutes({ children }: { children: ReactNode }) {
  const location = useLocation()

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 14, scale: 0.998 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.42, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
