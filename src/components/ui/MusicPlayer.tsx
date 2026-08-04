import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface MusicPlayerProps {
  src: string
}

/** Floating music player that loops an attached audio file. */
export function MusicPlayer({ src }: MusicPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio(src)
    audio.loop = true
    audioRef.current = audio
    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [src])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      void audio.play()
    }
    setPlaying(!playing)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
      className="fixed right-5 bottom-5 z-[70] sm:right-8 sm:bottom-8"
    >
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? 'Pause music' : 'Play music'}
        className="group flex items-center gap-3 rounded-full border border-line bg-paper py-2 pr-5 pl-2 shadow-[rgba(0,0,0,0.08)_0px_2px_8px_0px] transition-transform hover:-translate-y-0.5"
      >
        <span
          className={cn(
            'grid h-10 w-10 place-items-center rounded-full text-lg transition-colors',
            playing ? 'bg-forest-ink text-cream-paper' : 'bg-blush text-forest-ink',
          )}
        >
          {playing ? (
            <span className="flex items-end gap-[3px] px-1" aria-hidden>
              {[0, 1, 2].map((bar) => (
                <motion.span
                  key={bar}
                  animate={playing ? { scaleY: [0.35, 1, 0.35] } : { scaleY: 0.35 }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: bar * 0.15, ease: 'easeInOut' }}
                  className="h-4 w-[3px] origin-bottom rounded-full bg-current"
                />
              ))}
            </span>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
              <path d="M7 4.5v15l13-7.5-13-7.5z" />
            </svg>
          )}
        </span>
        <span className="pr-1 text-xs font-semibold tracking-wide text-ink">
          {playing ? 'Playing' : 'Play music'}
        </span>
      </button>
    </motion.div>
  )
}
