export function slugify(input: string): string {
  const slug = input
    .toLowerCase()
    .trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)

  return slug || 'collection'
}

const SUFFIX_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789'

export function randomSuffix(length = 5): string {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (byte) => SUFFIX_CHARS[byte % SUFFIX_CHARS.length]).join('')
}

export function generateEditToken(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}
