import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { usePageMeta } from '@/utils/meta'
import { EASE } from '@/utils/anim'
import { cn } from '@/utils/cn'

const faqs = [
  {
    question: 'What is Open When Letters?',
    answer:
      'Open When Letters lets you write a small collection of letters, each for a specific kind of moment — a bad day, missing someone, a small win. You share one beautiful link, and the person you love opens each letter when the time is right.',
  },
  {
    question: 'Do I need an account to read a collection?',
    answer:
      'No. Reading is the whole point and requires no account, no app and no download. Anyone with the link can open the collection and read the letters waiting for them.',
  },
  {
    question: 'Is Open When Letters free?',
    answer:
      'Yes. Writing, sharing and reading collections is completely free. There are no hidden charges for the core experience.',
  },
  {
    question: 'How do scheduled letters work?',
    answer:
      'Every letter gets a moment: it can be ready any time, set to open on a specific date, or repeat every year on a birthday or anniversary. Until that moment arrives the letter stays sealed.',
  },
  {
    question: 'Can someone read their letters before they unlock?',
    answer:
      'No. Sealed letters stay hidden until their moment arrives — the collection only ever reveals what is ready. The surprise is part of the gift.',
  },
  {
    question: 'Can I edit or delete letters after I share the link?',
    answer:
      'Yes. From the builder you can go back and edit a letter, change when it opens, delete it, or add more letters to the collection at any time.',
  },
  {
    question: 'Can I add photos, stickers, music or handwriting?',
    answer:
      'Yes. The letter studio lets you pick paper backgrounds and fonts, add stickers and photos, and attach a short audio message — so each letter feels like it was made by hand.',
  },
  {
    question: 'Is my data private?',
    answer:
      'Your collections are private and only reachable through the link you choose to share. We store the words you write so they can be delivered to the right person, and we never sell your data.',
  },
  {
    question: 'Can I use Open When Letters on my phone?',
    answer:
      'Yes. Everything runs in the browser, so letters work beautifully on phones, tablets and desktops — exactly the way a real letter should.',
  },
]

function FaqItem({ question, answer, defaultOpen }: { question: string; answer: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false)

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-[rgba(0,0,0,0.04)_0px_1px_2px_0px]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
      >
        <span className="font-display text-lg font-semibold tracking-tight text-ink">
          {question}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className={cn('shrink-0 text-forest-ink', open && 'text-forest-ink')}
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 leading-relaxed text-ink-soft sm:px-6">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FaqPage() {
  usePageMeta({
    title: 'FAQ · Open When Letters',
    description:
      'Answers to common questions about writing, sharing and opening letters — from scheduling and unlocking to privacy and pricing.',
    path: '/faq',
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
              Questions, answered.
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg">
              Everything you might wonder about writing, sharing and opening
              letters — in plain words.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="mt-12 space-y-3"
          >
            {faqs.map((faq, index) => (
              <FaqItem key={faq.question} {...faq} defaultOpen={index === 0} />
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="mt-12 text-center text-sm leading-relaxed text-mist"
          >
            Still curious? We would love to hear from you — say hello through the
            Feedback form in the navigation.
          </motion.p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
