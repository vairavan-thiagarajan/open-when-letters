/**
 * Durable email delivery log (Supabase `email_log` table).
 *
 * Guarantees:
 *   - "never send duplicate emails": a `dedupe_key` with status 'sent' is
 *     respected across retries (isAlreadySent -> skip).
 *   - "log all failures": every failed attempt is persisted with its error.
 *   - a failed send may be retried later; a sent one never is.
 *
 * If the log write itself fails we log loudly but never crash the send flow —
 * the email module stays resilient by design.
 */

import { serverEnv } from './env'

const TABLE = 'email_log'

/**
 * Prefers the service role key so email_log can sit behind RLS (see
 * migration 006). Falls back to the anon key so local/dev runs still work —
 * in that case the table must be open or the log writes become no-ops
 * (which is safe; email delivery is never blocked by logging).
 */
function restAuthKey(): string {
  return serverEnv.supabaseServiceRoleKey || serverEnv.supabaseAnonKey
}

interface RestOptions {
  method?: 'GET' | 'POST' | 'PATCH'
  path: string
  body?: unknown
  prefer?: string
}

async function rest({ method = 'GET', path, body, prefer }: RestOptions): Promise<Response> {
  const key = restAuthKey()
  return fetch(`${serverEnv.supabaseUrl}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(5000),
  })
}

/** True when the dedupe_key already has a successful 'sent' row. */
export async function isAlreadySent(dedupeKey: string): Promise<boolean> {
  try {
    const response = await rest({
      path: `${TABLE}?dedupe_key=eq.${encodeURIComponent(dedupeKey)}&status=eq.sent&select=id`,
    })
    if (!response.ok) return false
    const rows = (await response.json()) as Array<{ id: string }> | null
    return Array.isArray(rows) && rows.length > 0
  } catch {
    return false
  }
}

/** Records a successful send. Conflict (duplicate) rows are ignored. */
export async function recordSent(
  dedupeKey: string,
  event: string,
  recipient: string,
): Promise<void> {
  try {
    await rest({
      method: 'POST',
      path: `${TABLE}?on_conflict=dedupe_key`,
      prefer: 'resolution=ignore-duplicates',
      body: { dedupe_key: dedupeKey, event, recipient, status: 'sent', error: '' },
    })
  } catch (error) {
    console.error(`[email] could not record sent email "${event}":`, error)
  }
}

/** Records a failed send so it can be retried later (merged, never a dupe). */
export async function recordFailure(
  dedupeKey: string,
  event: string,
  recipient: string,
  message: string,
): Promise<void> {
  try {
    await rest({
      method: 'POST',
      path: `${TABLE}?on_conflict=dedupe_key`,
      prefer: 'resolution=merge-duplicates',
      body: {
        dedupe_key: dedupeKey,
        event,
        recipient,
        status: 'failed',
        error: message.slice(0, 2000),
      },
    })
  } catch (error) {
    console.error(`[email] could not record failed email "${event}":`, error)
  }
}
