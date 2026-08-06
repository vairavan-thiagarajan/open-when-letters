/** Server-side input validation shared by the email API endpoints. */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isEmail(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 254 && EMAIL_PATTERN.test(value)
}

export function isSlug(value: unknown): value is string {
  return typeof value === 'string' && /^[a-z0-9-]{1,100}$/i.test(value)
}

export function isRequestId(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f-]{8,64}$/i.test(value)
}

export function optionalNote(value: unknown, maxLength = 500): string {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  return trimmed.length > maxLength ? trimmed.slice(0, maxLength) : trimmed
}
