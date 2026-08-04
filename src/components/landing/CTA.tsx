import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { FloatingHearts } from '@/components/effects/FloatingHearts'
import { EASE } from '@/utils/anim'

export function CTA() {
  return (
    <section className="relative px-5 py-20 sm:px-8 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-[linear-gradient(120deg,#1a3300_0%,#4a7030_55%,#1a3300_100%)] px-6 py-16 text-center shadow-[rgba(0,0,0,0.08)_0px_2px_8px_0px] sm:px-12 sm:py-28"
      >
        <FloatingHearts count={10} className="opacity-70" />

        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-5xl">
            The right words, ready
            <br />
            for the <em className="italic">right</em> moment.
          </h2>

          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-cream-paper/90">
            Start a collection now, while the feelings are fresh. Add letters as
            the moments come to mind — then share one beautiful link.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link to="/create">
              <Button
                size="lg"
                className="bg-paper text-forest-ink shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px] hover:bg-white"
              >
                Create a collection
              </Button>
            </Link>
            <Link to="/create">
              <Button
                size="lg"
                variant="ghost"
                className="border border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                I'll start with one letter
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
