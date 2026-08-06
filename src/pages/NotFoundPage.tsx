import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { usePageMeta } from '@/utils/meta'
import { EASE } from '@/utils/anim'

/**
 * The lost-letter 404. No dead ends — just a gentle nudge back home.
 */
export function NotFoundPage() {
  usePageMeta({
    title: 'Letter lost · Open When Letters',
    description:
      'This letter seems to have gone missing. Let us help you find your way back home.',
    path: '/404',
    noindex: true,
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center"
        >
          <p className="mx-auto grid h-24 w-24 place-items-center rounded-[2rem] bg-blush sm:h-28 sm:w-28">
            <svg viewBox="0 0 24 24" fill="none" className="h-12 w-12 text-forest-ink" aria-hidden>
              <rect x="3" y="6" width="18" height="13" rx="3" fill="currentColor" opacity="0.35" />
              <path
                d="M4.5 9l7.5 5 7.5-5"
                stroke="#fcfaf5"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="18.5" cy="6.5" r="3.5" fill="currentColor" opacity="0.18" />
            </svg>
          </p>

          <h1 className="mt-6 font-display text-[clamp(1.65rem,6.5vw,2.5rem)] leading-[1.1] font-semibold tracking-tight text-ink sm:text-5xl">
            Looks like this letter
            <br />
            got lost…
          </h1>

          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg">
            Let&apos;s help you find your way back.
          </p>

          <Link to="/" className="mt-8 inline-block">
            <Button size="lg">Return Home</Button>
          </Link>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
