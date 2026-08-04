import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from './SectionHeading'

const steps = [
  {
    number: '01',
    title: 'Create a collection',
    text: 'Name it and set the mood. It is ready for all the moments you want to prepare for.',
  },
  {
    number: '02',
    title: 'Write your letters',
    text: 'Add unlimited letters — one for bad days, one for birthdays, one for everything in between. They autosave as you type.',
  },
  {
    number: '03',
    title: 'Publish & share',
    text: 'Get a unique link and send it to someone special. They open it, tap an envelope, and read the words meant just for them.',
  },
]

export function HowItWorks() {
  return (
    <section className="relative scroll-mt-24 py-20 sm:py-28" id="how-it-works">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_50%,#f2f1ea_0%,transparent_70%)]"
      />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="From idea to shared, in three small steps"
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal key={step.number} delay={index * 0.1} className="h-full">
              <div className="relative h-full rounded-xl border border-line bg-paper/80 p-7 shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]">
                <span className="absolute top-6 right-7 font-display text-4xl font-semibold text-blush-deep/70 sm:text-5xl">
                  {step.number}
                </span>
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-blush">
                  <span className="h-3 w-3 rounded-sm bg-forest-ink" />
                </span>
                <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
