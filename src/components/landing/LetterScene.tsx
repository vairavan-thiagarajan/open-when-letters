import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { EASE } from '@/utils/anim'

const notes = [
  {
    label: 'You miss me',
    tone: 'bg-sticky-note-mint',
    rotate: -7,
    className: 'left-0 top-[6%] w-[46%] max-w-[190px]',
    delay: 0.2,
  },
  {
    label: 'It is a hard day',
    tone: 'bg-sticky-note-teal',
    rotate: 6,
    className: 'right-0 top-[0%] w-[43%] max-w-[180px]',
    delay: 0.35,
  },
  {
    label: 'You win',
    tone: 'bg-sticky-note-blush',
    rotate: -4,
    className: 'right-[4%] bottom-[2%] w-[41%] max-w-[170px]',
    delay: 0.1,
  },
]

export function LetterScene() {
  return (
    <div className="relative mx-auto aspect-[10/11] h-full w-full max-w-md">
      {/* hand-drawn ring behind everything */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[112%] w-[112%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-line/50"
      />

      {/* pastel sticky notes fanned behind the envelope */}
      {notes.map((note) => (
        <motion.div
          key={note.label}
          initial={{ opacity: 0, y: 26, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.55 + note.delay, ease: EASE }}
          className={cn('absolute z-0', note.className)}
        >
          <motion.div
            animate={{
              y: [0, -9, 0],
              rotate: [note.rotate, note.rotate - 3, note.rotate],
            }}
            transition={{
              duration: 4.5 + note.delay * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ transform: `rotate(${note.rotate}deg)` }}
            className={cn(
              'relative rounded-xl px-4 pt-6 pb-4 shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]',
              note.tone,
            )}
          >
            {/* washi tape */}
            <span
              aria-hidden
              className="absolute -top-2 left-1/2 h-4 w-12 -translate-x-1/2 rotate-[-3deg] rounded-[2px] bg-highlighter-yellow/80"
            />
            <p className="text-[10px] font-semibold font-mono tracking-wider text-ink-soft uppercase">
              Open when
            </p>
            <p className="mt-1 font-display text-sm leading-snug font-semibold tracking-tight text-ink sm:text-base">
              {note.label}
            </p>
          </motion.div>
        </motion.div>
      ))}

      {/* the sealed envelope */}
      <motion.div
        initial={{ opacity: 0, y: 34, scale: 0.88 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.85, delay: 0.35, ease: EASE }}
        className="absolute inset-x-0 top-1/2 z-10 mx-auto w-[68%] max-w-[350px] -translate-y-1/2"
      >
        <motion.div
          animate={{ y: [0, -13, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
        >
          {/* washi tape corners */}
          <span
            aria-hidden
            className="absolute -top-3 left-[10%] z-20 h-5 w-14 -rotate-6 rounded-[3px] bg-highlighter-yellow/70"
          />
          <span
            aria-hidden
            className="absolute -top-3 right-[10%] z-20 h-5 w-14 rotate-6 rounded-[3px] bg-highlighter-yellow/70"
          />

          <svg viewBox="0 0 260 180" fill="none" className="h-auto w-full" aria-hidden>
            <defs>
              <linearGradient id="ls-body" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f2f1ea" />
                <stop offset="1" stopColor="#e3e1d5" />
              </linearGradient>
              <linearGradient id="ls-flap" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor="#f6f4ec" />
                <stop offset="1" stopColor="#e9e6d9" />
              </linearGradient>
            </defs>

            {/* soft ground shadow */}
            <ellipse cx="130" cy="172" rx="96" ry="9" fill="#1a3300" opacity="0.06" />

            {/* envelope back */}
            <rect x="26" y="30" width="208" height="132" rx="18" fill="url(#ls-body)" />

            {/* front panel */}
            <rect
              x="26"
              y="58"
              width="208"
              height="104"
              rx="18"
              fill="#fcfaf5"
              stroke="#cfcfcf"
              strokeWidth="1.5"
            />

            {/* fold lines */}
            <path
              d="M44 142 L130 94 L216 142"
              stroke="#cfcfcf"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* flap */}
            <path d="M26 56 L130 18 L234 56 Z" fill="url(#ls-flap)" />

            {/* wax seal */}
            <g>
              <circle cx="130" cy="62" r="16" fill="#ffe95c" />
              <path
                d="M130 62 C 127.6 57.6 123.2 55.4 123.2 52 C 123.2 49.4 125.4 47.8 127.6 47.8 C 128.9 47.8 130 48.6 130 49.7 C 130 48.6 131.1 47.8 132.4 47.8 C 134.6 47.8 136.8 49.4 136.8 52 C 136.8 55.4 132.4 57.6 130 62 Z"
                fill="#1a3300"
              />
            </g>
          </svg>

          {/* hanging tag */}
          <motion.div
            animate={{ rotate: [3, -2, 3] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-9 left-[8%] flex flex-col items-center"
            aria-hidden
          >
            <span className="h-3 w-px bg-pencil-gray" />
            <span className="-mt-px flex flex-col items-center rounded-md border border-line bg-paper px-2.5 py-1.5 shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]">
              <span className="h-1.5 w-1.5 rounded-full bg-highlighter-yellow" />
              <span className="mt-1 font-mono text-[9px] font-semibold tracking-widest text-ink-soft uppercase">
                for you
              </span>
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
