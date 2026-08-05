import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthCard } from '@/components/auth/AuthCard'
import { AuthInput } from '@/components/auth/AuthInput'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { LoadingButton } from '@/components/auth/LoadingButton'
import { useAuth } from '@/context/authContext'
import { useToast } from '@/components/ui/toastContext'
import { usePageMeta } from '@/utils/meta'

interface LoginLocationState {
  from?: { pathname: string }
}

export function LoginPage() {
  const { user, loading, rememberMe, setRememberMe, signIn, resendConfirmation } =
    useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const toast = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [showResend, setShowResend] = useState(false)
  const [resending, setResending] = useState(false)

  usePageMeta({
    title: 'Log in · Open When Letters',
    description: 'Log in to your Open When Letters account.',
    path: '/login',
    noindex: true,
  })

  if (!loading && user) {
    const from = (location.state as LoginLocationState | null)?.from?.pathname ?? '/collections'
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.trim() || !password) {
      setError('Enter your email and password.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await signIn(email.trim(), password)
      const from = (location.state as LoginLocationState | null)?.from?.pathname ?? '/collections'
      navigate(from, { replace: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not sign in.'
      setError(message)
      setShowResend(/verify your email/i.test(message))
      setSubmitting(false)
    }
  }

  const handleResend = async () => {
    if (!email.trim()) return
    setResending(true)
    try {
      await resendConfirmation(email.trim())
      toast('Confirmation email sent — check your inbox.')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not resend the email.')
    } finally {
      setResending(false)
    }
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome back"
        subtitle="Sign in to your account — your letters are waiting."
        footer={
          <p className="text-sm text-ink-soft">
            New here?{' '}
            <Link
              to="/signup"
              className="font-semibold text-forest-ink underline decoration-highlighter-yellow underline-offset-2 transition-colors hover:text-ink"
            >
              Create an account
            </Link>
          </p>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {searchParams.get('verified') === '1' && (
            <div className="rounded-xl border border-highlighter-yellow/60 bg-highlighter-yellow/30 px-4 py-3 text-sm font-medium text-forest-ink">
              Email confirmed — welcome! Sign in to continue.
            </div>
          )}

          <AuthInput
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setError(null)
              setShowResend(false)
            }}
            placeholder="you@example.com"
            autoComplete="email"
            autoFocus
          />

          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setError(null)
              setShowResend(false)
            }}
            placeholder="Your password"
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 cursor-pointer accent-highlighter-yellow"
              />
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-forest-ink transition-colors hover:text-ink"
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <div className="rounded-xl border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-sm font-medium text-terracotta">
              {error}
            </div>
          )}

          {showResend && (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="self-start text-sm font-medium text-forest-ink underline decoration-highlighter-yellow underline-offset-2 transition-colors hover:text-ink disabled:opacity-50"
            >
              {resending ? 'Sending…' : "Didn't get the email? Resend it"}
            </button>
          )}

          <LoadingButton
            type="submit"
            size="lg"
            loading={submitting}
            loadingText="Signing in…"
            className="w-full"
          >
            Sign in
          </LoadingButton>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
