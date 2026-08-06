import { supabase } from '@/services/supabase'

/**
 * Client-side email helpers.
 *
 * These call the Vercel serverless functions in /api/emails. Email delivery
 * is a nice-to-have: welcome is fire-and-forget (never blocks signup), and
 * sharing surfaces its own inline status in the UI.
 */

/** Fire-and-forget welcome email right after a successful signup. */
export function sendWelcomeEmail(email: string): void {
  void fetch('/api/emails/welcome', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  }).catch(() => {
    /* email is non-critical — never block the happy path */
  })
}

export interface SharedCollectionEmailInput {
  /** Recipient email address. */
  to: string
  /** Public slug of the collection (used for /open/:slug). */
  slug: string
  /** Collection title for the email copy. */
  title: string
  /** Optional personal note from the sender. */
  note?: string
  /** Client-generated id making the send idempotent across retries. */
  requestId: string
}

/** Sends the "someone wrote Open When Letters for you" email. Throws on failure. */
export async function sendSharedCollectionEmail(
  input: SharedCollectionEmailInput,
): Promise<void> {
  const token = (await supabase?.auth.getSession())?.data.session?.access_token
  const response = await fetch('/api/emails/shared', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    throw new Error('Could not send the email. Please try again.')
  }
}
