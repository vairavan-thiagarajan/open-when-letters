import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { usePageMeta } from '@/utils/meta'
import { EASE } from '@/utils/anim'
import { cn } from '@/utils/cn'

const faqs = [
  {
    question: 'What is the story behind Open When Letters?',
    answer:
      'It started with two people who had so much to say to each other. When life got busy, the quiet moments to talk were few, so they made a place to leave words for each other: letters that wait until the moment they are needed. Open When Letters still works that way today, as a small way of being there for someone, even when you cannot be side by side.',
  },
  {
    question: 'What is Open When Letters?',
    answer:
      'Open When Letters is a little service for a big feeling. You write a small collection of letters, one for a bad day, one for missing someone, one for a small win, and share a single beautiful link. The person you love opens each letter exactly when they need it most. It is our way of helping words arrive at the right moment.',
  },
  {
    question: 'Do I need an account to read a collection?',
    answer:
      'Not at all. Reading is the whole point, and it is completely open: no account, no app and no download. If someone shares a collection with you, just open the link, and the letters that are ready will be waiting for you.',
  },
  {
    question: 'Is Open When Letters free?',
    answer:
      'Yes, writing, sharing and reading collections is completely free. There are no hidden charges, and we have no plans to add any for the core experience. We believe heartfelt words should never come with a price tag.',
  },
  {
    question: 'How do scheduled letters work?',
    answer:
      'Every letter has a moment of its own. It can be ready to open any time, unlock on a particular date, or return every year on a birthday or anniversary. Until that moment arrives, the letter stays sealed and safe, we promise.',
  },
  {
    question: 'Can someone read their letters before they unlock?',
    answer:
      'No. Sealed letters stay hidden until their moment arrives. The collection only ever reveals what is ready to be read. We think the surprise is part of the gift, and we protect it carefully.',
  },
  {
    question: 'Can I edit or delete letters after I share the link?',
    answer:
      'Of course. You can return to the builder whenever you like to edit a letter, change when it opens, delete it, or add more letters. Nothing is set in stone. We want you to feel at ease the whole way through.',
  },
  {
    question: 'Can I add photos, stickers or handwriting?',
    answer:
      'Yes! The letter studio lets you pick paper backgrounds and fonts, and add stickers and photos. We want every letter to feel like it was made by hand, with love.',
  },
  {
    question: 'Is my data private?',
    answer:
      'Your collections are private, and the only way anyone can reach them is through a link you choose to share. We keep the words you write so they can reach the right person, we never sell your data, and we store only what the service needs to do its job.',
  },
  {
    question: 'Is the site secure?',
    answer:
      'Yes. The whole site is served over HTTPS, which encrypts your connection so letters and passwords are protected as they travel between your device and our servers. Passwords are stored as one-way hashes rather than in plain text, and access to the systems that hold your words is kept to the bare minimum the service needs to run.',
  },
  {
    question: 'Can you read my letters or see my password?',
    answer:
      'Passwords are stored only as one-way hashes, so no one \u2014 including us \u2014 can read them back. Your letters are kept only so they can reach the right person, and we never read them. A collection can only be opened by someone who has the link you shared, and the password if you added one, so your words go exactly where you send them.',
  },
  {
    question: 'Can I use Open When Letters on my phone?',
    answer:
      'Yes, everything runs in the browser, so letters look and feel just right on phones, tablets and desktops. Wherever you happen to be, a letter can find you.',
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
      'Answers to common questions about writing, sharing and opening letters, from scheduling and unlocking to privacy and pricing.',
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
              letters in plain words.
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
            Still curious? We would love to hear from you. Reach out through the
            Feedback form in the navigation. A real person reads every word and
            replies to everything we receive.
          </motion.p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
