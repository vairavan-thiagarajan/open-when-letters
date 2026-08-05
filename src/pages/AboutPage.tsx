import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { usePageMeta } from '@/utils/meta'
import { EASE } from '@/utils/anim'

const sections = [
  {
    title: 'The story behind it',
    body: 'Open When Letters began the simplest way a project can: for someone I love. She had so much to say to me, and I had so much to say back, but when we were both busy, the quiet moments to talk were few. So I built a place where we can leave our words for each other. No matter how busy life gets, we can still be there, in the things we say, in the letters left waiting for the right moment.',
  },
  {
    title: 'Why letters?',
    body: 'A message read in the moment it matters lands differently. A letter for a bad day already knows what kind of day it is. Writing ahead lets you say the right thing at the right time, even when you are not there. That is how we stay close when life pulls us in different directions.',
  },
  {
    title: 'How it works',
    body: 'You write a small collection of letters, one for each kind of moment: missing me, a hard day, a small win. Share a single, beautiful link with the person you love. They open each letter when the time is right, and it feels like you are right there beside them.',
  },
  {
    title: 'Made to feel personal',
    body: 'Letters sit on warm paper tones with hand drawn accents, like something you sealed by hand. No noise, no accounts required to read. Just words, waiting. Our small way of being there for each other, in whatever ways we can.',
  },
]

export function AboutPage() {
  usePageMeta({
    title: 'About · Open When Letters',
    description:
      'The story behind Open When Letters. A quiet way for two people to be there for each other, even when life gets busy and the time to talk is short.',
    path: '/about',
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-24 sm:pt-36 sm:pb-32">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-center"
          >
            <span className="mx-auto block h-1.5 w-1.5 rounded-full bg-highlighter-yellow" />
            <h1 className="mt-5 font-display text-[clamp(1.65rem,6.5vw,2.25rem)] leading-[1.05] font-semibold tracking-tight text-ink sm:text-5xl">
              Letters, sealed for
              <br />
              the{' '}
              <span className="relative whitespace-nowrap">
                right moment.
                <span
                  aria-hidden
                  className="absolute inset-x-[-4px] bottom-[3px] -z-10 block h-[32%] rounded-sm bg-highlighter-yellow/60"
                />
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg">
              Open When Letters began as a small gift for someone I love, a way
              to be there for each other even when life gets busy and the time
              to talk is short.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="mt-14 space-y-8"
          >
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                  {section.title}
                </h2>
                <p className="mt-3 leading-relaxed text-ink-soft">{section.body}</p>
              </section>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="mt-16 text-center"
          >
            <Link to="/create">
              <Button size="lg">Create your own collection</Button>
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
