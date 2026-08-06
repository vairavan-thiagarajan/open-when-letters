/**
 * POST /api/emails/welcome
 *
 * Sends the welcome email right after a successful signup. Fire-and-forget
 * from the client; de-duplicated on `welcome:{email}` so it can never be sent
 * twice for the same address.
 *
 * Request body: { email: string }
 */

import { serverEnv } from '../../email/lib/env'
import { jsonResponse } from '../../email/lib/http'
import { sendEmail } from '../../email/lib/resend'
import { welcomeEmailHtml } from '../../email/templates/welcome'
import { isEmail } from '../../email/lib/validate'

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ error: 'Invalid request body.' }, 400)
  }

  const email = (body as { email?: unknown }).email
  if (!isEmail(email)) {
    return jsonResponse({ error: 'Enter a valid email address.' }, 400)
  }

  try {
    const result = await sendEmail({
      to: email,
      subject: '\u{1F48C} Welcome to Open When Letters',
      html: welcomeEmailHtml(serverEnv.appUrl, email),
      event: 'welcome',
      dedupeKey: `welcome:${email.toLowerCase()}`,
    })
    return jsonResponse({ sent: result.sent })
  } catch (error) {
    console.error('[email] welcome send failed:', error)
    return jsonResponse({ error: 'Could not send the email. Please try again later.' }, 502)
  }
}
