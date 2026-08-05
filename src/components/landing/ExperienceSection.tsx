import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { EnvelopeScene } from '@/components/envelope/EnvelopeScene'
import { LetterModal } from '@/components/collection/LetterModal'
import { FloatingHearts } from '@/components/effects/FloatingHearts'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/landing/SectionHeading'
import { SAMPLE_LETTER } from '@/data/sampleLetter'

const sampleCollections = [
  "Open When You're Sad",
  'Open When You Miss Me',
  '100 Reasons I Love You',
  'Open When You Need Hope',
]

/**
 * "Experience It Yourself" — a live sample of the reading experience.
 *
 * The envelope and the letter are the real production components (EnvelopeScene
 * + LetterModal), so what a visitor tries here is exactly what a recipient
 * receives. Nothing is re-implemented for the homepage.
 */
export function ExperienceSection() {
  const [open, setOpen] = useState(false)

  return (
    <section className="relative px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="A letter, just for you"
            title="Experience It Yourself"
            text="Open a real sample letter and discover what makes Open When Letters special."
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-14">
          <div
            className="relative mx-auto max-w-2xl overflow-hidden rounded-[2.5rem] px-6 pt-12 pb-12 text-center sm:px-10"
            style={{
              background:
                'radial-gradient(120% 90% at 50% 0%, #24401a 0%, #1a3300 58%, #14250e 100%)',
            }}
          >
            {/* ambience: soft glows + vignette, like the reading room */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div
                className="absolute -top-20 left-1/2 h-64 w-[85%] -translate-x-1/2 rounded-full blur-3xl"
                style={{ background: 'rgba(168,229,229,0.1)' }}
              />
              <div
                className="absolute -bottom-12 left-1/2 h-52 w-80 -translate-x-1/2 rounded-full blur-3xl"
                style={{ background: 'rgba(203,85,33,0.2)' }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(90% 70% at 50% 45%, transparent 45%, rgba(12,24,0,0.5) 100%)',
                }}
              />
            </div>

            <FloatingHearts count={8} className="opacity-60" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-cream-paper/15 bg-cream-paper/10 px-4 py-1.5 font-mono text-[11px] font-semibold tracking-widest text-cream-paper/70 uppercase backdrop-blur">
                ✦ A sample experience
              </span>

              <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-cream-paper sm:text-3xl">
                Open When You're Having A Bad Day
              </h3>

              <div className="mx-auto mt-9 w-full max-w-[400px] sm:max-w-[460px]">
                <EnvelopeScene
                  title="You're Having A Bad Day"
                  phase="idle"
                  onRequestOpen={() => setOpen(true)}
                  onOpened={() => {}}
                  onPulledOut={() => {}}
                  onSealed={() => {}}
                />
              </div>

              <p className="mt-6 text-sm text-cream-paper/70">
                Created by{' '}
                <span className="font-semibold text-cream-paper">
                  Someone Who Cares About You
                </span>
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-[1.5rem] bg-blush">
              <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-forest-ink" aria-hidden>
                <path
                  d="M12 20.5C7 16.5 3 13 3 8.8 3 6 5.2 4 7.9 4c1.7 0 3.1.8 4.1 2.2C13 4.8 14.4 4 16.1 4 18.8 4 21 6 21 8.8c0 4.2-4 7.7-9 11.7Z"
                  fill="currentColor"
                />
              </svg>
            </span>

            <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
              That was just one letter.
            </h3>
            <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-ink-soft">
              Imagine receiving an entire collection written just for you.
            </p>

            <ul className="mx-auto mt-8 flex max-w-lg flex-wrap items-center justify-center gap-3">
              {sampleCollections.map((title) => (
                <li
                  key={title}
                  className="rounded-full border border-line bg-paper px-4 py-2 text-sm font-medium text-ink shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]"
                >
                  {title}
                </li>
              ))}
            </ul>

            <Link to="/signup" className="mt-10 inline-block">
              <Button size="lg">
                Create Your Own Collection
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                  <path
                    d="M5 12h14m0 0l-6-6m6 6l-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </Link>
          </div>
        </Reveal>
      </div>

      <AnimatePresence>
        {open && (
          <LetterModal letter={SAMPLE_LETTER} onClose={() => setOpen(false)} />
        )}
      </AnimatePresence>
    </section>
  )
}
