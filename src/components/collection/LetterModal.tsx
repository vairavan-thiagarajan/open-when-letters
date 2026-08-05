import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EnvelopeScene, type EnvelopeStage } from '@/components/envelope/EnvelopeScene'
import { LetterReaderSkeleton } from '@/components/ui/PageSkeletons'
import { FloatingHearts } from '@/components/effects/FloatingHearts'
import { EASE } from '@/utils/anim'
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

type Stage = 'envelope' | 'reading' | 'sealing'

/**
 * The immersive reading experience. A full-bleed "room" replaces the browser
 * chrome: an envelope you open, a letter you pull out and read on a real sheet
 * of paper, and a gentle way of putting it back.
 *
 * The page beneath (nav, footer, dashboard controls) is fully covered by an
 * opaque ambient surface — reading feels like handling an object, not a page.
 */
export function LetterModal({ letter, onClose }: LetterModalProps) {
  const [scenePhase, setScenePhase] = useState<EnvelopeStage>('idle')
  const [stage, setStage] = useState<Stage>('envelope')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (stage === 'sealing') return
      if (stage === 'reading') setStage('sealing')
      else onClose()
    },
    [stage, onClose],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Safety net: if the seal animation never completes, still close.
  useEffect(() => {
    if (stage !== 'sealing') return
    const timer = window.setTimeout(onClose, 2800)
    return () => window.clearTimeout(timer)
  }, [stage, onClose])

  // When sealing, scroll back to the top so the envelope scene is in view.
  useEffect(() => {
    if (stage === 'sealing') scrollRef.current?.scrollTo({ top: 0 })
  }, [stage])

  // Preload the reading chunk while the user is still pulling the letter out.
  useEffect(() => {
    if (scenePhase === 'pulling' || stage === 'reading') {
      void import('@/components/envelope/LetterView')
    }
  }, [scenePhase, stage])

  const openStart = useCallback(() => setScenePhase('opening'), [])
  const toReading = useCallback(() => {
    setStage('reading')
    setScenePhase('idle')
  }, [])
  const toSealing = useCallback(() => {
    setStage('sealing')
    setScenePhase('sealing')
  }, [])

  const sceneVisible = stage === 'envelope' || stage === 'sealing'
  const readingVisible = stage === 'reading' || stage === 'sealing'

  return (
    <motion.div
      ref={scrollRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      role="dialog"
      aria-modal="true"
      aria-label={`Open when ${letter.title}`}
      className="fixed inset-0 z-[80] overflow-y-auto overscroll-contain bg-forest-ink"
    >
      {/* ambient room — soft light, colour glows and a gentle vignette */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 80% at 50% 0%, #2e4d1c 0%, #1a3300 62%)',
          }}
        />
        <div
          className="absolute -top-32 left-1/2 h-96 w-[84%] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: 'rgba(168,229,229,0.1)' }}
        />
        <div
          className="absolute right-[4%] bottom-[-8%] h-80 w-80 rounded-full blur-3xl"
          style={{ background: 'rgba(203,85,33,0.16)' }}
        />
        <div
          className="absolute left-[-6%] bottom-[14%] h-72 w-72 rounded-full blur-3xl"
          style={{ background: 'rgba(246,208,255,0.08)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(90% 72% at 50% 42%, transparent 42%, rgba(12,24,0,0.55) 100%)',
          }}
        />
      </div>

      {/* scene layer — envelope + open/pull/seal sequence */}
      <AnimatePresence>
        {sceneVisible && (
          <motion.div
            key="scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative z-20 flex min-h-[100svh] flex-col items-center justify-center px-5 py-12"
          >
            <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-5 sm:px-8">
              <p className="font-mono text-xs font-semibold tracking-widest text-cream-paper/60 uppercase">
                You have a letter
              </p>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid h-11 w-11 place-items-center rounded-full border border-cream-paper/15 bg-cream-paper/10 text-cream-paper backdrop-blur transition-colors hover:bg-cream-paper/20"
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

            <div className="relative z-10 w-full">
              <FloatingHearts count={10} className="opacity-70" />
              <EnvelopeScene
                title={letter.title || 'this moment'}
                phase={stage === 'sealing' ? 'sealing' : scenePhase}
                onRequestOpen={openStart}
                onOpened={() => setScenePhase('pulling')}
                onPulledOut={toReading}
                onSealed={onClose}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* reading layer — the letter sheet, still mounted while sealing so the
          paper visually shrinks back toward the envelope */}
      <AnimatePresence>
        {readingVisible && (
          <motion.div
            key="reading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative z-10"
          >
            <motion.div
              animate={
                stage === 'sealing'
                  ? { scale: 0.88, opacity: 0.12, y: 80 }
                  : { scale: 1, opacity: 1, y: 0 }
              }
              transition={{ duration: 1.1, ease: EASE }}
            >
              <div className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 pt-4 sm:px-6">
                <p className="ml-1 rounded-full bg-forest-ink/60 px-4 py-2 font-mono text-[11px] font-semibold tracking-widest text-cream-paper/80 uppercase backdrop-blur">
                  A letter for you
                </p>
                <button
                  type="button"
                  onClick={toSealing}
                  disabled={stage === 'sealing'}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-cream-paper/15 bg-forest-ink/70 px-5 text-sm font-medium text-cream-paper backdrop-blur transition-colors hover:bg-forest-ink disabled:opacity-50"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Close letter
                </button>
              </div>

              <Suspense fallback={<LetterReaderSkeleton />}>
                <div key={`${letter.id}-content`} className="pt-2 pb-28 sm:pb-32">
                  <LetterView letter={letter} />
                </div>
              </Suspense>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
