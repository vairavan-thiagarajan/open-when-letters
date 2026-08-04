import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { hashPassword, safeEqual } from '@/utils/password'
import { cn } from '@/utils/cn'
import { EASE } from '@/utils/anim'

interface PasswordGateProps {
  title: string
  /** Stored SHA-256 hash of the expected password. */
  passwordHash: string
  onUnlock: () => void
}

export function PasswordGate({ title, passwordHash, onUnlock }: PasswordGateProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setError(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const submit = async (event?: FormEvent) => {
    event?.preventDefault()
    if (!value || checking) return
    setChecking(true)
    const digest = await hashPassword(value)
    const ok = safeEqual(digest, passwordHash)
    setChecking(false)
    if (ok) {
      onUnlock()
    } else {
      setError(true)
      setValue('')
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24">
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.04, 1], opacity: [0.25, 0.35, 0.25] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute top-1/2 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
        className="relative w-full max-w-sm text-center"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative mx-auto grid h-20 w-20 place-items-center rounded-xl bg-paper text-4xl shadow-[rgba(0,0,0,0.08)_0px_2px_8px_0px]"
        >
          <span className="absolute inset-0 rounded-xl bg-blush-deep/40 blur-md" aria-hidden />
          <svg viewBox="0 0 24 24" fill="none" className="relative h-8 w-8 text-forest-ink" aria-hidden>
            <path
              d="M7 10V7a5 5 0 0 1 10 0v3M5 10h14v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        <h1 className="mt-7 font-display text-3xl font-semibold tracking-tight text-ink">
          This collection is private
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">
          {title} is sealed until it is shared with someone who knows the
          password.
        </p>

        <motion.form
          onSubmit={submit}
          animate={error ? { x: [0, -10, 10, -8, 8, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="mt-8 space-y-3"
        >
          <label className="sr-only" htmlFor="collection-password">
            Password
          </label>
          <input
            id="collection-password"
            type="password"
            autoFocus
            value={value}
            onChange={(event) => {
              setValue(event.target.value)
              if (error) setError(false)
            }}
            placeholder="Enter the password"
            autoComplete="off"
            className={cn(
              'w-full rounded-2xl border bg-paper px-4 py-3 text-center text-ink shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px] outline-none transition-colors duration-200 placeholder:text-mist',
              error ? 'border-forest-ink/70 ring-2 ring-highlighter-yellow/50' : 'border-line focus:border-highlighter-yellow',
            )}
          />
          <Button type="submit" size="lg" disabled={checking || !value} className="w-full">
            {checking ? 'Checking…' : 'Unlock letters'}
          </Button>
          {error && (
            <p className="text-sm font-medium text-terracotta" role="alert">
              That password isn't right — try again.
            </p>
          )}
        </motion.form>

        <p className="mt-8 text-xs text-mist">
          Made with love on Open When Letters
        </p>
      </motion.div>
    </div>
  )
}
