import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { EASE } from '@/utils/anim'

interface RevealProps {
  children: ReactNode
  delay?: number
  className?: string
  y?: number
}

export function Reveal({ children, delay = 0, className, y = 28 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.65, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
