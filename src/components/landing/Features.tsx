import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from './SectionHeading'

const features = [
  {
    title: 'Made for the moment',
    text: 'Every letter is tied to a feeling, so the right words arrive at the exact moment they are needed.',
  },
  {
    title: 'Share with one link',
    text: 'Every collection gets a unique URL. Anyone with the link can open it — no app, no account, no sign-up.',
  },
  {
    title: 'Effortless to create',
    text: 'Name a collection, pour in as many letters as you like, and publish. It takes minutes, not hours.',
  },
  {
    title: 'Yours to keep editing',
    text: 'The creator keeps a secret edit link. Visitors read the magic; you keep the pen.',
  },
]

export function Features() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Why Open When"
            title="The feelings in between, wrapped in a link"
            text="The moments we can't always prepare for deserve the words we'd want to say. Open When keeps them close — and shareable."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.08} className="h-full">
              <div className="group flex h-full flex-col rounded-xl border border-line bg-paper p-7 shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px] transition-all duration-300 hover:-translate-y-1.5 hover:border-highlighter-yellow/60 hover:shadow-[rgba(0,0,0,0.08)_0px_2px_8px_0px]">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-blush transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                  <span className="h-3 w-3 rounded-sm bg-forest-ink" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                  {feature.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
                  {feature.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
