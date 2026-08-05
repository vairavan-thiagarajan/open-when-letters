import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { usePageMeta } from '@/utils/meta'
import { EASE } from '@/utils/anim'

const sections = [
  {
    title: '1. The service',
    body: 'Open When Letters ("we", "us") provides a service for writing and sharing collections of letters that open at the right moment. By using the service, you agree to these Terms of Service. If you do not agree, please do not use the service.',
  },
  {
    title: '2. Your account',
    body: 'You are responsible for keeping your account details safe and for everything done through your account. Tell us right away if you notice unauthorised use. You must be old enough to agree to these terms in your country to create an account.',
  },
  {
    title: '3. Your content',
    body: 'The letters, photos, audio and other material you create remain yours. You grant us the limited permission needed to store, process and deliver that content so the service can work — nothing more. You promise the content you share is yours to share and does not break the law or anyone\u2019s rights.',
  },
  {
    title: '4. What you may not do',
    body: 'You may not misuse the service: attempt to access it without permission, try to bypass security, scrape or resell its content, send spam or harmful material, or use it in any way that is unlawful, harmful or infringing. Letters you write are meant to be kind — content that harasses, threatens or harms others is not allowed.',
  },
  {
    title: '5. Sharing and privacy',
    body: 'Collections are only reachable through the link you share, but anyone who has the link can open them. Please think about who you share a link with. Our handling of personal information is described in our privacy practices — we store only what is needed to run the service and never sell your data.',
  },
  {
    title: '6. Intellectual property',
    body: 'The service itself — its design, interface, logos and features — belongs to us. You may not copy, modify or reuse it beyond what the service plainly allows.',
  },
  {
    title: '7. Links to third parties',
    body: 'The service may link to websites or forms we do not control, including feedback forms. We are not responsible for their content or privacy practices.',
  },
  {
    title: '8. Availability and changes',
    body: 'We aim to keep the service reliable, but we may update, suspend or discontinue parts of it at any time. We may also revise these terms; the latest version always applies, and continued use after a change means you accept it.',
  },
  {
    title: '9. No warranties',
    body: 'The service is provided "as is" and "as available" without warranties of any kind, express or implied, including that it will be uninterrupted, error-free or fit for a particular purpose.',
  },
  {
    title: '10. Limitation of liability',
    body: 'To the fullest extent allowed by law, we are not liable for indirect, incidental or consequential damages arising from your use of the service. Our total liability for any claim is limited to the amount you paid us (if any) in the preceding twelve months.',
  },
  {
    title: '11. Termination',
    body: 'We may suspend or end access to the service if you break these terms. You can stop using the service or delete your account at any time, and your content will be handled according to our deletion practices.',
  },
  {
    title: '12. Contact',
    body: 'Questions about these terms? The quickest way to reach us is through the Feedback form in the navigation — we read everything.',
  },
]

export function TermsPage() {
  usePageMeta({
    title: 'Terms of Service · Open When Letters',
    description:
      'The terms that govern your use of Open When Letters — from accounts and your content to privacy, liability and changes to the service.',
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
