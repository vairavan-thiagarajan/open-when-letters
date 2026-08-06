/**
 * POST /api/emails/shared
 *
 * Sends the "someone wrote Open When Letters for you" email when a signed-in
 * user shares a collection with a friend.
 *
 * The caller's Supabase session is verified (so the endpoint cannot be abused
 * to spam arbitrary addresses). Each submission carries a client-generated
 * `requestId`; retries with the same id are de-duplicated, while a fresh
 * deliberate share gets a fresh id and a fresh email.
 *
 * Request body:
 *   { to: string, slug: string, title?: string, note?: string, requestId: string }
 */

import { serverEnv } from '../../email/lib/env'
import { jsonResponse } from '../../email/lib/http'
import { sendEmail } from '../../email/lib/resend'
import { sharedCollectionEmailHtml } from '../../email/templates/sharedCollection'
import { isEmail, isRequestId, isSlug, optionalNote } from '../../email/lib/validate'

/** Verifies the bearer token against Supabase and returns the user id. */
async function resolveUserId(request: Request): Promise<string | null> {
  const header = request.headers.get('authorization') ?? ''
  const token = header.replace(/^Bearer\s+/i, '').trim()
  if (!token) return null

  try {
    const response = await fetch(`${serverEnv.supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: serverEnv.supabaseAnonKey,
        Authorization: `Bearer ${token}`,
      },
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) return null
    const data = (await response.json()) as { id?: string } | null
    return data?.id ?? null
  } catch {
    return null
  }
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405)
  }

  const userId = await resolveUserId(request)
  if (!userId) {
    return jsonResponse({ error: 'Sign in to share a collection.' }, 401)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ error: 'Invalid request body.' }, 400)
  }

  const input = body as {
    to?: unknown
    slug?: unknown
    title?: unknown
    note?: unknown
    requestId?: unknown
  }

  if (!isEmail(input.to)) {
    return jsonResponse({ error: 'Enter a valid email address.' }, 400)
  }
  if (!isSlug(input.slug)) {
    return jsonResponse({ error: 'Invalid collection link.' }, 400)
  }
  if (!isRequestId(input.requestId)) {
    return jsonResponse({ error: 'Invalid request.' }, 400)
  }

  const title = typeof input.title === 'string' ? input.title.trim().slice(0, 120) : ''
  const note = optionalNote(input.note)

  try {
    const result = await sendEmail({
      to: input.to,
      subject: '\u{1F48C} Someone wrote Open When Letters for you',
      html: sharedCollectionEmailHtml({
        appUrl: serverEnv.appUrl,
        slug: input.slug,
        collectionTitle: title,
        note,
      }),
      event: 'collection-shared',
      dedupeKey: `shared:${input.requestId}`,
    })
    return jsonResponse({ sent: result.sent })
  } catch (error) {
    console.error('[email] shared send failed:', error)
    return jsonResponse({ error: 'Could not send the email. Please try again.' }, 502)
  }
}
