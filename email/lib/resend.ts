/**
 * Resend delivery layer with retries, idempotency and durable logging.
 *
 * Every send is:
 *   1. de-duplicated against the Supabase `email_log` table (skip if already
 *      sent — retries can never produce a duplicate),
 *   2. sent with exponential backoff (default 3 attempts),
 *   3. recorded as 'sent' or 'failed' (all failures are logged durably AND to
 *      the server console).
 *
 * A second idempotency key is passed to Resend itself so concurrent retries
 * are safe on their side too.
 */

import { Resend } from 'resend'
import { serverEnv } from './env'
import { isAlreadySent, recordFailure, recordSent } from './log'

const RETRY_BASE_DELAY_MS = 500

export interface SendEmailInput {
  to: string
  subject: string
  html: string
  /** Machine name of the email, e.g. 'welcome'. */
  event: string
  /** Unique key that makes the send idempotent across retries. */
  dedupeKey: string
  /** Number of attempts before giving up. Defaults to 3. */
  attempts?: number
}

export interface SendEmailResult {
  /** False when the email was skipped because it was already sent. */
  sent: boolean
}

export class EmailSendError extends Error {
  constructor(message = 'Could not send the email. Please try again later.') {
    super(message)
    this.name = 'EmailSendError'
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  if (await isAlreadySent(input.dedupeKey)) return { sent: false }

  const attempts = Math.max(1, input.attempts ?? 3)
  const client = new Resend(serverEnv.resendApiKey)
  let lastError: unknown = null

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const { error } = await client.emails.send(
        {
          from: serverEnv.emailFrom,
          to: [input.to],
          subject: input.subject,
          html: input.html,
        },
        { idempotencyKey: input.dedupeKey },
      )
      if (error) throw new Error(error.message)

      await recordSent(input.dedupeKey, input.event, input.to)
      return { sent: true }
    } catch (error) {
      lastError = error
      console.error(
        `[email] ${input.event} -> ${input.to} attempt ${attempt}/${attempts} failed:`,
        error,
      )
      if (attempt < attempts) {
        await sleep(RETRY_BASE_DELAY_MS * 2 ** (attempt - 1))
      }
    }
  }

  const message =
    lastError instanceof Error ? lastError.message : 'Unknown Resend delivery error'
  await recordFailure(input.dedupeKey, input.event, input.to, message)
  throw new EmailSendError()
}
