import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { usePageMeta } from '@/utils/meta'
import { EASE } from '@/utils/anim'

const sections = [
  {
    title: '1. The short version',
    body: 'Open When Letters is built to keep your words safe and to send them only where they should go. We collect the smallest amount of information needed to run the service, we never sell your data, and your letters stay private behind the link you share.',
  },
  {
    title: '2. What we collect',
    body: 'When you create an account we keep your email address and a one-way hash of your password, so it can never be read back. When you write letters, photos or collection details, those are stored so the service can do its job and nothing more. We also keep basic, anonymous technical logs so the site stays reliable and secure.',
  },
  {
    title: '3. Emails we send',
    body: 'We send you a welcome letter when you join, a verification email to confirm your address, and — when you ask us to — an email that shares a collection link with someone you love. We never send marketing emails unless you opt in, and we never send the same message twice by accident. Transactional emails are delivered through Resend, our email provider, which is bound by the same privacy promises we make to you.',
  },
  {
    title: '4. Who can see your letters',
    body: 'Only people you give the link to. A collection is reachable through the link you share (and a password, if you set one), so please share links only with people you trust. The people you share with do not need an account to read your letters.',
  },
  {
    title: '5. Security',
    body: 'The site runs over HTTPS, so your words are encrypted while travelling between your device and our servers. Passwords and collection passwords are stored only as one-way hashes. Access to the systems that hold your words is kept to the minimum needed to run the service.',
  },
  {
    title: '6. Cookies and analytics',
    body: 'We use only what is necessary to keep you signed in and make the service work. We do not sell your information to advertisers, and we do not build advertising profiles of you.',
  },
  {
    title: '7. Your choices',
    body: 'You can sign out, reset your password, or delete your account at any time from your profile. When you delete your account, your collections and letters are handled with care and removed.',
  },
  {
    title: '8. Changes to this policy',
    body: 'If we change the way we handle your information, we will update this page and do our best to tell you. The latest version always applies.',
  },
  {
    title: '9. Contact',
    body: 'Questions about privacy, or anything at all? The quickest way to reach us is through the Feedback form in the navigation. We read everything, and we always answer.',
  },
]

export function PrivacyPage() {
  usePageMeta({
    title: 'Privacy Policy · Open When Letters',
    description:
      'How Open When Letters handles your words, your account and your privacy — kept short and written in plain language.',
    path: '/privacy',
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
              Privacy Policy
            </h1>
            <p className="mt-5 text-sm text-mist">Last updated: August 2026</p>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg">
              A service about heartfelt words should treat them with care.
              Here is exactly what we do with yours.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="mt-14 space-y-10"
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
        </div>
      </main>
      <Footer />
    </div>
  )
}
