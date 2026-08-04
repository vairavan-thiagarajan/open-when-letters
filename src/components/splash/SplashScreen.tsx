import { useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { EASE } from '@/utils/anim'

interface SplashScreenProps {
  onComplete: () => void
}

const INTRO_MS = 3500

/**
 * Brand splash shown once on load. A sealed envelope floats in, the flap pops
 * open, a letter slips out and the wordmark highlights itself — then the whole
 * screen lifts away like a curtain to reveal the app.
 */
export function SplashScreen({ onComplete }: SplashScreenProps) {
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) {
      onComplete()
      return
    }
    const timer = setTimeout(onComplete, INTRO_MS)
    return () => clearTimeout(timer)
  }, [reduce, onComplete])

  if (reduce) return null

  return (
    <motion.div
      onClick={onComplete}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        y: '-100%',
        borderBottomLeftRadius: '50%',
        borderBottomRightRadius: '50%',
        transition: { duration: 0.8, ease: EASE },
      }}
      className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-forest-ink text-cream-paper"
    >
      {/* soft colour glows */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[12%] h-72 w-72 rounded-full bg-sticky-note-teal/15 blur-3xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-[-4rem] left-[10%] h-72 w-72 rounded-full bg-sticky-note-blush/15 blur-3xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-sticky-note-mint/10 blur-3xl"
      />

      {/* envelope scene */}
      <motion.svg
        viewBox="0 0 260 230"
        initial={{ opacity: 0, y: 40, scale: 0.94, rotate: -3 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
        className="h-auto w-[min(230px,64vw)]"
        aria-hidden
      >
        <motion.g
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 1, 0.72], y: [0, 0, 9] }}
          transition={{ delay: 1.3, duration: 0.7, ease: EASE }}
        >
          <ellipse cx="130" cy="218" rx="112" ry="8" fill="rgba(252,250,245,0.1)" />
          <rect x="10" y="52" width="240" height="150" rx="10" fill="#fcfaf5" />
          <path
            d="M10 52 L130 152 L250 52 L250 198 Q130 212 10 198 Z"
            fill="#f0e9d8"
          />
          <path
            d="M10 52 L130 152 L250 52"
            fill="none"
            stroke="rgba(252,250,245,0.45)"
            strokeWidth="2"
          />
        </motion.g>

        {/* flap, ring and wax seal */}
        <motion.g
          initial={{ y: 0, rotate: 0, opacity: 1 }}
          animate={{ y: -46, rotate: -9, opacity: [1, 1, 0.55] }}
          transition={{ delay: 1.05, duration: 0.6, ease: EASE }}
          style={{ transformOrigin: '130px 52px' }}
        >
          <path
            d="M10 52 L250 52 L130 152 Z"
            fill="#fcfaf5"
            stroke="rgba(26,51,0,0.08)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <motion.circle
            cx="130"
            cy="152"
            r="24"
            fill="none"
            stroke="#ffe95c"
            strokeWidth="2.5"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 0], scale: [0.6, 1.5, 1.8] }}
            transition={{ delay: 1.05, duration: 0.6, ease: 'easeOut' }}
            style={{ transformOrigin: '130px 152px' }}
          />
          <circle cx="130" cy="152" r="18" fill="#cb5521" />
          <g transform="translate(123.7 146.2) scale(0.7)">
            <path
              d="M12 20.5C7 16.5 3 13 3 8.8 3 6 5.2 4 7.9 4c1.7 0 3.1.8 4.1 2.2C13 4.8 14.4 4 16.1 4 18.8 4 21 6 21 8.8c0 4.2-4 7.7-9 11.7Z"
              fill="#fcfaf5"
            />
          </g>
        </motion.g>

        {/* the letter slipping out */}
        <motion.g
          initial={{ y: 34, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6, ease: EASE }}
        >
          <rect x="26" y="46" width="208" height="140" rx="8" fill="#fffdfa" />
          <rect
            x="44"
            y="78"
            width="150"
            height="7"
            rx="3.5"
            fill="rgba(26,51,0,0.16)"
          />
          <rect
            x="44"
            y="96"
            width="118"
            height="7"
            rx="3.5"
            fill="rgba(26,51,0,0.16)"
          />
          <rect
            x="44"
            y="114"
            width="140"
            height="7"
            rx="3.5"
            fill="rgba(26,51,0,0.16)"
          />
          <g transform="translate(180 72)">
            <path
              d="M12 20.5C7 16.5 3 13 3 8.8 3 6 5.2 4 7.9 4c1.7 0 3.1.8 4.1 2.2C13 4.8 14.4 4 16.1 4 18.8 4 21 6 21 8.8c0 4.2-4 7.7-9 11.7Z"
              fill="#cb5521"
            />
          </g>
        </motion.g>
      </motion.svg>

      {/* wordmark */}
      <div className="mt-10 text-center sm:mt-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6, ease: EASE }}
          className="font-display text-[clamp(2rem,9vw,3.75rem)] leading-none font-bold tracking-tight"
        >
          Open When
          <span className="mx-auto mt-1 block w-fit -rotate-1 rounded-[3px] bg-highlighter-yellow px-[0.15em] text-forest-ink">
            Letters
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.65, duration: 0.5, ease: EASE }}
          className="mt-4 font-mono text-[11px] font-semibold tracking-[0.22em] text-cream-paper/55 uppercase sm:text-xs"
        >
          Letters that wait for the right moment
        </motion.p>
      </div>
    </motion.div>
  )
}
