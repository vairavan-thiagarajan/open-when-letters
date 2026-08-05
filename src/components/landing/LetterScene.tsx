import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { EASE } from '@/utils/anim'
import { EnvelopeThumb } from '@/components/letters/EnvelopeThumb'

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

          <EnvelopeThumb cover={0} locked className="w-full" />

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
