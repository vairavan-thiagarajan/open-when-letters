import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { EASE, springs } from '@/utils/anim'
import { cn } from '@/utils/cn'

const tickerPhrases = [
  'Open when you miss me',
  "Open when you're proud",
  'Open when it rains',
  'Open when you feel lost',
  'Open when you need a hug',
  'Open when you achieve big things',
  "Open when you're celebrating",
  'Open when the day feels long',
]

const exploreLinks = [
  { label: 'Create a collection', to: '/create' },
  { label: 'How it works', to: '/#how-it-works' },
  { label: 'Start a collection', to: '/create' },
  { label: 'Design principles', to: '/design' },
]

const ideaLinks = [
  { label: 'For birthdays', to: '/create' },
  { label: 'For bad days', to: '/create' },
  { label: 'For anniversaries', to: '/create' },
  { label: 'For every milestone', to: '/create' },
]

function HeartGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 20.5C7 16.5 3 13 3 8.8 3 6 5.2 4 7.9 4c1.7 0 3.1.8 4.1 2.2C13 4.8 14.4 4 16.1 4 18.8 4 21 6 21 8.8c0 4.2-4 7.7-9 11.7Z"
        fill="currentColor"
      />
    </svg>
  )
}

function FooterMark() {
  return (
    <Link
      to="/"
      className="group flex w-fit items-center gap-2.5"
      aria-label="Open When Letters — home"
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-highlighter-yellow text-forest-ink shadow-soft transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
        <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-5" aria-hidden>
          <rect x="2.5" y="5" width="19" height="14" rx="3.5" fill="currentColor" />
          <path
            d="M4 8l8 5.5L20 8"
            stroke="#fcfaf5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </span>
      <span className="font-display text-[1.35rem] leading-none font-semibold tracking-tight text-cream-paper">
        Open When
      </span>
    </Link>
  )
}

function ColumnLabel({ tone, children }: { tone: string; children: ReactNode }) {
  return (
    <span className="flex items-center gap-2 font-mono text-xs font-semibold tracking-widest text-cream-paper/50 uppercase">
      <span className={cn('h-1.5 w-5 rounded-full', tone)} />
      {children}
    </span>
  )
}

function FooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="group relative w-fit text-sm text-cream-paper/70 transition-colors hover:text-cream-paper"
    >
      {children}
      <span
        aria-hidden
        className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-highlighter-yellow transition-transform duration-300 group-hover:scale-x-100"
      />
    </Link>
  )
}

export function Footer() {
  const reduce = useReducedMotion()

  return (
    <footer className="relative overflow-hidden bg-forest-ink text-cream-paper">
      {/* soft colour glows */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[8%] h-72 w-72 rounded-full bg-sticky-note-mint/10 blur-3xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-8 left-[4%] h-64 w-64 rounded-full bg-sticky-note-blush/10 blur-3xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sticky-note-teal/10 blur-3xl"
      />

      {/* ticker ribbon */}
      <div className="relative overflow-hidden border-y border-forest-ink/15 bg-highlighter-yellow py-3 sm:py-4">
        <motion.div
          className="flex w-max items-center whitespace-nowrap will-change-transform"
          animate={reduce ? undefined : { x: ['0%', '-50%'] }}
          transition={{ duration: 32, ease: 'linear', repeat: Infinity }}
        >
          {[0, 1].map((copy) => (
            <div key={copy} aria-hidden={copy === 1} className="flex items-center">
              {tickerPhrases.map((phrase) => (
                <span key={phrase} className="flex items-center">
                  <span className="px-5 font-display text-sm font-bold tracking-tight text-forest-ink uppercase sm:px-8 sm:text-base lg:text-lg">
                    {phrase}
                  </span>
                  <HeartGlyph className="h-3.5 w-3.5 shrink-0 text-forest-ink/50 sm:h-4 sm:w-4" />
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pt-20 pb-10 sm:px-8">
        {/* ghost wordmark */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 select-none text-center font-display text-[24vw] leading-none font-bold tracking-tight whitespace-nowrap text-cream-paper/5 lg:text-[16rem]"
        >
          Open When
        </span>

        <div className="relative flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          {/* signature headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="max-w-xl"
          >
            <p className="font-mono text-xs font-semibold tracking-widest text-highlighter-yellow uppercase">
              P.S. — keep this letter for later
            </p>
            <h2 className="mt-4 font-display text-[clamp(1.75rem,7vw,3rem)] leading-[1.04] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Sealed with love,
              <br />
              for the{' '}
              <span className="relative whitespace-nowrap">
                right moment.
                <span
                  aria-hidden
                  className="absolute inset-x-[-4px] bottom-[6px] -z-10 block h-[32%] rounded-sm bg-highlighter-yellow/70"
                />
              </span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-cream-paper/70">
              Every collection is a promise: no matter when they open it, the
              words will be ready — and they will still be true.
            </p>
          </motion.div>

          {/* postage stamp */}
          <motion.div
            whileHover={{ y: -6, rotate: -4 }}
            transition={springs.gentle}
            className="relative shrink-0 self-start md:self-auto"
          >
            <span
              aria-hidden
              className="absolute -top-2 left-6 z-10 h-5 w-14 rotate-[-8deg] rounded-[3px] bg-highlighter-yellow/90"
            />
            <div className="rounded-2xl border-2 border-dashed border-cream-paper/30 bg-cream-paper p-2.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.45)]">
              <div className="flex h-32 w-32 flex-col items-center justify-center gap-2.5 rounded-xl bg-forest-ink sm:h-36 sm:w-36">
                <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden>
                  <rect
                    x="2.5"
                    y="5"
                    width="19"
                    height="14"
                    rx="3.5"
                    fill="none"
                    stroke="#fcfaf5"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M4 8l8 5.5L20 8"
                    stroke="#fcfaf5"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="18.5" cy="6.5" r="2.25" fill="#ffe95c" />
                </svg>
                <span className="px-3 text-center font-mono text-[9px] leading-tight font-semibold tracking-widest text-cream-paper/85 uppercase">
                  Open when needed
                </span>
              </div>
            </div>
            <motion.span
              initial={{ rotate: -24, scale: 0.5 }}
              whileInView={{ rotate: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={springs.soft}
              aria-hidden
              className="absolute -right-3 -bottom-3 grid h-11 w-11 place-items-center rounded-full bg-terracotta shadow-[0_8px_20px_-6px_rgba(203,85,33,0.55)]"
            >
              <HeartGlyph className="h-5 w-5 text-cream-paper" />
            </motion.span>
          </motion.div>
        </div>

        {/* links */}
        <div className="mt-16 grid gap-10 border-t border-cream-paper/15 pt-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:gap-12">
          <div className="max-w-xs">
            <FooterMark />
            <p className="mt-4 text-sm leading-relaxed text-cream-paper/70">
              Letters, sealed with love, waiting for the moments that need them
              most.
            </p>
          </div>

          <nav aria-label="Explore" className="flex flex-col gap-3.5">
            <ColumnLabel tone="bg-sticky-note-teal">Explore</ColumnLabel>
            {exploreLinks.map((link) => (
              <FooterLink key={link.label} to={link.to}>
                {link.label}
              </FooterLink>
            ))}
          </nav>

          <nav aria-label="Ideas" className="flex flex-col gap-3.5">
            <ColumnLabel tone="bg-sticky-note-blush">Ideas</ColumnLabel>
            {ideaLinks.map((link) => (
              <FooterLink key={link.label} to={link.to}>
                {link.label}
              </FooterLink>
            ))}
          </nav>

          <div className="flex flex-col gap-3 rounded-2xl bg-cream-paper p-5 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.5)] sm:max-w-xs lg:w-56">
            <span className="font-mono text-xs font-semibold tracking-widest text-forest-ink/60 uppercase">
              Start now
            </span>
            <p className="text-sm leading-relaxed text-forest-ink/80">
              The perfect moment to write is right now.
            </p>
            <Link to="/create" className="mt-1 w-fit">
              <Button size="sm">Write a letter</Button>
            </Link>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-14 flex flex-col gap-3 border-t border-cream-paper/15 pt-6 text-xs text-cream-paper/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Open When Letters</p>
          <p className="inline-flex items-center gap-1.5">
            Made with
            <HeartGlyph className="h-3.5 w-3.5 text-terracotta" />
            for the ones we love
          </p>
          <p>Created by Vairavan Thiagarajan</p>
        </div>
      </div>
    </footer>
  )
}
