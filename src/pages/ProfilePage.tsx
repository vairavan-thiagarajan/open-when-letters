import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/authContext'
import { useToast } from '@/components/ui/toastContext'
import { usePageMeta } from '@/utils/meta'
import { EASE } from '@/utils/anim'

export function ProfilePage() {
  const { user, emailVerified, signOut } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [signingOut, setSigningOut] = useState(false)

  usePageMeta({
    title: 'Your account · Open When Letters',
    description: 'Manage your Open When Letters account.',
    path: '/profile',
    noindex: true,
  })

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
      navigate('/', { replace: true })
    } catch {
      setSigningOut(false)
      toast('Could not sign you out. Please try again.')
    }
  }

  const joinedAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

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
              Profile
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
              Your account
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="mt-10 space-y-5"
          >
            <div className="rounded-[2rem] border border-line bg-cream/60 p-6 sm:p-8">
              <div className="flex items-center gap-5">
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-highlighter-yellow font-display text-2xl font-semibold text-forest-ink">
                  {(user?.email?.[0] ?? '?').toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display text-xl font-semibold tracking-tight text-ink">
                    {user?.email}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-ink-soft">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ${
                        emailVerified ? 'bg-blush text-forest-ink' : 'bg-terracotta/15 text-terracotta'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          emailVerified ? 'bg-forest-ink' : 'bg-terracotta'
                        }`}
                      />
                      {emailVerified ? 'Verified' : 'Not verified'}
                    </span>
                  </p>
                </div>
              </div>

              {joinedAt && (
                <div className="mt-6 border-t border-dashed border-line pt-5">
                  <p className="text-xs font-semibold tracking-widest font-mono text-mist uppercase">
                    Member since
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">{joinedAt}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 rounded-[2rem] border border-line bg-cream/60 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-lg font-semibold tracking-tight text-ink">
                  Password &amp; security
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  Reset your password or manage your account.
                </p>
              </div>
              <Link to="/settings">
                <Button variant="outline">Account settings</Button>
              </Link>
            </div>

            <div className="flex flex-col gap-3 rounded-[2rem] border border-line bg-cream/60 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-lg font-semibold tracking-tight text-ink">
                  Sign out
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  End this session on this device.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleSignOut}
                disabled={signingOut}
              >
                {signingOut ? 'Signing out…' : 'Sign out'}
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
