import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthCard } from '@/components/auth/AuthCard'
import { AuthInput } from '@/components/auth/AuthInput'
import { LoadingButton } from '@/components/auth/LoadingButton'
import { useAuth } from '@/context/authContext'
import { usePageMeta } from '@/utils/meta'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ForgotPasswordPage() {
  const { user, loading, resetPasswordForEmail } = useAuth()

  usePageMeta({
    title: 'Reset your password · Open When Letters',
    description: 'Request a password reset for your Open When Letters account.',
    path: '/forgot-password',
    noindex: true,
  })

  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  if (!loading && user) return <Navigate to="/collections" replace />

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Enter the email you signed up with.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await resetPasswordForEmail(email.trim())
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the reset link.')
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <AuthLayout>
        <AuthCard
          title="Check your inbox"
          subtitle="If an account exists for that email, a password reset link is on its way."
        >
          <div className="text-center">
            <motion.span
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="mx-auto grid h-16 w-16 place-items-center rounded-[2rem] bg-blush"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-forest-ink" aria-hidden>
                <rect x="3" y="6" width="18" height="13" rx="3" fill="currentColor" />
                <path
                  d="M4.5 9l7.5 5 7.5-5"
                  stroke="#fcfaf5"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.span>
            <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-ink-soft">
              The link expires after a little while, so click it soon. You can
              always request another one.
            </p>
            <Link
              to="/login"
              className="mt-8 inline-block text-sm font-medium text-forest-ink underline decoration-highlighter-yellow underline-offset-2 transition-colors hover:text-ink"
            >
              Back to sign in
            </Link>
          </div>
        </AuthCard>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Forgot your password?"
        subtitle="Enter your email and we'll send you a link to choose a new one."
        footer={
          <p className="text-sm text-ink-soft">
            Remembered it?{' '}
            <Link
              to="/login"
              className="font-semibold text-forest-ink underline decoration-highlighter-yellow underline-offset-2 transition-colors hover:text-ink"
            >
              Sign in
            </Link>
          </p>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <AuthInput
            id="forgot-email"
            label="Email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setError(null)
            }}
            placeholder="you@example.com"
            autoComplete="email"
            autoFocus
          />

          {error && (
            <div className="rounded-xl border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-sm font-medium text-terracotta">
              {error}
            </div>
          )}

          <LoadingButton
            type="submit"
            size="lg"
            loading={submitting}
            loadingText="Sending link…"
            className="w-full"
          >
            Send reset link
          </LoadingButton>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
