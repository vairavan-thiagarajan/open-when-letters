import { motion } from 'framer-motion'
import { EnvelopeThumb } from '@/components/letters/EnvelopeThumb'
import type { CollectionLetter } from '@/services/types'
import { getUnlockWindow, UNLOCK_META, countdownLabel } from '@/utils/schedule'
import { useNow } from '@/hooks/useNow'
import { cn } from '@/utils/cn'
import { EASE } from '@/utils/anim'

interface LockedLetterCardProps {
  letter: CollectionLetter
  index: number
  shadow?: boolean
  /** Visitor mode: the card comes into focus with the reveal cascade. */
  visitor?: boolean
}

/**
 * A sealed, not-yet-openable letter: the envelope cover with its name and a
 * live countdown beneath, no outer box.
 */
export function LockedLetterCard({ letter, index, shadow, visitor }: LockedLetterCardProps) {
  const now = useNow()
  const window = getUnlockWindow(letter, now)
  const meta = UNLOCK_META[letter.unlockType]
  const label = letter.title || undefined

  return (
    <motion.div
      initial={
        visitor ? { opacity: 0, y: 32, filter: 'blur(10px)' } : { opacity: 0, y: 24 }
      }
      animate={visitor ? undefined : { opacity: 1, y: 0 }}
      whileInView={visitor ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined}
      viewport={visitor ? { once: true, margin: '-60px' } : undefined}
      transition={{
        duration: visitor ? 1 : 0.55,
        delay: Math.min(index * (visitor ? 0.18 : 0.06), visitor ? 1 : 0.5),
        ease: EASE,
      }}
      aria-label={`Locked letter: ${letter.title || 'Untitled'}`}
      className="flex h-full flex-col p-2"
    >
      <EnvelopeThumb cover={letter.coverImage} locked label={label} shadow={shadow} />

      <div className="mt-3 flex-1 text-center">
        <p className="font-mono text-[11px] font-semibold tracking-widest text-mist uppercase">
          Opens {window.label} · {meta.label}
        </p>
        {window.target && (
          <p
            className={cn(
              'mt-1 font-display text-xl font-semibold tracking-tight tabular-nums',
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
