import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EnvelopeScene } from '@/components/envelope/EnvelopeScene'
import { LetterReaderSkeleton } from '@/components/ui/PageSkeletons'
import { FloatingHearts } from '@/components/effects/FloatingHearts'
import { EASE, springs } from '@/utils/anim'
import type { CollectionLetter } from '@/services/types'

const LetterView = lazy(() =>
  import('@/components/envelope/LetterView').then((module) => ({
    default: module.LetterView,
  })),
)

interface LetterModalProps {
  letter: CollectionLetter
  onClose: () => void
}

type Phase = 'envelope' | 'opened' | 'sealing'

export function LetterModal({ letter, onClose }: LetterModalProps) {
  const [phase, setPhase] = useState<Phase>('envelope')
  const [opening, setOpening] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleCloseLetter = useCallback(() => {
    setPhase('sealing')
  }, [])

  // Safety net: if the seal animation's completion callback never fires, close
  // anyway so the reader always lands back on the collection grid.
  useEffect(() => {
    if (phase !== 'sealing') return
    const timer = window.setTimeout(onClose, 2000)
    return () => window.clearTimeout(timer)
  }, [phase, onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Open when ${letter.title}`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={phase === 'opened' ? handleCloseLetter : onClose}
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.98 }}
        transition={springs.soft}
        className="relative z-10 flex max-h-[92svh] w-full flex-col overflow-hidden rounded-t-[2rem] border border-line bg-paper shadow-[rgba(0,0,0,0.08)_0px_2px_8px_0px] sm:max-w-2xl sm:rounded-[2rem]"
      >
        <div className="min-h-0 w-full flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {phase === 'opened' ? (
              <Suspense fallback={<LetterReaderSkeleton />}>
                <div key={`${letter.id}-content`} className="py-6">
                  <LetterView letter={letter} onClose={handleCloseLetter} />
                </div>
              </Suspense>
            ) : (
              <div
                key="envelope"
                className="relative flex flex-col items-center px-6 py-10 sm:py-12"
              >
                <FloatingHearts count={10} className="opacity-60" />

                {/* subtle scene shift while opening / sealing */}
                <motion.div
                  aria-hidden
                  initial={false}
                  animate={{ opacity: opening ? 1 : 0, scale: opening ? 1 : 0.96 }}
                  transition={{ duration: 0.9, ease: EASE }}
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(ellipse at 50% 42%, var(--color-blush-deep) 0%, transparent 68%)',
                  }}
                />

                <div className="relative z-10 flex w-full items-center justify-between">
                  <p className="text-xs font-semibold tracking-widest font-mono text-forest-ink uppercase">
                    You have a letter
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="grid h-11 w-11 place-items-center rounded-full border border-line bg-paper/80 text-ink-soft transition-colors hover:text-forest-ink"
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
                </div>

                <div className="relative z-10 mt-4 w-full max-w-md">
                  <EnvelopeScene
                    title={letter.title || 'this moment'}
                    cover={letter.coverImage}
                    opening={opening}
                    onOpen={() => setOpening(true)}
                    onOpenComplete={() => {
                      setOpening(false)
                      setPhase('opened')
                    }}
                    sealing={phase === 'sealing'}
                    onSealed={onClose}
                  />
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
