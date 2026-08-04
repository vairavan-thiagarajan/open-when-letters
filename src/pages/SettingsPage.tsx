import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/authContext'
import { usePageMeta } from '@/utils/meta'
import { EASE } from '@/utils/anim'

export function SettingsPage() {
  const { user } = useAuth()

  usePageMeta({
    title: 'Account settings · Open When Letters',
    description: 'Manage your Open When Letters account settings.',
    path: '/settings',
    noindex: true,
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-24 sm:pt-32">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <p className="font-mono text-xs font-semibold tracking-widest text-forest-ink uppercase">
              Settings
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
              Account settings
            </h1>
            <p className="mt-3 text-ink-soft">
              Signed in as <span className="font-medium text-forest-ink">{user?.email}</span>.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="mt-10 rounded-[2rem] border border-line bg-cream/60 p-6 sm:p-8"
          >
            <p className="font-display text-lg font-semibold tracking-tight text-ink">
              More settings are on the way
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Profile details, email changes and notification preferences will
              arrive in the next phase. Your password can be reset from the{' '}
              <Link
                to="/forgot-password"
                className="font-medium text-forest-ink underline decoration-highlighter-yellow underline-offset-2 transition-colors hover:text-ink"
              >
                password reset
              </Link>{' '}
              page.
            </p>
            <div className="mt-6">
              <Link to="/profile">
                <Button variant="outline">Back to profile</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
