import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { usePageMeta } from '@/utils/meta'
import { EASE } from '@/utils/anim'

const sections = [
  {
    title: '1. The service',
    body: 'Open When Letters helps you write and share collections of letters that open at the right moment. When we say "we", we mean the people who run the service. By using it, you agree to these terms. If you do not agree, we kindly ask that you simply do not use the service, no hard feelings.',
  },
  {
    title: '2. Your account',
    body: 'Please keep your account details safe, and let us know right away if you ever suspect someone else has used them. To create an account, you need to be old enough to agree to these terms in your country. If anything ever seems off, we are always here to help.',
  },
  {
    title: '3. Your content',
    body: 'The letters, photos and anything else you create remain yours, always. We only ask for the limited permission needed to store, process and deliver them so the service can do its job, and nothing more. Please share only what is yours to share and what respects other people\u2019s rights.',
  },
  {
    title: '4. What you may not do',
    body: 'We ask that you use the service kindly and fairly. Please do not try to access it without permission, bypass its security, scrape or resell its content, or send spam or harmful material. Letters are meant to spread warmth. Content that harasses, threatens or hurts others is not welcome.',
  },
  {
    title: '5. Sharing and privacy',
    body: 'A collection is only reachable through the link you share, but anyone who has that link can open it. Please share links only with people you trust. Our handling of personal information is kept to the minimum the service needs to run, and we never sell your data.',
  },
  {
    title: '6. Security and your data',
    body: 'The site runs over HTTPS, so the words you write are encrypted while travelling between your device and our servers. Passwords — for accounts and for protected collections — are stored only as one-way hashes, never in plain text, so they cannot be read back. Letters are kept only so they can reach the right person, and a collection is only reachable through the link you share (plus the password, if you set one). We never sell your data, and we keep access to the systems that store your words to the minimum needed to run the service.',
  },
  {
    title: '7. Intellectual property',
    body: 'The design of this site — its visual identity, illustrations, layout and look and feel — is our own work, and we are proud of it. Please enjoy it the way it is meant to be enjoyed, and do not copy or reuse the design beyond what is plainly allowed.',
  },
  {
    title: '8. Links to third parties',
    body: 'The service may link to websites or forms we do not control, such as our feedback form. We cannot take responsibility for their content or privacy practices, but we only link to people and services we trust.',
  },
  {
    title: '9. Availability and changes',
    body: 'We work hard to keep the service reliable and dependable. From time to time we may update, pause or retire parts of it, and we may revise these terms. The latest version always applies. When we make changes, we will do our best to keep you informed, and continued use simply means you are comfortable with them.',
  },
  {
    title: '10. No warranties',
    body: 'Like any service, we provide it "as is" and "as available", without a promise that it will be uninterrupted or error free. We will always give it our best, and we hope you will always enjoy it, but we cannot guarantee perfection.',
  },
  {
    title: '11. Limitation of liability',
    body: 'To the fullest extent the law allows, we are not liable for indirect, incidental or consequential damages from your use of the service, and our total responsibility for any claim is limited to what you have paid us (if anything) in the preceding twelve months. That said, we take our responsibility to your words seriously.',
  },
  {
    title: '12. Termination',
    body: 'If you ever break these terms, we may need to suspend or end your access, but we will only do so when it is truly necessary. You can stop using the service or delete your account at any time, and your content will be handled with care according to our deletion practices.',
  },
  {
    title: '13. Contact',
    body: 'Questions about these terms, or anything at all? The quickest way to reach us is through the Feedback form in the navigation. We read everything, and we always answer.',
  },
]

export function TermsPage() {
  usePageMeta({
    title: 'Terms of Service · Open When Letters',
    description:
      'The terms that govern your use of Open When Letters, from accounts and your content to privacy, liability and changes to the service.',
    path: '/terms',
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
              Terms of Service
            </h1>
            <p className="mt-5 text-sm text-mist">
              Last updated: August 2026
            </p>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg">
              These terms are short and written in plain language, because a
              service about heartfelt words should not bury them in fine print.
              Please read them at your leisure, and if anything feels unclear,
              we are always glad to talk it through.
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
