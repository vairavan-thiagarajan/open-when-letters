import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuth } from '@/context/authContext'
import { usePageMeta } from '@/utils/meta'
import { EASE } from '@/utils/anim'

export function DashboardPage() {
  const { user } = useAuth()

  usePageMeta({
    title: 'Dashboard · Open When Letters',
    description: 'Your Open When Letters dashboard.',
    path: '/dashboard',
    noindex: true,
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-24 sm:pt-32">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <p className="font-mono text-xs font-semibold tracking-widest text-forest-ink uppercase">
              Dashboard
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
              Welcome back
            </h1>
            <p className="mt-3 text-ink-soft">
              Signed in as <span className="font-medium text-forest-ink">{user?.email}</span>.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="mt-10 rounded-[2rem] border border-line bg-cream/60"
          >
            <EmptyState
              title="Your collections are on the way"
              text="Your account is ready. Your saved letter collections will appear here soon — for now, you can start writing."
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/create">
                  <Button size="lg">Create a collection</Button>
                </Link>
                <Link to="/collections">
                  <Button size="lg" variant="outline">
                    Go to collections
                  </Button>
                </Link>
              </div>
            </EmptyState>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
