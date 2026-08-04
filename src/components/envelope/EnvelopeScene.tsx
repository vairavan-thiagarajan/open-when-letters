import { useId } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { COVERS } from '@/data/covers'
import { EASE } from '@/utils/anim'

interface EnvelopeSceneProps {
  title: string
  cover: number
  opening: boolean
  onOpen: () => void
  onOpenComplete: () => void
  /** When true the envelope plays its sequence in reverse to "re-seal". */
  sealing?: boolean
  onSealed?: () => void
}

const heartTargets = [
  { x: -70, y: -90, delay: 0 },
  { x: 70, y: -90, delay: 0.05 },
  { x: -46, y: -70, delay: 0.12 },
  { x: 46, y: -70, delay: 0.12 },
  { x: -90, y: -50, delay: 0.18 },
  { x: 90, y: -50, delay: 0.18 },
  { x: -18, y: -120, delay: 0.1 },
  { x: 18, y: -120, delay: 0.1 },
]

const sparkleTargets = [
  { x: -84, y: -120, delay: 0.06 },
  { x: 84, y: -118, delay: 0.1 },
  { x: -120, y: -60, delay: 0.16 },
  { x: 120, y: -58, delay: 0.2 },
  { x: -64, y: -142, delay: 0.12 },
  { x: 66, y: -144, delay: 0.16 },
]

const paperRaised = { y: '-62%', opacity: 1, rotate: -2, scale: 1.04 }
const paperLowered = { y: '0%', opacity: 0, rotate: 0, scale: 1 }

export function EnvelopeScene({
  title,
  cover,
  opening,
  onOpen,
  onOpenComplete,
  sealing = false,
  onSealed,
}: EnvelopeSceneProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const palette = COVERS[cover % COVERS.length]
  const flapGradient = `flap-${uid}`
  const interactive = !opening && !sealing
  const active = opening || sealing

  const handleSealed = () => {
    if (sealing && onSealed) onSealed()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.08, y: -24 }}
      transition={{ duration: 0.55, ease: EASE }}
      className="relative"
    >
      <motion.div
        aria-hidden
        initial={{ opacity: 0.6, scale: 0.9 }}
        animate={{ opacity: active ? 1 : 0.6, scale: active ? 1.18 : 1 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="absolute -inset-12 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${palette.to}66 0%, transparent 65%)`,
        }}
      />

      <motion.button
        type="button"
        onClick={() => interactive && onOpen()}
        aria-label={`Open the letter: ${title}`}
        disabled={!interactive}
        className="group relative mx-auto block w-full max-w-[360px] cursor-pointer select-none disabled:cursor-default"
        style={{ perspective: 1000 }}
      >
        <motion.div
          animate={
            interactive ? { y: [0, -9, 0], rotate: [0, 0.6, -0.6, 0] } : { y: 0, rotate: 0 }
          }
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative aspect-[10/7] w-full"
        >
          <div
            className="absolute inset-0 rounded-xl shadow-[rgba(0,0,0,0.08)_0px_2px_8px_0px]"
            style={{ background: `linear-gradient(135deg, ${palette.from}, ${palette.to})` }}
          />

          <motion.div
            initial={sealing ? paperRaised : false}
            animate={opening ? paperRaised : paperLowered}
            transition={{
              duration: sealing ? 0.8 : 0.9,
              delay: opening ? 0.7 : sealing ? 0.15 : 0,
              ease: EASE,
            }}
            onAnimationComplete={() => {
              if (opening) onOpenComplete()
            }}
            className="absolute inset-x-[7%] top-[4%] bottom-[16%] z-[25] rounded-2xl border border-line bg-paper px-5 py-4 text-left shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]"
          >
            <p className="font-display text-2xl leading-tight text-ink">
              Open when {title}
            </p>
            <div className="mt-3 space-y-2">
              <div className="h-1.5 w-3/4 rounded-full bg-line" />
              <div className="h-1.5 w-2/3 rounded-full bg-line" />
              <div className="h-1.5 w-5/6 rounded-full bg-line" />
            </div>
          </motion.div>

          <div className="absolute inset-x-0 bottom-0 h-[52%] rounded-b-3xl border border-t-0 border-line bg-paper">
            <svg viewBox="0 0 320 148" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
              <path
                d="M24 136 L160 52 L296 136"
                fill="none"
                stroke="#f0e4dd"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-x-0 top-[14%] grid place-items-center text-forest-ink">
              <svg viewBox="0 0 24 24" fill="none" className="h-9 w-9 opacity-70" aria-hidden>
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

          <motion.div
            initial={sealing ? { rotateX: -180 } : false}
            animate={{ rotateX: active ? (sealing ? 0 : -180) : 0 }}
            transition={{
              duration: 0.65,
              delay: opening ? 0.15 : sealing ? 0.9 : 0,
              ease: [0.4, 0, 0.2, 1],
            }}
            style={{ transformOrigin: 'top', backfaceVisibility: 'hidden' }}
            onAnimationComplete={() => {
              if (sealing) handleSealed()
            }}
            className="absolute inset-x-0 top-0 z-[30] h-[52%]"
          >
            <svg viewBox="0 0 320 150" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
              <defs>
                <linearGradient id={flapGradient} x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0" stopColor={palette.to} />
                  <stop offset="1" stopColor={palette.from} />
                </linearGradient>
              </defs>
              <path
                d="M10 6 H310 L160 148 Z"
                fill={`url(#${flapGradient})`}
                stroke="rgba(70,52,59,0.08)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>

            <motion.span
              animate={active ? { opacity: 0, scale: 0.4, rotate: 20 } : { opacity: 1, scale: [1, 1.12, 1] }}
              transition={
                active
                  ? { duration: 0.3, delay: 0.15 }
                  : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
              }
              className="absolute left-1/2 top-[42%] grid -translate-x-1/2 place-items-center"
            >
              <svg viewBox="0 0 30 30" className="h-8 w-8" aria-hidden>
                <circle cx="15" cy="15" r="14" fill="#1a3300" opacity="0.35" />
                <path
                  d="M15 22 C 12.6 17.6 8.2 15.4 8.2 12 C 8.2 9.4 10.4 7.8 12.6 7.8 C 13.9 7.8 15 8.6 15 9.7 C 15 8.6 16.1 7.8 17.4 7.8 C 19.6 7.8 21.8 9.4 21.8 12 C 21.8 15.4 17.4 17.6 15 22 Z"
                  fill="#1a3300"
                />
              </svg>
            </motion.span>
          </motion.div>
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {opening && (
          <>
            {heartTargets.map((target, i) => (
              <motion.span
                key={`h-${i}`}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
                animate={{ opacity: [0, 1, 0], x: target.x, y: target.y, scale: 1.2 }}
                transition={{ duration: 1.1, delay: 0.55 + target.delay, ease: 'easeOut' }}
                className="pointer-events-none absolute left-1/2 top-[34%] text-forest-ink"
                aria-hidden
              >
                ♥
              </motion.span>
            ))}
            {sparkleTargets.map((target, i) => (
              <motion.span
                key={`s-${i}`}
                initial={{ opacity: 0, scale: 0, rotate: -30 }}
                animate={{ opacity: [0, 1, 0], x: target.x, y: target.y, scale: 1.4, rotate: 30 }}
                transition={{ duration: 1.2, delay: 0.6 + target.delay, ease: 'easeOut' }}
                className="pointer-events-none absolute left-1/2 top-[34%] text-lg text-highlighter-yellow"
                aria-hidden
              >
                ✦
              </motion.span>
            ))}
          </>
        )}
      </AnimatePresence>

      <motion.p
        animate={
          active ? { opacity: 0 } : { opacity: [0.55, 1, 0.55] }
        }
        transition={
          active
            ? { duration: 0.3 }
            : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
        }
        className="mt-6 text-center text-sm text-mist"
      >
        {sealing
          ? 'Sealing it again…'
          : opening
            ? 'Opening…'
            : 'Tap the envelope to open'}
      </motion.p>
    </motion.div>
  )
}
