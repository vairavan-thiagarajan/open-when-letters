import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { usePageMeta } from '@/utils/meta'
import { cn } from '@/utils/cn'

const colors = [
  {
    name: 'Cream / Paper',
    className: 'bg-cream',
    hex: '#FCFAF5',
    role: 'Page background',
    note: 'The warm paper everything sits on.',
  },
  {
    name: 'Forest Ink',
    className: 'bg-forest-ink',
    hex: '#1A3300',
    role: 'Primary text & actions',
    note: 'Aliased as “ink”.',
  },
  {
    name: 'Ink Soft',
    className: 'bg-ink-soft',
    hex: '#4A7030',
    role: 'Secondary text',
    note: '',
  },
  {
    name: 'Blush Mint',
    className: 'bg-blush',
    hex: '#D5F5C2',
    role: 'Soft accent fills',
    note: 'Aliased as “sticky-note-mint”.',
  },
  {
    name: 'Blush Deep',
    className: 'bg-blush-deep',
    hex: '#A8E5E5',
    role: 'Hover & secondary accents',
    note: 'Aliased as “sticky-note-teal”.',
  },
  {
    name: 'Highlighter',
    className: 'bg-highlighter-yellow',
    hex: '#FFE95C',
    role: 'Highlights & hover edges',
    note: 'Used sparingly — it is the accent.',
  },
  {
    name: 'Mist',
    className: 'bg-mist',
    hex: '#B6B6B6',
    role: 'Borders & muted captions',
    note: 'Aliased as “line” & “pencil-gray”.',
  },
  {
    name: 'Whisper Gray',
    className: 'bg-whisper-gray',
    hex: '#F1F1F1',
    role: 'Subtle fills',
    note: '',
  },
  {
    name: 'Terracotta',
    className: 'bg-terracotta',
    hex: '#CB5521',
    role: 'Errors & the heart accent',
    note: '',
  },
  {
    name: 'Note Blush',
    className: 'bg-sticky-note-blush',
    hex: '#F6D0FF',
    role: 'Sticky-note accent',
    note: 'Lives in the footer glows.',
  },
]

const radii = [
  { label: 'Buttons', value: 'rounded-md', className: 'rounded-md' },
  { label: 'Icon boxes', value: 'rounded-xl', className: 'rounded-xl' },
  { label: 'Cards & inputs', value: 'rounded-2xl', className: 'rounded-2xl' },
  { label: 'Letter paper', value: 'rounded-[2rem]', className: 'rounded-[2rem]' },
  { label: 'Pills', value: 'rounded-full', className: 'rounded-full' },
]

const typeScale = [
  {
    label: 'Display · h1',
    className: 'font-display text-3xl font-semibold tracking-tight sm:text-5xl',
    use: 'Page titles',
  },
  {
    label: 'Heading · h2',
    className: 'font-display text-2xl font-semibold tracking-tight sm:text-4xl',
    use: 'Section headings',
  },
  {
    label: 'Card title · h3',
    className: 'font-display text-2xl font-semibold tracking-tight',
    use: 'Cards, modals & letters',
  },
  {
    label: 'Body',
    className: 'text-base leading-relaxed text-ink-soft',
    use: 'Sections; cards use text-sm text-ink-soft',
  },
  {
    label: 'Eyebrow',
    className: 'font-mono text-xs font-semibold tracking-widest text-forest-ink uppercase',
    use: 'Page & section labels',
  },
  {
    label: 'Caption',
    className: 'text-xs text-mist',
    use: 'Hints, meta & helper text',
  },
]

const principles = [
  {
    title: 'Warm & hand-made',
    body: 'Paper tones, sticky notes, a postage stamp, dashed seams, a heartbeat. It should feel like something sealed by hand — never like a dashboard.',
  },
  {
    title: 'One accent at a time',
    body: 'Highlighter-yellow is reserved for highlights and hover edges. When something glows, it means “this is the moment”.',
  },
  {
    title: 'Icons are drawn, not typed',
    body: 'Every icon is an inline SVG with consistent stroke geometry. No emoji, no font icons.',
  },
  {
    title: 'Type does the hierarchy',
    body: 'Weight and the mono eyebrow do the work — not an ever-growing list of sizes. Five sizes cover the whole product.',
  },
  {
    title: 'Motion that breathes',
    body: 'Slow, gentle reveals; fast, snappy taps. Nothing spins or loops forever — and everything respects the system’s reduced-motion setting.',
  },
  {
    title: 'Colour does the work, not shadows',
    body: 'Elevation is intentionally minimal: just two shadows. Borders and colour carry the separation.',
  },
]

const motionFacts = [
  { k: 'EASE', v: '[0.22, 1, 0.36, 1] — the signature curve, used for every reveal and transition' },
  { k: 'Springs', v: 'gentle · soft · snappy — micro-interactions and entrances' },
  { k: 'Reveal', v: 'fade + 28px rise, viewport margin -70px, 0.65s' },
  { k: 'Press', v: 'buttons tap at 0.97 scale with a soft ripple' },
  { k: 'Respect', v: 'MotionConfig reducedMotion="user" + a CSS media query for reduced motion' },
]

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="font-mono text-xs font-semibold tracking-widest text-forest-ink uppercase">
      {children}
    </p>
  )
}

function SectionCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'rounded-[2rem] border border-line bg-paper p-6 shadow-soft sm:p-8',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function DesignPage() {
  usePageMeta({
    title: 'Design principles · Open When Letters',
    description:
      'The design system behind Open When Letters — colour, typography, spacing, radius, motion and the rules that keep it warm, consistent and hand-made.',
    path: '/design',
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-24 sm:pt-36 sm:pb-32">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <Reveal className="text-center">
            <span className="mx-auto block h-1.5 w-1.5 rounded-full bg-highlighter-yellow" />
            <p className="mt-5 font-mono text-xs font-semibold tracking-widest text-forest-ink uppercase">
              Design system
            </p>
            <h1 className="mt-4 font-display text-[clamp(2rem,7vw,3.25rem)] leading-[1.05] font-semibold tracking-tight text-ink sm:text-6xl">
              Design principles
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
              This is the design system we built for Open When Letters — from
              scratch, and small on purpose. A paper palette, three fonts, five
              radii, two shadows and one accent. Here is exactly how it is put
              together.
            </p>
          </Reveal>

          {/* Colour */}
          <Reveal className="mt-16">
            <SectionLabel>01 · Colour</SectionLabel>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
              A paper palette
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
              Ten tokens, chosen and named by us. Every colour lives as a token
              in{' '}
              <code className="rounded-md bg-blush px-1.5 py-0.5 font-mono text-xs text-forest-ink">
                src/index.css
              </code>
              , and each one maps to a utility class used across the app.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {colors.map((color) => (
                <div
                  key={color.name}
                  className="overflow-hidden rounded-2xl border border-line bg-paper shadow-soft"
                >
                  <div className={cn('flex h-24 items-end p-3', color.className)}>
                    <span className="rounded-md bg-cream/85 px-2 py-0.5 font-mono text-xs font-semibold text-forest-ink">
                      {color.hex}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-semibold tracking-tight text-ink">{color.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-soft">{color.role}</p>
                    {color.note && <p className="mt-1 text-xs text-mist">{color.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Typography */}
          <Reveal className="mt-16">
            <SectionLabel>02 · Typography</SectionLabel>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
              Three voices
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <SectionCard>
                <p className="font-mono text-xs font-semibold tracking-widest text-mist uppercase">
                  Display
                </p>
                <p className="mt-3 font-display text-6xl font-semibold tracking-tight text-ink">
                  Aa
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  Bricolage Grotesque — every heading. Tight tracking, semibold, a little playful.
                </p>
              </SectionCard>
              <SectionCard>
                <p className="font-mono text-xs font-semibold tracking-widest text-mist uppercase">
                  Sans
                </p>
                <p className="mt-3 text-6xl font-medium tracking-tight text-ink">Aa</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  Inter Variable — all body copy, buttons and labels. Quiet and readable.
                </p>
              </SectionCard>
              <SectionCard>
                <p className="font-mono text-xs font-semibold tracking-widest text-mist uppercase">
                  Mono
                </p>
                <p className="mt-3 font-mono text-6xl font-medium text-ink">Aa</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  Roboto Mono — eyebrows, captions and codes. It whispers “label”.
                </p>
              </SectionCard>
            </div>

            <div className="mt-4 space-y-px overflow-hidden rounded-2xl border border-line bg-line/40">
              {typeScale.map((t) => (
                <div
                  key={t.label}
                  className="flex flex-col gap-2 bg-paper px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className={cn('truncate', t.className)}>The right moment</p>
                  </div>
                  <div className="shrink-0 sm:ml-6 sm:text-right">
                    <p className="font-mono text-xs font-semibold tracking-widest text-forest-ink uppercase">
                      {t.label}
                    </p>
                    <p className="mt-0.5 text-xs text-mist">{t.use}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Radius */}
          <Reveal className="mt-16">
            <SectionLabel>03 · Shape</SectionLabel>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
              Five radii, each with a job
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {radii.map((r) => (
                <SectionCard key={r.label} className="flex flex-col items-center gap-3 p-6">
                  <span
                    className={cn('grid h-16 w-16 place-items-center bg-blush', r.className)}
                  >
                    <span className="h-3 w-3 rounded-sm bg-forest-ink" />
                  </span>
                  <div className="text-center">
                    <p className="text-sm font-semibold tracking-tight text-ink">{r.label}</p>
                    <p className="mt-0.5 font-mono text-xs text-mist">{r.value}</p>
                  </div>
                </SectionCard>
              ))}
            </div>
          </Reveal>

          {/* Elevation */}
          <Reveal className="mt-16">
            <SectionLabel>04 · Elevation</SectionLabel>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
              Two shadows, nothing more
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <SectionCard className="flex flex-col gap-2">
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-cream shadow-soft">
                  <span className="h-3 w-3 rounded-sm bg-forest-ink" />
                </span>
                <p className="mt-1 text-sm font-semibold tracking-tight text-ink">Soft</p>
                <p className="font-mono text-xs text-mist">0 1px 2px rgba(0,0,0,0.05)</p>
                <p className="text-sm leading-relaxed text-ink-soft">
                  Resting cards. Faint, like paper resting on paper.
                </p>
              </SectionCard>
              <SectionCard className="flex flex-col gap-2">
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-cream shadow-lift">
                  <span className="h-3 w-3 rounded-sm bg-forest-ink" />
                </span>
                <p className="mt-1 text-sm font-semibold tracking-tight text-ink">Lift</p>
                <p className="font-mono text-xs text-mist">0 2px 8px rgba(0,0,0,0.08)</p>
                <p className="text-sm leading-relaxed text-ink-soft">
                  Hovered or floating things — modals, cards mid-air.
                </p>
              </SectionCard>
            </div>
          </Reveal>

          {/* Buttons */}
          <Reveal className="mt-16">
            <SectionLabel>05 · Buttons</SectionLabel>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
              Four intents, three sizes
            </h2>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button>Primary</Button>
              <Button variant="soft">Soft</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <SectionCard>
                <p className="text-sm font-semibold tracking-tight text-ink">Primary</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                  The one true action. Forest ink on cream. Ripple on press, 0.97 tap scale.
                </p>
              </SectionCard>
              <SectionCard>
                <p className="text-sm font-semibold tracking-tight text-ink">Sizing</p>
                <p className="mt-1 font-mono text-xs text-mist">
                  sm h-9 px-4 · md h-11 px-6 · lg h-13 px-8
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                  Pills keep min-h-11, inputs use px-4 py-3, icon buttons are h-11 w-11.
                </p>
              </SectionCard>
            </div>
          </Reveal>

          {/* Motion */}
          <Reveal className="mt-16">
            <SectionLabel>06 · Motion</SectionLabel>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
              It should breathe
            </h2>
            <div className="mt-6 space-y-px overflow-hidden rounded-2xl border border-line bg-line/40">
              {motionFacts.map((m) => (
                <div key={m.k} className="flex gap-4 bg-paper px-5 py-4">
                  <span className="shrink-0 rounded-full bg-blush px-3 py-1 font-mono text-[11px] font-semibold tracking-widest text-forest-ink uppercase">
                    {m.k}
                  </span>
                  <p className="text-sm leading-relaxed text-ink-soft">{m.v}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Principles */}
          <Reveal className="mt-16">
            <SectionLabel>07 · The rules</SectionLabel>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
              What stays true
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {principles.map((p, index) => (
                <SectionCard key={p.title}>
                  <p className="font-mono text-xs font-semibold tracking-widest text-forest-ink uppercase">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <p className="mt-2 font-display text-xl font-semibold tracking-tight text-ink">
                    {p.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.body}</p>
                </SectionCard>
              ))}
            </div>
          </Reveal>

          <Reveal className="mt-16 text-center">
            <Link to="/create">
              <Button size="lg">Create your own collection</Button>
            </Link>
          </Reveal>
        </div>
      </main>
      <Footer />
    </div>
  )
}
