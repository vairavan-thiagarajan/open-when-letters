import { motion } from 'framer-motion'
import type { CollectionLetter } from '@/services/types'
import { getUnlockWindow, UNLOCK_META, countdownLabel } from '@/utils/schedule'
import { useNow } from '@/hooks/useNow'
import { cn } from '@/utils/cn'
import { EASE } from '@/utils/anim'

interface LockedLetterCardProps {
  letter: CollectionLetter
  index: number
}

/** A sealed, not-yet-openable letter card with a live countdown. */
export function LockedLetterCard({ letter, index }: LockedLetterCardProps) {
  const now = useNow()
  const window = getUnlockWindow(letter, now)
  const meta = UNLOCK_META[letter.unlockType]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: EASE }}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-paper p-6 shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]"
      aria-label={`Locked letter: ${letter.title || 'Untitled'}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,transparent,black_70%)]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%231a3300' stroke-opacity='0.14' stroke-width='1.5'%3E%3Ccircle cx='60' cy='60' r='14'/%3E%3Ccircle cx='60' cy='60' r='26'/%3E%3Ccircle cx='60' cy='60' r='40'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blush">
          <span className="h-3 w-3 rounded-sm bg-forest-ink" />
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blush/70 px-3 py-1 text-[11px] font-semibold tracking-widest font-mono text-ink-soft uppercase">
          <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
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
      </div>

      <div className="relative mt-5">
        <p className="text-[11px] font-semibold tracking-widest font-mono text-forest-ink uppercase">
          Open when · {meta.label}
        </p>
        <h3 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-ink">
          {letter.title || 'Untitled letter'}
        </h3>
        {letter.trigger && (
          <p className="mt-1 text-sm text-ink-soft">{letter.trigger}</p>
        )}
      </div>

      <div className="relative mt-6 rounded-2xl border border-dashed border-line bg-cream/60 px-4 py-3.5">
        <p className="text-center text-[11px] font-semibold tracking-widest font-mono text-mist uppercase">
          Opens {window.label}
        </p>
        {window.target && (
          <p
            className={cn(
              'mt-1 text-center font-display text-xl font-semibold tracking-tight tabular-nums',
              window.unlocked ? 'text-forest-ink' : 'text-ink',
            )}
          >
            {window.unlocked ? 'It is open now' : countdownLabel(window.target, now)}
          </p>
        )}
      </div>
    </motion.div>
  )
}
