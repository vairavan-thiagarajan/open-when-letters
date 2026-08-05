import { useCallback, useEffect, useRef } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion'
import { EASE } from '@/utils/anim'
import { cn } from '@/utils/cn'
import { LETTER_FONT_FAMILY } from '@/data/letterStudio'

export type EnvelopeStage = 'idle' | 'opening' | 'pulling' | 'sealing'

interface EnvelopeSceneProps {
  title: string
  phase: EnvelopeStage
  onRequestOpen: () => void
  /** Flap finished opening and the paper is peeking out — switch to pulling. */
  onOpened: () => void
  /** Paper has been fully pulled out — hand over to the reading view. */
  onPulledOut: () => void
  /** Envelope finished re-sealing — safe to return to the collection. */
  onSealed: () => void
}

/**
 * The reading envelope: a premium kraft-paper object (not a flat illustration)
 * with an opening sequence, a drag-to-pull-out letter, and a sealing sequence.
 *
 * Motion values drive every transform so the pull interaction stays buttery on
 * touch and mouse, and the whole scene degrades gracefully under reduced motion.
 */
export function EnvelopeScene({
  title,
  phase,
  onRequestOpen,
  onOpened,
  onPulledOut,
  onSealed,
}: EnvelopeSceneProps) {
  const reduce = useReducedMotion()
  const envRef = useRef<HTMLDivElement>(null)
  const dragStartY = useRef<number | null>(null)
  const dragging = useRef(false)

  /** 0 = paper hidden in the envelope, 1.18 = fully pulled out above it. */
  const travel = useMotionValue(0)
  /** 0..1 — how far the envelope has gently lifted off the table. */
  const lift = useMotionValue(0)

  const paperTransform = useTransform(travel, (v) =>
    `translate3d(0, ${-v * 100}%, 0) scale(${1 + v * 0.06}) rotate(${-v * 1.6}deg)`,
  )
  const envelopeY = useTransform(
    [lift, travel],
    ([l, t]: number[]) => `${-l * 12 + t * 26}px`,
  )
  const envelopeOpacity = useTransform(travel, (v) => 1 - v * 0.22)
  const groundShadow = useTransform(travel, (v) => 0.5 + v * 0.45)

  const flapOpen = phase !== 'idle'

  // Opening: lift, then flap opens, then the paper peeks out.
  useEffect(() => {
    if (phase !== 'opening') return
    animate(lift, 1, { duration: 0.7, ease: EASE })
    const t1 = window.setTimeout(() => {
      animate(travel, 0.16, { duration: 1, ease: EASE })
    }, 300)
    const t2 = window.setTimeout(() => onOpened(), 1750)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [phase, lift, travel, onOpened])

  // Sealing: paper lowers back in, flap closes, envelope settles.
  useEffect(() => {
    if (phase !== 'sealing') return
    travel.set(1.18)
    const t1 = window.setTimeout(() => {
      animate(travel, 0, { duration: 1.1, ease: EASE })
    }, 350)
    const t2 = window.setTimeout(() => {
      animate(lift, 0, { duration: 0.7, ease: EASE })
    }, 1500)
    const t3 = window.setTimeout(() => onSealed(), 2400)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
    }
  }, [phase, travel, lift, onSealed])

  // Reduced motion: skip the manual pull entirely.
  useEffect(() => {
    if (phase === 'pulling' && reduce) onPulledOut()
  }, [phase, reduce, onPulledOut])

  const finishPull = useCallback(() => {
    animate(travel, 1.18, { duration: 0.55, ease: EASE, onComplete: onPulledOut })
  }, [travel, onPulledOut])

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (phase !== 'pulling' || reduce) return
      dragging.current = true
      dragStartY.current = event.clientY
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    [phase, reduce],
  )

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging.current || dragStartY.current == null) return
      const height = envRef.current?.offsetHeight ?? 340
      const delta = dragStartY.current - event.clientY
      const fraction = Math.max(0, Math.min(1, delta / (height * 0.52)))
      travel.set(0.16 + fraction * (1 - 0.16))
    },
    [travel],
  )

  const handlePointerEnd = useCallback(() => {
    if (!dragging.current) return
    dragging.current = false
    dragStartY.current = null
    if (travel.get() >= 0.5) finishPull()
    else animate(travel, 0.16, { duration: 0.5, ease: EASE })
  }, [travel, finishPull])

  const hint =
    phase === 'idle'
      ? 'Tap the envelope to open'
      : phase === 'opening'
        ? 'Opening…'
        : phase === 'pulling'
          ? 'Gently pull the letter up'
          : 'Sealing it away…'

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative w-full max-w-[400px] sm:max-w-[460px]"
      >
        {/* ambient warm glow behind the envelope */}
        <motion.div
          aria-hidden
          animate={{
            opacity: phase === 'idle' ? 0.55 : 0.95,
            scale: phase === 'idle' ? 1 : 1.18,
          }}
          transition={{ duration: 1.4, ease: EASE }}
          className="absolute -inset-12 rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(203,85,33,0.32) 0%, rgba(203,85,33,0.12) 45%, transparent 70%)',
          }}
        />

        {/* gentle idle float */}
        <motion.div
          animate={phase === 'idle' ? { y: [0, -8, 0] } : { y: 0 }}
          transition={
            phase === 'idle'
              ? { duration: 5.5, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.4 }
          }
        >
          <div
            ref={envRef}
            role="button"
            tabIndex={phase === 'idle' ? 0 : -1}
            aria-label={`Open the letter: ${title}`}
            onClick={() => phase === 'idle' && onRequestOpen()}
            onKeyDown={(event) => {
              if (phase !== 'idle') return
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onRequestOpen()
              }
            }}
            className={cn(
              'relative aspect-[10/7] w-full select-none',
              phase === 'idle' && 'cursor-pointer',
            )}
            style={{ perspective: 1200 }}
          >
            <motion.div style={{ y: envelopeY, opacity: envelopeOpacity }}>
              {/* ground shadow that deepens as the letter lifts out */}
              <motion.div
                aria-hidden
                style={{ opacity: groundShadow }}
                className="absolute -bottom-9 left-1/2 h-6 w-[88%] -translate-x-1/2 rounded-[50%] bg-black/50 blur-xl"
              />

              <div className="relative aspect-[10/7] w-full">
                {/* back panel — kraft paper */}
                <div
                  className="absolute inset-0 rounded-xl shadow-[0_28px_56px_-20px_rgba(0,0,0,0.55)]"
                  style={{
                    background:
                      'linear-gradient(155deg, var(--color-kraft) 0%, var(--color-kraft-deep) 55%, var(--color-kraft-dark) 100%)',
                  }}
                />
                <div className="kraft-grain absolute inset-0 rounded-xl" aria-hidden />

                {/* the letter — inside the pocket, drag handle while pulling */}
                <motion.div
                  style={{ transform: paperTransform, touchAction: 'none' }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerEnd}
                  onPointerCancel={handlePointerEnd}
                  className={cn(
                    'absolute inset-x-[6%] top-[6%] bottom-[10%] z-10',
                    phase === 'pulling' && 'cursor-grab active:cursor-grabbing',
                  )}
                >
                  <div className="paper-grain flex h-full w-full flex-col rounded-sm bg-paper px-4 pt-3 shadow-[0_14px_28px_-16px_rgba(26,51,0,0.45)]">
                    <p
                      className="text-sm leading-snug font-semibold text-ink sm:text-base"
                      style={{ fontFamily: LETTER_FONT_FAMILY, fontStyle: 'italic' }}
                    >
                      Open when {title}
                    </p>
                    <div className="mt-2 space-y-1.5">
                      <div className="h-1 w-3/4 rounded-full bg-line/60" />
                      <div className="h-1 w-2/3 rounded-full bg-line/60" />
                      <div className="h-1 w-5/6 rounded-full bg-line/60" />
                    </div>
                  </div>
                </motion.div>

                {/* front pocket with fold lines */}
                <div
                  className="absolute inset-x-0 bottom-0 z-20 h-[56%]"
                  style={{
                    background:
                      'linear-gradient(180deg, var(--color-kraft-deep) 0%, var(--color-kraft-dark) 100%)',
                  }}
                >
                  <svg
                    viewBox="0 0 320 148"
                    preserveAspectRatio="none"
                    className="h-full w-full"
                    aria-hidden
                  >
                    <path
                      d="M14 142 L160 54 L306 142"
                      fill="none"
                      stroke="rgba(74,52,20,0.28)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-x-0 top-[20%] grid place-items-center">
                    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-forest-ink/40" aria-hidden>
                      <rect x="3" y="6" width="18" height="13" rx="3" fill="currentColor" />
                      <path
                        d="M4.5 9l7.5 5 7.5-5"
                        stroke="#fcfaf5"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>

                {/* flap — rotates open/closed from its top edge */}
                <motion.div
                  initial={phase === 'sealing' ? { rotateX: -150 } : false}
                  animate={{ rotateX: phase === 'sealing' ? 0 : flapOpen ? -150 : 0 }}
                  transition={{
                    duration: 1,
                    delay: phase === 'sealing' ? 1.3 : phase === 'opening' ? 0.2 : 0,
                    ease: EASE,
                  }}
                  style={{ transformOrigin: 'top center', backfaceVisibility: 'hidden' }}
                  className="pointer-events-none absolute inset-x-0 top-0 z-40 h-[54%]"
                >
                  <div
                    className="relative h-full w-full rounded-t-xl"
                    style={{
                      background:
                        'linear-gradient(180deg, var(--color-kraft) 0%, var(--color-kraft-deep) 100%)',
                      clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                    }}
                  >
                    <div className="kraft-grain absolute inset-0" aria-hidden />
                    {/* heart wax seal */}
                    <span
                      aria-hidden
                      className="absolute top-[56%] left-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.35),inset_0_-3px_6px_rgba(0,0,0,0.28),0_2px_6px_rgba(0,0,0,0.35)]"
                      style={{
                        background:
                          'linear-gradient(135deg, var(--color-terracotta) 0%, #a84317 100%)',
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-cream-paper/90" aria-hidden>
                        <path
                          d="M12 20.5C7 16.5 3 13 3 8.8 3 6 5.2 4 7.9 4c1.7 0 3.1.8 4.1 2.2C13 4.8 14.4 4 16.1 4 18.8 4 21 6 21 8.8c0 4.2-4 7.7-9 11.7Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                  </div>
                </motion.div>

                {/* lighting sweep — makes the kraft read as dimensional */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-50 rounded-xl"
                  style={{
                    background:
                      'linear-gradient(115deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.06) 34%, rgba(90,60,25,0.08) 80%, rgba(90,60,25,0.2) 100%)',
                    boxShadow:
                      'inset 0 1px 1px rgba(255,255,255,0.35), inset 0 -1px 1px rgba(74,52,20,0.18)',
                  }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* hint line */}
      <motion.p
        key={hint}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="mt-10 min-h-5 text-center text-sm text-cream-paper/70"
      >
        {hint}
      </motion.p>

      {/* tactile CTA / fallback for keyboards, screen readers and reduced motion */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {phase === 'idle' && (
          <button
            type="button"
            onClick={onRequestOpen}
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-highlighter-yellow px-7 text-sm font-semibold tracking-tight text-forest-ink shadow-[0_12px_28px_-12px_rgba(255,233,92,0.8)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            Open the letter
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
              <path
                d="M12 5v13m0 0l-5-5m5 5l5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        {phase === 'pulling' && (
          <button
            type="button"
            onClick={finishPull}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-cream-paper/25 bg-cream-paper/10 px-7 text-sm font-medium text-cream-paper backdrop-blur transition-colors hover:bg-cream-paper/20"
          >
            Lift the letter out
          </button>
        )}
      </div>
    </div>
  )
}
