import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { EASE } from '@/utils/anim'
import { cn } from '@/utils/cn'

interface EmptyStateProps {
  title: string
  text?: string
  children?: ReactNode
  className?: string
}

/** Meaningful, animated empty state with a soft glowing orb and friendly copy. */
export function EmptyState({ title, text, children, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-14 text-center', className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative grid h-24 w-24 place-items-center rounded-[2rem] bg-gradient-to-br from-blush to-blush-deep shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]"
      >
        <motion.svg
          viewBox="0 0 24 24"
          fill="none"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="h-10 w-10 text-forest-ink"
          aria-hidden
        >
          <rect x="3" y="6" width="18" height="13" rx="3" fill="currentColor" />
          <path
            d="M4.5 9l7.5 5 7.5-5"
            stroke="#fcfaf5"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
        <motion.span
          aria-hidden
          animate={{ scale: [1, 1.14, 1], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -inset-2 rounded-[2.5rem] border border-highlighter-yellow/40"
        />
      </motion.div>

      <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-ink">{title}</h3>
      {text && <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">{text}</p>}
      {children && <div className="mt-7">{children}</div>}
    </div>
  )
}
