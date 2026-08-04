import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { FloatingHearts } from '@/components/effects/FloatingHearts'
import { LetterScene } from '@/components/landing/LetterScene'
import { EASE } from '@/utils/anim'

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      {/* ambient background — soft forest/mint tones */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60%_50%_at_18%_0%,#e8f8e0_0%,transparent_60%),radial-gradient(50%_45%_at_88%_15%,#fff9dc_0%,transparent_60%)]"
      />
      <FloatingHearts count={10} />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        {/* Copy */}
        <div className="w-full max-w-xl min-w-0">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-highlighter-yellow/50 bg-cream/70 px-4 py-1.5 text-sm font-medium text-forest-ink shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px] backdrop-blur font-mono"
          >
            A collection of love letters
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
            className="mt-6 font-display text-[clamp(1.65rem,7vw,2.6rem)] leading-[1.05] font-semibold tracking-tight text-ink sm:text-6xl"
          >
            Letters that wait
            <br />
            for the{' '}
            <span className="relative whitespace-nowrap">
              right moment
              <span
                aria-hidden
                className="absolute inset-x-[-4px] bottom-[3px] -z-10 block h-[35%] rounded-sm bg-highlighter-yellow/60"
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
            className="mt-6 text-base leading-relaxed text-ink-soft sm:text-lg"
          >
            Write a collection of heartfelt letters — one for missing me, one for
            bad days, one for every moment in between — then share it with the
            person you love using a single, beautiful link.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link to="/create">
              <Button size="lg">
                Create a collection
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </Link>
            <a href="/#how-it-works">
              <Button size="lg" variant="outline">
                See how it works
              </Button>
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 text-sm text-mist font-mono"
          >
            One link · Unlimited letters · No account needed
          </motion.p>
        </div>

        {/* Visual */}
        <div className="relative mx-auto h-[380px] w-full max-w-md min-w-0 sm:h-[500px] lg:max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="h-full w-full"
          >
            <LetterScene />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
