import { useState } from 'react'
import type { FormEvent } from 'react'
import { sendSharedCollectionEmail } from '@/services/email'
import { cn } from '@/utils/cn'

interface EmailShareCardProps {
  /** Public slug of the published collection. */
  slug: string
  /** Collection title used in the email copy. */
  title: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Status = 'idle' | 'sending' | 'sent' | 'error'

/**
 * "Email a friend" — sends the collection link to someone's inbox via the
 * Resend-backed /api/emails/shared endpoint.
 */
export function EmailShareCard({ slug, title }: EmailShareCardProps) {
  const [open, setOpen] = useState(false)
  const [to, setTo] = useState('')
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const recipient = to.trim()
    if (!EMAIL_PATTERN.test(recipient)) {
      setStatus('error')
      setError('Enter a valid email address.')
      return
    }
    setStatus('sending')
    try {
      await sendSharedCollectionEmail({
        to: recipient,
        slug,
        title,
        note: note.trim(),
        requestId: crypto.randomUUID(),
      })
      setStatus('sent')
      setTo('')
      setNote('')
    } catch {
      setStatus('error')
      setError('Could not send the email. Please try again.')
    }
  }

  const reset = () => {
    setOpen(false)
    setTo('')
    setNote('')
    setStatus('idle')
    setError('')
  }

  return (
    <div>
      <p className="mb-2 text-xs font-semibold tracking-widest font-mono text-forest-ink uppercase">
        Email a friend
      </p>

      {status === 'sent' ? (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-blush bg-blush/30 px-4 py-3">
          <p className="text-sm font-medium text-ink">Sent! The link is on its way. 💌</p>
          <button
            type="button"
            onClick={reset}
            className="shrink-0 text-sm font-medium text-ink-soft transition-colors hover:text-forest-ink"
          >
            Send another
          </button>
        </div>
      ) : !open ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-highlighter-yellow/60 bg-paper p-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm text-ink-soft">
            Send the link straight to someone&apos;s inbox.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="min-h-11 shrink-0 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-highlighter-yellow"
          >
            Email a friend
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label
              htmlFor="email-share-to"
              className="mb-1.5 block text-xs font-medium text-ink-soft"
            >
              Their email
            </label>
            <input
              id="email-share-to"
              type="email"
              required
              autoComplete="off"
              placeholder="someone@example.com"
              value={to}
              onChange={(event) => {
                setTo(event.target.value)
                setError('')
              }}
              className={cn(
                'w-full rounded-xl border bg-cream px-4 py-3 text-sm text-ink placeholder:text-mist',
                'focus:border-forest-ink focus:outline-none',
                error ? 'border-terracotta' : 'border-line',
              )}
            />
          </div>
          <div>
            <label
              htmlFor="email-share-note"
              className="mb-1.5 block text-xs font-medium text-ink-soft"
            >
              A little note <span className="text-mist">(optional)</span>
            </label>
            <textarea
              id="email-share-note"
              rows={2}
              maxLength={500}
              placeholder="Open this when you need a smile…"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="w-full resize-none rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink placeholder:text-mist focus:border-forest-ink focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-terracotta">{error}</p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="min-h-11 flex-1 rounded-full bg-forest-ink px-4 py-2 text-sm font-medium text-cream-paper transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {status === 'sending' ? 'Sending…' : 'Send'}
            </button>
            <button
              type="button"
              onClick={reset}
              className="min-h-11 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-highlighter-yellow"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
