import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { CTA } from '@/components/landing/CTA'
import { usePageMeta, absoluteUrl } from '@/utils/meta'

export function LandingPage() {
  usePageMeta({
    title: 'Open When Letters — Letters that wait for the right moment',
    description:
      'Write heartfelt letters to be opened at just the right moment. A quiet place to keep the words someone will need later.',
    path: '/',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Open When Letters',
        url: absoluteUrl('/'),
        description: 'Letters that wait for the right moment.',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Open When Letters',
        url: absoluteUrl('/'),
      },
    ],
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
