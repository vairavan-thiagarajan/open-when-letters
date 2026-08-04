import { motion } from 'framer-motion'
import { EnvelopeThumb } from '@/components/letters/EnvelopeThumb'
import type { CollectionLetter } from '@/services/types'
import { formatDate } from '@/utils/formatDate'
import { EASE } from '@/utils/anim'

interface CollectionLetterCardProps {
  letter: CollectionLetter
  index: number
  onOpen: () => void
}

export function CollectionLetterCard({
  letter,
  index,
  onOpen,
}: CollectionLetterCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.06, 0.5),
        ease: EASE,
      }}
      className="h-full"
    >
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={onOpen}
        className="group block h-full w-full cursor-pointer text-left"
      >
        <article className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-paper shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-highlighter-yellow/60 group-hover:shadow-[rgba(0,0,0,0.08)_0px_2px_8px_0px]">
          <div className="relative px-7 pt-6 pb-1">
            <span className="absolute top-5 right-5 z-10 inline-flex items-center gap-1.5 rounded-full border border-line bg-paper/80 px-3 py-1 text-xs font-medium text-ink-soft shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px] backdrop-blur">
              <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" aria-hidden>
                <path
                  d="M7 10V7a5 5 0 0 1 10 0v3M5 10h14v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Sealed
            </span>
            <motion.div
              whileHover={{ scale: 1.06, rotate: -1.5 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className="mx-auto max-w-[190px]"
            >
              <EnvelopeThumb cover={letter.coverImage} locked />
            </motion.div>
          </div>

          <div className="flex flex-1 flex-col p-6 pt-3">
            <p className="text-[11px] font-semibold tracking-widest font-mono text-forest-ink uppercase">
              Open when
            </p>
            <h3 className="mt-1.5 font-display text-2xl leading-snug font-semibold tracking-tight text-ink transition-colors duration-300 group-hover:text-forest-ink">
              {letter.title || 'Untitled letter'}
            </h3>
            {letter.trigger && (
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
                {letter.trigger}
              </p>
            )}

            <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
              <span className="text-xs text-mist">{formatDate(letter.createdAt)}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blush px-3.5 py-1.5 text-sm font-medium text-forest-ink transition-colors duration-300 group-hover:bg-forest-ink group-hover:text-white">
                Open
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-3.5 w-3.5"
                  aria-hidden
                >
                  <path
                    d="M9 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </article>
      </motion.button>
    </motion.div>
  )
}
