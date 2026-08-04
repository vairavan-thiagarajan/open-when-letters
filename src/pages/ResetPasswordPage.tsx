import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthCard } from '@/components/auth/AuthCard'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { LoadingButton } from '@/components/auth/LoadingButton'
import { useAuth } from '@/context/authContext'
import { useToast } from '@/components/ui/toastContext'
import { RouteFallback } from '@/components/ui/PageSkeletons'
import { usePageMeta } from '@/utils/meta'

export function ResetPasswordPage() {
  const { user, loading, recovery, updatePassword } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  usePageMeta({
    title: 'Set a new password · Open When Letters',
    description: 'Choose a new password for your Open When Letters account.',
    path: '/reset-password',
    noindex: true,
  })

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (loading) return <RouteFallback />

  // A signed-in user who isn't here through a recovery link has no business here.
  if (user && !recovery) return <Navigate to="/dashboard" replace />

  if (!user && !recovery) {
    return (
      <AuthLayout>
        <AuthCard
          title="This link has expired"
          subtitle="Password reset links only last a short while."
        >
          <div className="text-center">
            <p className="mx-auto max-w-sm text-sm leading-relaxed text-ink-soft">
              Request a fresh link and try again. If the problem continues, make
              sure you clicked the newest email.
            </p>
            <Link
              to="/forgot-password"
              className="mt-8 inline-block text-sm font-medium text-forest-ink underline decoration-highlighter-yellow underline-offset-2 transition-colors hover:text-ink"
            >
              Get a new reset link
            </Link>
          </div>
        </AuthCard>
      </AuthLayout>
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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
      await updatePassword(password)
      toast('Password updated — welcome back.')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update your password.')
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Choose a new password"
        subtitle="Pick something you'll remember — your letters will thank you."
        footer={
          <p className="text-sm text-ink-soft">
            Prefer to skip?{' '}
            <Link
              to="/dashboard"
              className="font-semibold text-forest-ink underline decoration-highlighter-yellow underline-offset-2 transition-colors hover:text-ink"
            >
              Go to your dashboard
            </Link>
          </p>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <PasswordInput
            id="reset-password"
            label="New password"
            hint="Min. 6 characters"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setError(null)
            }}
            placeholder="Choose a password"
            autoComplete="new-password"
            autoFocus
          />

          <PasswordInput
            id="reset-confirm"
            label="Confirm new password"
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
            loadingText="Updating…"
            className="w-full"
          >
            Update password
          </LoadingButton>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
