import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthCard } from '@/components/auth/AuthCard'
import { AuthInput } from '@/components/auth/AuthInput'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { LoadingButton } from '@/components/auth/LoadingButton'
import { useAuth } from '@/context/authContext'
import { useToast } from '@/components/ui/toastContext'
import { usePageMeta } from '@/utils/meta'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function SignupPage() {
  const { user, loading, signUp, resendConfirmation } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  usePageMeta({
    title: 'Create your account · Open When Letters',
    description: 'Create an account and start writing letters that wait for the right moment.',
    path: '/signup',
    noindex: true,
  })

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)
  const [resending, setResending] = useState(false)

  if (!loading && user) return <Navigate to="/collections" replace />

  if (pendingEmail) {
    return (
      <AuthLayout>
        <AuthCard
          title="Check your inbox"
          subtitle={`We sent a verification link to ${pendingEmail}.`}
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
              Click the link inside the email to confirm your address, then sign
              in. The words can wait — they always do.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <LoadingButton
                size="lg"
                loading={resending}
                loadingText="Sending…"
                onClick={async () => {
                  setResending(true)
                  try {
                    await resendConfirmation(pendingEmail)
                    toast('Verification email sent — check your inbox.')
                  } catch (err) {
                    toast(err instanceof Error ? err.message : 'Could not resend the email.')
                  } finally {
                    setResending(false)
                  }
                }}
              >
                Resend email
              </LoadingButton>
              <Link to="/login">
                <LoadingButton size="lg" variant="outline" className="w-full sm:w-auto">
                  Back to sign in
                </LoadingButton>
              </Link>
            </div>
          </div>
        </AuthCard>
      </AuthLayout>
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Enter a valid email address.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      const result = await signUp(email.trim(), password)
      if (result.needsEmailConfirmation) {
        setPendingEmail(email.trim())
      } else {
        toast('Account created — welcome!')
        navigate('/collections', { replace: true })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create your account.')
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Create your account"
        subtitle="Write letters for someone you love — keep them safe behind your own login."
        footer={
          <p className="text-sm text-ink-soft">
            Already have an account?{' '}
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
            id="signup-email"
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

          <PasswordInput
            id="signup-password"
            label="Password"
            hint="Min. 6 characters"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setError(null)
            }}
            placeholder="Create a password"
            autoComplete="new-password"
          />

          <PasswordInput
            id="signup-confirm"
            label="Confirm password"
            value={confirm}
            onChange={(event) => {
              setConfirm(event.target.value)
              setError(null)
            }}
            placeholder="Repeat your password"
            autoComplete="new-password"
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
            loadingText="Creating account…"
            className="w-full"
          >
            Create account
          </LoadingButton>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
