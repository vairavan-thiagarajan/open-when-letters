import { motion } from 'framer-motion'
import type { CollectionLetter } from '@/services/types'
import { formatDate } from '@/utils/formatDate'
import { FloatingHearts } from '@/components/effects/FloatingHearts'
import { MemoryCard } from '@/components/memory/MemoryCard'
import { EASE } from '@/utils/anim'

interface LetterViewProps {
  letter: CollectionLetter
  onClose?: () => void
}

export function LetterView({ letter, onClose }: LetterViewProps) {
  const paragraphs = letter.body.split(/\n\n+/).filter(Boolean)

  return (
    <div className="relative">
      <FloatingHearts count={8} className="opacity-60" />

      <div className="relative mx-auto max-w-2xl px-5 pb-8 sm:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex justify-end"
        >
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close letter"
              className="grid h-11 w-11 place-items-center rounded-full border border-line bg-paper/80 text-ink-soft shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px] transition-colors hover:text-forest-ink"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5" aria-hidden>
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08, ease: EASE }}
          className="paper-grain relative mt-4 rounded-[2rem] border border-line bg-paper px-5 py-8 shadow-[rgba(0,0,0,0.08)_0px_2px_8px_0px] sm:px-14 sm:py-14"
        >
          <div className="text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-blush px-4 py-1.5 text-xs font-semibold tracking-widest font-mono text-forest-ink uppercase">
              Open when
            </p>
            <h1 className="mt-4 font-display text-2xl leading-tight font-semibold text-ink sm:mt-5 sm:text-6xl">
              {letter.title}
            </h1>
            {letter.trigger && (
              <p className="mt-3 text-sm text-mist">{letter.trigger}</p>
            )}
            <p className="mt-2 text-xs text-mist">
              Sealed on {formatDate(letter.createdAt)}
            </p>
          </div>

          <div className="mx-auto my-6 flex items-center gap-4 sm:my-9" aria-hidden>
            <span className="h-px flex-1 bg-line" />
            <span className="text-forest-ink">♥</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <div className="space-y-7">
            {paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.25 + index * 0.14,
                  ease: EASE,
                }}
                className="font-display text-base leading-[1.75] whitespace-pre-line text-ink/90 sm:text-[1.3rem]"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          {letter.memoryImageUrl && (
            <MemoryCard src={letter.memoryImageUrl} alt={letter.title} />
          )}
        </motion.article>
      </div>
    </div>
  )
}
